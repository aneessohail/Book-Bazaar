import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import './Navvbar.css'; 

function Navvbar() {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand">
          Book Bazaar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink 
              className="nav-link" 
              to="/"
            >
              Home
            </NavLink>
            <NavLink 
              className="nav-link" 
              to="/book/list"
            >
              Book Listing
            </NavLink>
            <NavLink 
              className="nav-link" 
              to="/book/order"
            >
              Orders
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navvbar;
