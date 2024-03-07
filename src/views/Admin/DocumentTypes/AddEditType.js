import React, { Component } from "react";
import patient from "../../../services/patient";
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
  FormFeedback
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class AddEditType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: {},
      errors: {},
      submitted: false
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    if (e.target.type === "checkbox") {
      fields[field] = e.target.checked;
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
      };

      patient.addDocumentType(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
            this.props.getDocumentTypes();
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.name) {
              errors["name"] = response.data.message.name[0];
            }
            this.setState({ errors: errors });
          }
        });
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
    this.setState({ errors: errors });
    return formIsValid;
  };

  getDocumentType = id => {
    this.setState({ loader: true });
    patient.getDocumentType({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.document;
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
    if (this.props.documentTypeId) {
      this.getDocumentType(this.props.documentTypeId);
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.documentTypeId ? "Update " : "Add "} Document Type
        </ModalHeader>
        <ModalBody className="pl-4 pr-4">
          <div className="animated fadeIn">
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Form
                name="add-edit-action-form"
                method="post"
                onSubmit={this.handleSubmit}
              >
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="name"
                    name="name"
                    id="name"
                    value={
                      this.state.fields["name"] ? this.state.fields["name"] : ""
                    }
                    onChange={event => this.handleChange("name", event)}
                    invalid={this.state.errors["name"] ? true : false}
                    className="input-bg"
                    bsSize="lg"
                  />
                  {this.state.errors["name"] && (
                    <FormFeedback>{this.state.errors["name"]}</FormFeedback>
                  )}
                </FormGroup>
                <Row>
                  <Col md={12} className="text-right">
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
                      {this.props.documentTypeId ? "Update" : "Add"}
                    </button>
                  </Col>
                </Row>
              </Form>
            </LoadingOverlay>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl
  };
};
export default connect(mapStateToProps)(AddEditType);
