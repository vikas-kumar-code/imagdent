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
  Button,
} from "reactstrap";
import patientpic from "../../../assets/images/patient-default.png";
import classnames from "classnames";
import patient from "../../../services/patient";
import common from "../../../services/common";
import Documents from "../Documents/Documents";
import { connect } from "react-redux";
import { updateLastSearchedPatient } from "../../../store/actions";
import moment from "moment";
import Notes from "../Notes/";

class PatientDetailsBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      error_403: false,
      loader: true,
      activeTab: "1",
      documents: [],
      imageSource: "",
      documents: [],
      notes: [],
      documentTypes: common.getDocumentTypes()[0],
      languages: common.getLanguages(),
      responsibleParty: ["Legal Guardian", "Parent", "Power of Attorney"],
    };
  }

  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  getPatient = (id) => {
    patient.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = response.data.patient;
        let documents = response.data.patient.documents;
        let notes = response.data.patient.notes;
        this.setState({
          fields,
          documents,
          notes,
        });
        this.props.updateLastSearchedPatient({ lastSearchedPatient: id });
      } else if (response.data.error) {
        this.setState({
          error_403: true,
        });
      }
      this.setState({ loader: false });
    });
  };
  componentDidMount() {
    if (this.props.id) {
      this.getPatient(this.props.id);
    }
  }
  showImage = (e) => {
    this.setState({ imageSource: e.target.src });
    this.toggleSubModal();
  };
  render() {
    const { fields } = this.state;
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <>
      <Row>
        <Col xl={12}>
      <Card>
        <CardHeader>
          <Row>
            <Col md={8} sm={12}>
              <strong style={{ fontSize: 20 }}>
                {`${fields["first_name"] && fields["first_name"] !== null
                  ? fields["first_name"]
                  : "Patient"
                  }'s Details
                  `}
              </strong>
            </Col>
            {this.props.enableEditPatient && (
              <Col md={4} sm={12} className="text-right">
                <Row>
                  <Col sm={12} md={6}>
                <Link to={`/admin/patients`} className="m-1 btn-block">
                  <FontAwesomeIcon icon="undo" className="" />
                  Back To Search Result
                </Link>
                </Col>
                <Col sm={12} md={6}>
                <Link
                  to={`/admin/patients/edit/${fields["id"]}`}
                  className="btn btn-primary m-1 btn-block"
                >
                  Edit Patient
                </Link>
                </Col>
                </Row>
              </Col>
            )}
          </Row>
        </CardHeader>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1",
                })}
                onClick={() => this.setActiveTab("1")}
                style={{ fontSize: 20 }}
              >
                Primary Details
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2",
                })}
                onClick={() => this.setActiveTab("2")}
                style={{ fontSize: 20 }}
              >
                Documents
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "3",
                })}
                onClick={() => this.setActiveTab("3")}
                style={{ fontSize: 20 }}
              >
                Notes
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab} className="mb-3">
            <TabPane tabId="1">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <Row>
                  <Col xl={6}>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Name :-</strong>
                      </Label>
                      {fields["first_name"] ? common.getFullName(fields) : ""}
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Birth Date :-</strong>
                      </Label>
                      {fields["BirthDate"]
                        ? moment(fields["BirthDate"]).format("MMMM DD, YYYY")
                        : "N/A"}
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>Sex :-</strong>
                        </Label>
                        {fields["Sex"] ? fields["Sex"] : "N/A"}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Email :-</strong>
                      </Label>
                      {fields["email"] ? (
                        <a href={`mailto:${fields["email"]}`}>
                          {fields["email"]}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>Primary Phone :-</strong>
                        </Label>
                        {fields["HomePhone"] ? fields["HomePhone"] : "N/A"}
                      </Col>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>Secondary Phone :-</strong>
                        </Label>
                        {fields["WorkPhone"] ? fields["WorkPhone"] : "N/A"}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Address1 :-</strong>
                      </Label>
                      {fields["Address1"] ? fields["Address1"] : "N/A"}
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Address2 :-</strong>
                      </Label>
                      {fields["Address2"] ? fields["Address2"] : "N/A"}
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>City :-</strong>
                        </Label>
                        {fields["City"] ? fields["City"] : "N/A"}
                      </Col>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>State :-</strong>
                        </Label>
                        {fields["statedetails"] && fields["statedetails"].state
                          ? fields["statedetails"].state
                          : "N/A"}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Zipcode :-</strong>
                      </Label>
                      {fields["Zipcode"] ? fields["Zipcode"] : "N/A"}
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Responsible Party :-</strong>
                      </Label>
                      {fields["ResponsibleParty"]
                        ? this.state.responsibleParty
                          .filter((p, i) => i == fields["ResponsibleParty"])
                          .map((v) => v)
                        : "N/A"}
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Responsible Party Name :-</strong>
                      </Label>
                      {fields["ResponsiblePartyName"]
                        ? fields["ResponsiblePartyName"]
                        : "N/A"}
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>Language :-</strong>
                        </Label>
                        {fields["language"]
                          ? this.state.languages
                            .filter((l, i) => i == fields["language"])
                            .map((v) => v)
                          : "N/A"}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>SMS Consent :-</strong>
                        </Label>
                        {parseInt(fields["sms_consent"]) === 1
                          ? "Active"
                          : "Inactive"}
                      </Col>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>SMS Consent Date :-</strong>
                        </Label>
                        {fields["sms_consent_date"]
                          ? moment(fields["sms_consent_date"]).format("MMMM DD, YYYY")
                          : "N/A"}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>Email Consent :-</strong>
                        </Label>
                        {parseInt(fields["email_consent"]) === 1
                          ? "Active"
                          : "Inactive"}
                      </Col>
                      <Col sm={6}>
                        <Label className="mr-2">
                          <strong>Email Consent Date :-</strong>
                        </Label>
                        {fields["email_consent_date"]
                          ? moment(fields["email_consent_date"]).format("MMMM DD, YYYY")
                          : "N/A"}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="mr-2">
                        <strong>Patient Photo :-</strong>
                      </Label>
                      <br />
                      {this.state.fields["image"] ? (
                        <img
                          src={`${this.props.baseUrl}/images/${this.state.fields["image"]}`}
                          width={"280px"}
                          className="img-fluid rounded-circle patient-upload"
                        />
                      ) : (
                        <img
                          src={patientpic}
                          width={"200px"}
                          height={"180px"}
                          className="img-fluid rounded-circle patient-upload"
                        />
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </LoadingOverlay>
            </TabPane>
            <TabPane tabId="2">
              <Documents
                documents={this.state.documents}
                documentTypes={this.state.documentTypes}
                enableDelete={false}
                enableEdit={false}
                removeDocument={this.removeDocument}
                uploadedOn={true}
                title="Uploaded Documents"
                chooseDocument={false}
              />
            </TabPane>
            <TabPane tabId="3">
              <Notes
                notes={this.state.notes}
                enableDelete={false}
                enableEdit={false}
                removeNote={this.removeNote}
                fillNote={this.fillNote}
                addedOn={true}
                addedBy={false}
                title="All Notes"
              />
            </TabPane>
          </TabContent>
          {this.props.enableEditPatient && (
            <Row>
              <Col xl={12} className="text-right">
                <Link to={`/admin/patients`}>
                  <FontAwesomeIcon icon="undo" className="mr-1" />
                  Back To Search Result
                </Link>
                <Link
                  to={`/admin/patients/edit/${fields["id"]}`}
                  className="btn btn-primary ml-1"
                >
                  Edit Patient
                </Link>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
      </Col>
      </Row>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateLastSearchedPatient: (data) => {
      dispatch(updateLastSearchedPatient(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsBody);
