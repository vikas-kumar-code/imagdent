import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import common from "../../../services/common";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import moment from "moment";

class Contact extends Component {
  state = {
    submitted: false,
    showMenu: false,
    roles: common.getContactRoles(),
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };
  handleView = (contact) => {
    return (
      <span
        data-id={contact.id}
        onClick={this.props.showContact}
        style={{ cursor: "pointer", color: "#20a8d8" }}
      >
        {contact.contact_fname}
      </span>
    );
  };
  removeContact = (e) => {
    if (window.confirm("Are you sure to delete this contact?")) {
      this.props.removeContact(e, "contacts");
    }
  };

  render() {
    const record = this.props.contact;
    return (
      <tr key={this.props.key}>
        <td>{this.props.index + 1}</td>
        <td>{this.handleView(record)}</td>
        <td>{this.state.roles[record.contact_role]}</td>
        {this.props.addedOn && (
          <React.Fragment>
            <td>{record.contact_phone !== 0 ? record.contact_phone : "N/A"}</td>
            <td>{moment(record.added_on).format("MMMM DD, YYYY")}</td>
          </React.Fragment>
        )}
        {this.props.enableEdit && (
          <td>
            <Dropdown
              isOpen={this.state.showMenu}
              size="sm"
              color="primary"
              toggle={this.toggleMenu}
            >
              <DropdownToggle caret>Action</DropdownToggle>
              <DropdownMenu right>
                {this.props.enableEdit && (
                  <DropdownItem
                    onClick={(e) =>
                      this.props.fillContact(
                        e,
                        "contacts",
                        "contactIndex",
                        "contactFields"
                      )
                    }
                    data-index={this.props.index}
                    disabled={this.state.submitted}
                  >
                    Edit
                  </DropdownItem>
                )}
                {this.props.enableDelete && (
                  <DropdownItem
                    onClick={this.removeContact}
                    data-index={this.props.index}
                  >
                    Delete
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </td>
        )}
      </tr>
    );
  }
}

export default Contact;
