import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Badge,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import common from "../../../services/common";
import Reschedule from "./Reschedule";
import EditUserClinicModal from "./EditUserClinicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { connect } from "react-redux";

class Case extends Component {
  state = {
    showMenu: false,
    showResceduleModal: false,
    showEditModal: false,
    caseId: null,
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };
  patientName = () => {
    let name = "";
    if (this.props.caseDetails.patient.prefix !== null) {
      name += this.props.caseDetails.patient.prefix + ` `;
    }
    if (this.props.caseDetails.patient.FirstName !== null) {
      name += this.props.caseDetails.patient.FirstName + ` `;
    }
    if (this.props.caseDetails.patient.LastName !== null) {
      name += this.props.caseDetails.patient.LastName + ` `;
    }
    if (this.props.caseDetails.patient.suffix !== null) {
      name += this.props.caseDetails.patient.suffix;
    }
    return name;
  };
  handleView = (patient) => {
    return (
      <span
        data-id={patient.id}
        onClick={this.props.togglePatientModal}
        style={{ cursor: "pointer", color: "#20a8d8" }}
      >
        {common.getFullName(patient)}
      </span>
    );
  };

  toggleEditModal = (id) => {
    if (id !== null && id !== undefined) {
      this.setState({
        caseId: id,
      });
    }
    this.setState({
      showEditModal: !this.state.showEditModal,
    });
  };

  toggleRescheduleModal = (id) => {
    if (id !== null && id !== undefined) {
      this.setState({
        caseId: id,
      });
    } else {
      this.props.getCases();
    }
    this.setState({
      showResceduleModal: !this.state.showResceduleModal,
    });
  };

  renderReschedule = (id) => {
    return (
      <Button
        className="btn btn-danger btn-sm btn-block"
        style={{ cursor: "pointer" }}
        onClick={() => this.toggleRescheduleModal(id)}
      >
        Schedule
      </Button>
    );
  };

  render() {
    const record = this.props.caseDetails;
    return (
      <>
        <tr key={record.id}>
          <td>
            {" "}
            <Link
              to={`/admin/cases/details/${record.id}`}
              style={{
                color: "#20a8d8",
              }}
            >
              {record.c_id}
            </Link>
          </td>
          <td>{record.location.publish_name}</td>
          <td>{this.handleView(this.props.caseDetails.patient)}</td>
          <td>
            <div className="d-flex justify-content-between">
              <a href={`mailto:${record.user.email}`}>
                {common.getFullName(record.user)}
              </a>

              {parseInt(record.status) < 10 && ( //HIDING UPDATE DOCTOR BUTTON ICON WHEN CASE IS COMPLETED
                <Button
                  className="btn btn-sm cases-edit"
                  onClick={() => this.toggleEditModal(record.id)}
                >
                  <FontAwesomeIcon icon="edit" />
                </Button>
              )}
            </div>
          </td>
          <td>{record.clinic.name}</td>
          <td>${record.total_price === null ? "00.00" : common.numberFormat(record.total_price)}</td>
          <td>
            <Badge
              color="primary"
              className={`p-1 caseStatus-${record.status}`}
            >
              {common.caseStatusArr[record.status]}
            </Badge>
          </td>
          <td>
            {record.appointment_date !== null
              ? moment(record.appointment_date).format("MMMM DD, YYYY")
              : (record.status == 0 && record.arrange_callback == 1) ? this.renderReschedule(record.id) : 'Not available'}
          </td>
          <td className="text-center">
            {
              parseInt(this.props.userType) === 1 && (<Button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => this.props.deleteCase(record.id)}
              >
                Delete
              </Button>)
            }

          </td>
        </tr>
        {this.state.showResceduleModal && (
          <Reschedule
            showModal={this.state.showResceduleModal}
            toggleModal={this.toggleRescheduleModal}
            caseId={this.state.caseId}
          />
        )}
        {this.state.showEditModal && (
          <EditUserClinicModal
            showModal={this.state.showEditModal}
            toggleModal={this.toggleEditModal}
            caseId={this.state.caseId}
            fieldsFromSearch={this.props.fieldsFromSearch}
            getCases={this.props.getCases}
          />
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userType: state.userType,
  };
};
export default connect(mapStateToProps)(Case);



