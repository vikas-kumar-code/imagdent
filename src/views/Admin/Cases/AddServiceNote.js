import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Col,
  Spinner,
  FormGroup,
  Button,
  Form,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { connect } from "react-redux";

class AddServiceNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      fields: {},
      errors: {},
    };
  }

  componentDidMount = () => {
    let targetService = this.props.selectedServices.filter(
      (ss) => parseInt(ss.id) === parseInt(this.props.selectedService.id)
    );
    let fields = this.state.fields;
    fields["note"] = targetService[0].note;
    this.setState({ fields });
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["note"] || fields["note"].value === "") {
      formIsValid = false;
      errors["note"] = "This is a required field.";
    }
    this.setState({ errors });
    return formIsValid;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      let selectedServices = [];
      this.props.selectedServices.forEach((ss, index) => {
        selectedServices[index] = ss;
        if (parseInt(ss.id) === parseInt(this.props.selectedService.id)) {
          selectedServices[index].note = this.state.fields.note;
        }
      });
      console.log(selectedServices);
      this.props.updateNoteInSelectedService(selectedServices);
      this.props.closeModal();
    }
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    fields["note"] = e.target.value;
    this.setState({ fields });
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} size="md">
        <ModalHeader
          toggle={this.props.closeModal}
        >{`Add Note for ${this.props.selectedService.name}`}</ModalHeader>
        <Form method="post" onSubmit={this.handleSubmit}>
          <ModalBody className="p-4">
            <FormGroup row>
              <Input
                type="textarea"
                name="note"
                value={
                  this.state.fields["note"] ? this.state.fields["note"] : ""
                }
                onChange={(e) => this.handleChange(e)}
                rows={4}
              />
              {this.state.errors["note"] && (
                <small className="fa-1x text-danger">
                  {this.state.errors["note"]}
                </small>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={this.props.closeModal}
              type="button"
              color="secondary"
            >
              Skip
            </Button>
            <Button
              type="submit"
              color="success"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
  };
};

export default connect(mapStateToProps)(AddServiceNote);
