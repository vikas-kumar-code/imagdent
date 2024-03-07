import React, { Component } from "react";
import ContentLoader, { BulletList, Facebook, Code } from "react-content-loader"

class SeletonScreen extends Component {
  render() {
    if (this.props.type === 'bullet') {
      return (
        <BulletList animate={true} backgroundOpacity={.3} className="mr-2" />
      );
    }
  }
}

export default SeletonScreen;