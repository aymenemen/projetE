import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../shared/PageAnimation/PageAnimation';
import CoursesService from './../../../service/courses.service';
import FilesService from './../../../service/upload.service';
import Loader from '../../shared/Spinner/Loader';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './New-Course-form.css';

const NewCourseForm = ({ teacherInfo, history, handleToast }) => {
    const [course, setCourse] = useState({
        title: '',
        lead: '',
        description: '',
        category: '',
        difficultyLevel: '',
        whatYouWillLearn: '',
        price: '',
        duration: '',
        requirements: '',
        imageUrl: teacherInfo.imageUrl || '',
        owner: teacherInfo._id || ''
    });
    const [uploadingActive, setUploadingActive] = useState(false);

    const coursesService = new CoursesService();
    const filesService = new FilesService();

    const handleInputChange = e => setCourse({ ...course, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        coursesService
            .saveCourse(course)
            .then(() => {
                history.push('/courses');
                handleToast(true, 'New course created!', '#d4edda');
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
                setCourse({ ...course, imageUrl: response.data.secure_url });
                setUploadingActive(false);
            })
            .catch(err => handleToast(true, err.response.data.message, '#f8d7da'));
    };

    return (
        <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }}>
                        <h1 className="mt-5">Créer un nouveau course</h1>
                        <hr />
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={course.title} onChange={handleInputChange} placeholder='Eye-catching title' required />
                            </Form.Group>

                            <Form.Group controlId="lead">
                                <Form.Label>Paragraphe d'introduction</Form.Label>
                                <Form.Control type="text" name="lead" value={course.lead} onChange={handleInputChange} placeholder='Eye-catching phrase' required />
                            </Form.Group>

                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as='textarea' name="description" value={course.description} onChange={handleInputChange} placeholder='Describe your course' required />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='category'>
                                        <Form.Label>Categorie</Form.Label>
                                        <Form.Control as='select' name='category' value={course.category} onChange={handleInputChange}>
                                            <option>Choisissez une option</option>
                                            <option value='Design'>Design</option>
                                            <option value='Development'>Development</option>
                                            <option value='Marketing'>Marketing</option>
                                            <option value='Music'>Music</option>
                                            <option value='Other'>Other</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='difficultyLevel'>
                                        <Form.Label>Level</Form.Label>
                                        <Form.Control as='select' name='difficultyLevel' value={course.difficultyLevel} onChange={handleInputChange}>
                                            <option>Choisissez une option</option>
                                            <option value='All levels'>All levels</option>
                                            <option value='Beginner'>Beginner</option>
                                            <option value='Intermediate'>Intermediate</option>
                                            <option value='Advanced'>Advanced</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="whatYouWillLearn">
                                <Form.Label>Main Topics</Form.Label>
                                <Form.Control as='textarea' name="whatYouWillLearn" value={course.whatYouWillLearn} onChange={handleInputChange} placeholder='The main topics your students will learn' required />
                                <Form.Text id='whatYouWillLearn' muted>Séparez les sujets avec des virgules</Form.Text>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="price">
                                        <Form.Label>Prix</Form.Label>
                                        <Form.Control type="number" name="price" value={course.price} onChange={handleInputChange} min='0' placeholder="Don't be greedy..." required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="duration">
                                        <Form.Label>Durée</Form.Label>
                                        <Form.Control type="number" name="duration" value={course.duration} onChange={handleInputChange} min='0' placeholder='How many hours?' required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="requirements">
                                <Form.Label>Exigences</Form.Label>
                                <Form.Control as='textarea' name="requirements" value={course.requirements} onChange={handleInputChange} placeholder='What is necessary to stay on course?' />
                                <Form.Text id='requirements' muted>Separate requirements with commas</Form.Text>
                            </Form.Group>

                            <Form.Group controlId="videos">
                                <Form.Label>Videos</Form.Label>
                                <Form.Control as='textarea' name="videos" value={course.videos} onChange={handleInputChange} placeholder='Include here the URLs of your content (audio or video)' />
                                <Form.Text id='videos' muted>Séparez les URLs avec des virgules</Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Image (file: jpg or png) {uploadingActive && <Loader />}</Form.Label>
                                <Form.Control type="file" onChange={handleImageUpload} />
                            </Form.Group>

                            <Button className="mt-3 add-course" type="submit" disabled={uploadingActive}>
                                {uploadingActive ? 'Image loading...' : 'Create course'}
                            </Button>
                        </Form>
                        {uploadingActive || (
                            <Link to={`/teachers/${teacherInfo._id}`} className="btn btn-outline-dark mt-5" disabled>
                               retour
                            </Link>
                        )}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default NewCourseForm;
