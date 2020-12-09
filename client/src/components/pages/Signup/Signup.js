import React, { Component } from 'react'
import AuthService from '../../../service/auth.service'
import FilesService from '../../../service/upload.service'
import Loader from '../../shared/Spinner/Loader'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import Alert from '../../shared/Alert/Alert'

class Signup extends Component {
  constructor () {
    super()
    this.state = {
      user: {
        username: '',
        email: '',
        password: '',
        role: '',
        imageUrl: ''
      },
      showToast: false,
      toastText: '',
      uploadingActive: false
    }
    this.authService = new AuthService()
    this.filesService = new FilesService()
  }

  handleInputChange = e => this.setState({ user: { ...this.state.user, [ e.target.name ]: e.target.value }})
  
  handleSubmit = e => {
    e.preventDefault()

    this.authService
      .signup(this.state.user)
      .then(newUser => {
        this.props.storeUser(newUser.data)
        this.props.history.push('/courses')
        this.handleToast(true, 'Register successful!')
      })
      .catch(err => this.setState({ showToast: true, toastText: err.response.data.message[0].msg }))
  }

  handleImageUpload = e => {
    const uploadData = new FormData()
    uploadData.append('imageUrl', e.target.files[ 0 ])

    this.setState({ uploadingActive: true })

    this.filesService
        .uploadImage(uploadData)
        .then(response => {
            this.setState({
                user: { ...this.state.user, imageUrl: response.data.secure_url },
                uploadingActive: false
            })
        })
        .catch(err => this.setState({ showToast: true, toastText: err.response.data.message }))   // TO-DO: comprobar que el mensaje sale bien
  }

  handleToast = (visible, text) => this.setState({ showToast: visible, toastText: text })

  render() {
    return (
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3}}>
            <h1>Sign Up</h1>
            <hr />

            <Form validated={this.validated} onSubmit={this.handleSubmit}>

              <Form.Row>
                <Form.Group as={Col} md='5' controlId='username'>
                    <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    name='username'
                    placeholder='popinez'
                    value={this.state.username}
                    onChange={this.handleInputChange} />
                </Form.Group>

                <Form.Group as={Col} md='7' controlId='password'>
                    <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type='password'
                    name='password'
                    placeholder='fantasía caribeña'
                    value={this.state.password}
                    onChange={this.handleInputChange} />
                  <Form.Text id='passwordHelpBlock' muted>
                    Your password must have more than 4 characters and contain a number
                  </Form.Text>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md='7' controlId='email'>
                    <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type='email'
                    name='email'
                    placeholder='pop@ino.dog'
                    value={this.state.email}
                    onChange={this.handleInputChange} />
                </Form.Group>

                <Form.Group as={Col} md='5' controlId='role'>
                  <Form.Label>Choose role</Form.Label>
                  <Form.Control as='select' name='role' value={this.state.role} onChange={this.handleInputChange}>
                    <option>Student or Teacher?</option>
                    <option value='Student' >Student</option>
                    <option value='Teacher' >Teacher</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Group>
                  <Form.Label>Imagen (file) {this.state.uploadingActive && <Loader />}</Form.Label>
                  <Form.Control type="file" onChange={this.handleImageUpload} />
              </Form.Group>

              <Form.Group>
                <Button variant='dark' type='submit' disabled={this.state.uploadingActive}>{this.state.uploadingActive ? 'Image loading...' : 'Let\'s start !'}</Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>

        <Alert show={this.state.showToast} handleToast={this.handleToast} toastText={ this.state.toastText}/>
      </Container>
    )
  }
}

export default Signup