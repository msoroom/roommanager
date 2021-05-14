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
    this.setState({
      Room: fine,
      authstufe: fine2,
      chageprops: { ...fine.props },
      chagetodos: { ...fine.todo },
    });

    console.log(fine);
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

    return !this.state.editing ? (
      <React.Fragment>
        <div className="PropsList">
          {" "}
          <Container fluid="md">
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
    ) : (
      <React.Fragment>
        <div className="PropsList">
          <Container fluid="md">
            {Object.keys(this.state.Room.props).map((prop, i) => {
              return (
                <Row key={i}>
                  <Col md="auto">
                    <input value={prop} readOnly={true}></input>
                  </Col>
                  <Col md="auto">
                    <input
                      id={prop}
                      value={this.state.chageprops[prop]}
                      onChange={(e) =>
                        this.setState((prevState) => {
                          prevState["chageprops"][prop] = e.target.value;

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
                          prevState["chageprops"][prop] = undefined;
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

  rendertodos() {
    if (!this.state.Room.todo) return;

    return !this.state.editing ? (
      <React.Fragment>
        <div className="buckedlistList">
          {" "}
          <Container fluid="md">
            {Object.keys(this.state.Room.todo).map((prop, i) => {
              return (
                <Row key={i}>
                  <Col md="auto">
                    <p>{prop}</p>
                  </Col>
                  <Col md="auto">
                    <p>{this.state.Room.todo[prop]}</p>
                  </Col>
                </Row>
              );
            })}
          </Container>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className="buckedlistList">
          <Container fluid="md">
            {Object.keys(this.state.Room.todo).map((prop, i) => {
              return (
                <Row key={i}>
                  <Col md="auto">
                    <input value={prop} readOnly={true}></input>
                  </Col>
                  <Col md="auto">
                    <input
                      id={prop}
                      value={this.state.chagetodos[prop]}
                      onChange={(e) =>
                        this.setState((prevState) => {
                          prevState["chagetodos"][prop] = e.target.value;
                          console.log(prevState);
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
                          prevState["chagetodos"][prop] = undefined;
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
            {console.log("adfasdf")}
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
                      "/rooms/" + this.props.match.params.name + "/pic/admin",
                      requestOptions
                    )
                      .then((response) => response.text())
                      .then((result) => console.log(result))
                      .catch((error) => console.log("error", error));
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
      this.state.tab === "props" &&
      (this.state.authstufe.edit_props || this.state.authstufe.admin)
    )
      return (
        <div>
          {!this.state.editing ? (
            <Button onClick={() => this.setState({ editing: true })}>
              edit
            </Button>
          ) : (
            <React.Fragment>
              {" "}
              <Row>
                <Button
                  onClick={() =>
                    this.setState({
                      editing: false,
                      key: "",
                      value: "",
                      chageprops: { ...this.state.Room.props },
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
                      this.state.chageprops[this.state.key] = this.state.value;

                    var raw = JSON.stringify({
                      props: { ...this.state.chageprops },
                    });

                    var requestOptions = {
                      method: "PATCH",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow",
                    };

                    fetch(
                      "/rooms/" + this.props.match.params.name + "/admin",
                      requestOptions
                    )
                      .then((response) => response.text())
                      .then((result) => console.log(result))
                      .catch((error) => console.log("error", error));
                    this.setState((prevState) => {
                      prevState.editing = false;
                      prevState.Room.props = { ...this.state.chageprops };
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

    if (
      this.state.tab === "todo" &&
      (this.state.authstufe.edit_todo || this.state.authstufe.admin)
    )
      return (
        <div>
          {!this.state.editing ? (
            <Button onClick={() => this.setState({ editing: true })}>
              edit
            </Button>
          ) : (
            <React.Fragment>
              {" "}
              <Row>
                <Button
                  onClick={() =>
                    this.setState({
                      editing: false,
                      key: "",
                      value: "",
                      chagetodos: { ...this.state.Room.todo },
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
                      this.state.chagetodos[this.state.key] = this.state.value;
                    console.log(this.state.chagetodos);
                    var raw = JSON.stringify({
                      buckedlist: { ...this.state.chagetodos },
                    });

                    var requestOptions = {
                      method: "PATCH",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow",
                    };

                    fetch(
                      "/rooms/" + this.props.match.params.name + "/admin",
                      requestOptions
                    )
                      .then((response) => response.text())
                      .then((result) => console.log(result))
                      .catch((error) => console.log("error", error));
                    this.setState((prevState) => {
                      prevState.editing = false;
                      prevState.Room.todo = { ...this.state.chagetodos };

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
}

export default room;
