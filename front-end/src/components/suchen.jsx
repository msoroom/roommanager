import React, { Component } from "react";

class suchen extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  update = (event) => this.setState({ value: event.target.value });

  render() {
    return (
      <form onSubmit={this.dosomething}>
        <input value={this.value} onChange={this.update}></input>
        <button></button>
      </form>
    );
  }

  dosomething = (event) => {
    event.preventDefault();
    console.log(this.state.value);
  };
}

export default suchen;
