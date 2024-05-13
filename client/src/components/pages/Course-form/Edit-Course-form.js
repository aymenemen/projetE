import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../shared/PageAnimation/PageAnimation';
import CoursesService from './../../../service/courses.service';
import FilesService from './../../../service/upload.service';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Loader from './../../shared/Spinner/Loader';

const EditCourseForm = ({ teacherInfo, match, history, handleToast }) => {
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
        videos: [],
        imageUrl: '',
        owner: teacherInfo ? teacherInfo._id : ''
    });
    const [uploadingActive, setUploadingActive] = useState(false);

    const coursesService = new CoursesService();
    const filesService = new FilesService();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const course_id = match.params.course_id;
                const response = await coursesService.getCourse(course_id);
                setCourse(response.data);
            } catch (error) {
                history.push('/profile');
                handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            }
        };
        fetchCourse();
    }, [match.params.course_id]);

    const handleInputChange = e => setCourse({ ...course, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        const course_id = match.params.course_id;
        coursesService
            .editCourse(course_id, course)
            .then(() => {
                history.push('/courses');
                handleToast(true, 'Edit successful!', '#d4edda');
            })
            .catch(() => {
                history.push(`/teachers/${teacherInfo._id}`);
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
                        <h1 className="mt-5">Edit Course</h1>
                        <hr />
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={course.title} onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="lead">
                                <Form.Label>Lead Paragraph</Form.Label>
                                <Form.Control type="text" name="lead" value={course.lead} onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as='textarea' name="description" value={course.description} onChange={handleInputChange} required />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='category'>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Control as='select' name='category' value={course.category} onChange={handleInputChange}>
                                            <option>Choose one option</option>
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
                                            <option>Choose one option</option>
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
                                <Form.Control as='textarea' name="whatYouWillLearn" value={course.whatYouWillLearn} onChange={handleInputChange} required />
                                <Form.Text id='whatYouWillLearn' muted>Separate topics with commas</Form.Text>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="price">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type="number" name="price" value={course.price} onChange={handleInputChange} min='0' required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="duration">
                                        <Form.Label>Duration</Form.Label>
                                        <Form.Control type="number" name="duration" value={course.duration} onChange={handleInputChange} min='0' required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="requirements">
                                <Form.Label>Requirements</Form.Label>
                                <Form.Control as='textarea' name="requirements" value={course.requirements} onChange={handleInputChange} />
                                <Form.Text id='requirements' muted>Separate requirements with commas</Form.Text>
                            </Form.Group>

                            <Form.Group controlId="videos">
                                <Form.Label>Videos</Form.Label>
                                <Form.Control as='textarea' name="videos" value={course.videos} onChange={handleInputChange} />
                                <Form.Text id='videos' muted>Separate URLs with commas</Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Imagen (file: jpg or png) {uploadingActive && <Loader />}</Form.Label>
                                <Form.Control type="file" onChange={handleImageUpload} />
                            </Form.Group>

                            <Button className="mt-3 add-course" type="submit" disabled={uploadingActive}>{uploadingActive ? 'Image loading...' : 'Confirm Edition'}</Button>
                        </Form>
                        {uploadingActive || <Link to={`/teachers/${teacherInfo._id}`} className="btn btn-outline-dark mt-5" disabled>Go back</Link>}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default EditCourseForm;
