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
  CardBody
} from "reactstrap";
import classnames from "classnames";
import common from "../../../services/common";
import clinic from "../../../services/clinic";
import { Helmet } from "react-helmet";
import Documents from "../Documents/Documents";
import Contacts from "./Contacts";
import Notes from "../Notes/";

class ClinicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      error_403: false,
      loader: true,
      activeTab: "1",
      documents: [],
      locations: [],
      imageSource: "",
      documents: [],
      contacts: [],
      notes: [],
      documentTypes: common.getDocumentTypes()[0],
      roles: common.getContactRoles()
    };
  }

  setActiveTab = activeTab => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  getClinic = id => {
    this.setState({ loader: true });
    clinic.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.clinic;
        let contacts = response.data.clinic.contacts;
        let documents = response.data.clinic.documents;
        let notes = response.data.clinic.notes;

        this.setState({
          loader: false,
          fields,
          documents,
          contacts,
          notes
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.getClinic(this.props.match.params.id);
    }
  };

  showImage = e => {
    this.setState({ imageSource: e.target.src });
  };

  render() {
    const { fields } = this.state;
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Clinic Details : Imagdent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col  md={8} sm={12}>
                    <h3 style={{ fontSize: 20 }}>
                      {fields["name"] ? `${fields["name"]}'s Details` : ""}
                    </h3>
                  </Col>



                  <Col md={4} sm={12} className="text-right">
                    <Row>
                      <Col sm={12} md={6}>
                    <Link to={`/admin/clinics`} className="btn btn-danger m-1 btn-block">
                      <FontAwesomeIcon icon="undo" className="mr-2" />
                      Back
                    </Link>
                    </Col>
                    <Col sm={12} md={6}>
                    <Link
                      to={`/admin/clinics/edit/${fields["id"]}`}
                      className="btn btn-primary m-1 btn-block"
                    >
                      Edit Clinic
                    </Link>
                    </Col>
                    </Row>
                  </Col>
                </Row>


              </CardHeader>
              <CardBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => this.setActiveTab("1")}
                      style={{ fontSize: 20 }}
                    >
                      Basic Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => this.setActiveTab("2")}
                      style={{ fontSize: 20 }}
                    >
                      Contact Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3"
                      })}
                      onClick={() => this.setActiveTab("3")}
                      style={{ fontSize: 20 }}
                    >
                      Documents
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "4"
                      })}
                      onClick={() => this.setActiveTab("4")}
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
                        <Col md={6}>
                          <FormGroup>
                            <Label for="name" className="mr-2">
                              <strong>Business Name :-</strong>
                            </Label>
                            {fields["name"] ? fields["name"] : ""}
                          </FormGroup>
                          <FormGroup>
                            <Label>
                              <strong>Business Email:-</strong>
                            </Label>
                            <a href={`mailto:${fields["email"]}`}>
                              {fields["email"] ? fields["email"] : "N/A"}
                            </a>
                          </FormGroup>

                          <FormGroup>
                            <Label>
                              <strong>Business Address :-</strong>
                            </Label>
                            {fields["address"] ? fields["address"] : "N/A"}
                          </FormGroup>
                          <FormGroup>
                            <Label>
                              <strong>Business Phone :-</strong>
                            </Label>{" "}
                            {fields["phone"] ? fields["phone"] : "N/A"}
                          </FormGroup>
                          <FormGroup>
                            <Label>
                              <strong>Business Fax:-</strong>
                            </Label>{" "}
                            {fields["fax"] ? fields["fax"] : "N/A"}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label>
                              <strong>Business EIN :-</strong>
                            </Label>{" "}
                            {fields["ein"] && fields["ein"] != 0
                              ? fields["ein"]
                              : "N/A"}
                          </FormGroup>
                          <FormGroup>
                            <Label>
                              <strong>Business NPI :-</strong>
                            </Label>
                            {fields["npi"] && fields["npi"] != 0
                              ? fields["npi"]
                              : "N/A"}
                          </FormGroup>
                          <FormGroup>
                            <Label>
                              <strong>Status :-</strong>
                            </Label>
                            {this.state.fields["status"] === "Y"
                              ? "Active"
                              : "Inactive"}
                          </FormGroup>
                        </Col>
                      </Row>
                    </LoadingOverlay>
                  </TabPane>
                  <TabPane tabId="2">
                    <Contacts
                      contacts={this.state.contacts}
                      enableDelete={false}
                      enableEdit={false}
                      removeContact={this.removeContact}
                      fillContact={this.fillContact}
                      addedOn={true}
                      addedBy={false}
                      title="All Contacts"
                    />
                  </TabPane>
                  <TabPane tabId="3">
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
                  <TabPane tabId="4">
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
                <Row>
                  <Col xl={12} className="text-right">
                    <Link to={`/admin/clinics`} className="btn btn-danger">
                      <FontAwesomeIcon icon="undo" className="mr-2" />
                      Back
                    </Link>
                    <Link
                      to={`/admin/clinics/edit/${fields["id"]}`}
                      className="btn btn-primary ml-1"
                    >
                      Edit Clinic
                    </Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ClinicDetails;
