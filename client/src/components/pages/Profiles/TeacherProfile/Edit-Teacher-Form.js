import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../shared/PageAnimation/PageAnimation';
import TeachersService from '../../../../service/teachers.service';
import FilesService from '../../../../service/upload.service';
import Loader from '../../../shared/Spinner/Loader';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EditTeacherForm = ({ loggedUser, teacherInfo, storeUser, history, handleToast }) => {
    const [teacher, setTeacher] = useState({
        name: '',
        surname: '',
        jobOccupation: '',
        description: '',
        linkedin: '',
        youtube: '',
        website: '',
        user: loggedUser ? loggedUser._id : ''
    });
    const [uploadingActive, setUploadingActive] = useState(false);

    useEffect(() => {
        setTeacher(teacherInfo);
    }, [teacherInfo]);

    const teachersService = new TeachersService();
    const filesService = new FilesService();

    const handleInputChange = e => setTeacher({ ...teacher, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();

        const teacherId = teacherInfo._id;

        teachersService
            .editTeacher(teacherId, teacher)
            .then(() => {
                storeUser(loggedUser);
                history.push(`/teachers/${teacherId}`);
                handleToast(true, 'Edit successful!', '#d4edda');
            })
            .catch(() => {
                history.push(`/teachers/${teacherId}`);
                handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            });
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
                        <h1 className="mt-5">Modifier votre profil d'enseignant</h1>
                        <hr />

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control type="text" name="name" value={teacher.name} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="surname">
                                <Form.Label>Nom de famille</Form.Label>
                                <Form.Control type="text" name="surname" value={teacher.surname} onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="jobOccupation">
                                <Form.Label>Profession</Form.Label>
                                <Form.Control type="text" name="jobOccupation" value={teacher.jobOccupation} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>À propos de moi</Form.Label>
                                <Form.Control as="textarea" name="description" value={teacher.description} onChange={handleInputChange} />
                            </Form.Group>

                            <Tabs className="mt-4" defaultActiveKey="linkedin" id="Personal Links">
                                <Tab eventKey="linkedin" title="Linkedin">
                                    <Form.Group controlId="linkedin">
                                        <Form.Label>Linkedin URL</Form.Label>
                                        <Form.Control type="text" name="linkedin" value={teacher.linkedin} onChange={handleInputChange} />
                                    </Form.Group>
                                </Tab>
                                <Tab eventKey="website" title="Website">
                                    <Form.Group controlId="website">
                                        <Form.Label>Siteweb URL</Form.Label>
                                        <Form.Control type="text" name="website" value={teacher.website} onChange={handleInputChange} />
                                    </Form.Group>
                                </Tab>
                                <Tab eventKey="youtube" title="Youtube">
                                    <Form.Group controlId="linkedin">
                                        <Form.Label>Youtube URL</Form.Label>
                                        <Form.Control type="text" name="youtube" value={teacher.youtube} onChange={handleInputChange} />
                                    </Form.Group>
                                </Tab>
                            </Tabs>

                            <Form.Group>
                                <Form.Label>Images (file: jpg or png) {uploadingActive && <Loader />}</Form.Label>
                                <Form.Control type="file" onChange={handleImageUpload} />
                            </Form.Group>

                            <Button className="mt-3 add-course" type="submit" disabled={uploadingActive}> {uploadingActive ? 'Image loading...' : 'Edit Teacher profile'}</Button>
                        </Form>
                        {uploadingActive || <Link to='/profile' className="btn btn-outline-dark mt-5" disabled>Go back</Link>}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default EditTeacherForm;
