import React, { Component } from "react";
import { Accordion, Row, Card, Button, Col } from "react-bootstrap";

class adminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      perms: null,
      users: null,
      limit: 10,
      page: 0,
      editusers: null,
      editing: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.users ? (
          <h1>still loading</h1>
        ) : (
          <React.Fragment>
            {this.renderusers()} {this.renderButton()}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  renderusers() {
    return (
      <Accordion>
        {this.state.editusers.map((user, i) => {
          return (
            <Card key={user._id}>
              <Card.Header>
                <Accordion.Toggle
                  as={Button}
                  variant="link"
                  eventKey={i.toString()}
                >
                  {user.name}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={i.toString()}>
                <Card.Body>
                  {Object.keys(user.perms).map((per) => {
                    return (
                      <Row>
                        <Col>{per}</Col>
                        <Col>
                          <Button
                            disabled={!this.state.editing}
                            variant={!user.perms[per] ? "danger" : "success"}
                            onClick={(e) => {
                              this.setState((prevState) => {
                                prevState.editusers[i].perms[per] =
                                  !user.perms[per];

                                return prevState;
                              });
                            }}
                          ></Button>
                        </Col>
                      </Row>
                    );
                  })}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
    );
  }

  async getusers() {
    const url =
      "/users/all/admin?skip=" + this.state.page + "&limit=" + this.state.limit;

    const result = await fetch(url);
    const data = await result.json();

    this.setState({ users: data.slice(), editusers: data.slice() });
  }

  async componentDidMount() {
    var perm = await fetch("/users/me/auth");
    const fine2 = await perm.json();

    const url =
      "/users/all/admin?skip=" + this.state.page + "&limit=" + this.state.limit;

    const result = await fetch(url);
    const data = await result.json();
    this.setState({
      perms: fine2,
      users: data.slice(),
      editusers: data.slice(),
    });
  }
  renderButton() {
    return (
      <div>
        {!this.state.editing ? (
          <Button onClick={() => this.setState({ editing: true })}>edit</Button>
        ) : (
          <Row>
            <Button onClick={() => this.setState({ editing: false })}>
              cancel
            </Button>
            <Button variant="danger" onClick={(e) => this.doadvancedstuff()}>
              Save
            </Button>
          </Row>
        )}
      </div>
    );
  }

  async doadvancedstuff() {
    const a = this.state.editusers.filter(
      (a, i) => JSON.stringify(this.state.users[i]) === JSON.stringify(a)
    );

    console.log(a);

    console.log(this.state.editusers);
    console.log(this.state.users);
  }
}

export default adminPanel;
