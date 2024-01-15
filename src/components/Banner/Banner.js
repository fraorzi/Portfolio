import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";

export const Banner = () => {
  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <span className="tagline">Welcome to my Portfolio</span>
            <h1>Hi! I'm Judy</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
            <button>Let’s Connect</button>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <img src={headerImg} alt="Header Img"/>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
