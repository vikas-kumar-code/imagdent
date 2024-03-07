import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import ChangePassword from "./ChangePassword";

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md={4} lg={4}>
            <ChangePassword />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl
  };
};
export default connect(mapStateToProps)(Settings);
