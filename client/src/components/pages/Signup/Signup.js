import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../shared/PageAnimation/PageAnimation';
import AuthService from '../../../service/auth.service';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Signup.css';
import logo from './logo2.png';

const Signup = ({ storeUser, history, handleToast }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  const authService = new AuthService();

  const handleInputChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
  
    authService
      .signup(user)
      .then(newUser => {
        if (newUser && newUser.data) {
          storeUser(newUser.data);
          history.push('/courses');
          handleToast(true, 'Register successful!', '#d4edda');
        } else {
          handleToast(true, 'Unexpected response from server', '#f8d7da');
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message && err.response.data.message[0] && err.response.data.message[0].msg) {
          handleToast(true, err.response.data.message[0].msg, '#f8d7da');
        } else {
          handleToast(true, 'An error occurred while signing up', '#f8d7da');
        }
      });
  };
  return (
    <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
      <section className='signup-page'>
        <Container className="mt-5">
          <Row>
            <Col lg={{ span: 6, offset: 3 }} className='signup-form'>

              <Row className='justify-content-center mt-3'>
                <figure className='form-logo'><img src={logo} alt='Freedemy logo' /></figure>
              </Row>

              <h1 className='text-center'>Sign Up</h1>

              <hr />

              <Form onSubmit={handleSubmit}>


                <Form.Group controlId='username'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    name='username'
                    placeholder='Choose a username'
                    value={user.username}
                    onChange={handleInputChange} />
                  <Form.Text id='passwordHelpBlock' muted>
                  Votre username doit comporter plus de 5 caractères
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type='password'
                    name='password'
                    placeholder='Choose a password'
                    value={user.password}
                    onChange={handleInputChange} />
                  <Form.Text id='passwordHelpBlock' muted>
                  Votre mot de passe doit comporter plus de 4 caractères et contenir un chiffre.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type='email'
                    name='email'
                    placeholder='sample@email.net'
                    value={user.email}
                    onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId='role'>
                  <Form.Label>Sélectionnez le rôle</Form.Label>
                  <Form.Control as='select' name='role' value={user.role} onChange={handleInputChange}>
                    <option>Quel est votre rôle ?</option>
                    <option value='Student' >Student</option>
                    <option value='Teacher' >Teacher</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-5 mb-3" style={{ width: '60%', margin: 'auto' }}>
                  <Button className='btn-block' variant='dark' type='submit'>Commençons !</Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>

        </Container>
      </section>
    </motion.div>
  );
};

export default Signup;
