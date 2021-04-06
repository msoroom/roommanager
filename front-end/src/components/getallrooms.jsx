import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
class allrooms extends Component {
  state = { rooms: null };
  render() {
    return (
      <React.Fragment>
        {!this.state.rooms ? <h1>loading</h1> : this.renderRooms()}
      </React.Fragment>
    );
  }

  async componentDidMount() {
    var data = await fetch("/rooms/");
    var data = await data.json();

    this.setState({ rooms: data });
  }

  renderRooms() {
    return this.state.rooms.map((room) => (
      <div>
        <Link to={`/Room/${room.name}`}>
          <li>{room.name}</li>
        </Link>
      </div>
    ));
  }
}

export default allrooms;