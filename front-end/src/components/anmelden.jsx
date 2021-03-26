import React, { Component } from "react";

class searchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { valueName: "", password: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={(event) =>
              this.setState({ valueName: event.target.value })
            }
          />
          <input
            type="password"
            value={this.state.password}
            onChange={(event) =>
              this.setState({ password: event.target.value })
            }
          />
          <button action="submit" value="a">
            Submit
          </button>
        </form>
      </React.Fragment>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(
      "Ein Name wurde abgeschickt: " +
        this.state.valueName +
        "  " +
        this.state.password
    );
  }
}

export default searchBar;
