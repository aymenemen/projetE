import { Col } from 'react-bootstrap'
import './NoMatches-msg.css'

const NoMatchesMsg = () => {
  return (
    <Col md={{ span: 10, offset: 1}}>
      <h2 className='noMatch-msg' >Il n'y a pas de correspondances, veuillez réessayer.</h2>
    </Col>
  )
}

export default NoMatchesMsg