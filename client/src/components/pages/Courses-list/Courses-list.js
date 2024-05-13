import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CoursesService from './../../../service/courses.service';
import SearchBar from './../../shared/SearchBar/SearchBar';
import NoMatchesMsg from '../../shared/NoMatches-message/NoMatches-msg.js';
import CourseCard from '../../shared/CourseCard/Course-card';
import Loader from './../../shared/Spinner/Loader';
import './Course-list.css';
import { Container, Row } from 'react-bootstrap';

const CoursesList = ({ loggedUser, teacherInfo, updateFavCourses, history, handleToast }) => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);

    const coursesService = new CoursesService();

    // useEffect(() => {
    //     refreshCourses();
    // }, );

    const refreshCourses = () => {
        coursesService
            .getCourses()
            .then(res => {
                setCourses(res.data);
                setFilteredCourses(res.data);
            })
            .catch(() => {
                history.push('/');
                handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            });
    };

    const filterBySearch = value => setFilteredCourses([...courses].filter(elm => elm.title.toLowerCase().includes(value.toLowerCase())));

    const filterByCategory = option => {
        if (option !== 'default') {
            setFilteredCourses([...filteredCourses].filter(elm => elm.category === option));
        } else {
            setFilteredCourses([...courses]);
        }
    };

    const filterByLevel = option => {
        if (option !== 'default') {
            setFilteredCourses([...filteredCourses].filter(elm => elm.difficultyLevel === option));
        } else {
            setFilteredCourses([...courses]);
        }
    };

    const sortBy = option => {
        const filteredCoursesCopy = [...filteredCourses];
        switch (option) {
            case 'Name-A':
                setFilteredCourses(filteredCoursesCopy.sort((a, b) => (a.title > b.title ? 1 : -1)));
                break;
            case 'Name-Z':
                setFilteredCourses(filteredCoursesCopy.sort((a, b) => (a.title < b.title ? 1 : -1)));
                break;
            case 'Price-asc':
                setFilteredCourses(filteredCoursesCopy.sort((a, b) => (a.price > b.price ? 1 : -1)));
                break;
            case 'Price-desc':
                setFilteredCourses(filteredCoursesCopy.sort((a, b) => (a.price < b.price ? 1 : -1)));
                break;
            default:
                setFilteredCourses([...courses]);
                break;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="container-fluid courses-hero">
                <Container>
                    <div className="heading">
                        <h1 className="mt-5">Our courses</h1>
                        <p>Help individuals reach their goals and pursue their dreams.</p>
                        <SearchBar
                            filterBySearch={filterBySearch}
                            filterByCategory={filterByCategory}
                            filterByLevel={filterByLevel}
                            sortBy={sortBy}
                        />
                    </div>
                </Container>
            </section>
            <section className="courses-list">
                <Container>
                    <Row>
                        {courses && filteredCourses ? (
                            filteredCourses.length === 0 ? (
                                <NoMatchesMsg />
                            ) : (
                                filteredCourses.map(elm => (
                                    <CourseCard
                                        key={elm._id}
                                        {...elm}
                                        userInfo={loggedUser}
                                        teacher={teacherInfo}
                                        updateFavCourses={updateFavCourses}
                                    />
                                ))
                            )
                        ) : (
                            <Loader />
                        )}
                    </Row>
                </Container>
            </section>
        </motion.div>
    );
};

export default CoursesList;
