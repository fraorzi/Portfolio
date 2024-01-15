import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/logo.svg';
import {
  BrowserRouter as Router
} from "react-router-dom";

export const NavBar = () => {
  return (
    <Router>
      <Navbar expand="md">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#skills">Skills</Nav.Link>
              <Nav.Link href="#projects">Projects</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  );
};
