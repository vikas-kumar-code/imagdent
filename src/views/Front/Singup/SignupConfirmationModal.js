import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalBody } from "reactstrap";

class SignupConfirmationModal extends Component {
  state = {
    message: `We have sent a confirmation email at your registered email address.
    Before you can start you using Civ.Works, you must confirm your
    email address.`
  };

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <ModalBody>
          <p className="text-center mt-3">{this.state.message}</p>
          <p className="text-center">
            <Link to="/login" className="btn btn-danger">
              Close
            </Link>
          </p>
        </ModalBody>
      </Modal>
    );
  }
}
export default SignupConfirmationModal;
