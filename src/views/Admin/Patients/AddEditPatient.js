import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import AddEditPatientBody from "./AddEditPatientBody";
class AddEditPatient extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="animated fadeIn">
        <AddEditPatientBody
          id={this.props.match.params.id}
          enableEditPatient={true}
        />
      </div>
    );
  }
}

export default AddEditPatient;
