import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CoursesService from '../../../service/courses.service';
import { Container, Row, Carousel, Col, Image } from 'react-bootstrap';
import './Home.css';
import RandomCard from './Random-card';
import Loader from '../../shared/Spinner/Loader';
import Hero from './Hero';
import Features from './Features';
import Banner from './Banner';

const Home = (props) => {
  const coursesService = new CoursesService();

  const [courses, setCourses] = useState(null); // Initial state set to null
  useEffect(() => {
    // Fetching data inside useEffect
    coursesService.getRandomCourses()
      .then(response => setCourses(response.data))
      .catch(() => {
        // props.history.push('/courses');
        props.handleToast(true, "Une erreur s'est produite, veuillez réessayer plus tard", '#f8d7da');
      });
  }, []);
  // Empty dependency array to ensure useEffect runs only once on component mount

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Hero title='Aspirez à des sommets plus élevés' p1="L'apprentissage vous maintient en tête" p2="Acquérez des compétences recherchées pour impressionner n'importe qui" />

      <section className="container-fluid about">
        <Container>
          <Row className="d-flex align-items-center">
            <Col md={6}>
              <Image style={{ width: '100%' }} src="https://res.cloudinary.com/dodneiokm/image/upload/v1608222311/project3-ironhack/freedemt_x0s3mo.png" />
            </Col>
            <Col md={6}>
              <h2 className="mb-3">À propos</h2>
              <p>Nous sommes LearnUp, une plateforme d'apprentissage en ligne. Nous aidons les organisations de toutes sortes à se préparer pour l'avenir en constante évolution du travail.</p>
              <p>Relier des millions d'étudiants aux compétences dont ils ont besoin pour réussir. Nous offrons l'opportunité d'ouvrir l'accès à l'éducation, en particulier pour ceux dont les opportunités ont historiquement été limitées. Pour ce faire, nous avons noué des partenariats avec plusieurs organisations.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel */}
      <Container>
        <section className="carousel-section mt-5">
          <h2 className="mt-5 mb-5 text-center ">Explorez nos écoles pour trouver le programme parfait pour vous.</h2>
          {courses ? (
            <Carousel className='carousel'>
              <Carousel.Item>
                <Row>
                  {[...courses].slice(0, 4).map(elm => (
                    <RandomCard key={elm._id} {...elm} />
                  ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item>
                <Row>
                  {[...courses].slice(4, 8).map(elm => (
                    <RandomCard key={elm._id} {...elm} />
                  ))}
                </Row>
              </Carousel.Item>
            </Carousel>
          ) : (
            <Loader />
          )}
        </section>
      </Container>
      <Banner title="Tirez le meilleur parti de votre expérience d'apprentissage en ligne." text='Nos enseignants vous aideront à apprendre tout en restant chez vous.' />

      {/* Features */}
      <Features />
    </motion.div>
  );
};

export default Home;
