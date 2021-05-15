import React, { Component } from "react";

class suchen extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  update = (event) => this.setState({ value: event.target.value });

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.dosomething}>
          <input value={this.value} onChange={this.update}></input>
          <button></button>
        </form>
        <div id="room"></div>
      </React.Fragment>
    );
  }

  dosomething = async (event) => {
    event.preventDefault();
    window.location.href = "/Room/" + this.state.value;
  };
}

export default suchen;
