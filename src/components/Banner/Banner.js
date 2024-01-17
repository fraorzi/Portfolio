import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";

export const Banner = () => {
  const [text, setText] = useState('');
  const toRotate = ["Web Developer", "Web Designer", "UI/UX Designer"];
  const period = 2000;
  let loopNum = 0;
  let isDeleting = false;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, period);

    return () => { clearInterval(ticker) };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting && updatedText === '') {
      isDeleting = false;
      loopNum++;
    } else if (!isDeleting && updatedText === fullText) {
      isDeleting = true;
    }
  };

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <div>
              <span className="tagline">Welcome to my Portfolio</span>
              <h1>{`Hi! I'm Judy`} <span className="wrap">{text}</span></h1>
              <p>Lorem Ipsum is simply dummy text...</p>
              <button>Let’s Connect</button>
            </div>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <img src={headerImg} alt="Header Img
" className="animate__animated animate__fadeIn" />
</Col>
</Row>
</Container>
</section>
);
};