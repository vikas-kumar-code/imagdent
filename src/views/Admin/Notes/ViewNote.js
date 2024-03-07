import React, { Component } from "react";
import { Modal, Table, ModalBody, ModalHeader } from "reactstrap";
import common from "../../../services/common";

class ViewNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteTypes: ["Internal", "External"]
    };
  }
  render() {
    const noteDetail = this.props.noteDetail[0];

    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleSubModal}>Note</ModalHeader>
        <ModalBody>
          <Table responsive className="table-striped">
            <tbody>
              <tr>
                <td>
                  <strong>Note</strong>
                </td>
                <td>{noteDetail.notes}</td>
              </tr>
              <tr>
                <td>
                  <strong>Note Type</strong>
                </td>
                <td>{this.state.noteTypes[noteDetail.note_type]}</td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    );
  }
}
export default ViewNote;
