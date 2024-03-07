import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import { Link } from "react-router-dom"

class Company extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  };

  render() {
    const record = this.props.company;
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
              <DropdownItem tag={Link} to={`/admin/insurance-companies/plans/${record.id}`}>
                Insurance Plans
              </DropdownItem>
              <DropdownItem data-id={record.id} onClick={this.props.toggleModal}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => this.props.deleteCompany(record.id)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    );
  }
}

export default Company;
