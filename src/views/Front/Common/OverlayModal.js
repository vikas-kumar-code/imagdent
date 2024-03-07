import React, { Component } from "react";
import { Modal, ModalBody, Spinner } from "reactstrap";

class OverlayModal extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <ModalBody>
          <div className="text-center p-3">
            <Spinner color="#887d7d" className="mr-1" /> <br />
            Please wait..
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
export default OverlayModal;
