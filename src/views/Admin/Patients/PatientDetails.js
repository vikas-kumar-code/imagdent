import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error403 from "../../Error403";
import { Link } from "react-router-dom";
import {
  Col,
  Row,
  Spinner,
  Label,
  FormGroup,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
  Button
} from "reactstrap";
import classnames from "classnames";
import common from "../../../services/common";
import { Helmet } from "react-helmet";
import PatientDetailsBody from "./PatientDetailsBody";

class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_403: false
    };
  }

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Patient Details : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <PatientDetailsBody
              id={this.props.match.params.id}
              enableEditPatient={true}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PatientDetails;
