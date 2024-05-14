import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from './../../../service/auth.service';
import logo from './logo2.png';
import { Navbar, Nav, Image } from 'react-bootstrap';
import Popup from '../../shared/Popup/Popup';
import LoginForm from '../../pages/Login-form/LoginForm';

import './Navigation.css';

const Navigation = ({ handleToast, storeUser, loggedUser }) => {
    const [showModal, setShowModal] = useState(false);
    const authService = new AuthService();

    const logOut = () => {
        // authService
        //     .logout()
        //     .then(() => {
        //         storeUser(undefined);
        //         handleToast(true, 'Logout successful!', '#d4edda');
        //     })
        //     .catch(err => handleToast(true, err.message, '#f8d7da'));
        window.location.reload()
    };

    const handleModal = visible => setShowModal(visible);

    return (
        <>
            <Popup show={showModal} handleModal={handleModal} color={'#fafafa'}>
                <LoginForm handleToast={handleToast} closeModal={() => handleModal(false)} storeUser={storeUser} />
            </Popup>

            <Navbar bg="light" variant="light" expand="md" className="menu" style={{ borderBottom: '1px solid #ddd' }}>
                <Link to="/">
                    <Navbar.Brand>
                        <motion.img
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 1 }}
                            alt="logo"
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top mx-2"
                        /> LearnUp_
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Link to="/" className="border-top">
                            <Nav.Link as="div">Acceuil</Nav.Link>
                        </Link>
                        <Link to="/courses" className="border-top">
                            <Nav.Link as="div">Cours</Nav.Link>
                        </Link>
                        <Link to="/teachers" className="border-top">
                            <Nav.Link as="div">Enseignants</Nav.Link>
                        </Link>
                        {loggedUser ? (
                            <>
                                <Nav.Link as="div" className="border-top" onClick={logOut}>
                                    Log out
                                </Nav.Link>

                                <Link to="/profile" className="d-flex align-items-center border-top padding-top">
                                    <Nav.Link as="div">{`Hi, ${loggedUser.username}!`}</Nav.Link>
                                    <Image style={{ width: '38px', height: '38px' }} className="img-fit ml-1" roundedCircle src={loggedUser.imageUrl} />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as="div" onClick={() => handleModal(true)} className="border-top">
                                    Log in
                                </Nav.Link>

                                <Link to="/signup">
                                    <Nav.Link as="div" className="border-top">
                                        Sign up
                                    </Nav.Link>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default Navigation;

