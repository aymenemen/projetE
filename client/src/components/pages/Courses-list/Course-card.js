import { Col, Card, Button, ButtonGroup } from 'react-bootstrap'

import { Link } from 'react-router-dom'

const CourseCard = ({ _id, courseImg, title, category, difficultyLevel, priceRanges, duration, owner, loggedUser }) => {
    //console.log({ _id, courseImg, title, category, difficultyLevel, priceRanges, duration, owner, loggedUser })
    return (
        <Col lg={4}>
            <Card className="course-card">
                <Card.Img variant="top" src={courseImg.path} alt={title} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">by {owner}</Card.Subtitle>
                    <Card.Text>{category} | {difficultyLevel} | {priceRanges.max} {priceRanges.currency}  | {duration}{' '}
                    </Card.Text>

                    {
                        owner === loggedUser._id
                            ?
                            <ButtonGroup aria-label="Basic example">
                                {/* <Button className="btn btn-dark">Edit</Button>

                                <Modal show={this.state.showModal} onHide={() => this.handleModal(false)}>
                                <Modal.Body>
                                <EditCourseForm closeModal={() => this.handleModal(false)} updateList={this.refreshCourses} loggedUser={this.props.loggedUser} />
                                </Modal.Body>
                                </Modal>

                                <Button className="btn btn-dark">Delete</Button> */}
                                <Link className="btn btn-dark" to={`/courses/${_id}`}>View details</Link>
                            </ButtonGroup>
                            :
                            <Link className="btn btn-dark btn-block btn-sm" to={`/courses/${_id}`}>View details</Link>
                    }

                </Card.Body>
            </Card>
        </Col>
    )
}

export default CourseCard