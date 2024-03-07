import React, { Component } from "react";
import plan from "../../../services/plan";
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

class AddEditPlan extends Component {
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
        id: this.props.planId
      };

      plan.add(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
            this.props.getPlans();
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
    if (!fields["duration"]) {
      formIsValid = false;
      errors["duration"] = "Duration can not be empty!";
    }
    if (!fields["price"]) {
      formIsValid = false;
      errors["price"] = "Price can not be empty!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getPlan = id => {
    this.setState({ loader: true });
    plan.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.plan;
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
    if (this.props.planId) {
      this.getPlan(this.props.planId);
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} size="sm">
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.planId ? "Update " : "Add "} Plan
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
                <FormGroup>
                  <Label for="duration">Duration</Label>
                  <Input
                    type="number"
                    name="duration"
                    id="duration"
                    value={
                      this.state.fields["duration"]
                        ? this.state.fields["duration"]
                        : ""
                    }
                    onChange={event => this.handleChange("duration", event)}
                    invalid={this.state.errors["duration"] ? true : false}
                    bsSize="lg"
                  />
                  {this.state.errors["duration"] && (
                    <FormFeedback>{this.state.errors["duration"]}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="text"
                    name="price"
                    id="price"
                    value={
                      this.state.fields["price"]
                        ? this.state.fields["price"]
                        : ""
                    }
                    onChange={event => this.handleChange("price", event)}
                    invalid={this.state.errors["price"] ? true : false}
                    bsSize="lg"
                  />
                  {this.state.errors["price"] && (
                    <FormFeedback>{this.state.errors["price"]}</FormFeedback>
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
                      {this.props.planId ? "Update" : "Add"}
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
export default connect(mapStateToProps)(AddEditPlan);
