import React, { Component } from "react";

class searchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      valueName: "",
      password1: "",
      password2: "",
      email: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            placeholder="name"
            onChange={(event) =>
              this.setState({ valueName: event.target.value })
            }
          />
          <input
            type="text"
            placeholder="email"
            value={this.state.value}
            onChange={(event) => this.setState({ email: event.target.value })}
          />
          <input
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={(event) =>
              this.setState({ password1: event.target.value })
            }
          />
          <input
            type="password"
            placeholder="password wiederholen"
            value={this.state.password2}
            onChange={(event) =>
              this.setState({ password2: event.target.value })
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

    if (this.state.password1 !== this.state.password2)
      return this.setState({ message: " Passwörter stimmen nicht über ein " });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: this.state.valueName,
      password: this.state.password1,
      email: this.state.email,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/api/users", requestOptions)
      .then((response) => response.text())
      .then((result) =>
        this.setState({ message: "Du hast dich erfolgreich registriert" })
      )
      .catch((error) => console.log("error", error));
  }
}

export default searchBar;
