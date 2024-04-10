import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import {
  Col,
  Row,
  Spinner,
  Button,
  Form,
  Label,
  FormFeedback,
  FormGroup,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import patient from "../../../services/patient";
import location from "../../../services/location";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import common from "../../../services/common";
import Documents from "../Documents/Documents";
import AddEditDocument from "../Documents/AddEditDocument";
import NumberFormat from "react-number-format";
import Notes from "../Notes/";
import AddEditNote from "../Notes/AddEditNote";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import moment from "moment";

class AddEditPatientBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      submitted: false,
      countries: [],
      states: [],
      //docSubmitted: false,
      loader: false,
      imageLoader: false,
      activeTab: "1",
      documents: [],
      notes: [],
      attachments: [],
      image: null,
      documentTypes: common.getDocumentTypes()[0],
      languages: common.getLanguages(),
      responsibleParty: [
        "Legal Guardian",
        "Parent",
        "Power of Attorney",
        "Self",
      ],
      enableEditButton: false,
      enableDeleteButton: true,
      checkUploadedFile: false,
      checkNotesAdded: false,
      sex: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
      ],
    };
  }

  checkNotesAdded = (val) => {
    this.setState({ checkNotesAdded: val });
  };

  getPatient = (id) => {
    let states = [];
    this.setState({ loader: true });
    patient.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = response.data.patient;
        fields["BirthDate"] =
          response.data.patient.BirthDate !== "0000-00-00"
            ? new Date(moment(response.data.patient.BirthDate))
            : "";
        fields["sms_consent_date"] =
          response.data.patient.sms_consent_date !== null
            ? new Date(response.data.patient.sms_consent_date)
            : new Date(moment());

        fields["email_consent_date"] =
          response.data.patient.email_consent_date !== null
            ? new Date(response.data.patient.email_consent_date)
            : new Date(moment());

        fields["BirthDate"].age = this.calAge(
          new Date(response.data.patient.BirthDate)
        );
        if (response.data.patient.Country!== null) {
          fields["Country"] = {
            label: response.data.patient.countrydetails.name,
            value: response.data.patient.countrydetails.id,
          };
        }
        if (response.data.patient.State !== null) {
          fields["State"] = {
            label: response.data.patient.statedetails.state,
            value: response.data.patient.statedetails.state_id,
          };
        }
        if (response.data.patient.Country !== null) {
          this.state.countries.forEach((country) => {
            if (country.value === response.data.patient.countrydetails.id) {
              typeof country.states !== "undefined" &&
                country.states.forEach((state, index) => {
                  states[index] = {
                    value: state.state_id,
                    label: state.state,
                  };
                });
            }
          });
        }

        let documents = response.data.patient.documents;
        let notes = response.data.patient.notes;
        this.setState({
          fields,
          states,
          documents,
          notes,
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      this.setState({ loader: false });
    });
  };

  componentDidMount() {
    location.list().then((response) => {
      if (response.data.success) {
        this.setState({ locations: response.data.locations });
      }
    });
    if (this.props.searchFields) {
      let fields = this.state.fields;
      fields = this.props.searchFields;
      fields["HomePhone"] =
        this.props.searchFields.phone !== undefined &&
        this.props.searchFields.phone;
      fields["Sex"] = this.props.searchFields.sex;
      fields["sms_consent_date"] = new Date(moment());
      fields["email_consent_date"] = new Date(moment());
      this.setState({ fields });
      common.getCountries().then((response) => {
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
          fields["Country"] = { label: "United States", value: "254" };
        }
        this.setState(
          { countries: countries, fields: fields, states: states },
          () => {
            if (this.props.id) {
              this.getPatient(this.props.id);
            }
          }
        );
      });
    }
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (this.props.userType != "15" && !this.props.isModal) {
        if (this.state.activeTab === "1") {
          this.setActiveTab("2");
        } else if (this.state.activeTab === "2") {
          if (this.state.checkUploadedFile) {
            alert("Save the document or cancel to discard");
          } else {
            this.setActiveTab("3");
          }
        } else if (this.state.activeTab === "3")
          if (this.state.checkNotesAdded) {
            alert("Save the note or cancel to discard");
          } else {
            this.setState({ submitted: true });
            let fields = this.state.fields;
            fields["coustom_BirthDate"] = moment(fields["BirthDate"]).format(
              "YYYY-MM-DD"
            )
            const params = {
              fields:fields,
              id: this.props.id ? this.props.id : "",
              documents: this.state.documents,
              notes: this.state.notes,
            };
            patient.add(params).then((response) => {
              this.setState({ submitted: false }, () => {
                if (response.data.success) {
                  toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                  if (this.props.enableEditPatient) {
                    this.props.history.push("/admin/dashboard");
                  } else {
                    this.props.toggleModal();
                    if (this.props.choosePatient) {
                      this.props.choosePatient(response.data.patientDetails);
                    }
                  }
                } else if (response.data.error) {
                  if (response.data.message) {
                    this.setState({ errors: response.data.message });
                  }
                  /*toast.error(response.data.message, {
                  position: toast.POSITION.TOP_RIGHT
                });*/
                }
              });
            });
          }
      } else {
        this.setState({ submitted: true });
        let fields = this.state.fields
        fields["coustom_BirthDate"] = moment(fields["BirthDate"]).format(
          "YYYY-MM-DD"
        )
        const params = {
          fields:fields,
          id: this.props.id ? this.props.id : "",
          documents: this.state.documents,
          notes: this.state.notes,
        };
        patient.add(params).then((response) => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              if (this.props.enableEditPatient) {
                this.props.history.push("/admin/patients");
              } else {
                this.props.toggleModal();
                if (this.props.choosePatient) {
                  this.props.choosePatient(response.data.patientDetails);
                }
              }
            } else if (response.data.error) {
              if (response.data.message) {
                this.setState({ errors: response.data.message });
              }
              /*toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });*/
            }
          });
        });
      }
    } else {
      this.setActiveTab("1");
    }
  };
  handleConsentChange = (field, e) => {
    let fields = this.state.fields;
    if(field === 'sms_consent' && !e.target.checked){
      fields['sms_consent_date'] = '';
    }
    else if(field === 'email_consent' && !e.target.checked){
      fields['email_consent_date'] = '';
    }
    fields[field] = e.target.checked ? 1 : 0;
    this.setState({ fields });
  };
  handleZipOnBlur = (e) => {
    if(e.target.value !== ''){
      let params = {
        zipcode: e.target.value,
      };
      if (e.target.value !== "") {
        patient.getZipDetails(params).then((res) => {
          if (res.data.success) {
            let fields = this.state.fields;
            fields["Country"] = {
              label: res.data.patient.countrydetails.name,
              value: res.data.patient.countrydetails.id,
            };
            fields["City"] = res.data.patient.City;
            fields["State"] = {
              label: res.data.patient.statedetails.state,
              value: res.data.patient.statedetails.state_id,
            };
            this.setState(fields);
          }
        });
      } else {
        let fields = this.state.fields;
        fields["Country"] = {};
        fields["City"] = "";
        fields["State"] = {};
        this.setState(fields);
      }
    }
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["first_name"]) {
      formIsValid = false;
      errors["first_name"] = "First name name can not be empty!";
    }
    if (!fields["last_name"]) {
      formIsValid = false;
      errors["last_name"] = "Last name can not be empty!";
    }
    if (fields["email"] && !common.isValidEmail(fields["email"])) {
      formIsValid = false;
      errors["email"] = "Enter valid Email Address!";
    }
    if (!fields["City"]) {
      formIsValid = false;
      errors["City"] = "City can not be empty!";
    }
    if (!fields["Country"]) {
      formIsValid = false;
      errors["Country"] = "Country can not be empty!";
    }
    if (!fields["State"]) {
      formIsValid = false;
      errors["State"] = "State can not be empty!";
    }
    // if (!fields["Zipcode"]) {
    //   formIsValid = false;
    //   errors["Zipcode"] = "Zipcode can not be empty!";
    // }
    if (!fields["HomePhone"]) {
      formIsValid = false;
      errors["HomePhone"] = "Please enter the primary phone.";
    }
    if (!fields["BirthDate"]) {
      formIsValid = false;
      errors["BirthDate"] = "Birth Date can not be empty!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  calAge = (date) => {
    let value = "";
    let endDate = new Date();
    let startDate = date;
    let age = endDate.getFullYear() - startDate.getFullYear();
    let month = endDate.getMonth() - startDate.getMonth();
    if (month < 0 || (month === 0 && endDate.getDate() < startDate.getDate())) {
      age--;
    }
    if (age > 0) {
      if (age === 1) {
        value = `${age} year old`;
      } else {
        value = `${age} years old`;
      }
    }
    return value;
  };

  handleDate = (date, field) => {
    let fields = this.state.fields;
    fields[field] = date;
    if (field === "BirthDate") {
      fields[field].age = this.calAge(date);
    }
    this.setState({ fields });
  };

  addDocument = (file) => {
    let documents = [...this.state.documents, file];
    this.setState({ documents });
  };

  removeDocument = (file_name) => {
    let documents = this.state.documents.filter(
      (document) => document.document_name !== file_name
    );
    this.setState({ documents });
  };
  addNote = (note, indx) => {
    let notes = this.state.notes;
    if (indx !== undefined) {
      notes.forEach((n, index) => {
        if (parseInt(index) === parseInt(indx)) {
          notes[index].note_type = note.note_type;
          notes[index].notes = note.notes;
        }
      });
      this.setState({ notes, noteIndex: "", noteFields: {} });
    } else {
      notes = [...notes, note];
      this.setState({ notes });
    }
  };
  fillNote = (e) => {
    let notes = this.state.notes.filter(
      (note, index) => parseInt(index) === parseInt(e.target.dataset.index)
    );
    this.setState({ noteFields: notes[0], noteIndex: e.target.dataset.index });
  };
  handleReset = () => {
    this.setState({
      noteIndex: "",
      noteFields: {},
    });
  };
  removeNote = (e) => {
    if (window.confirm("Are you sure to delete this note?")) {
      let notes = this.state.notes.filter(
        (note, index) => parseInt(index) !== parseInt(e.target.dataset.index)
      );
      this.setState({ notes });
    }
  };
  handlePhone = (phone, field_name) => {
    let fields = this.state.fields;
    fields[field_name] = "+" + phone;
  };

  checkCallBack = (file, progress) => {
    console.log(file);
  };
  handleCountryChange = (country) => {
    let fields = this.state.fields;
    fields["Country"] = { label: country.label, value: country.value };
    let states = this.state.states;
    this.setState({ fields }, () => {
      let states = [];
      typeof country.states !== "undefined" &&
        country.states.forEach((state, index) => {
          states[index] = { value: state.state_id, label: state.state };
        });
      if (states.length > 0 && states.length === 1) {
        fields["State"] = states[0];
      } else {
        fields["State"] = { value: "", label: "Select State..." };
      }
      this.setState({ fields, states });
    });
  };

  handleStateChange = (state) => {
    let fields = this.state.fields;
    fields["State"] = { label: state.label, value: state.value };
    this.setState({ fields });
  };

  checkUploadedFile = (val) => {
    this.setState({ checkUploadedFile: val });
  };

  handlePatientImage = (img) => {
    this.setState({ image: img.target.files[0] });
  };

  handleImageSubmit = () => {
    var formdata = new FormData();
    if (this.state.image) {
      this.setState({ imageLoader: true });
      formdata.append("filepond", this.state.image);
      patient.addImage(formdata).then((response) => {
        if (response.data.success) {
          let fields = this.state.fields;
          fields["file"] = response.data.file;
          this.setState({ fields: fields, imageLoader: false });
          toast.success("Patient image has been uploaded sucessfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };

  render() {
    const { fields, countries, states, errors, isModal } = this.state;
    return (
      <Card>
        {!this.props.isModal ? (
          this.props.enableEditPatient ? (
            <CardHeader>
              <strong style={{ fontSize: 20 }}>
                {fields["id"]
                  ? `Update ${fields["first_name"] && fields["first_name"] !== null
                    ? fields["first_name"]
                    : ""
                  }`
                  : "Add New Patient"}
              </strong>
            </CardHeader>
          ) : (
            <CardHeader>
              <strong style={{ fontSize: 20 }}>Add New Patient</strong>
            </CardHeader>
          )
        ) : null}
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
            {this.props.userType != "15" && !this.props.isModal && (
              <>
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
              </>
            )}
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
                    <Col md={2}>
                      <FormGroup>
                        <Label style={{ width: "100%" }}>Patient Image </Label>
                        <div class="upload-btn-wrapper">
                          {this.state.image ? (
                            <div>
                              <img
                                src={URL.createObjectURL(this.state.image)}
                                className="img-fluid rounded-circle imgupload"
                                width="400px"
                                height="350px"
                              />
                            </div>
                          ) : this.state.fields.image ? (
                            <img
                              src={`${this.props.baseUrl}/images/${this.state.fields["image"]}`}
                              className="img-fluid rounded-circle imgupload"
                              width="400px"
                              height="350px"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon="user-circle"
                              style={{ fontSize: 145, paddingBottom: "15px" }}
                            />
                          )}
                          <Button
                            type="button"
                            color="success"
                            className="btn-upload"
                            onClick={() => this.handleImageSubmit()}
                            disabled={
                              this.state.image === null ||
                                this.state.imageLoader
                                ? true
                                : false
                            }
                          >
                            {this.state.imageLoader && this.props.userType && (
                              <FontAwesomeIcon
                                icon="spinner"
                                className="mr-1"
                                spin={true}
                              />
                            )}
                            Upload Image
                          </Button>
                          <Input
                            type="file"
                            allowMultiple={false}
                            allowRemove={true}
                            onChange={(e) => this.handlePatientImage(e)}
                          // tabIndex={1}
                          />
                          {this.state.errors["file"] && (
                            <small className="fa-1x text-danger">
                              {this.state.errors["file"]}
                            </small>
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md={10}>
                      <FormGroup row>
                        <Col md={2}>
                          <Label>Prefix</Label>
                          <Input
                            type="text"
                            className="ml10"
                            name="prefix"
                            value={fields["prefix"] ? fields["prefix"] : ""}
                            onChange={(event) =>
                              this.handleChange("prefix", event)
                            }
                            invalid={errors["prefix"] ? true : false}
                            tabindex="1"
                          />
                          {errors["prefix"] && (
                            <FormFeedback>{errors["prefix"]}</FormFeedback>
                          )}
                        </Col>
                        <Col md={3}>
                          <Label>First Name</Label>
                          <Input
                            type="text"
                            name="first_name"
                            value={
                              fields["first_name"] ? fields["first_name"] : ""
                            }
                            onChange={(event) =>
                              this.handleChange("first_name", event)
                            }
                            invalid={errors["first_name"] ? true : false}
                            tabindex="2"
                          />
                          {errors["first_name"] && (
                            <FormFeedback>{errors["first_name"]}</FormFeedback>
                          )}
                        </Col>
                        <Col md={2}>
                          <Label>MI</Label>
                          <Input
                            type="text"
                            name="middle_name"
                            value={
                              fields["middle_name"] ? fields["middle_name"] : ""
                            }
                            onChange={(event) =>
                              this.handleChange("middle_name", event)
                            }
                            invalid={errors["middle_name"] ? true : false}
                            tabindex="3"
                          />
                          {errors["middle_name"] && (
                            <FormFeedback>{errors["middle_name"]}</FormFeedback>
                          )}
                        </Col>
                        <Col md={3}>
                          <Label>Last Name</Label>
                          <Input
                            type="text"
                            name="last_name"
                            value={
                              fields["last_name"] ? fields["last_name"] : ""
                            }
                            onChange={(event) =>
                              this.handleChange("last_name", event)
                            }
                            invalid={errors["last_name"] ? true : false}
                            tabindex="4"
                          />
                          {errors["last_name"] && (
                            <FormFeedback>{errors["last_name"]}</FormFeedback>
                          )}
                        </Col>
                        <Col md={2}>
                          <Label>Suffix</Label>
                          <Input
                            type="text"
                            className="ml10"
                            name="suffix"
                            value={fields["suffix"] ? fields["suffix"] : ""}
                            onChange={(event) =>
                              this.handleChange("suffix", event)
                            }
                            invalid={errors["suffix"] ? true : false}
                            tabindex="5"
                          />
                          {errors["suffix"] && (
                            <FormFeedback>{errors["suffix"]}</FormFeedback>
                          )}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col sm={6}>
                          <Label>Preferred Name</Label>
                          <Input
                            type="text"
                            name="preferred_name"
                            value={
                              fields["preferred_name"]
                                ? fields["preferred_name"]
                                : ""
                            }
                            onChange={(event) =>
                              this.handleChange("preferred_name", event)
                            }
                            invalid={errors["preferred_name"] ? true : false}
                            tabindex="6"
                          />
                          {errors["preferred_name"] && (
                            <FormFeedback>
                              {errors["preferred_name"]}
                            </FormFeedback>
                          )}
                        </Col>
                        <Col sm={6}>
                          <FormGroup>
                            <Label for="ResponsibleParty">
                              Responsible Party
                            </Label>
                            <Input
                              type="select"
                              tabindex="7"
                              name="ResponsibleParty"
                              id="ResponsibleParty"
                              value={
                                fields["ResponsibleParty"]
                                  ? fields["ResponsibleParty"]
                                  : ""
                              }
                              onChange={(event) =>
                                this.handleChange("ResponsibleParty", event)
                              }
                              invalid={
                                errors["ResponsibleParty"] ? true : false
                              }
                              className="input-bg"
                            >
                              <option value="">
                                {this.state.responsibleParty.length === 0
                                  ? "Loading..."
                                  : "-Select-"}
                              </option>
                              {this.state.responsibleParty.map((party, i) => (
                                <option value={i} key={`key-party-${party}`}>
                                  {party}
                                </option>
                              ))}
                            </Input>
                            {errors["ResponsibleParty"] && (
                              <FormFeedback>
                                {errors["ResponsibleParty"]}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <Row>
                        <Col sm={6}>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="text"
                              name="email"
                              value={fields["email"] ? fields["email"] : ""}
                              onChange={(event) =>
                                this.handleChange("email", event)
                              }
                              invalid={errors["email"] ? true : false}
                              bsSize="lg"
                              tabindex="8"
                            />
                            {errors["email"] && (
                              <FormFeedback>{errors["email"]}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                        <Col sm={6}>
                          <FormGroup>
                            <Label for="ResponsiblePartyName">
                              Responsible Party Name
                            </Label>
                            <Input
                              type="text"
                              name="ResponsiblePartyName"
                              id="ResponsiblePartyName"
                              value={
                                fields["ResponsiblePartyName"]
                                  ? fields["ResponsiblePartyName"]
                                  : ""
                              }
                              onChange={(event) =>
                                this.handleChange("ResponsiblePartyName", event)
                              }
                              invalid={
                                errors["ResponsiblePartyName"] ? true : false
                              }
                              tabindex="9"
                            />
                            {errors["ResponsiblePartyName"] && (
                              <FormFeedback>
                                {errors["ResponsiblePartyName"]}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={12}>
                      <FormGroup row>
                        <Col sm={6}>
                          <Label for="Sex">Sex</Label>
                          <Input
                            type="select"
                            bsSize="lg"
                            name="Sex"
                            onChange={(e) => this.handleChange("Sex", e)}
                            value={fields["Sex"] ? fields["Sex"] : ""}
                            invalid={errors["Sex"] ? true : false}
                            className="input-bg"
                            tabindex="10"
                          >
                            <option value="">-Select-</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            {/* {this.state.sex.map((s, i) => (
                              <option value={s.value} key={i}>
                                {s.label}
                              </option>
                            ))} */}
                          </Input>
                          {errors["Sex"] && (
                            <FormFeedback>{errors["Sex"]}</FormFeedback>
                          )}
                        </Col>
                        <Col sm={6}>
                          <Label for="BirthDate">Birth Date</Label>
                          {fields["BirthDate"] && fields["BirthDate"].age && (
                            <small className="fa-1x text-success float-right">
                              {`${fields["BirthDate"].age}`}
                            </small>
                          )}
                          <DatePicker
                            showYearDropdown
                            showMonthDropdown
                            className="form-control"
                            style={{ width: 100 + "%", float: "left" }}
                            selected={
                              fields["BirthDate"] ? fields["BirthDate"] : ""
                            }
                            onChange={(e) => this.handleDate(e, "BirthDate")}
                            dateFormat="MM-dd-yyyy"
                            placeholderText="MM-DD-YYYY"
                            tabIndex={11}
                          />
                          {errors["BirthDate"] && (
                            <small className="fa-1x text-danger">
                              {errors["BirthDate"]}
                            </small>
                          )}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col sm={4}>
                          <Label for="HomePhone">Primary Phone</Label>
                          <PhoneInput
                            // onlyCountries={["us", "in", "jp"]}
                            onlyCountries={["us"]}
                            value={
                              fields["HomePhone"] ? fields["HomePhone"] : ""
                            }
                            onChange={(phone) =>
                              this.handlePhone(phone, "HomePhone")
                            }
                            inputClass="form-control-lg form-control"
                            country="us"
                            inputStyle={{ width: 350 }}
                            tabIndex={12}
                          />
                          {this.state.errors["HomePhone"] && (
                            <small className="fa-1x text-danger">
                              {this.state.errors["HomePhone"]}
                            </small>
                          )}
                        </Col>
                        <Col sm={4}>
                          <Label for="WorkPhone">Secondary Phone</Label>
                          <PhoneInput
                            // onlyCountries={["us", "in", "jp"]}
                            onlyCountries={["us"]}
                            value={
                              fields["WorkPhone"] ? fields["WorkPhone"] : ""
                            }
                            onChange={(phone) =>
                              this.handlePhone(phone, "WorkPhone")
                            }
                            inputClass="form-control-lg form-control"
                            country="us"
                            inputStyle={{ width: 350 }}
                            tabIndex={13}
                          />
                          {this.state.errors["WorkPhone"] && (
                            <small className="fa-1x text-danger">
                              {this.state.errors["WorkPhone"]}
                            </small>
                          )}
                        </Col>
                        <Col sm={4}>
                          <FormGroup>
                            <Label>Language</Label>
                            <Input
                              type="select"
                              bsSize="lg"
                              name="language"
                              tabIndex={14}
                              onChange={(e) => this.handleChange("language", e)}
                              value={
                                fields["language"] ? fields["language"] : ""
                              }
                              invalid={errors["language"] ? true : false}
                              className="input-bg"
                            >
                              <option value="">
                                {this.state.languages.length === 0
                                  ? "Loading..."
                                  : "-Select-"}
                              </option>
                              {this.state.languages.map((lang, i) => (
                                <option value={i} key={`key-lang-${lang}`}>
                                  {lang}
                                </option>
                              ))}
                            </Input>
                            {errors["language"] && (
                              <FormFeedback>{errors["language"]}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </FormGroup>

                      <Row>
                        <Col md={6}>
                          <Label for="Address1">Address1</Label>
                          <Input
                            type="text"
                            name="Address1"
                            id="Address1"
                            tabindex="15"
                            value={fields["Address1"] ? fields["Address1"] : ""}
                            onChange={(event) =>
                              this.handleChange("Address1", event)
                            }
                            invalid={errors["Address1"] ? true : false}
                          />
                          {errors["Address1"] && (
                            <FormFeedback>{errors["Address1"]}</FormFeedback>
                          )}
                        </Col>
                        <Col md={6}>
                          <Label for="Address2">Address2</Label>
                          <Input
                            type="text"
                            name="Address2"
                            id="Address2"
                            tabindex="16"
                            value={fields["Address2"] ? fields["Address2"] : ""}
                            onChange={(event) =>
                              this.handleChange("Address2", event)
                            }
                            invalid={errors["Address2"] ? true : false}
                          />
                          {errors["Address2"] && (
                            <FormFeedback>{errors["Address2"]}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col md={3}>
                          <FormGroup>
                            <Label for="City">City</Label>
                            <Input
                              type="text"
                              name="City"
                              id="City"
                              value={fields["City"] ? fields["City"] : ""}
                              onChange={(event) =>
                                this.handleChange("City", event)
                              }
                              invalid={errors["City"] ? true : false}
                              tabindex="17"
                            />
                            {errors["City"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["City"]}
                              </small>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="State">State</Label>
                            <Select
                              name="State"
                              id="State"
                              placeholder={<div>Select State...</div>}
                              value={fields["State"] ? fields["State"] : ""}
                              options={states}
                              onChange={(event) =>
                                this.handleStateChange(event)
                              }
                              invalid={errors["State"] ? true : false}
                              tabIndex={18}
                            />
                            {errors["State"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["State"]}
                              </small>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={3}>
                          <FormGroup>
                            <Label>Zipcode</Label>
                            <NumberFormat
                              format="#########"
                              tabindex="19"
                              className={
                                errors["Zipcode"]
                                  ? "change-border"
                                  : "form-control"
                              }
                              value={
                                fields["Zipcode"] && fields["Zipcode"] != 0
                                  ? fields["Zipcode"].replace(/ /g, "")
                                  : ""
                              }
                              onChange={(event) =>
                                this.handleChange("Zipcode", event)
                              }
                              onBlur={(e) => this.handleZipOnBlur(e)}
                            />
                            {errors["Zipcode"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["Zipcode"]}
                              </small>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="Country">Country</Label>
                            <Select
                              name="Country"
                              id="Country"
                              placeholder={<div>Select Country...</div>}
                              value={
                                fields["Country"]
                                  ? fields["Country"]
                                  : ""
                              }
                              options={countries}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={this.handleCountryChange}
                              tabIndex={20}
                            />
                            {errors["Country"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["Country"]}
                              </small>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      {
                        (parseInt(this.props.userType) === 1 ||
                          parseInt(this.props.userType) === 15) ? (
                          <Row className="mt-4">
                            <Col sm={3}>
                            <FormGroup>
                              <InputGroup>
                                <div style={{ display: "flex" }}>
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText className="smsconsent">
                                      <Input
                                        addon
                                        type="checkbox"
                                        name="sms_consent"
                                        tabIndex="21"
                                        onChange={(event) => {
                                          this.handleConsentChange(
                                            "sms_consent",
                                            event
                                          );
                                        }}
                                        checked={
                                          (fields["sms_consent"] == "1" || fields["sms_consent_date"] !== '')
                                            ? true
                                            : false
                                        }
                                      />
                                    </InputGroupText>
                                    <InputGroupText className="smsconsent">SMS Consent
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <DatePicker
                                    showYearDropdown
                                    showMonthDropdown
                                    style={{ width: 100 + "%", float: "left" }}
                                    selected={
                                      fields["sms_consent_date"]
                                        ? fields["sms_consent_date"]
                                        : ""
                                    }
                                    onChange={(e) =>
                                      this.handleDate(e, "sms_consent_date")
                                    }
                                    dateFormat="MM-dd-yyyy"
                                    placeholderText="MM-DD-YYYY"
                                    tabIndex={22}
                                    className="form-control"
                                  />
                                </div>
                              </InputGroup>
                              </FormGroup>
                            </Col>
                            <Col sm={3}></Col>

                            <Col sm={3}>
                            <FormGroup>
                              <InputGroup>
                                <div style={{ display: "flex" }}>
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText className="emailconsent">
                                      <Input
                                        addon
                                        type="checkbox"
                                        tabIndex="23"
                                        name="email_consent"
                                        onChange={(event) => {
                                          this.handleConsentChange(
                                            "email_consent",
                                            event
                                          );
                                        }}
                                        checked={
                                          (fields["email_consent"] == "1" || fields["email_consent_date"] !== '')
                                            ? true
                                            : false
                                        }
                                      />
                                    </InputGroupText>
                                    <InputGroupText className="emailconsent">Email Consent
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <DatePicker
                                    showYearDropdown
                                    showMonthDropdown
                                    className="form-control"
                                    style={{ width: 100 + "%", float: "left" }}
                                    selected={
                                      fields["email_consent_date"]
                                        ? fields["email_consent_date"]
                                        : ""
                                    }
                                    onChange={(e) =>
                                      this.handleDate(e, "email_consent_date")
                                    }
                                    dateFormat="MM-dd-yyyy"
                                    placeholderText="MM-DD-YYYY"
                                    tabIndex={24}
                                  />
                                  {errors["email_consent_date"] && (
                                    <small className="fa-1x text-danger">
                                      {errors["email_consent_date"]}
                                    </small>
                                  )}
                                </div>
                              </InputGroup>
                              </FormGroup>
                            </Col>
                            <Col sm={3}></Col>
                          </Row>
                        ) :
                          (

                            (parseInt(!this.props.userType) === 1 ||
                              parseInt(!this.props.userType) === 15) || this.props.id && (
                                <Row className="mt-4">
                                  <Col sm={3}>
                                    <InputGroup>
                                      <div style={{ display: "flex" }}>
                                        <InputGroupAddon addonType="prepend">
                                          <InputGroupText>
                                            <Input
                                              addon
                                              type="checkbox"
                                              name="sms_consent"
                                              onChange={(event) => {
                                                this.handleConsentChange(
                                                  "sms_consent",
                                                  event
                                                );
                                              }}
                                              checked={
                                                fields["sms_consent"] == "1"
                                                  ? true
                                                  : false
                                              }
                                              disabled
                                            />
                                          </InputGroupText>
                                          <InputGroupText>SMS Consent</InputGroupText>
                                        </InputGroupAddon>
                                        <DatePicker
                                          showYearDropdown
                                          showMonthDropdown
                                          style={{ width: 100 + "%", float: "left" }}
                                          selected={
                                            fields["sms_consent_date"]
                                              ? fields["sms_consent_date"]
                                              : ""
                                          }
                                          onChange={(e) =>
                                            this.handleDate(e, "sms_consent_date")
                                          }
                                          dateFormat="MM-dd-yyyy"
                                          placeholderText="MM-DD-YYYY"
                                          tabIndex={11}
                                          className="form-control"
                                          disabled
                                        />
                                      </div>
                                    </InputGroup>
                                  </Col>
                                  <Col sm={3}></Col>

                                  <Col sm={3}>
                                    <InputGroup>
                                      <div style={{ display: "flex" }}>
                                        <InputGroupAddon addonType="prepend">
                                          <InputGroupText>
                                            <Input
                                              addon
                                              type="checkbox"
                                              name="email_consent"
                                              onChange={(event) => {
                                                this.handleConsentChange(
                                                  "email_consent",
                                                  event
                                                );
                                              }}
                                              checked={
                                                fields["email_consent"] == "1"
                                                  ? true
                                                  : false
                                              }
                                              disabled
                                            />
                                          </InputGroupText>
                                          <InputGroupText>Email Consent</InputGroupText>
                                        </InputGroupAddon>
                                        <DatePicker
                                          showYearDropdown
                                          showMonthDropdown
                                          className="form-control"
                                          style={{ width: 100 + "%", float: "left" }}
                                          selected={
                                            fields["email_consent_date"]
                                              ? fields["email_consent_date"]
                                              : ""
                                          }
                                          onChange={(e) =>
                                            this.handleDate(e, "email_consent_date")
                                          }
                                          dateFormat="MM-dd-yyyy"
                                          placeholderText="MM-DD-YYYY"
                                          tabIndex={11}
                                          disabled
                                        />
                                        {errors["email_consent_date"] && (
                                          <small className="fa-1x text-danger">
                                            {errors["email_consent_date"]}
                                          </small>
                                        )}
                                      </div>
                                    </InputGroup>
                                  </Col>
                                  <Col sm={3}></Col>
                                </Row>
                              )
                          )}


                    </Col>

                    <Col xl={12} className="text-right mt-4">
                      {this.props.enableEditPatient ? (
                        <Link
                          to="/admin/patients"
                          className="btn btn-danger mr-2"
                        >
                          Cancel
                        </Link>
                      ) : (
                        <button
                          class="btn btn-danger mr-2"
                          onClick={this.props.toggleModal}
                        >
                          Cancel
                        </button>
                      )}

                      <Button
                        type="submit"
                        color="success"
                        disabled={this.state.submitted}
                        onClick={this.handleSubmit}
                      >
                        {this.state.submitted && this.props.userType && (
                          <FontAwesomeIcon
                            icon="spinner"
                            className="mr-1"
                            spin={true}
                          />
                        )}
                        {!this.props.isModal && this.props.userType != "15"
                          ? "Next"
                          : "Save Patient"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </LoadingOverlay>
            </TabPane>
            <TabPane tabId="2">
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
                    serviceName={patient}
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
                    Next <FontAwesomeIcon icon="forward" className="ml-1" />
                  </Button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
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
                    removeNote={this.removeNote}
                    fillNote={this.fillNote}
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
                    {this.state.submitted && (
                      <FontAwesomeIcon
                        icon="spinner"
                        className="mr-1"
                        spin={true}
                      />
                    )}
                    Save Patient
                  </Button>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    apiUrl: state.apiUrl,
    token: state.token,
    userType: state.userType,
    searchFields:
      state.searchPatientData !== undefined
        ? state.searchPatientData.searchFields
        : [],
  };
};
export default withRouter(connect(mapStateToProps)(AddEditPatientBody));
