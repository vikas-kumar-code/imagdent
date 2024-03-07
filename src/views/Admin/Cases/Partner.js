import React, { Component } from "react";
import common from "../../../services/common";
import { Row, Col, Table, Button, Spinner } from "reactstrap";
import ManageTreatmentTeam from "./ManageTreatmentTeam";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class Partner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      manageTeamModal: false,
    };
  }

  toggleManageTeamModal = () => {
    this.setState((prevState) => ({
      manageTeamModal: !prevState.manageTeamModal,
    }));
    if (!this.state.manageTeamModal) {
      this.props.getTeam(this.props.caseId);
    }
  };

  render() {
    const { team } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Col xl={12} className="text-right">
            <Button
              color="success"
              type="button"
              onClick={this.toggleManageTeamModal}
              className="mb-2"
            >
              Add Partner
            </Button>
          </Col>
        </Row>
        {team !== undefined && team.length > 0 && (
          <Row>
            <Col xl={12}>
              <LoadingOverlay
                active={this.props.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <Table>
                  <thead>
                    <tr>
                      <td className="border-top-0" />
                      <td className="border-top-0">
                        <strong>Doctor</strong>
                      </td>
                      <td className="border-top-0">
                        <strong>Added On</strong>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}.</td>
                          <td>
                            <a
                              onClick={() => this.props.toggleModal(v.user)}
                              style={{ cursor: "pointer" }}
                              className="text-primary"
                            >
                              {common.getFullName(v.user)}
                            </a>
                          </td>
                          <td>{moment(v.added_on).format("MMMM DD, YYYY")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </LoadingOverlay>
            </Col>
          </Row>
        )}
        {this.state.manageTeamModal && (
          <ManageTreatmentTeam
            showModal={this.state.manageTeamModal}
            toggleModal={this.toggleManageTeamModal}
            caseId={this.props.caseId}
            getTeam={this.props.getTeam}
            getCase={this.props.getCase}
            
          />
        )}
      </React.Fragment>
    );
  }
}

export default Partner;
