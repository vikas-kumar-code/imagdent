import React, { Component } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

class Formm extends Component {
  state = {
    showMenu: false,
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };

  render() {
    const record = this.props.form;
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td className="text-center">
          <Link
            to={`/admin/forms/edit/${record.id}`}
            className="btn btn-primary btn-sm"
          >
            Edit
          </Link>
        </td>
        <td className="text-center">
          <Button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => this.props.deleteForms(record.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default Formm;