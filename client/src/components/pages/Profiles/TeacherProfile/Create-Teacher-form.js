import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../shared/PageAnimation/PageAnimation';
import TeachersService from '../../../../service/teachers.service';
import FilesService from '../../../../service/upload.service';
import Loader from '../../../shared/Spinner/Loader';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import './Create-Teacher-form.css';

const NewTeacherForm = ({ loggedUser, storeUser, history, handleToast }) => {
    const [teacher, setTeacher] = useState({
        name: '',
        surname: '',
        jobOccupation: '',
        description: '',
        linkedin: '',
        youtube: '',
        website: '',
        user: loggedUser ? loggedUser._id : '',
    });

    const [uploadingActive, setUploadingActive] = useState(false);

    const teachersService = new TeachersService();
    const filesService = new FilesService();

    const handleInputChange = e => setTeacher({ ...teacher, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();

        teachersService
            .saveTeacher(teacher)
            .then(() => {
                storeUser(loggedUser);
                history.push('/profile');
                handleToast(true, 'Congratulations!, now you have a teacher\'s profile', '#d4edda');
            })
            .catch(err => handleToast(true, err.response.data.message[0].msg, '#f8d7da'));
    };

    const handleImageUpload = e => {
        const uploadData = new FormData();
        uploadData.append('imageUrl', e.target.files[0]);

        setUploadingActive(true);

        filesService
            .uploadImage(uploadData)
            .then(response => {
                setTeacher({ ...teacher, imageUrl: response.data.secure_url });
                setUploadingActive(false);
            })
            .catch(err => handleToast(true, err.response.data.message, '#f8d7da'));
    };

    return (
        <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>

            <Container>
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <h1 className='mt-5' >Create your Teacher Profile</h1>
                        <hr />

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="name" value={teacher.name} onChange={handleInputChange} placeholder='Enter your name' required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="surname">
                                        <Form.Label>Surname</Form.Label>
                                        <Form.Control type="text" name="surname" value={teacher.surname} onChange={handleInputChange} placeholder='Enter your last name' required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="jobOccupation">
                                <Form.Label>Job Occupation</Form.Label>
                                <Form.Control type="text" name="jobOccupation" value={teacher.jobOccupation} onChange={handleInputChange} placeholder='What is your profession' />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>About me</Form.Label>
                                <Form.Control as="textarea" name="description" value={teacher.description} onChange={handleInputChange} placeholder='Tell us something about you' />
                            </Form.Group>

                            <Tabs className="mt-4" defaultActiveKey="linkedin" id="Personal Links">
                                <Tab eventKey="linkedin" title="Linkedin">
                                    <Form.Group controlId="linkedin">
                                        <Form.Label>Linkedin URL</Form.Label>
                                        <Form.Control type="text" name="linkedin" value={teacher.linkedin} onChange={handleInputChange} placeholder='Do you have a linkedIn profile?' />
                                    </Form.Group>
                                </Tab>
                                <Tab eventKey="website" title="Website">
                                    <Form.Group controlId="website">
                                        <Form.Label>Website URL</Form.Label>
                                        <Form.Control type="text" name="website" value={teacher.website} onChange={handleInputChange} placeholder='Do you have any website?' />
                                    </Form.Group>
                                </Tab>
                                <Tab eventKey="youtube" title="Youtube">
                                    <Form.Group controlId="youtube">
                                        <Form.Label>Youtube URL</Form.Label>
                                        <Form.Control type="text" name="youtube" value={teacher.youtube} onChange={handleInputChange} placeholder='Do you have a Youtube channel?' />
                                    </Form.Group>
                                </Tab>
                            </Tabs>

                            <Form.Group className="mt-3">
                                <Form.Label>Imagen (file: jpg or png) {uploadingActive && <Loader />}</Form.Label>
                                <Form.Control type="file" onChange={handleImageUpload} />
                            </Form.Group>

                            <Button className="mt-3 add-course" type="submit" disabled={uploadingActive}> {uploadingActive ? 'Image loading...' : 'Create Teacher profile'}</Button>
                        </Form>
                        {uploadingActive || <Link to='/profile' className="btn btn-outline-dark mt-5" disabled>Go back</Link>}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default NewTeacherForm;
