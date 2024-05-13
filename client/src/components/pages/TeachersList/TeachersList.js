import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeachersService from '../../../service/teachers.service';
import SearchBar from './../../shared/SearchBar/SearchBar';
import NoMatchesMsg from './../../shared/NoMatches-message/NoMatches-msg';
import TeacherCard from './TeacherCard';
import Loader from '../../shared/Spinner/Loader';
import './TeacherList.css';
import { Container, Row } from 'react-bootstrap';

const TeachersList = ({ history, handleToast, loggedUser, teacherInfo, updateFavTeachers }) => {
    const [teachers, setTeachers] = useState(undefined);
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    const teachersService = new TeachersService();

    // useEffect(() => {
    //     refreshTeachers();
    // }, []);

    const refreshTeachers = () => {
        teachersService
            .getTeachers()
            .then(res => {
                setTeachers(res.data);
                setFilteredTeachers([...res.data]);
            })
            .catch(() => {
                history.push('/');
                handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            });
    };

    const filterBySearch = value => {
        setFilteredTeachers([...teachers].filter(elm => elm.name.toLowerCase().includes(value.toLowerCase())));
    };

    const sortBy = option => {
        const filteredTeachersCopy = [...filteredTeachers];
        switch (option) {
            case 'Name-A':
                setFilteredTeachers(filteredTeachersCopy.sort((a, b) => (a.name > b.name ? 1 : -1)));
                break;
            case 'Name-Z':
                setFilteredTeachers(filteredTeachersCopy.sort((a, b) => (a.name < b.name ? 1 : -1)));
                break;
            default:
                setFilteredTeachers([...teachers]);
                break;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="container-fluid teacher-hero">
                <div className="heading">
                    <Container>
                        <h1 className="mt-5">Our teachers</h1>
                        <p>
                            Help people learn new skills, advance their careers, <br></br> and explore their hobbies by
                            sharing your knowledge.
                        </p>
                        <SearchBar filterBySearch={filterBySearch} sortBy={sortBy} />
                    </Container>
                </div>
            </section>
            <section className="teachers-list">
                <Container>
                    <Row>
                        {teachers && filteredTeachers ? (
                            filteredTeachers.length === 0 ? (
                                <NoMatchesMsg />
                            ) : (
                                filteredTeachers.map(elm => (
                                    <TeacherCard
                                        key={elm._id}
                                        {...elm}
                                        userInfo={loggedUser}
                                        teacher={teacherInfo}
                                        updateFavTeachers={updateFavTeachers}
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

export default TeachersList;
