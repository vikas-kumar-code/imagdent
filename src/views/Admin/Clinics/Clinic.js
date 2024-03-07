import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Badge
} from "reactstrap";
import { Link } from "react-router-dom";

class Clinic extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  };

  render() {
    const record = this.props.clinic;
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>
          <Link
            to={`/admin/clinics/details/${record.id}`}
            style={{
              color: "#20a8d8"
            }}
          >
            {record.name !== null ? record.name : "--"}
          </Link>
        </td>
        <td>{record.email}</td>
        <td>{record.phone}</td>
        <td>{record.fax}</td>
        <td>
          <Link to={`/admin/clinics/edit/${record.id}`}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              data-id={record.id}
            >
              Edit
            </button>
          </Link>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => this.props.deleteClinic(record.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

export default Clinic;
