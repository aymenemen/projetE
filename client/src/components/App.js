import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import TeachersServices from './../service/teachers.service';


import Navigation from './layout/navigation/Navigation';
import Footer from './layout/Footer/Footer';
import Home from './pages/Home/Home';

import CoursesList from './pages/Courses-list/Courses-list';
import CourseDetails from './pages/Course-details/Course-details';
import NewCourseForm from './pages/Course-form/New-Course-form';
import EditCourseForm from './pages/Course-form/Edit-Course-form';

import Signup from './pages/Signup/Signup';
import UserProfile from './pages/Profiles/UserProfile/UserProfile';
import EditUserForm from './pages/Profiles/UserProfile/EditUserForm';

import TeachersList from './pages/TeachersList/TeachersList';
import TeacherProfile from './pages/Profiles/TeacherProfile/TeacherProfile';
import NewTeacherForm from './pages/Profiles/TeacherProfile/Create-Teacher-form';
import EditTeacherForm from './pages/Profiles/TeacherProfile/Edit-Teacher-Form';

import Alert from './shared/Alert/Alert';
import AuthService from './../service/auth.service';
import UserService from '../service/users.service';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [teacher, setTeacher] = useState();
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastColor, setToastColor] = useState('');

  const authServices = new AuthService();
  const teachersServices = new TeachersServices();
  const usersServices = new  UserService();

  // useEffect(() => {
  //   refreshUser();
  // }, []);

  const refreshUser = () => {
    authServices
    .isLoggedIn()
      .then((response) => setTheUser(response.data))
      .catch(() => setTheUser(undefined));
  };

  const setTheUser = (user) => {
    setLoggedInUser(user);
    if (user) {
      teachersServices
        .getTeacher(loggedInUser._id)
        .then((response) => setTeacher(response.data[0]))
        .catch(() => setTeacher(undefined));
    } else {
      setTeacher(undefined);
    }
  };

  const handleToast = (visible, text, color) => {
    setShowToast(visible);
    setToastText(text);
    setToastColor(color);
  };

  const updateFavCourses = (item_id) => {
    if (loggedInUser) {
      const newList = loggedInUser.favCourses.includes(item_id)
        ? loggedInUser.favCourses.filter((elm) => elm !== item_id)
        : [...loggedInUser.favCourses, item_id];
      usersServices
        .updateFavCourses(loggedInUser._id, newList)
        .then(() => refreshUser())
        .catch(() => handleToast(true, 'An error has occurred, please try again later', '#f8d7da'));
    }
  };

  const updateFavTeachers = (item_id) => {
    if (loggedInUser) {
      const newList = loggedInUser.favTeachers.includes(item_id)
        ? loggedInUser.favTeachers.filter((elm) => elm !== item_id)
        : [...loggedInUser.favTeachers, item_id];
      usersServices
        .updateFavTeachers(loggedInUser._id, newList)
        .then(() => refreshUser())
        .catch(() => handleToast(true, 'An error has occurred, please try again later', '#f8d7da'));
    }
  };

  return (
    <>
      <Navigation storeUser={setTheUser} loggedUser={loggedInUser} handleToast={handleToast} />

      <main>
        <AnimatePresence>
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props} handleToast={handleToast} />} />
            <Route exact path="/courses" render={(props) => <CoursesList {...props} loggedUser={loggedInUser} teacherInfo={teacher} updateFavCourses={updateFavCourses} handleToast={handleToast} />} />
            <Route path="/courses/:course_id" render={(props) => <CourseDetails {...props} handleToast={handleToast} teacherInfo={teacher} loggedUser={loggedInUser} />} />
            <Route exact path="/teachers" render={(props) => <TeachersList {...props} loggedUser={loggedInUser} teacherInfo={teacher} updateFavTeachers={updateFavTeachers} handleToast={handleToast} />} />
            <Route path="/teachers/:teacher_id" render={(props) => <TeacherProfile {...props} loggedUser={loggedInUser} teacherInfo={teacher} storeUser={setTheUser} updateFavCourses={updateFavCourses} handleToast={handleToast} />} />
            <Route path="/signup" render={(props) => (loggedInUser ? <Redirect to="/courses" /> : <Signup {...props} handleToast={handleToast} storeUser={setTheUser} />)} />
            <Route exact path="/profile" render={(props) => (loggedInUser ? <UserProfile {...props} loggedUser={loggedInUser} teacherInfo={teacher} storeUser={setTheUser} updateFavCourses={updateFavCourses} updateFavTeachers={updateFavTeachers} handleToast={handleToast} /> : <Redirect to="/signup" />)} />
            <Route path="/profile/edit-user" render={(props) => (loggedInUser ? <EditUserForm {...props} loggedUser={loggedInUser} storeUser={setTheUser} handleToast={handleToast} /> : <Redirect to="/signup" />)} />
            <Route path="/profile/create-teacher" render={(props) => (loggedInUser ? <NewTeacherForm {...props} loggedUser={loggedInUser} teacherInfo={teacher} storeUser={setTheUser} handleToast={handleToast} /> : <Redirect to="/signup" />)} />
            <Route path="/profile-teacher/edit-teacher" render={(props) => (loggedInUser ? <EditTeacherForm {...props} loggedUser={loggedInUser} teacherInfo={teacher} storeUser={setTheUser} handleToast={handleToast} /> : <Redirect to="/signup" />)} />
            <Route path="/profile-teacher/create-course" render={(props) => (teacher ? <NewCourseForm {...props} loggedUser={loggedInUser} teacherInfo={teacher} handleToast={handleToast} /> : <Redirect to="/signup" />)} />
            <Route path="/profile-teacher/edit-course/:course_id" render={(props) => (teacher ? <EditCourseForm {...props} loggedUser={loggedInUser} teacherInfo={teacher} handleToast={handleToast} /> : <Redirect to="/signup" />)} />
          </Switch>
        </AnimatePresence>
        <Alert show={showToast} handleToast={handleToast} toastText={toastText} color={toastColor} />
      </main>

      <Footer />
    </>
  );
};

export default App;
