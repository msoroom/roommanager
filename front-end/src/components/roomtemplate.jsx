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
  state = {
    Room: null,
    message: "loading",
    authstufe: {},
    editing: false,
    tab: "pics",
    changepics: [],
    chageprops: {},
    chagetodos: {},
    key: "",
    value: "",
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
                this.setState({
                  tab: selectedkey,
                  editing: false,
                  key: "",
                  value: "",
                });
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
                  {this.rendertabg()}
                </Tab>
              )}
              {!(
                this.state.authstufe.see_todo || this.state.authstufe.admin
              ) ? undefined : (
                <Tab eventKey="todos" title="Todo">
                  {this.rendertabg()}
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
      "/api/rooms/" + this.props.match.params.name,
      requestOptions
    );

    const fine = await room.json();

    //get user athentication status

    if (!document.cookie.includes("auth_token")) return;

    var perm = await fetch("/api/users/me/auth", requestOptions);
    const fine2 = await perm.json();
    this.setState({
      Room: fine,
      authstufe: fine2,
      chageprops: { ...fine.props },
      chagetodos: { ...fine.todos },
    });
  }

  renderpics() {
    if (!this.state.Room.pics)
      return <b>Es sind keine Bilder für diesen Raum vorhanden</b>;
    if (this.state.Room.pics.length === 0)
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
            <Row md="2" key={p._id}>
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
                  this.state.changepics.push(e.target.id);
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

  rendertabg() {
    if (!this.state.Room.props) return;
    if (this.state.tab === "pics") return;
    return !this.state.editing ? (
      <React.Fragment>
        <div className="PropsList">
          <Container fluid="md">
            {Object.keys(this.state.Room[this.state.tab]).map((prop, i) => {
              return (
                <Row>
                  <Col md="auto">
                    <p>{prop}</p>
                  </Col>
                  <Col md="auto">
                    <p>{this.state.Room[this.state.tab][prop]}</p>
                  </Col>
                </Row>
              );
            })}
          </Container>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className="PropsList">
          <Container fluid="md">
            {Object.keys(this.state.Room[this.state.tab]).map((prop, i) => {
              return (
                <Row key={i}>
                  <Col md="auto">
                    <input value={prop} readOnly={true}></input>
                  </Col>
                  <Col md="auto">
                    <input
                      id={prop}
                      value={this.state["chage" + this.state.tab][prop]}
                      onChange={(e) =>
                        this.setState((prevState) => {
                          prevState["chage" + this.state.tab][prop] =
                            e.target.value;

                          return prevState;
                        })
                      }
                    ></input>
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      id={prop._id}
                      onClick={(e) => {
                        this.setState((prevState) => {
                          prevState["chage" + this.state.tab][prop] = undefined;
                          return prevState;
                        });
                      }}
                    >
                      del
                    </Button>
                  </Col>
                </Row>
              );
            })}

            <Row>
              <Col md="auto">
                <input
                  onChange={(e) => this.setState({ key: e.target.value })}
                ></input>
              </Col>
              <Col md="auto">
                <input
                  onChange={(e) => this.setState({ value: e.target.value })}
                ></input>
              </Col>
            </Row>
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
              <Picupload name={this.props.match.params.name} />
              <Row>
                <Button onClick={() => this.setState({ editing: false })}>
                  cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={async (e) => {
                    const delbil = this.state.changepics;

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify(delbil);

                    var requestOptions = {
                      method: "DELETE",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow",
                    };

                    fetch(
                      "/api/rooms/" +
                        this.props.match.params.name +
                        "/pic/admin",
                      requestOptions
                    );

                    this.setState({ editing: false });
                  }}
                >
                  Save
                </Button>
              </Row>
            </React.Fragment>
          )}
        </div>
      );
    }

    if (
      (this.state.tab === "todos" || this.state.tab === "props") &&
      (this.state.authstufe[
        this.state.tab === "props" ? "edit_props" : "edit_todo"
      ] ||
        this.state.authstufe.admin)
    )
      return (
        <div>
          {!this.state.editing ? (
            <Button onClick={() => this.setState({ editing: true })}>
              edit
            </Button>
          ) : (
            <React.Fragment>
              <Row>
                <Button
                  onClick={() =>
                    this.setState((prevState) => {
                      prevState.editing = false;
                      prevState.key = "";
                      prevState.value = "";
                      prevState["chage" + this.state.tab] = {
                        ...this.state.Room[this.state.tab],
                      };

                      return prevState;
                    })
                  }
                >
                  cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={async (e) => {
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    if (!(this.state.key === "" || this.state.value === ""))
                      this.state["chage" + this.state.tab][this.state.key] =
                        this.state.value;

                    var send = {};

                    if (this.state.tab === "todos") {
                      send = { buckedlist: this.state.chagetodos };
                    } else {
                      send = { props: this.state.chageprops };
                    }

                    var raw = JSON.stringify(send);

                    var requestOptions = {
                      method: "PATCH",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow",
                    };

                    fetch(
                      "/api/rooms/" + this.props.match.params.name + "/admin",
                      requestOptions
                    );

                    this.setState((prevState) => {
                      prevState.editing = false;
                      prevState.Room[this.state.tab] = {
                        ...this.state["chage" + this.state.tab],
                      };

                      return prevState;
                    });
                  }}
                >
                  Save
                </Button>
              </Row>
            </React.Fragment>
          )}
        </div>
      );
  }
}

export default room;
