import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SearchBar from "./suchen";

import Loginform from "./anmelden";
import SignupForm from "./singup";
import CR from "./createroome";
import Gar from "./getallrooms";
import Room from "./roomtemplate";
import Navbar from "./navbar";

class maine extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />

        <div>
          <Router>
            <Switch>
              <Route exact path="/">
                <Gar></Gar>
              </Route>
              <Route exact path="/login">
                <Loginform />
              </Route>
              <Route exact path="/signUp">
                <SignupForm></SignupForm>
              </Route>
              <Route exact path="/createRoom">
                <CR></CR>
              </Route>
              <Route exact path="/Room/:name" component={Room}></Route>
              <Route exact path="/search">
                <SearchBar />
              </Route>
            </Switch>
          </Router>
        </div>
      </React.Fragment>
    );
  }
}

export default maine;
