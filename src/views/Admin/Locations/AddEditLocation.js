import React, { Component } from "react";
import location from "../../../services/location";
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
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import classnames from "classnames";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";

class AddEditLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: { status: "Y" },
      countries: [],
      bcountries: [],
      states: [],
      bstates: [],
      defaultStateOptions: [],
      errors: {},
      submitted: false,
      activeTab: "1",
      file: {},
      document: {},
    };
  }

  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (this.state.activeTab === "1") {
        this.setActiveTab("2");
      } else {
        this.setState({
          submitted: true,
        });
        const params = {
          fields: this.state.fields,
        };
        let that = this;
        location
          .add(params)
          .then((response) => {
            this.setState({ submitted: false }, () => {
              if (response.data.success) {
                toast.success(response.data.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
                this.props.toggleModal();
                this.props.getLocations(this.props.fieldsFromSearch);
              } else if (response.data.error) {
                if (response.data.message) {
                  this.setState({ errors: response.data.message });
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
  handleZipOnBlur = (e) => {
    let params = {
      zipcode: e.target.value,
    };
    if (e.target.value !== "") {
      location.getZipDetails(params).then((res) => {
        if (res.data.success) {
          let fields = this.state.fields;
          fields["country"] = {
            label: res.data.location.countrydetails.name,
            value: res.data.location.countrydetails.id,
          };
          fields["city"] = res.data.location.City;
          fields["state"] = {
            label: res.data.location.statedetails.state,
            value: res.data.location.statedetails.state_id,
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
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["legal_name"]) {
      formIsValid = false;
      errors["legal_name"] = "Legal Name can not be empty!";
    }
    if (!fields["publish_name"]) {
      formIsValid = false;
      errors["publish_name"] = "Publish Name can not be empty!";
    }
    if (!fields["Zipcode"] || (fields["Zipcode"] && fields["Zipcode"] == 0)) {
      formIsValid = false;
      errors["Zipcode"] = "Zipcode can not be empty!";
    }
    if (fields["email"] && !common.isValidEmail(fields["email"])) {
      formIsValid = false;
      errors["email"] = "Please enter a valid email!";
    }
    if (!fields["country_id"]) {
      formIsValid = false;
      errors["country_id"] = "Country can not be empty!";
    }
    if (!fields["state_id"]) {
      formIsValid = false;
      errors["state_id"] = "State can not be empty!";
    }
    if (!fields["HomePhone"]) {
      formIsValid = false;
      errors["HomePhone"] = "Please enter Office Cell Phone.";
    }
    if (!fields["WorkPhone"] && !fields["WorkPhone"]) {
      formIsValid = false;
      errors["WorkPhone"] = "Please enter Location Phone.";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };

  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  getLocation = (id) => {
    let states = [];
    let bstates = [];
    this.setState({ loader: true });
    location.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = Object.assign({}, response.data.location);
        if (response.data.location.country_id !== null) {
          fields["country_id"] = {
            label: response.data.location.country.name,
            value: response.data.location.country.id,
          };
          let country = this.state.countries.filter(
            (country) =>
              parseInt(country.value) ===
              parseInt(response.data.location.country_id)
          );
          country[0].states.forEach((state, index) => {
            states[index] = {
              value: state.state_id,
              label: state.state,
            };
          });

          if (response.data.location.state_id !== null) {
            fields["state_id"] = {
              label: response.data.location.state.state,
              value: response.data.location.state.state_id,
            };
          }
        }
        if (response.data.location.billing_country !== null) {
          let bcountry = this.state.countries.filter(
            (country) =>
              parseInt(country.value) ===
              parseInt(response.data.location.billing_country)
          );
          bcountry[0].states.forEach((state, index) => {
            bstates[index] = {
              value: state.state_id,
              label: state.state,
            };
          });
          fields["billing_country"] = {
            label: response.data.location.bcountry.name,
            value: response.data.location.bcountry.id,
          };
          if (response.data.location.billing_state !== null) {
            fields["billing_state"] = {
              label: response.data.location.bstate.state,
              value: response.data.location.bstate.state_id,
            };
          }
        }

        this.setState({
          loader: false,
          fields,
          states,
          bstates,
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };
  componentDidMount = () => {
    //this.getCountries();
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
          fields["country_id"] = { label: "United States", value: "254" };
          fields["billing_country"] = { label: "United States", value: "254" };

          this.setState(
            {
              countries,
              bcountries: countries,
              fields: fields,
              states: states,
              bstates: states,
            },
            () => {
              if (this.props.locationId) {
                this.getLocation(this.props.locationId);
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
    fields["country_id"] = { label: country.label, value: country.value };
    let states = this.state.states;
    this.setState({ fields }, () => {
      let states = [];
      typeof country.states !== "undefined" &&
        country.states.forEach((state, index) => {
          states[index] = { value: state.state_id, label: state.state };
        });
      if (states.length > 0 && states.length === 1) {
        fields["state_id"] = states[0];
      } else {
        fields["state_id"] = { value: "", label: "Select State..." };
      }
      this.setState({ fields, states });
    });
  };

  handleStateChange = (state) => {
    let fields = this.state.fields;
    fields["state_id"] = { label: state.label, value: state.value };
    this.setState({ fields });
  };

  handleBillingCountryChange = (country) => {
    let fields = this.state.fields;
    fields["billing_country"] = { label: country.label, value: country.value };
    let bstates = this.state.bstates;
    this.setState({ fields }, () => {
      let states = [];
      typeof country.states !== "undefined" &&
        country.states.forEach((state, index) => {
          bstates[index] = { value: state.state_id, label: state.state };
        });
      if (bstates.length > 0 && bstates.length === 1) {
        fields["billing_state"] = states[0];
      } else {
        fields["billing_state"] = { value: "", label: "Select State..." };
      }
      this.setState({ fields, bstates });
    });
  };

  handleBillingStateChange = (state) => {
    let fields = this.state.fields;
    fields["billing_state"] = { label: state.label, value: state.value };
    this.setState({ fields });
  };
  checkCallBack = (file, progress) => {
    console.log(file.id);
    //console.log(this.state.files);
  };
  render() {
    const { loader, countries, states, bcountries, bstates, fields, errors } =
      this.state;
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <Form
          name="add-edit-action-form"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <ModalHeader toggle={this.props.toggleModal}>
            {this.props.locationId ? "Update " : "Add "} Location
          </ModalHeader>
          <LoadingOverlay
            active={loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <ModalBody className="pl-4 pr-4">
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
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => this.setActiveTab("2")}
                    style={{ fontSize: 20 }}
                  >
                    Billing Address
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab} className="mb-3">
                <TabPane tabId="1">
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="legal_name">Legal Name</Label>
                        <Input
                          type="text"
                          name="legal_name"
                          id="legal_name"
                          value={
                            fields["legal_name"] ? fields["legal_name"] : ""
                          }
                          onChange={(event) =>
                            this.handleChange("legal_name", event)
                          }
                          invalid={errors["legal_name"] ? true : false}
                          className="input-bg"
                          bsSize="lg"
                        />
                        {errors["legal_name"] && (
                          <FormFeedback>{errors["legal_name"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="publish_name">Published Name</Label>
                        <Input
                          type="text"
                          name="publish_name"
                          id="publish_name"
                          value={
                            fields["publish_name"] ? fields["publish_name"] : ""
                          }
                          onChange={(event) =>
                            this.handleChange("publish_name", event)
                          }
                          invalid={errors["publish_name"] ? true : false}
                          className="input-bg"
                          bsSize="lg"
                        />
                        {errors["publish_name"] && (
                          <FormFeedback>{errors["publish_name"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={12}>
                      <FormGroup>
                        <Label for="fb_url">Facebook Profile Url</Label>
                        <Input
                          type="url"
                          name="fb_url"
                          id="fb_url"
                          value={fields["fb_url"] ? fields["fb_url"] : ""}
                          onChange={(event) =>
                            this.handleChange("fb_url", event)
                          }
                          invalid={errors["fb_url"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["fb_url"] && (
                          <FormFeedback>{errors["fb_url"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={12}>
                      <FormGroup>
                        <Label>Street Address</Label>
                        <Input
                          type="textarea"
                          name="street_address"
                          id="street_address"
                          value={
                            fields["street_address"]
                              ? fields["street_address"]
                              : ""
                          }
                          onChange={(event) =>
                            this.handleChange("street_address", event)
                          }
                          invalid={errors["street_address"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["street_address"] && (
                          <FormFeedback>
                            {errors["street_address"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>City</Label>

                        <Input
                          type="text"
                          name="city"
                          id="city"
                          value={fields["city"] ? fields["city"] : ""}
                          onChange={(event) => this.handleChange("city", event)}
                          invalid={errors["city"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["city"] && (
                          <FormFeedback>{errors["city"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="state_id">State</Label>
                        <Select
                          name="state_id"
                          id="state_id"
                          placeholder={<div>Select State...</div>}
                          value={fields["state_id"] && fields["state_id"]}
                          options={states}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={this.handleStateChange}
                        />
                        {errors["state_id"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["state_id"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Zipcode</Label>
                        <NumberFormat
                          format="#########"
                          className={
                            errors["Zipcode"] ? "change-border" : "form-control"
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

                    <Col md={6}>
                      <FormGroup>
                        <Label for="country_id">Country</Label>
                        <Select
                          name="country_id"
                          id="country_id"
                          placeholder={<div>Select Country...</div>}
                          value={
                            fields["country_id"]
                              ? fields["country_id"]
                              : { label: "United States", value: "254" }
                          }
                          options={countries}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={this.handleCountryChange}
                        />
                        {errors["country_id"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["country_id"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          type="text"
                          name="email"
                          id="email"
                          value={fields["email"] ? fields["email"] : ""}
                          onChange={(event) =>
                            this.handleChange("email", event)
                          }
                          invalid={errors["email"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["email"] && (
                          <FormFeedback>{errors["email"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="fax">Fax</Label>
                        <NumberFormat
                          format="(###) ###-####"
                          className={
                            errors["fax"] ? "change-border" : "form-control"
                          }
                          value={fields["fax"] ? fields["fax"] : ""}
                          onChange={(event) => this.handleChange("fax", event)}
                        />
                        {errors["fax"] && (
                          <small className="fa-1x text-danger">
                            {errors["fax"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="HomePhone">Office Cell Phone</Label>
                        <NumberFormat
                          format="(###) ###-####"
                          value={fields["HomePhone"] ? fields["HomePhone"] : ""}
                          onChange={(event) =>
                            this.handleChange("HomePhone", event)
                          }
                          className={
                            errors["HomePhone"]
                              ? "change-border"
                              : "form-control"
                          }
                        />
                        {errors["HomePhone"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["HomePhone"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="WorkPhone">Location Phone</Label>
                        <NumberFormat
                          format="(###) ###-####"
                          value={fields["WorkPhone"] ? fields["WorkPhone"] : ""}
                          onChange={(event) =>
                            this.handleChange("WorkPhone", event)
                          }
                          className={
                            errors["WorkPhone"]
                              ? "change-border"
                              : "form-control"
                          }
                        />
                        {errors["WorkPhone"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["WorkPhone"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    {this.props.userType == 1 && (
                      <Col md={6}>
                        <FormGroup>
                          <Label for="ein">EIN Number</Label>

                          <Input
                            type="number"
                            name="ein"
                            id="ein"
                            value={
                              fields["ein"] && fields["ein"] != 0
                                ? fields["ein"]
                                : ""
                            }
                            onChange={(event) =>
                              this.handleChange("ein", event)
                            }
                            invalid={errors["ein"] ? true : false}
                            bsSize="lg"
                          />
                          {this.state.errors["ein"] && (
                            <FormFeedback>{errors["ein"]}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                    )}
                    <Col md={6}>
                      <FormGroup>
                        <Label for="ein">NPI</Label>
                        <Input
                          type="number"
                          name="npi"
                          id="npi"
                          value={
                            fields["npi"] && fields["npi"] != 0
                              ? fields["npi"]
                              : ""
                          }
                          onChange={(event) => this.handleChange("npi", event)}
                          invalid={errors["npi"] ? true : false}
                          bsSize="lg"
                        />
                        {this.state.errors["npi"] && (
                          <FormFeedback>{errors["npi"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="file_name">File Upload</Label>
                        <FilePond
                          allowMultiple={false}
                          allowRemove={true}
                          ref={(ref) => (this.pond = ref)}
                          server={{
                            url: this.props.apiUrl,
                            process: {
                              url: "/location/upload-document",
                              headers: {
                                "X-Api-Key": `Bearer  ${this.props.token}`,
                              },
                              onload: (response) => {
                                let response_josn = JSON.parse(response);
                                if (response_josn.success) {
                                  let file = response_josn.file;
                                  let fields = this.state.fields;
                                  fields["file_name"] = file.document_name;
                                  this.setState({
                                    file,
                                    fields,
                                  });
                                  return response_josn.file.document_name;
                                }
                              },
                              onerror: (error) => {
                                return error;
                              },
                            },
                            revert: {
                              url: "/location/delete-document",
                              headers: {
                                "X-Api-Key": `Bearer  ${this.props.token}`,
                                file_name: this.state.file,
                              },
                              onload: (response) => {
                                //console.log(response);
                              },
                            },
                          }}
                          onprocessfileprogress={(file, progress) =>
                            this.checkCallBack(file, progress)
                          }
                          onprocessfilerevert={(file) => {
                            let documents = this.state.documents.filter(
                              (document) => document != file.serverId
                            );
                            this.setState({
                              documents,
                            });
                          }}
                          labelFileProcessingError={(error) => {
                            let message = JSON.parse(error.body);
                            return message.message;
                          }}
                        />
                        {this.state.errors["file"] && (
                          <small className="fa-1x text-danger">
                            {this.state.errors["file"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup check inline>
                        <Label>
                          <Input
                            type="radio"
                            name="status"
                            value="Y"
                            onChange={(event) =>
                              this.handleChange("status", event)
                            }
                            checked={fields["status"] === "Y" && true}
                          />
                          Active
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label>
                          <Input
                            type="radio"
                            name="status"
                            value="N"
                            onChange={(event) =>
                              this.handleChange("status", event)
                            }
                            checked={fields["status"] === "N" && true}
                          />
                          Inactive
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_legal_name">Legal Name</Label>
                        <Input
                          type="text"
                          name="billing_legal_name"
                          id="billing_legal_name"
                          value={
                            fields["billing_legal_name"]
                              ? fields["billing_legal_name"]
                              : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_legal_name", event)
                          }
                          invalid={errors["billing_legal_name"] ? true : false}
                          className="input-bg"
                          bsSize="lg"
                        />
                        {errors["billing_legal_name"] && (
                          <FormFeedback>
                            {errors["billing_legal_name"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_email">Email</Label>
                        <Input
                          type="text"
                          name="billing_email"
                          id="billing_email"
                          value={
                            fields["billing_email"]
                              ? fields["billing_email"]
                              : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_email", event)
                          }
                          invalid={errors["billing_email"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["billing_email"] && (
                          <FormFeedback>{errors["billing_email"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_fax">Fax</Label>
                        <NumberFormat
                          format="(###) ###-####"
                          className={
                            errors["billing_fax"]
                              ? "change-border"
                              : "form-control"
                          }
                          value={
                            fields["billing_fax"] ? fields["billing_fax"] : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_fax", event)
                          }
                        />
                        {errors["billing_fax"] && (
                          <small className="fa-1x text-danger">
                            {errors["billing_fax"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_phone">Phone</Label>
                        <NumberFormat
                          format="(###) ###-####"
                          value={
                            fields["billing_phone"]
                              ? fields["billing_phone"]
                              : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_phone", event)
                          }
                          className={
                            errors["billing_phone"]
                              ? "change-border"
                              : "form-control"
                          }
                        />
                        {errors["billing_phone"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["billing_phone"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label>Street Address</Label>
                        <Input
                          type="text"
                          name="billing_street_address"
                          id="billing_street_address"
                          value={
                            fields["billing_street_address"]
                              ? fields["billing_street_address"]
                              : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_street_address", event)
                          }
                          invalid={
                            errors["billing_street_address"] ? true : false
                          }
                          bsSize="lg"
                        />
                        {errors["billing_street_address"] && (
                          <FormFeedback>
                            {errors["billing_street_address"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_city">City</Label>
                        <Input
                          type="text"
                          name="billing_city"
                          id="billing_city"
                          value={
                            fields["billing_city"] ? fields["billing_city"] : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_city", event)
                          }
                          invalid={errors["billing_city"] ? true : false}
                          bsSize="lg"
                        />
                        {errors["billing_city"] && (
                          <FormFeedback>{errors["billing_city"]}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_state">State</Label>
                        <Select
                          name="billing_state"
                          id="billing_state"
                          placeholder={<div>Select State...</div>}
                          value={
                            fields["billing_state"] && fields["billing_state"]
                          }
                          options={bstates}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={this.handleBillingStateChange}
                        />
                        {errors["billing_state"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["billing_state"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Zipcode</Label>
                        <NumberFormat
                          format="#########"
                          className={
                            errors["billing_zipcode"]
                              ? "change-border"
                              : "form-control"
                          }
                          value={
                            fields["billing_zipcode"] && fields["Zipcode"] != 0
                              ? fields["billing_zipcode"].replace(/ /g, "")
                              : ""
                          }
                          onChange={(event) =>
                            this.handleChange("billing_zipcode", event)
                          }
                        />
                        {errors["billing_zipcode"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["billing_zipcode"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="billing_country">Country</Label>
                        <Select
                          name="billing_country"
                          id="billing_country"
                          placeholder={<div>Select Country...</div>}
                          value={
                            fields["billing_country"]
                              ? fields["billing_country"]
                              : { label: "United States", value: "254" }
                          }
                          options={bcountries}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={this.handleBillingCountryChange}
                        />
                        {errors["billing_country"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["billing_country"]}
                          </small>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
            <ModalFooter>
              <button
                type="button"
                className="btn btn-outline-dark cp mr-1"
                disabled={this.state.submitted}
                onClick={this.props.toggleModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger cbd-color cp"
                disabled={this.state.submitted}
              >
                {this.state.submitted && (
                  <FontAwesomeIcon
                    icon="spinner"
                    className="mr-1"
                    spin={true}
                  />
                )}
                {this.props.locationId ? "Update" : "Add"}
              </button>
            </ModalFooter>
          </LoadingOverlay>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userType: state.userType,
    apiUrl: state.apiUrl,
    token: state.token,
  };
};
export default connect(mapStateToProps)(AddEditLocation);
