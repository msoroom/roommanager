import React, { Component } from "react";
import Picupload from "./picupload";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Image,
  Tabs,
  Tab,
  Button,
  Carousel,
  Row,
  Container,
  Col,
} from "react-bootstrap";

class room extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    Room: null,
    message: "loading",
    authstufe: {},
    editing: false,
    tab: "pics",
    changepics: [],
  };
  render() {
    return (
      <div>
        <p>{this.props.match.params.name}</p>

        {!this.state.Room ? (
          <b>{this.state.message}</b>
        ) : (
          <React.Fragment>
            <Tabs
              defaultActiveKey="pics"
              id="uncontrolled-tab-example"
              onSelect={(selectedkey) => {
                this.setState({ tab: selectedkey });
              }}
            >
              {!(
                this.state.authstufe.admin || this.state.authstufe.see_pics
              ) ? null : (
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
            {this.renderButton()}
          </React.Fragment>
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

    //get user athentication status

    if (!document.cookie.includes("auth_token")) return;

    var perm = await fetch("/users/me/auth", requestOptions);
    const fine2 = await perm.json();
    this.setState({ Room: fine, authstufe: fine2 });
  }

  handelSelect() {}

  renderpics() {
    if (!this.state.Room.pics)
      return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;
    if (this.state.Room.pics.length == 0)
      return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;

    return !this.state.editing ? (
      <div className="RoomPicBox">
        <Carousel>
          {this.state.Room.pics.map((p, i) => {
            const base64string = String(
              "data:image/png;base64," +
                Buffer.from(p.pic.data).toString("base64")
            );
            return (
              <Carousel.Item key={i}>
                <Image fluid={true} src={base64string} alt="First slide" />
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
    ) : (
      <div className="RoomPicBox">
        {this.state.Room.pics.map((p, i) => {
          const base64string = String(
            "data:image/png;base64," +
              Buffer.from(p.pic.data).toString("base64")
          );

          return (
            <Row md="2">
              {" "}
              <Image
                src={base64string}
                key={i}
                className="autobilder"
                fluid={true}
              />
              <Button
                id={p._id}
                onClick={(e) => {
                  this.changepics.push(e.target.id);
                }}
              >
                delete
              </Button>
            </Row>
          );
        })}
      </div>
    );
  }

  // renderpics() {
  //   if (!this.state.Room.pics)
  //     return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;
  //   if (this.state.Room.pics.length == 0)
  //     return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;
  //   return this.state.Room.pics.map((p, i) => {
  //     const base64string = String(
  //       "data:image/png;base64," + Buffer.from(p.pic.data).toString("base64")
  //     );

  //     return (
  //       <Image src={base64string} key={i} className="autobilder" fluid={true} />
  //     );
  //   });
  // }

  renderprops() {
    if (!this.state.Room.props) return;

    return (
      <React.Fragment>
        <div className="PropsList">
          {" "}
          <Container>
            {Object.keys(this.state.Room.props).map((prop, i) => {
              return (
                <Row>
                  <Col md="auto">
                    <p>{prop}</p>
                  </Col>
                  <Col md="auto">
                    <p>{this.state.Room.props[prop]}</p>
                  </Col>
                </Row>
              );
            })}
          </Container>
        </div>
      </React.Fragment>
    );
  }
  rendertodos() {
    if (!this.state.Room.todo) return;

    return (
      <React.Fragment>
        <div className="PropsList">
          {" "}
          <Container>
            {Object.keys(this.state.Room.todo).map((prop, i) => {
              return (
                <Row>
                  <p>{prop}</p>

                  <p>{this.state.Room.todo[prop]}</p>
                </Row>
              );
            })}
          </Container>
        </div>
      </React.Fragment>
    );
  }

  renderButton() {
    if (
      this.state.tab === "pics" &&
      (this.state.authstufe.edit_pics || this.state.authstufe.admin)
    ) {
      return (
        <div>
          {!this.state.editing ? (
            <Button onClick={() => this.setState({ editing: true })}>
              edit
            </Button>
          ) : (
            <React.Fragment>
              {" "}
              <Picupload />
              <Row>
                <Button onClick={() => this.setState({ editing: false })}>
                  cancel
                </Button>
                <Button variant="danger" onClick={(e) => {}}>
                  Save
                </Button>
              </Row>
            </React.Fragment>
          )}
        </div>
      );
    }

    if (
      this.state.tab === "props" &&
      !(this.state.authstufe.edit_props || this.state.authstufe.admin)
    )
      return;

    if (
      this.state.tab === "todo" &&
      !(this.state.authstufe.edit_todo || this.state.authstufe.admin)
    )
      return;

    return (
      <div>
        {!this.state.editing ? (
          <Button onClick={() => this.setState({ editing: true })}>edit</Button>
        ) : (
          <Row>
            <Button onClick={() => this.setState({ editing: false })}>
              cancel
            </Button>
            <Button variant="danger">Save</Button>
          </Row>
        )}
      </div>
    );
  }
  picdeleter() {}
}

export default room;

// <div>
// <Picupload room={this.state.Room} />{" "}
// <div id="box">{this.renderpics()}</div>
// <div id="box">{this.renderprops()}</div>
// </div>
