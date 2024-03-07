import React, { Component } from "react";
import { Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ManageStatus extends Component {
  render() {
    if (parseInt(this.props.caseDetails.status) === 0) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-0 btn-block"
          onClick={this.props.changeStatus}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Patient check-in
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 1) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 caseStatus-1 btn-block"
          onClick={this.props.skipFunc}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Upload patient paper work
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 2) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-2 btn-block"
          onClick={this.props.changeStatus}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Accept payment
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 3) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-3 btn-block"
          onClick={this.props.skipCaptured}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Capture records
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 4) {
      
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-4 btn-block"
          onClick={this.props.skipFunc}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Upload re-formatted files
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 5) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-5 btn-block"
          onClick={this.props.skipReadyForRadiologist}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Ready For Radiologist
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 6) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-6 btn-block"
          onClick={this.props.skipFunc}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Complete Rad Report
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 7) {
      return (
        <Col sm={12} md={4}>  <Button
          className="m-1 text-white caseStatus-7 btn-block"
          onClick={this.props.toggleAddNoteModal}
          disabled={this.props.submitted}
        >
          {this.props.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          Complete Case
        </Button></Col>
      );
    } else if (parseInt(this.props.caseDetails.status) === 8) {
      return null;
    } else {
      return <Button className="m-1 text-white btn-green">Loading...</Button>;
    }
  }
}
export default ManageStatus;
