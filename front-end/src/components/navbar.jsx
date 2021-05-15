import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";

import Cookies from "universal-cookie";

import "../css/my.css";
class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { buttonstate: "danger", cookies: null };
  }
  render() {
    return this.renderalle();
  }

  async componentDidMount() {}

  async logout(e) {
    e.preventDefault();
    const cookies = new Cookies();

    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch("/api/users/logout", requestOptions).then((ea) => {
      if (ea.status !== 200) return;
      cookies.remove("auth_token", { path: "/" });
      this.setState({ buttonstate: "fullfilled" });
    });
  }

  renderalle() {
    return (
      <Navbar sticky="top" className="color-nav" fixed="top">
        <Nav>
          {document.location.pathname === "/" ? (
            <></>
          ) : (
            <Navbar.Brand href="/">Zu den Räumen</Navbar.Brand>
          )}
          {document.location.pathname === "/user/admin" ? (
            <></>
          ) : (
            <Navbar.Brand href="/user/admin">AdminPannel</Navbar.Brand>
          )}
          {!document.cookie.toString().includes("auth_token") ? (
            <Navbar.Brand href="/login">Login</Navbar.Brand>
          ) : (
            <NavDropdown title="ME" id="basic-nav-dropdown">
              <NavDropdown.Item href="/User/me">HOME</NavDropdown.Item>
              <Button
                onClick={(event) => this.logout(event)}
                variant={this.state.buttonstate}
              >
                LOGOUT
              </Button>
            </NavDropdown>
          )}
        </Nav>
      </Navbar>
    );
  }
}

export default navbar;
