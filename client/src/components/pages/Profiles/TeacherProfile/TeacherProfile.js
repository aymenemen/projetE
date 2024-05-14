import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Image, Col, Row, Button } from 'react-bootstrap';
import CoursesServices from '../../../../service/courses.service';
import TeachersServices from '../../../../service/teachers.service';
import CourseCard from '../../../shared/CourseCard/Course-card';
import Loader from './../../../shared/Spinner/Loader';
import Popup from '../../../shared/Popup/Popup';
import DeleteMessage from '../../../shared/Delete-message/DeleteMessage';
import './TeacherProfile.css';

const TeacherProfile = ({ match, teacherInfo, loggedUser, history, handleToast }) => {
    const [teacher, setTeacher] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const teachersServices = new TeachersServices();
    const coursesServices = new CoursesServices();

    useEffect(() => {
        refreshTeacher();
    }, []);

    const refreshTeacher = () => {
        const teacher_id = match.params.teacher_id;
        const getTeacher = teachersServices.getTheTeacher(teacher_id);
        const getCourses = coursesServices.getTeacherCourses(teacher_id);

        Promise.all([getTeacher, getCourses])
            .then(response => {
                setTeacher(response[0].data);
                setCourses(response[1].data);
            })
            .catch(() => {
                // history.push('/teachers');
                handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            });
    };

    const deleteCourse = course_Id => {
        coursesServices
            .deleteCourse(course_Id)
            .then(() => {
                refreshTeacher();
                handleToast(true, 'Delete successful!', '#d4edda');
            })
            .catch(() => {
                history.push('/profile');
                handleToast(true, 'An error has occurred while deleting, please try again later', '#f8d7da');
            });
    };

    const deleteTeacher = () => {
        const teacher_Id = teacher._id;

        teachersServices
            .deleteTeacher(teacher_Id)
            .then(() => {
                history.push('/profile');
                handleToast(true, 'Delete successful!', '#d4edda');
            })
            .catch(() => {
                history.push('/profile');
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
                        <Button variant='secondary' onClick={() => handleModal(false)}>Fermer</Button>
                    </Col>
                    <Col xs='auto'>
                        <Button onClick={deleteTeacher} variant='danger'>Supprimer l'enseignant</Button>
                    </Col>
                </Row>
            </Popup>
            <Container className="teacher-profile">
                {teacher ? (
                    <>
                        <Row>
                            <Col md={{ span: 8 }} lg={{ span: 8 }}>
                                <p className="instructor" style={{ color: '#73726c' }}>INSTRUCTEUR</p>
                                <h1>{teacher.name} {teacher.surname} </h1>
                                <p><strong>{teacher.jobOccupation}</strong></p>
                                <hr></hr>
                                {teacherInfo && teacherInfo._id === teacher._id ? (
                                    <h3><strong>About me</strong></h3>
                                ) : (
                                    <h3><strong>About the teacher</strong></h3>
                                )}
                                <p>{teacher.description}</p>
                            </Col>
                            <Col md={{ span: 4 }} lg={{ span: 3, offset: 1 }}>
                                <aside className="d-flex align-items-center flex-column teacher-badge">
                                    <Row>
                                        <Image src={teacher.imageUrl} className="user-img mb-3" roundedCircle alt={teacher.name} />
                                    </Row>
                                    <Row className="mt-3 mb-3">
                                        {teacher.linkedin && (
                                            <a className="teacher-links-btn" href={teacher.linkedin} alt='Linkedin button' target="_blank" rel="noreferrer">
                                                <span><img className="links-icon" src="https://res.cloudinary.com/dodneiokm/image/upload/v1607977090/project3-ironhack/linkedin_3_zpvz48.png" alt='Linkedin icon' /></span>Linkedin
                                            </a>
                                        )}
                                        {teacher.website && (
                                            <a className="teacher-links-btn" href={teacher.website} alt='Website button' target="_blank" rel="noreferrer">
                                                <span><img className="links-icon" src="https://res.cloudinary.com/dodneiokm/image/upload/v1607977242/project3-ironhack/link_kj6las.png" alt='Website icon' /></span>Website
                                            </a>
                                        )}
                                        {teacher.youtube && (
                                            <a className="teacher-links-btn" href={teacher.youtube} alt='Youtube button' target="_blank" rel="noreferrer">
                                                <span><img className="links-icon" src="https://res.cloudinary.com/dodneiokm/image/upload/v1607976945/project3-ironhack/youtube_hgefuo.png" alt='Youtube icon' /></span>Youtube
                                            </a>
                                        )}
                                        {teacherInfo && teacherInfo._id === teacher._id && (
                                            <>
                                                <Link to='/profile-teacher/edit-teacher' className="teacher-edit mt-5">Modifier les détails</Link>
                                                <Button onClick={() => handleModal(true)} className="teacher-delete">Supprimer</Button>
                                                <Link to='/profile-teacher/create-course' className="course-add mt-5">Ajouter un cours</Link>
                                            </>
                                        )}
                                    </Row>
                                </aside>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col md={12}>
                                {teacherInfo && teacherInfo._id === teacher._id ? (
                                    <h2 className="mt-5 mb-5">Mes Cours</h2>
                                ) : (
                                    <h2 className="mt-5 mb-5">Les cours de l'enseignant</h2>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            {courses.length > 0 ? (
                                courses.map(elm => (
                                    <CourseCard
                                        key={elm._id}
                                        {...elm}
                                        teacher={teacherInfo}
                                        userInfo={loggedUser}
                                        deleteCourse={deleteCourse}
                                        updateFavCourses={handleToast}
                                    />
                                ))
                            ) : teacherInfo && teacherInfo._id === teacher._id ? (
                                <Col className="cta">
                                    <Row className="d-flex justify-content-between">
                                        <p className="mt-2 mb-0">Commençons à enseigner. <strong>{teacher.name}</strong>! Créez un cours captivant</p>
                                        <Link to='/profile-teacher/create-course' className="btn btn-success ">Créer un nouveau cours</Link>
                                    </Row>
                                </Col>
                            ) : (
                                <Col className="cta">
                                    <Row className="d-flex justify-content-between">
                                        <p className="mt-2 mb-0">Ce professeur n'a pas encore créé de cours.</p>
                                        <Link to='/courses' className="btn btn-success ">Voir plus de cours</Link>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    </>
                ) : (
                    <Loader />
                )}
                <Link to="/teachers" className="btn btn-outline-dark mt-5">retour</Link>
            </Container>
        </motion.div>
    );
};

export default TeacherProfile;
