import React, { Component } from "react";
import { Card, CardHeader, Col } from "reactstrap";
import { connect } from "react-redux";

class ChangeLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false
    };
  }
  handleSelectedColor = () => {
    if (
      this.props.defaultLocation &&
      parseInt(this.props.defaultLocation) === parseInt(this.props.loc.id)
    ) {
      return "dark";
    } else {
      return "primary";
    }
  };

  render() {
    const record = this.props.loc;
    return (
      <Col md={3}>
        <Card color={this.handleSelectedColor()}>
          <CardHeader
            className="text-center p-2"
            style={{ fontSize: 13, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => this.props.setLocation(record.id)}
          >{`${record.publish_name}`}</CardHeader>
        </Card>
      </Col>
    );
  }
}



export default ChangeLocation;
