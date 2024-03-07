import React, { Component } from "react";
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
  FormText,
} from "reactstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import service from "../../../services/service";
import common from "../../../services/common";
import location from "../../../services/location";

class AddEditService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: { parent_id: 0 },
      errors: {},
      parentServices: [],
      locations: [],
      submitted: false,
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    if (field == "note_required") {
      fields[field] = e.target.checked ? 1 : 0;
    } else fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleMultiChange = (field, option) => {
    let fields = this.state.fields;
    fields[field] = option;
    this.setState({ fields });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
      };
      let that = this;
      service
        .add(params)
        .then((response) => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              this.props.toggleModal();
              this.props.getServices(this.props.fieldsFromSearch);
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
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Name can not be empty!";
    }
    if (parseInt(fields["parent_id"]) !== 0) {
      if (!fields["code"]) {
        formIsValid = false;
        errors["code"] = "Code can not be empty!";
      }
      if (!fields["price"]) {
        formIsValid = false;
        errors["price"] = "Price can not be empty!";
      }
      if (!fields["locations"]) {
        formIsValid = false;
        errors["locations"] = "Please select atleast one location";
      }
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getService = (id) => {
    this.setState({ loader: true });
    service.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = response.data.service;
        if (response.data.service.locations !== null) {
          fields["locations"] = this.state.locations
            .filter((loc) =>
              response.data.service.locations.includes(loc.value)
            )
            .map((v, i) => ({ label: v.label, value: v.value }));
        }
        this.setState({
          loader: false,
          fields,
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  componentDidMount = () => {
    common.getParentServices().then((response) =>
      this.setState(
        {
          parentServices: response.data.services,
        },
        () => {
          location.list().then((response) => {
            let locations = [];
            if (response.data.success) {
              response.data.locations.forEach((loc, index) => {
                locations[index] = {
                  label: loc.publish_name,
                  value: loc.id,
                };
              });
            }
            this.setState(
              {
                locations,
              },
              () => {
                if (this.props.serviceId) {
                  this.getService(this.props.serviceId);
                }
              }
            );
          });
        }
      )
    );
  };

  render() {
    const { submitted, fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showModal}>
        <Form
          name="add-edit-action-form"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <ModalHeader toggle={this.props.toggleModal}>
            {this.props.serviceId ? "Update " : "Add "} Service
          </ModalHeader>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <ModalBody className="pl-4 pr-4">
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={fields["name"] ? fields["name"] : ""}
                      onChange={(event) => this.handleChange("name", event)}
                      invalid={errors["name"] ? true : false}
                      className="input-bg"
                      bsSize="lg"
                    />
                    {errors["name"] && (
                      <FormFeedback>{errors["name"]}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Parent Service</Label>
                    <Input
                      type="select"
                      bsSize="lg"
                      name="parent_id"
                      onChange={(e) => this.handleChange("parent_id", e)}
                      value={fields["parent_id"] ? fields["parent_id"] : ""}
                      invalid={errors["parent_id"] ? true : false}
                      className="input-bg"
                    >
                      <option value="0">
                        {this.state.parentServices.length === 0
                          ? "Loading..."
                          : "-Select-"}
                      </option>
                      {this.state.parentServices.map((parent) => (
                        <option
                          value={parent.id}
                          key={`key-service-${parent.id}`}
                        >
                          {parent.name}
                        </option>
                      ))}
                    </Input>
                    {errors["parent_id"] && (
                      <FormFeedback>{errors["parent_id"]}</FormFeedback>
                    )}
                  </FormGroup>
                  {fields["parent_id"] != 0 && (
                    <FormGroup>
                      <Label for="locations">Location</Label>
                      <Select
                        name="locations"
                        id="locations"
                        placeholder={<div>Select Location...</div>}
                        value={fields["locations"] ? fields["locations"] : []}
                        options={this.state.locations}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isMulti
                        invalid={errors["locations"] ? true : false}
                        onChange={(option) =>
                          this.handleMultiChange("locations", option)
                        }
                      />
                      {errors["locations"] && (
                        <small
                          style={{ fontSize: "12px" }}
                          className="fa-1x text-danger"
                        >
                          {errors["locations"]}
                        </small>
                      )}
                    </FormGroup>
                  )}
                  <FormGroup>
                    <Label for="code">Code</Label>
                    <Input
                      type="text"
                      name="code"
                      id="code"
                      value={fields["code"] ? fields["code"] : ""}
                      onChange={(event) => this.handleChange("code", event)}
                      invalid={this.state.errors["code"] ? true : false}
                      bsSize="lg"
                    />
                    {this.state.errors["code"] && (
                      <FormFeedback>{this.state.errors["code"]}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="price">Price</Label>
                    <Input
                      type="number"
                      name="price"
                      id="price"
                      value={fields["price"] ? fields["price"] : ""}
                      step="0.01"
                      onChange={(event) => this.handleChange("price", event)}
                      invalid={errors["price"] ? true : false}
                      bsSize="lg"
                    />
                    {errors["price"] && (
                      <FormFeedback>{errors["price"]}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="ada_code">ADA Code</Label>
                    <Input
                      type="text"
                      name="ada_code"
                      id="ada_code"
                      value={fields["ada_code"] ? fields["ada_code"] : ""}
                      onChange={(event) => this.handleChange("ada_code", event)}
                      invalid={errors["ada_code"] ? true : false}
                      bsSize="lg"
                    />
                    {errors["ada_code"] && (
                      <FormFeedback>{errors["ada_code"]}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="cpt_code">CPT Code</Label>
                    <Input
                      type="text"
                      name="cpt_code"
                      id="cpt_code"
                      value={fields["cpt_code"] ? fields["cpt_code"] : ""}
                      onChange={(event) => this.handleChange("cpt_code", event)}
                      invalid={errors["cpt_code"] ? true : false}
                      bsSize="lg"
                    />
                    {errors["cpt_code"] && (
                      <FormFeedback>{errors["cpt_code"]}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                {fields["parent_id"] != 0 && (
                  <Col md={12}>
                    <FormGroup check inline>
                      <Label>
                        <Input
                          type="checkbox"
                          name="note_required"
                          onChange={(event) => {
                            this.handleChange("note_required", event);
                          }}
                          checked={
                            fields["note_required"] == "1" ? true : false
                          }
                        />
                        Required Note
                      </Label>
                    </FormGroup>
                  </Col>
                )}
                <Col md={6}>
                  <FormGroup check inline>
                    <Label>
                      <Input
                        type="radio"
                        name="status"
                        value="Y"
                        onChange={(event) => this.handleChange("status", event)}
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
                        onChange={(event) => this.handleChange("status", event)}
                        checked={fields["status"] === "N" && true}
                      />
                      Inactive
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <button
                type="button"
                className="btn btn-outline-dark cp mr-1"
                disabled={submitted}
                onClick={this.props.toggleModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger cbd-color cp"
                disabled={submitted}
              >
                {submitted && (
                  <FontAwesomeIcon
                    icon="spinner"
                    className="mr-1"
                    spin={true}
                  />
                )}
                {this.props.serviceId ? "Update" : "Add"}
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
  };
};
export default connect(mapStateToProps)(AddEditService);
