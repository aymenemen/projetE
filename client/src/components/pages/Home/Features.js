import { Row, Col, Container } from 'react-bootstrap'
import FeaturesCard from './FeaturesCard'
import help from './help.png'
import book from './book.png'
import pencil from './pencil.png'
import schedule from './schedule.png'
const Features = () => {
  return (
    <section className="features text-center mt-5">
      <Container>
        <Row className="d-flex align-items-center" >
          <Col lg={6} md={12} style={{ textAlign: 'left' }}>
            <h2 className="mb-3">Ne gaspillez pas votre temps précieux.</h2>
            <p>Seul Freedemy possède tous les facteurs critiques pour obtenir de véritables résultats.</p>
<p>Notre collection sélectionnée de cours d'entreprise et techniques les mieux notés donne aux entreprises, gouvernements et organisations à but non lucratif le pouvoir de développer une expertise interne et de satisfaire la soif d'apprentissage et de développement des employés.</p>
            <p className="mb-5">Empower your remote workforce to learn what they need, when they need it. Online learning from global experts across tech, business, wellness and more to help your employees do whatever comes next.</p>
          </Col>
          <Col lg={3} md={6}>
            <FeaturesCard
              imgSrc={pencil}
              alt='Employeable skills icon'
              title='Get real employable skills'
              text='Our curriculum is designed with top-tier industry partners, so you learn the high-impact skills that top companies want.'
            />

            <FeaturesCard
              imgSrc={book}
              alt='ActiveLearning icon'
              title='Project-based learning'
              text='Learn by doing with real-world projects and other hands-on exercises that lead to real skills mastery.'
            />
          </Col>

          <Col lg={3} md={6}>
            <FeaturesCard
              imgSrc={schedule}
              alt='Schedule icon'
              title='Learn on your schedule'
              text='Self-paced learning - whenever and wherever you want. Graduate while learning part-time for 10 hrs/week.'
            />
            <FeaturesCard
              imgSrc={help}
              alt='Help you need icon'
              title='The help you need'
              text='Reach out to our mentors 24/7 and have your coding questions answered quickly so you can keep learning.'
            />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Features