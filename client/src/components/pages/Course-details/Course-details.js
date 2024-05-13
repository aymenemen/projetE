import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'; 
import CoursesService from './../../../service/courses.service';
import CommentsService from './../../../service/comments.service';
import AddComments from './../../shared/AddComments/AddComments';
import Loader from './../../shared/Spinner/Loader';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import './Course-details.css';

const CourseDetails = ({ match, history, handleToast, loggedUser }) => {
    const [course, setCourse] = useState(undefined);
    const [comments, setComments] = useState(undefined);
    const [videoUrl, setVideoUrl] = useState(undefined);
    const [showInput, setShowInput] = useState(false);

    const coursesService = new CoursesService();
    const commentsService = new CommentsService();

    const refreshCourse = () => {
        const course_id = match.params.course_id;
        const getCourse = coursesService.getCourse(course_id);
        const getComments = commentsService.getCourseComments(course_id);

        Promise.all([getCourse, getComments])
            .then((res) => {
                setCourse(res[0].data);
                setVideoUrl(res[0].data.videos[0]);
                setComments(res[1].data);
            })
            .catch(() => {
                history.push('/courses');
                handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            });
    };

    const deleteComment = (commentId) => {
        commentsService
            .deleteComment(commentId)
            .then(() => {
                refreshCourse();
                handleToast(true, 'Delete successful!', '#d4edda');
            })
            .catch(() => {
                history.push('/courses');
                handleToast(true, 'An error has occurred while deleting, please try again later', '#f8d7da');
            });
    };

    const toggleInput = () => setShowInput(!showInput);

    useEffect(() => {
        refreshCourse();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container className="course-details ">
                {course ? (
                    <>
                        <section className="header">
                            <Row>
                                <Col md={{ span: 8 }}>
                                    <h1>{course.title}</h1>
                                    <p>
                                        <em> {course.lead}</em>
                                    </p>
                                    {course.owner && (
                                        <p style={{ color: '#73726c', fontWeight: 700 }}>
                                            Created by{' '}
                                            <Link to={`/teachers/${course.owner._id}`}>
                                                {course.owner.name} {course.owner.surname}
                                            </Link>
                                        </p>
                                    )}
                                    <p>
                                        <strong>Category:</strong> {course.category} | <strong>Difficulty Level:</strong> {course.difficultyLevel} | <strong>Price:</strong>{' '}
                                        {course.price} € | <strong>Duration:</strong> {course.duration} hrs.
                                    </p>
                                </Col>
                                <Col md={{ span: 4 }}>
                                    <img className="mb-3 course-img" src={course.imageUrl} alt={course.title} />
                                </Col>
                            </Row>
                        </section>

                        <section className="course-bckg">
                            <Row>
                                <Col>
                                    <h3 className="mt-5 mb-3">Description</h3>
                                    <p>{course.description}</p>

                                    <h3 className="mt-5 mb-4">What you will learn:</h3>
                                    <ul className="whatYouWillLearn">
                                        {course.whatYouWillLearn.map((elm, idx) => (
                                            <li key={idx}>
                                                <img src="https://res.cloudinary.com/dodneiokm/image/upload/v1607883391/project3-ironhack/checked_ib75gx.png" alt="Checked icon" />
                                                <p>{elm}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <h3 className="mt-4 mb-4">Requirements:</h3>
                                    <ul className="requirements mb-4">
                                        {course.requirements.map((elm, idx) => (
                                            <li key={idx}>
                                                <img src="https://res.cloudinary.com/dodneiokm/image/upload/v1607887317/project3-ironhack/double-check_tm7qmy.png" alt="Double-Checked icon" />
                                                <p>{elm}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    {loggedUser ? (
                                        <Button onClick={toggleInput} className="mt-3 mb-3 start-course">
                                            {showInput ? 'Close media' : 'See course media'}
                                        </Button>
                                    ) : (
                                        <Button onClick={toggleInput} disabled className="mt-3 mb-3 start-course">
                                            Log In to see media
                                        </Button>
                                    )}

                                    {/* Videos */}
                                    {showInput && (
                                        <motion.div transition={{ type: 'spring', stiffness: 300, duration: 1.2 }}>
                                            <Row>
                                                <Col md={12} lg={8}>
                                                    <ReactPlayer width="100%" url={videoUrl} controls />
                                                </Col>

                                                <Col md={12} lg={4}>
                                                    {course.videos.map((elm, idx) => (
                                                        <Card.Header className="video-card" key={elm._id}>
                                                            <img
                                                                src="https://res.cloudinary.com/dodneiokm/image/upload/v1607893554/project3-ironhack/play_u6mma0.png"
                                                                alt="play icon"
                                                                onClick={() => setVideoUrl(elm)}
                                                            />
                                                            <p style={{ display: 'inline-flex' }}>Lesson {idx + 1}</p>
                                                        </Card.Header>
                                                    ))}
                                                </Col>
                                            </Row>
                                        </motion.div>
                                    )}
                                </Col>
                            </Row>
                        </section>

                        {/* Comments */}

                        <h3 className="mt-5 mb-3">Comments</h3>

                        {comments.length > 0 ? (
                            comments.map((elm) => (
                                <div className="mb-2" key={elm._id} {...elm}>
                                    {elm.user && (
                                        <div className="comments-card">
                                            <div className="comment-body" style={{ width: '90%' }}>
                                                <Image className="avatar" roundedCircle src={elm.user.imageUrl} alt={elm.user.username} />
                                                <div className="comment-text" style={{ width: '80%' }}>
                                                    <p className="mb-0">
                                                        <strong>
                                                            {elm.user.username} {elm.timestamps}
                                                        </strong>
                                                    </p>
                                                    <p className="mb-0">
                                                        <em>" {elm.content} "</em>
                                                    </p>
                                                    <small>{elm.createdAt}</small>
                                                </div>
                                            </div>
                                            {loggedUser && loggedUser._id === elm.user._id ? (
                                                <Button onClick={() => deleteComment(elm._id)} variant="outline-danger" size="sm">
                                                    Delete
                                                </Button>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="mb-3 ml-3">No comments yet</p>
                        )}

                        {loggedUser && (
                            <section>
                                <AddComments refreshCourse={refreshCourse} courseId={course._id} loggedUser={loggedUser} history={history} handleToast={handleToast} />
                            </section>
                        )}

                        <Link to="/courses" className="btn btn-sm btn-outline-dark mt-5">
                            Go back
                        </Link>
                    </>
                ) : (
                    <Loader />
                )}
            </Container>
        </motion.div>
    );
};

export default CourseDetails;

