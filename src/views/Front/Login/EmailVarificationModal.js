import React, { Component } from "react";
import { Spinner, Button, Modal, ModalBody } from "reactstrap";
import axios from "axios";
import store from "../../../store/store";

const STATE = store.getState();
class EmailVarificationModal extends Component {
  state = {
    showModal: this.props.show,
    message: "We are verifying your email address. Please wait...",
    showSpinner: true,
    closeButton: false,
    redirect: false
  };
  hideModal = () => {
    this.setState({
      showModal: false
    });
  };
  confirmEmail() {
    var that = this;
    axios
      .get(STATE.apiUrl + "/user/confirm-email", {
        params: {
          code: this.props.code
        }
      })
      .then(function(response) {
        if (response.data.success) {
          that.setState({
            message: response.data.message,
            showSpinner: false,
            closeButton: true
          });
        } else if (response.data.error) {
          that.setState({
            message: response.data.message,
            showSpinner: false,
            closeButton: true
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentDidMount() {
    if (this.props.code != null) {
      this.confirmEmail();
    }
  }
  render() {
    return (
      <Modal
        isOpen={this.state.showModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        top
      >
        <ModalBody>
          <p className="text-center mt-3">{this.state.message}</p>
          {this.state.showSpinner && (
            <p className="text-center">
              <Spinner size="lg" color="dark" className="mt-3" />
            </p>
          )}
          {this.state.closeButton && (
            <p className="text-center">
              <Button
                color="danger"
                onClick={this.hideModal}
                className={this.state.closeButton}
              >
                Close
              </Button>
            </p>
          )}
        </ModalBody>
      </Modal>
    );
  }
}
export default EmailVarificationModal;
