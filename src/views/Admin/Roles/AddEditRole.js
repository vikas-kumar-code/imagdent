import React, { Component } from "react";
import role from "../../../services/role";
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

class AddEditRole extends Component {
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
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        id: this.props.roleId,
      };
      let that = this;
      role.add(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleEditModal();
            this.props.getRoles(this.props.fieldsFromSearch);
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.name) {
              errors["name"] = response.data.message.name[0];
            }
            this.setState({ errors: errors });
          }
        });
      }).catch(function (error) {
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
    this.setState({ errors: errors });
    return formIsValid;
  };

  getRole = id => {
    this.setState({ loader: true });
    role.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.role;
        this.setState({
          loader: false,
          fields
        });
      } else if (response.data.error) {
        let errors = {};
        if (response.data.message.name) {
          errors["name"] = response.data.message[0];
        }
        this.setState({ errors: errors });
      }

      else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };

  componentDidMount = () => {
    if (this.props.roleId) {
      this.getRole(this.props.roleId);
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.roleId ? "Update " : "Add "} Role
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
                      onClick={this.props.toggleEditModal}
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
                      {this.props.roleId ? "Update" : "Add"}
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
export default connect(mapStateToProps)(AddEditRole);
