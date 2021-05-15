import React, { Component } from "react";

class searchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", message: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={(event) => this.setState({ email: event.target.value })}
          />
          <input
            type="password"
            value={this.state.password}
            onChange={(event) =>
              this.setState({ password: event.target.value })
            }
          />
          <button action="submit" value="a">
            Submit
          </button>
        </form>
        <h1>{this.state.message}</h1>
      </React.Fragment>
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: this.state.email,
      password: this.state.password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/api/users/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error)
          return this.setState({ message: "Das hat nicht geklappt" });
        else this.setState({ message: " Das hat geklappt" });
      })
      .catch((error) => {
        this.setState({ message: "Fa " });
        console.log(error);
      });
  }
}

export default searchBar;
