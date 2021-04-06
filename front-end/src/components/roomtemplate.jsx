import React, { Component } from "react";
import Picupload from "./picupload";
import "../css/my.css";

class room extends Component {
  constructor(props) {
    super(props);
  }
  state = { Room: null, message: "loading" };
  render() {
    return (
      <div>
        <h1>{this.props.match.params.name}</h1>

        {!this.state.Room ? (
          <b>{this.state.message}</b>
        ) : (
          <div class="box">
            <Picupload room={this.state.Room} /> <div>{this.renderprops()}</div>
          </div>
        )}
      </div>
    );
  }

  async componentDidMount() {
    const requestoptions = {
      method: "get",
      headers: { "Content-Type": "application/json" },
    };

    var room = await fetch(
      "/rooms/" + this.props.match.params.name,
      requestoptions
    );
    var room = await room.json();
    if (room.error) return this.setState({ message: room.error });
    this.setState({ Room: room });
  }

  renderprops() {
    if (this.state.Room.pics.length == 0)
      return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;

    return (
      <ul>
        {this.state.Room.pics.map((p, i) => {
          const base64string = String(
            "data:image/png;base64," +
              Buffer.from(p.pic.data).toString("base64")
          );

          return (
            <li key={i}>
              <img src={base64string} className="autobilder"></img>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default room;
