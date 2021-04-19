import React, { Component } from "react";
import Picupload from "./picupload";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image, Tabs, Tab } from "react-bootstrap";
class room extends Component {
  constructor(props) {
    super(props);
  }
  state = { Room: null, message: "loading", authstufe: {}, editing: false };
  render() {
    return (
      <div>
        <h1>{this.props.match.params.name}</h1>

        {!this.state.Room ? (
          <b>{this.state.message}</b>
        ) : (
          <Tabs defaultActiveKey="pics" id="uncontrolled-tab-example">
            {!(this.state.authstufe.admin || this.state.authstufe.see_pics) ? (
              console.log("aa")
            ) : (
              <Tab eventKey="pics" title="Bilder">
                {this.renderpics()}
              </Tab>
            )}
            {!(
              this.state.authstufe.see_props || this.state.authstufe.admin
            ) ? undefined : (
              <Tab eventKey="props" title="Eigenschaften">
                {this.renderprops()}
              </Tab>
            )}
            {!(
              this.state.authstufe.see_todo || this.state.authstufe.admin
            ) ? undefined : (
              <Tab eventKey="todo" title="Todo">
                {this.rendertodos()}
              </Tab>
            )}
          </Tabs>
        )}
      </div>
    );
  }

  async componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const room = await fetch(
      "/rooms/" + this.props.match.params.name,
      requestOptions
    );

    const fine = await room.json();
    console.log(fine);
    //get user athentication status

    if (!document.cookie.includes("auth_token")) return;

    var perm = await fetch("/users/me/auth", requestOptions);
    const fine2 = await perm.json();
    this.setState({ Room: fine, authstufe: fine2 });
  }

  renderpics() {
    if (!this.state.Room.pics)
      return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;
    if (this.state.Room.pics.length == 0)
      return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;
    return this.state.Room.pics.map((p, i) => {
      const base64string = String(
        "data:image/png;base64," + Buffer.from(p.pic.data).toString("base64")
      );

      return (
        <Image src={base64string} key={i} className="autobilder" fluid={true} />
      );
    });
  }

  renderprops() {
    if (!this.state.Room.props) return;

    return (
      <React.Fragment>
        <table>
          {Object.keys(this.state.Room.props).map((prop, i) => {
            <tr key={i}>
              <th key={prop}>{prop}</th>
              <th key={this.state.Room.props[prop]}>
                {this.state.Room.props[prop]}
              </th>
            </tr>;
          })}
        </table>
        <input type="text"></input>
      </React.Fragment>
    );
  }
  rendertodos() {
    return;
  }
}

export default room;

// <div>
// <Picupload room={this.state.Room} />{" "}
// <div id="box">{this.renderpics()}</div>
// <div id="box">{this.renderprops()}</div>
// </div>
