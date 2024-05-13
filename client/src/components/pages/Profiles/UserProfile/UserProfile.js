import { Container, Image, Col, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import UsersServices from './../../../../service/users.service'
import CoursesServices from './../../../../service/courses.service'
import TeacherServices from './../../../../service/teachers.service'

import CourseCard from './../../../shared/CourseCard/Course-card'
import TeacherCard from './../../TeachersList/TeacherCard'
import Popup from '../../../shared/Popup/Popup'
import DeleteMessage from '../../../shared/Delete-message/DeleteMessage'
import TabNav from './../../../shared/TabsNav/TabNav'
import Tab from './../../../shared/TabsNav/Tab'

import './UserProfile.css'

const UserProfile = ({ loggedUser, teacherInfo, handleToast, storeUser, history, updateFavCourses, updateFavTeachers }) => {
  const [teacherCourses, setTeacherCourses] = useState(undefined);
  const [favCourses, setFavCourses] = useState([]);
  const [favTeachers, setFavTeachers] = useState([]);
  const [learningActivity, setLearningActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('Favorite Courses');
  const [randomCourses, setRandomCourses] = useState([]);

  const usersServices = new UsersServices();
  const coursesServices = new CoursesServices();
  const teachersServices = new TeacherServices();

  useEffect(() => {
    refreshCourses();
    getFavsCourses();
    getFavsTeachers();
  }, []);

  useEffect(() => {
    const currentFavCoursesLength = favCourses.length;
    if (currentFavCoursesLength !== loggedUser.favCourses.length) {
      getFavsCourses();
    }

    const currentFavTeachersLength = favTeachers.length;
    if (currentFavTeachersLength !== loggedUser.favTeachers.length) {
      getFavsTeachers();
    }
  }, [favCourses, favTeachers, loggedUser]);

  const refreshCourses = () => {
    coursesServices
      .getRandomCourses()
      .then(response => setRandomCourses(response.data))
      .catch(() => {
        history.push('/');
        handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
      });

    if (teacherInfo) {
      coursesServices
        .getTeacherCourses(teacherInfo._id)
        .then(response => setTeacherCourses(response.data))
        .catch(() => {
          history.push('/');
          handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
        });
    }
  };

  const getFavsCourses = () => {
    if (loggedUser.favCourses) {
      usersServices
        .getUserFavCourses(loggedUser._id)
        .then(response => setFavCourses(response.data))
        .catch(() => {
          history.push('/');
          handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
        });
    }
  };

  const getFavsTeachers = () => {
    if (loggedUser.favTeachers) {
      usersServices
        .getUserFavTeachers(loggedUser._id)
        .then(response => setFavTeachers(response.data))
        .catch(() => {
          history.push('/');
          handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
        });
    }
  };

  const deleteUser = () => {
    usersServices
      .deleteUser(loggedUser._id)
      .then(() => {
        handleToast(true, 'User deleted', '#d4edda');
        storeUser(undefined);
        history.push('/');
      })
      .catch(() => {
        history.push('/');
        handleToast(true, 'An error has occurred while deleting, please try again later', '#f8d7da');
      });
  };

  const handleModal = visible => setShowModal(visible);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Popup show={showModal} handleModal={handleModal} color={'#f8d7da'}>
        <DeleteMessage />
        <Row className='justify-content-center'>
          <Col xs='auto'>
            <Button variant='secondary' onClick={() => handleModal(false)}>Close</Button>
          </Col>
          <Col xs='auto'>
            <Button to={`/profile/delete-user/${loggedUser._id}`} onClick={deleteUser} variant='danger'>Delete account</Button>
          </Col>
        </Row>
      </Popup>

      <Container className="user-profile">
        <h1 className="mt-5 mb-3">Welcome back {loggedUser.username} !</h1>

        {/* User details */}
        <section className="user-details">
          <article>
            <Image src={loggedUser.imageUrl} className="user-img" roundedCircle alt={loggedUser.username} />
            <div className="user-fields">
              <p><strong>Username:</strong> {loggedUser.username}</p>
              <p><strong>Email:</strong> {loggedUser.email}</p>
              <p><strong>Role:</strong> {loggedUser.role}</p>
            </div>
          </article>

          <div className="user-buttons">
            <Link to='/profile/edit-user' className="btn btn-info">Edit details</Link>
            <Button onClick={() => handleModal(true)} className="btn btn-danger">Delete user</Button>

            {loggedUser.role === 'Teacher' && teacherInfo ?
              <Link to={`/teachers/${teacherInfo._id}`} className="btn btn-warning">Teacher profile</Link>
              : loggedUser.role === 'Teacher' && !teacherInfo ?
                <Link to='/profile/create-teacher' className="btn btn-success">Create teacher profile</Link>
                : null
            }
          </div>
        </section>


        {/* Your activity*/}
        <h2 className="mt-5 mb-3">Your activity</h2>
        <Row className="mt-5">
          <Col>
            <TabNav tabs={['Favorite Courses', 'Favorite Teachers', 'Suggested Courses']} selected={selected} setSelected={setSelected}   >
              {favCourses.length > 0 &&
                <Tab isSelected={selected === 'Favorite Courses'} >
                  <section>
                    <Row>
                      {favCourses.map(elm =>
                        <CourseCard key={elm._id} {...elm} userInfo={loggedUser} teacher={teacherInfo} updateFavCourses={updateFavCourses} />)
                      }
                    </Row>
                  </section>
              </Tab>
                }
              {favTeachers.length > 0 &&
                <Tab isSelected={selected === 'Favorite Teachers'} >
                  <Row style={{ width: '100 %' }}>
                    {favTeachers.map(elm =>
                      <TeacherCard key={elm._id} {...elm} userInfo={loggedUser} teacher={teacherInfo} updateFavTeachers={updateFavTeachers} />)
                    }
                  </Row>
                </Tab>
              }
              {randomCourses.length > 0 &&
                <Tab isSelected={selected === 'Suggested Courses'} >
                  <Row>
                    {randomCourses.map(elm =>
                      <CourseCard key={elm._id} {...elm} userInfo={loggedUser} teacher={teacherInfo} updateFavCourses={updateFavCourses} />)
                    }
                  </Row>
                </Tab>
              }
            </TabNav>
          </Col>
        </Row>

        <Link to="/courses" className="btn btn-outline-dark mt-5">Go back</Link>
      </Container>
    </motion.div >
  )
}

export default UserProfile;
