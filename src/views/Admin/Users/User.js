import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Badge
} from "reactstrap";
import { Link } from "react-router-dom";
import common from "../../../services/common";

class User extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  };

  render() {
    const record = this.props.user;
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>
          <Link
            to={`/admin/users/details/${record.id}`}
            style={{
              color: "#20a8d8"
            }}
          >{common.getFullName(record)}
          </Link>
        </td>
        <td>{record.username}</td>
        <td>{record.email}</td>
        <td>{record.phone !== null ? record.phone : "--"}</td>
        {/*<td>{record.location !== null ? record.location.legal_name : "--"}</td>*/}
        <td>{record.role !== null ? record.role.name : "Super Admin"}</td>
        <td>
          {record.status && record.status === "Y" ? (
            <Badge color="success">Active</Badge>
          ) : (
            <Badge color="danger">Inactive</Badge>
          )}
        </td>
        <td>
          <Dropdown
            isOpen={this.state.showMenu}
            size="sm"
            color="primary"
            toggle={this.toggleMenu}
          >
            <DropdownToggle caret>Action</DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag={Link} to={`/admin/users/edit/${record.id}`}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => this.props.deleteUser(record.id)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    );
  }
}

export default User;
