import React, { Component } from "react";

class Role extends Component {
  render() {
    const record = this.props.role;
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>
          {record.id !== "1" && (
            <button
              type="button"
              className="btn btn-warning btn-sm"
              data-id={record.id}
              onClick={this.props.togglePermissionModal}
            >
              Assign Permission
            </button>
          )}
        </td>
        <td>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-id={record.id}
            onClick={this.props.toggleEditModal}
          >
            Edit
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => this.props.deleteRole(record.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

export default Role;
