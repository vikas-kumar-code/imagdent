import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, ModalBody ,ModalFooter} from "reactstrap";
import common from "../../../services/common";
import moment from "moment";
import { connect } from "react-redux";
import PatientDetailsBody from "./PatientDetailsBody";

class Patient extends Component {
  state = {
    showMenu: false,
    showReferModal: false,
    showPatientModel: false,
    showPrintReferModal: false,
    referralId: null,
    patientId: null,
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };
  togglePatientModal = (id) => {
    this.setState((prevState) => ({
      patientId: id,
      showPatientModel: !prevState.showPatientModel,
    }));
  };
  /*togglePrintRererralModal = (referralId = null) => {
    this.setState(prevState => ({
      showPrintReferModal: !prevState.showPrintReferModal,
      referralId
    }));
  };*/
  render() {
    const record = this.props.patient;
    const patient = `${record.first_name} ${record.last_name}`;
    return (
      <React.Fragment>
        <tr key={record.id}>
          <td>{record.id}</td>
          {this.props.enablePatientDetail ? (
            <td>
              <Link
                to={`/admin/patients/details/${record.id}`}
                style={{
                  color:
                    this.props.lastSearchedPatient === record.id
                      ? "#f724b6"
                      : "#20a8d8",
                }}
              >
                {record.first_name} {record.last_name}
              </Link>
            </td>
          ) : (
            <td>
              <span
                onClick={() => this.togglePatientModal(record.id)}
                style={{
                  color:
                    this.props.lastSearchedPatient === record.id
                      ? "#f724b6"
                      : "#20a8d8",
                  cursor: "pointer",
                }}
              >
                {record.first_name} {record.last_name}
              </span>
            </td>
          )}
          <td>{moment(record.BirthDate).format("MMMM DD, YYYY")}</td>
          <td>
            {record.Age} {record.Age > 1 ? "Years" : "Year"}
          </td>
          <td>{record.HomePhone}</td>
          <td>{record.City}</td>
          <td>{record.statedetails && record.statedetails.state}</td>
          <td>{record.Sex}</td>
          {this.props.enableSelection === false ? (
            <React.Fragment>
              <td className="text-center">
                <Link
                  to={`/admin/patients/edit/${record.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
              </td>
              <td className="text-center">
                <Button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => this.props.deletePatient(record.id)}
                >
                  Delete
                </Button>
              </td>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => this.props.choosePatient(record)}
                >
                  Select Patient
                </button>
              </td>
              <td></td>
            </React.Fragment>
          )}
        </tr>
        {this.state.showPatientModel && (
          <Modal isOpen={this.state.showPatientModel} size="lg">
            <ModalBody className="p-0">
              <PatientDetailsBody
                id={this.state.patientId}
                enableEditPatient={false}
              />
            </ModalBody>
            <ModalFooter className="border-top-0 pt-0">
              <Button
                color="danger"
                className="btn-sm"
                onClick={this.togglePatientModal}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    lastSearchedPatient: state.lastSearchedPatient,
  };
};
export default connect(mapStateToProps)(Patient);
