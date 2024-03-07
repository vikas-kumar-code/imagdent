import React, { Component } from "react";
import Error403 from "../../Error403";
import { Col, Row } from "reactstrap";
import { Helmet } from "react-helmet";
import CaseDetailsBody from "./CaseDetailsBody";

class CaseDetails extends Component {
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
          <title>Case Details : Imagdent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <CaseDetailsBody
              caseId={this.props.match.params.id}
              enableEditCase={true}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CaseDetails;
