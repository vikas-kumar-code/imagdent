import React, { Component, Suspense } from "react";
import { Col, Row } from "reactstrap";
import { Helmet } from "react-helmet";
import DuePayments from "./DuePayments/";
import TodayCases from "./TodayCases";
import CasesInProgress from "./CasesInProgress";
import Inbox from "./Inbox";

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn pt-1">
        <Helmet>
          <title>Admin Dashboard : iMagDent</title>
        </Helmet>
        <Row>
          <Col md={6}>
            <DuePayments />
          </Col>
          <Col md={6}>
            <TodayCases />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <CasesInProgress />
          </Col>
          <Col md={6}>
            <Inbox />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
