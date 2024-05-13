import React, { useState } from 'react';
import AuthService from '../../../service/auth.service';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './Login.css';
import logo from './logo2.png';

const LoginForm = ({ storeUser, closeModal, handleToast }) => {
    const [formInfo, setFormInfo] = useState({ username: '', password: '' });
    const authService = new AuthService();

    const handleInputChange = e => setFormInfo({ ...formInfo, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();

        authService
            .login(formInfo)
            .then(theLoggedInUser => {
                storeUser(theLoggedInUser.data);
                closeModal();
                handleToast(true, 'Log in successful!', '#d4edda');
            })
            .catch(err => handleToast(true, err.response.data.message, '#f8d7da'));
    };

    return (
        <Container className='login-form pb-3'>
            <Row>
                <Col>
                    <Row className='justify-content-center mt-3'>
                        <figure className='form-logo'><img src={logo} alt='Freedemy logo' /></figure>
                    </Row>
                    <h1 className='text-center'>Log In</h1>
                    <hr />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Usermane</Form.Label>
                            <Form.Control type="text" name="username" value={formInfo.username} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={formInfo.password} onChange={handleInputChange} />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center">
                            <Button variant="dark" type="submit">Enter</Button>
                            <Form.Text id='loginHelpText' muted>Click outside to cancel</Form.Text>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
