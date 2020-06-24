import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./_site-nav.scss";

const SiteNav = ({ routes = [] }) => {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand href="/">
        <img
          className="navbar-brand-image"
          src="https://storage.googleapis.com/fluffy-butts/Fluffy%20Butts/logo.png"
        />
        <h1 className="navbar-brand-title">Fluffy Butts</h1>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="nav-items" id="basic-navbar-nav">
        <Nav className="ml-auto">
          {routes
            .filter(({ includeInNavBar }) => includeInNavBar)
            .map(({ path, title }, i) => (
              <Nav.Link href={path} key={i}>
                {title}
              </Nav.Link>
            ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default SiteNav;
