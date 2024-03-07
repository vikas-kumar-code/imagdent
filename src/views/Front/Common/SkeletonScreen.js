import React, { Component } from "react";

class SkeletonScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div className="demo" style={{ height: this.props.height }} />;
  }
}

export default SkeletonScreen;
