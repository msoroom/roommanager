import React, { Component } from "react";
import axios from "axios";

class pictureupload extends Component {
  state = { message: "Upload!" };

  fileChangedHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  uploadHandler = () => {
    console.log(this.state.selectedFile);
  };

  render() {
    return (
      <React.Fragment>
        <input type="file" onChange={this.fileChangedHandler} />
        <button onClick={this.uploadHandler}>{this.state.message}</button>
      </React.Fragment>
    );
  }
  uploadHandler = () => {
    const formData = new FormData();
    formData.append(
      "pic",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    axios
      .post("/api/rooms/" + this.props.name + "/admin/pics", formData)
      .then((e) => this.setState({ message: "Finished" }));
  };
}

export default pictureupload;
