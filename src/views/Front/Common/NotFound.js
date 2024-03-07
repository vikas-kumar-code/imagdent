import React from "react";
import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotFound = props => {
  return (
    <div
      className="app flex-row align-items-center"
      style={{ minHeight: props.minHeight ? props.minHeight + "vh" : "50vh" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">
                <FontAwesomeIcon
                  icon={props.icon ? props.icon : "frown"}
                  color="gray"
                />
              </h1>
              <h4 className="pt-3">Oops!</h4>
              <p className="text-muted float-left">{props.message}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
