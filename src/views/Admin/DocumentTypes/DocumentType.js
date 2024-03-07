import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Badge
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DocumentType extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  };

  render() {
    const record = this.props.document;
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>
          <Dropdown
            isOpen={this.state.showMenu}
            size="sm"
            color="primary"
            toggle={this.toggleMenu}
          >
            <DropdownToggle caret>Action</DropdownToggle>
            <DropdownMenu right>
              <DropdownItem data-id={record.id} onClick={this.props.toggleModal}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => this.props.deleteDocumentType(record.id)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    );
  }
}

export default DocumentType;
