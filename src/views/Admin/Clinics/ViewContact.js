import React, { Component } from "react";
import { Modal, Table, ModalBody, ModalHeader } from "reactstrap";
import common from "../../../services/common";

class ViewContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: common.getContactRoles()
    };
  }

  render() {
    const contactDetail = this.props.contactDetail[0];

    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleSubModal}>
          Contact Information
        </ModalHeader>
        <ModalBody>
          <Table responsive className="table-striped">
            <tbody>
              <tr>
                <td>
                  <strong>Name</strong>
                </td>
                <td>{`${
                  contactDetail.contact_prefix
                    ? contactDetail.contact_prefix
                    : ""
                } ${
                  contactDetail.contact_fname ? contactDetail.contact_fname : ""
                } ${
                  contactDetail.contact_mname ? contactDetail.contact_mname : ""
                } ${
                  contactDetail.contact_lname ? contactDetail.contact_lname : ""
                } ${
                  contactDetail.contact_suffix
                    ? contactDetail.contact_suffix
                    : ""
                }`}</td>
              </tr>
              <tr>
                <td>
                  <strong>Email</strong>
                </td>
                <td>
                  {contactDetail.contact_email ? (
                    <a href={`mailto:${contactDetail.contact_email}`}>
                      {contactDetail.contact_email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Role</strong>
                </td>
                <td>{this.state.roles[contactDetail.contact_role]}</td>
              </tr>
              <tr>
                <td>
                  <strong>Phone</strong>
                </td>
                <td>{contactDetail.contact_phone}</td>
              </tr>
              <tr>
                <td>
                  <strong>Phone Ext.</strong>
                </td>
                <td>{contactDetail.contact_phone_ext}</td>
              </tr>
              <tr>
                <td>
                  <strong>Fax</strong>
                </td>
                <td>{contactDetail.contact_fax}</td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    );
  }
}
export default ViewContact;
