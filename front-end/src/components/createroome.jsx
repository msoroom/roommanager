import React, { Component } from "react";

class createroome extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { room: "" };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          onChange={(e) => this.setState({ room: e.target.value })}
        ></input>
      </form>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: this.state.room,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/api/rooms", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
}

export default createroome;
