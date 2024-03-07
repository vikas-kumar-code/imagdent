import React, { Component } from "react";
import diagnosis from "../../../services/diagnosiscode";
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
  FormText
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import Select from "react-select";

class AddEditDiagnosis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: { status: "Y" },
      errors: {},
      submitted: false
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({
        submitted: true
      });

      const params = {
        fields: this.state.fields
      };
      let that = this;
      diagnosis
        .add(params)
        .then(response => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              });
              this.props.toggleModal();
              this.props.getDiagnosisCodes(this.props.fieldsFromSearch);
            } else if (response.data.error) {
              if (response.data.message) {
                this.setState({ errors: response.data.message });
              }
            }
          });
        })
        .catch(function(error) {
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
    if (!fields["code"]) {
      formIsValid = false;
      errors["code"] = "Code can not be empty!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getDiagnosisCode = id => {
    this.setState({ loader: true });
    diagnosis.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.diagnosis_code;
        this.setState({
          loader: false,
          fields
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };
  componentDidMount = () => {
    if (this.props.diagnosisCodeId) {
      this.getDiagnosisCode(this.props.diagnosisCodeId);
    }
  };

  render() {
    const { loader, fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showModal}>
        <Form
          name="add-edit-action-form"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <ModalHeader toggle={this.props.toggleModal}>
            {this.props.diagnosisCodeId ? "Update " : "Add "} Diagnosis Code
          </ModalHeader>
          <LoadingOverlay
            active={loader}
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
                      onChange={event => this.handleChange("name", event)}
                      invalid={errors["name"] ? true : false}
                      className="input-bg"
                      bsSize="lg"
                    />
                    {errors["name"] && (
                      <FormFeedback>{errors["name"]}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="code">Code</Label>
                    <Input
                      type="text"
                      name="code"
                      id="code"
                      value={fields["code"] ? fields["code"] : ""}
                      onChange={event => this.handleChange("code", event)}
                      invalid={errors["code"] ? true : false}
                      className="input-bg"
                      bsSize="lg"
                    />
                    {errors["code"] && (
                      <FormFeedback>{errors["code"]}</FormFeedback>
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
                        onChange={event => this.handleChange("status", event)}
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
                        onChange={event => this.handleChange("status", event)}
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
                {this.props.diagnosisCodeId ? "Update" : "Add"}
              </button>
            </ModalFooter>
          </LoadingOverlay>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userType: state.userType
  };
};
export default connect(mapStateToProps)(AddEditDiagnosis);
