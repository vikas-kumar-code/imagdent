import React, { Component } from "react";
import { Input, Badge } from "reactstrap";

class Diagnosis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    };
  }

  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
    if (this.state.showMenu) {
      this.props.getDiagnosisCodes(this.props.fieldsFromSearch);
    }
  };

  render() {
    const record = this.props.diagnosis;
    return (
      <tr key={record.id}>
        <React.Fragment>
          <td>{record.id}</td>
        </React.Fragment>
        <td>{record.name}</td>
        <td>{record.code}</td>
        <td>
          {record.status && record.status === "Y" ? (
            <Badge color="success">Active</Badge>
          ) : (
            <Badge color="danger">Inactive</Badge>
          )}
        </td>
        <React.Fragment>
          <td>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              data-id={record.id}
              onClick={this.props.toggleModal}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => this.props.deleteDiagnosisCode(record.id)}
            >
              Delete
            </button>
          </td>
        </React.Fragment>
      </tr>
    );
  }
}

export default Diagnosis;
