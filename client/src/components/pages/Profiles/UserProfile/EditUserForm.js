import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../shared/PageAnimation/PageAnimation';
import UsersService from '../../../../service/users.service';
import FilesService from '../../../../service/upload.service';
import Loader from '../../../shared/Spinner/Loader';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const EditUserForm = (props) => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const [uploadingActive, setUploadingActive] = useState(false);
    const usersService = new UsersService();
    const filesService = new FilesService();

    useEffect(() => {
        setUser(props.loggedUser);
    }, [props.loggedUser]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        usersService
            .editUser(props.loggedUser._id, user)
            .then((userData) => {
                props.storeUser(userData.data);
                props.history.push('/profile');
                props.handleToast(true, 'Edit successful!', '#d4edda');
            })
            .catch(() => {
                props.history.push('/profile');
                props.handleToast(true, 'An error has occurred, please try again later', '#f8d7da');
            });
    };

    const handleImageUpload = (e) => {
        const uploadData = new FormData();
        uploadData.append('imageUrl', e.target.files[0]);

        setUploadingActive(true);

        filesService
            .uploadImage(uploadData)
            .then((response) => {
                setUser({ ...user, imageUrl: response.data.secure_url });
                setUploadingActive(false);
            })
            .catch((err) => props.handleToast(true, err.response.data.message, '#f8d7da'));
    };

    return (
        <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
            <Container>
                <Row>
                    <Col lg={{ span: 6, offset: 3 }}>
                        <h1 className='mt-5'>Modifier le profil utilisateur</h1>
                        <hr />

                        <Form onSubmit={handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} controlId='username'>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required
                                        type='text'
                                        name='username'
                                        value={user.username}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} md='7' controlId='email'>
                                    <Form.Label>Email </Form.Label>
                                    <Form.Control
                                        required
                                        type='email'
                                        name='email'
                                        value={user.email}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md='5' controlId='role'>
                                    <Form.Label>Sélectionnez le rôle</Form.Label>
                                    <Form.Control as='select' name='role' value={user.role} onChange={handleInputChange}>
                                        <option>Student ou Teacher?</option>
                                        <option value='Student'>Student</option>
                                        <option value='Teacher'>Teacher</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group className='mt-3'>
                                <Form.Label>
                                    Images (file: jpg or png) {uploadingActive && <Loader />}
                                </Form.Label>
                                <Form.Control type='file' onChange={handleImageUpload} />
                            </Form.Group>

                            <Button className='mt-3 add-course' type='submit' disabled={uploadingActive}>
                                {uploadingActive ? 'Image loading...' : 'Save changes'}
                            </Button>
                        </Form>
                        {!uploadingActive && (
                            <Link to='/profile' className='btn btn-outline-dark mt-5' style={{ marginBottom: '200px' }} disabled>
                                retour
                            </Link>
                        )}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default EditUserForm;
