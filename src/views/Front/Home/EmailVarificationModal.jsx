import React, { Component } from "react";
import { Spinner, Button, Modal, ModalBody } from "reactstrap";
import axios from "axios";
import { setToken } from "../../../config/config";
class EmailVarificationModal extends Component {
  state = {
    open: this.props.code !== null ? true : false,
    message: "We are verifying your email address. Please wait...",
    showSpinner: "",
    closeButton: "d-none",
    redirect: false
  };
  hideModal = () => {
    this.setState({
      open: false
    });
    if (this.state.redirect) {
      this.props.history.push("/");
    }
  };
  confirmEmail() {
    var that = this;
    axios
      .get("/user/confirm-email", {
        params: {
          code: this.props.code
        }
      })
      .then(function(response) {
        if (response.data.success) {
          that.setState({
            message: response.data.message,
            showSpinner: "d-none",
            closeButton: "",
            redirect: true
          });
        } else if (response.data.error) {
          that.setState({
            message: response.data.message,
            showSpinner: "d-none",
            closeButton: ""
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentDidMount() {
    if (this.props.code !== null) {
      this.confirmEmail();
    }
  }
  render() {
    return (
      <Modal
        isOpen={this.state.open}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        top
      >
        <ModalBody>
          <p className="text-center mt-3">{this.state.message}</p>
          <p className="text-center">
            <Spinner
              size="lg"
              color="dark"
              className={"mt-3 " + this.state.showSpinner}
            />
          </p>
          <p className="text-center">
            <Button
              color="danger"
              onClick={this.hideModal}
              className={this.state.closeButton}
            >
              Close
            </Button>
          </p>
        </ModalBody>
      </Modal>
    );
  }
}
export default EmailVarificationModal;
