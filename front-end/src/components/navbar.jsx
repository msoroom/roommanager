import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";

import "../css/my.css";
class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { buttonstate: "danger" };
  }
  render() {
    return (
      <Navbar sticky="top" className="color-nav" fixed="top">
        <Nav>
          {document.location.pathname == "/" ? (
            <></>
          ) : (
            <Navbar.Brand href="/">Zu den Räumen</Navbar.Brand>
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
  async logout(e) {
    e.preventDefault();

    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch("/users/logout", requestOptions)
      .then((ea) => {
        if (ea.status !== 200) return;

        document.cookie =
          "auth_token; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

        this.setState({ buttonstate: "success" });
        document.reload();
      })
      .catch((e) => console.log(e));
  }
}

export default navbar;
