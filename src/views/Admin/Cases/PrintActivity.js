import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import common from "../../../services/common";
import moment from "moment";


export default class ComponentToPrint extends Component {
  render() {
    const activities = this.props.activities;
    return (
      <div className="container">
        <Card>
          <CardHeader>
            <strong>Activity List</strong>
          </CardHeader>
          <CardBody>
            {activities.map((log, index) => {
              return (
                <div className="row" key={`log-index-${index}`}>
                  <div className="col py-2">
                    <div className="card shadow">
                      <div className="card-body">
                        <h4 className="card-title text-muted">{log.title}</h4>
                        <p className="card-text">{log.message}</p>
                        <div>
                          <h5 className="float-left">
                            By {common.getFullName(log.addedby)}
                          </h5>
                          <div className="float-right text-muted">
                           
                            {
                              moment( log.added_on).format("MMMM DD, YYYY")
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardBody>
          <CardFooter>
            <Row>
              <Col md={12} className="text-center">
                <img
                  src={`/assets/images/logo.png`}
                  alt="iMagDent"
                  title="iMagDent"
                  className="mb-2"
                  width={120}
                />
              </Col>
              <Col md={12} className="text-center">
                www.iMagDent.com
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
