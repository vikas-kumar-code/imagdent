import React, { Component } from "react";
import clinic from "../../../services/clinic";
import common from "../../../services/common";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Spinner,
  Button,
  FormFeedback,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import classnames from "classnames";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import Documents from "../Documents/Documents";
import AddEditDocument from "../Documents/AddEditDocument";
import Notes from "../Notes/";
import AddEditNote from "../Notes/AddEditNote";
import Contacts from "./Contacts";
import AddEditContact from "./AddEditContact";

class AddEditClinic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: { status: "Y" },
      activeTab: "1",
      documentTypes: common.getDocumentTypes()[0],
      documents: [],
      enableEditButton: false,
      enableDeleteButton: true,
      errors: {},
      submitted: false,
      //docSubmitted: false,
      notes: [],
      noteFields: {},
      noteIndex: "",
      contacts: [],
      contactFields: {},
      contactIndex: "",
      checkUploadedFile: false,
      checkContactDetailAdded: false,
      checkNotesAdded: false,
    };
  }
  handleChange = (e, index = null) => {
    let fields = this.state.fields;
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      fields[name] = checked;
    } else {
      fields[name] = value;
    }
    this.setState({ fields });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (this.state.activeTab === "1") {
        this.setActiveTab("2");
      } else if (this.state.activeTab === "2") {
        if (this.state.checkContactDetailAdded) {
          alert("Save new contact or cancel to discard");
        } else {
          this.setActiveTab("3");
        }
      } else if (this.state.activeTab === "3") {
        if (this.state.checkUploadedFile) {
          alert("Save the document or cancel to discard");
        } else {
          this.setActiveTab("4");
        }
      } else if (this.state.activeTab === "4")
        if (this.state.checkNotesAdded) {
          alert("Save the note or cancel to discard");
        } else {
          this.setState({ submitted: true });
          const params = {
            fields: this.state.fields,
            documents: this.state.documents,
            notes: this.state.notes,
            contacts: this.state.contacts,
          };
          let that = this;
          clinic
            .add(params)
            .then((response) => {
              this.setState({ submitted: false }, () => {
                if (response.data.success) {
                  toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                  this.props.history.push("/admin/clinics");
                } else if (response.data.error) {
                  if (response.data.message) {
                    this.setState({ errors: response.data.message });
                    toast.error(response.data.message, {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                  }
                }
              });
            })
            .catch(function (error) {
              that.setState({ submitted: false });
            });
        }
    } else {
      this.setActiveTab("1");
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Name can not be empty!";
    }
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email can not be empty!";
    }
    if (regex.test(fields["email"]) == false) {
      formIsValid = false;
      errors["email"] = "Email Id is not valid!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getClinic = (id) => {
    this.setState({ loader: true });
    clinic.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = response.data.clinic;
        let documents = response.data.clinic.documents;
        let notes = response.data.clinic.notes;
        let contacts = response.data.clinic.contacts;
        if (response.data.clinic.country !== null) {
          fields["country"] = {
            label: response.data.clinic.countrydetails.name,
            value: response.data.clinic.countrydetails.id,
          };
        }
        if (response.data.clinic.state !== null) {
          fields["state"] = {
            label: response.data.clinic.statedetails.state,
            value: response.data.clinic.statedetails.state_id,
          };
        }
        this.setState({
          loader: false,
          fields,
          notes,
          documents,
          contacts,
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  componentDidMount = () => {
    this.setState({ loader: false });
    common
      .getCountries()
      .then((response) => {
        let fields = this.state.fields;
        let countries = [];
        let states = [];
        if (response.data.success) {
          response.data.countries.forEach((country, index) => {
            countries[index] = {
              label: country.name,
              value: country.id,
              states: country.states,
            };
          });
          response.data.countries[0].states.forEach((state, index) => {
            states[index] = { label: state.state, value: state.state_id };
          });
          fields["country"] = { label: "United States", value: "254" };
          this.setState(
            {
              countries,
              bcountries: countries,
              fields: fields,
              states: states,
            },
            () => {
              if (this.props.locationId) {
                this.getLocation(this.props.locationId);
              }
              if (this.props.match.params.id) {
                this.getClinic(this.props.match.params.id);
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleCountryChange = (country) => {
    let fields = this.state.fields;
    fields["country"] = { label: country.label, value: country.value };
    let states = this.state.states;
    this.setState({ fields }, () => {
      let states = [];
      typeof country.states !== "undefined" &&
        country.states.forEach((state, index) => {
          states[index] = { value: state.state_id, label: state.state };
        });
      if (states.length > 0 && states.length === 1) {
        fields["state"] = states[0];
      } else {
        fields["state"] = { value: "", label: "Select State..." };
      }
      this.setState({ fields, states });
    });
  };

  handleStateChange = (state) => {
    let fields = this.state.fields;
    fields["state"] = { label: state.label, value: state.value };
    this.setState({ fields });
  };

  handleZipOnBlur = (e) => {
    let params = {
      zipcode: e.target.value,
    };
    if (e.target.value !== "") {
      clinic.getZipDetails(params).then((res) => {
        if (res.data.success) {
          let fields = this.state.fields;
          fields["country"] = {
            label: res.data.clinic.countrydetails.name,
            value: res.data.clinic.countrydetails.id,
          };
          fields["city"] = res.data.clinic.city;
          fields["state"] = {
            label: res.data.clinic.statedetails.state,
            value: res.data.clinic.statedetails.state_id,
          };
          this.setState(fields);
        }
      });
    } else {
      let fields = this.state.fields;
      fields["country"] = {};
      fields["city"] = "";
      fields["state"] = {};
      this.setState(fields);
    }
  };

  addDocument = (file) => {
    let documents = [...this.state.documents, file];
    this.setState({ documents });
  };
  handleDelete = (file_name, case_file) => {
    const params = {
      file_name: file_name,
    };
    clinic.deleteDocument(params).then((response) => {
      if (response.data.success) {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.removeDocument(file_name);
      }
    });
  };

  removeDocument = (file_name) => {
    let documents = this.state.documents.filter(
      (document) => document.document_name !== file_name
    );
    this.setState({ documents });
  };
  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };

  addNote = (note, indx, i = null) => {
    let notes = this.state.notes;
    if (indx !== undefined) {
      notes.forEach((n, index) => {
        if (parseInt(index) === parseInt(indx)) {
          notes[index].note_type = note.note_type;
          notes[index].notes = note.notes;
        }
      });
      this.setState({
        notes,
        noteIndex: "",
        noteFields: {},
      });
    } else {
      notes = [...notes, note];
      this.setState({ notes });
    }
  };
  removeData = (e, data) => {
    let resetData = this.state[data].filter(
      (data, index) => parseInt(index) !== parseInt(e.target.dataset.index)
    );
    this.setState({ [data]: resetData });
  };

  fillData = (e, data, dataIndex, fields) => {
    let fillData = this.state[data].filter(
      (data, index) => parseInt(index) === parseInt(e.target.dataset.index)
    );
    this.setState({
      [fields]: fillData[0],
      [dataIndex]: e.target.dataset.index,
    });
  };
  handleReset = (index, fields) => {
    this.setState({
      [index]: "",
      [fields]: {},
    });
  };
  addContact = (contact, indx) => {
    let contacts = this.state.contacts;
    if (indx !== undefined) {
      contacts.forEach((n, index) => {
        if (parseInt(index) === parseInt(indx)) {
          Object.keys(contact).map((key) => {
            contacts[index].key = contact.key;
          });
        }
      });
      this.setState({
        contacts,
        contactIndex: "",
        contactFields: {},
      });
    } else {
      contacts = [...contacts, contact];
      this.setState({ contacts });
    }
  };

  checkUploadedFile = (val) => {
    this.setState({ checkUploadedFile: val });
  };

  checkContactDetailAdded = (val) => {
    this.setState({ checkContactDetailAdded: val });
  };

  checkNotesAdded = (val) => {
    this.setState({ checkNotesAdded: val });
  };

  render() {
    const { fields, countries, states, errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader className="text-left p-2">
            <strong style={{ fontSize: 20 }}>
              {fields["id"]
                ? `Update ${
                    fields["name"] && fields["name"] !== null
                      ? fields["name"]
                      : ""
                  }
                  `
                : "Add New Clinic"}
            </strong>
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
                  Basic Details
                </NavLink>
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2",
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
                    active: this.state.activeTab === "3",
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
                    active: this.state.activeTab === "4",
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
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Business Name</Label>
                          <Input
                            type="name"
                            name="name"
                            value={fields["name"] ? fields["name"] : ""}
                            onChange={(e) => this.handleChange(e)}
                            invalid={errors["name"] ? true : false}
                            className="input-bg"
                            bsSize="lg"
                          />
                          {errors["name"] && (
                            <FormFeedback>{errors["name"]}</FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label>Business Email</Label>
                          <Input
                            type="text"
                            name="email"
                            value={fields["email"] ? fields["email"] : ""}
                            onChange={(e) => this.handleChange(e)}
                            invalid={errors["email"] ? true : false}
                            bsSize="lg"
                          />
                          {errors["email"] && (
                            <FormFeedback>{errors["email"]}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Business Phone</Label>
                            <NumberFormat
                              format="(###) ###-####"
                              className="form-control-lg form-control"
                              name="phone"
                              value={fields["phone"] ? fields["phone"] : ""}
                              onChange={(e) => this.handleChange(e)}
                            />
                            {errors["phone"] && (
                              <small className="fa-1x text-danger">
                                {errors["phone"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label>Business Fax</Label>
                            <NumberFormat
                              format="(###) ###-####"
                              className="form-control-lg form-control"
                              name="fax"
                              value={fields["fax"] ? fields["fax"] : ""}
                              onChange={(e) => this.handleChange(e)}
                            />
                            {errors["fax"] && (
                              <small className="fa-1x text-danger">
                                {errors["fax"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Business NPI</Label>
                            <Input
                              type="number"
                              name="npi"
                              value={
                                fields["npi"] && fields["npi"] != 0
                                  ? fields["npi"]
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["npi"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["npi"] && (
                              <FormFeedback>{errors["npi"]}</FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label>Business EIN</Label>
                            <Input
                              type="number"
                              name="ein"
                              value={
                                fields["ein"] && fields["ein"] != 0
                                  ? fields["ein"]
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["ein"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["ein"] && (
                              <FormFeedback>{errors["ein"]}</FormFeedback>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Label>Business Address line 1</Label>
                        <Input
                          type="text"
                          name="address1"
                          value={fields["address1"] ? fields["address1"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["address1"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["address1"] && (
                          <FormFeedback>{errors["address1"]}</FormFeedback>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label>Business Address line 2</Label>
                        <Input
                          type="text"
                          name="address2"
                          value={fields["address2"] ? fields["address2"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["address2"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["address2"] && (
                          <FormFeedback>{errors["address2"]}</FormFeedback>
                        )}
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col sm={3}>
                        <Label>City</Label>
                        <Input
                          type="text"
                          name="city"
                          value={fields["city"] ? fields["city"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["city"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["city"] && (
                          <FormFeedback>{errors["city"]}</FormFeedback>
                        )}
                      </Col>
                      <Col sm={3}>
                        <Label for="state">State</Label>
                        <Select
                          name="state"
                          value={fields["state"] ? fields["state"] : ""}
                          options={states}
                          onChange={(e) => this.handleStateChange(e)}
                          invalid={errors["state"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["state"] && (
                          <FormFeedback>{errors["state"]}</FormFeedback>
                        )}
                      </Col>

                      <Col sm={3}>
                        <Label>Zip</Label>
                        <NumberFormat
                          format={"#########"}
                          name="zip"
                          value={fields["zip"] ? fields["zip"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["zip"] ? true : false}
                          bsSize="lg"
                          className="form-control-lg form-control"
                          onBlur={(e) => this.handleZipOnBlur(e)}
                        />
                        {errors["zip"] && (
                          <FormFeedback>{errors["zip"]}</FormFeedback>
                        )}
                      </Col>
                      <Col sm={3}>
                        <Label for="country">Country</Label>
                        <Select
                          name="country"
                          value={
                            fields["country"]
                              ? fields["country"]
                              : { label: "United States", value: "254" }
                          }
                          options={countries}
                          onChange={(e) => this.handleCountryChange(e)}
                          invalid={errors["country"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["country"] && (
                          <FormFeedback>{errors["country"]}</FormFeedback>
                        )}
                      </Col>
                    </Row>
                    <FormGroup check inline className="mt-3">
                      <Label>
                        <Input
                          type="radio"
                          name="status"
                          value="Y"
                          onChange={(e) => this.handleChange(e)}
                          checked={fields["status"] === "Y" && true}
                        />
                        Active
                      </Label>
                    </FormGroup>
                    <FormGroup check inline className="mt-3">
                      <Label>
                        <Input
                          type="radio"
                          name="status"
                          value="N"
                          onChange={(e) => this.handleChange(e)}
                          checked={fields["status"] === "N" && true}
                        />
                        Inactive
                      </Label>
                    </FormGroup>
                    <Col xl={12} className="text-right">
                      <Link to="/admin/clinics" className="btn btn-danger mr-2">
                        Cancel
                      </Link>
                      <Button type="submit" color="success">
                        Next <FontAwesomeIcon icon="forward" className="ml-1" />
                      </Button>
                    </Col>
                  </Form>
                </LoadingOverlay>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col xl={7}>
                    <AddEditContact
                      addContact={this.addContact}
                      contactFields={this.state.contactFields}
                      contactIndex={this.state.contactIndex}
                      handleReset={this.handleReset}
                      checkContactDetailAdded={this.checkContactDetailAdded}
                    />
                  </Col>
                  <Col xl={5}>
                    <Contacts
                      contacts={this.state.contacts}
                      enableDelete={true}
                      enableEdit={true}
                      removeContact={this.removeData}
                      fillContact={this.fillData}
                      addedOn={false}
                      addedBy={false}
                      title="All Contacts"
                      key={this.state.contactIndex}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={12} className="text-right">
                    <Button
                      type="button"
                      color="default"
                      disabled={this.state.submitted}
                      onClick={() => this.setActiveTab("1")}
                    >
                      <FontAwesomeIcon icon="backward" className="mr-1" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      disabled={this.state.submitted}
                      onClick={this.handleSubmit}
                    >
                      {" "}
                      Next <FontAwesomeIcon icon="forward" className="ml-1" />
                    </Button>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col xl={4}>
                    <AddEditDocument
                      addDocument={this.addDocument}
                      documentTypes={this.state.documentTypes}
                      checkUploadedFile={this.checkUploadedFile}
                      handleReset={this.handleReset}
                    />
                  </Col>
                  <Col xl={8}>
                    <Documents
                      documents={this.state.documents}
                      documentTypes={this.state.documentTypes}
                      enableDelete={this.state.enableDeleteButton}
                      enableEdit={this.state.enableEditButton}
                      removeDocument={this.removeDocument}
                      uploadedOn={false}
                      title="Uploaded Documents"
                      chooseDocument={false}
                      serviceName={clinic}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={12} className="text-right">
                    <Button
                      type="button"
                      color="default"
                      disabled={this.state.submitted}
                      onClick={() => this.setActiveTab("2")}
                    >
                      <FontAwesomeIcon icon="backward" className="mr-1" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      disabled={this.state.submitted}
                      onClick={this.handleSubmit}
                    >
                      {" "}
                      Next <FontAwesomeIcon icon="forward" className="ml-1" />
                    </Button>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="4">
                <Row>
                  <Col xl={4}>
                    <AddEditNote
                      addNote={this.addNote}
                      noteFields={this.state.noteFields}
                      noteIndex={this.state.noteIndex}
                      handleReset={this.handleReset}
                      checkNotesAdded={this.checkNotesAdded}
                    />
                  </Col>
                  <Col xl={8}>
                    <Notes
                      notes={this.state.notes}
                      enableDelete={true}
                      enableEdit={true}
                      removeNote={this.removeData}
                      fillNote={this.fillData}
                      addedOn={false}
                      addedBy={false}
                      title="All Notes"
                      key={this.state.noteIndex}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={12} className="text-right">
                    <Button
                      type="button"
                      color="default"
                      disabled={this.state.submitted}
                      onClick={() => this.setActiveTab("2")}
                    >
                      <FontAwesomeIcon icon="backward" className="mr-1" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      disabled={this.state.submitted}
                      onClick={this.handleSubmit}
                    >
                      {this.state.submitted && (
                        <FontAwesomeIcon
                          icon="spinner"
                          className="mr-1"
                          spin={true}
                        />
                      )}{" "}
                      {this.props.match.params.id ? "Update" : "Save"}
                    </Button>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect(null)(AddEditClinic);
