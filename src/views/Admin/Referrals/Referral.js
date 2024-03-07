import React, { Component } from "react";
import ReferralDetails from "../Patients/ReferralDetails"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import PrintReferralModal from "../Patients/PrintReferralModal"
import Refer from "../Patients/Refer"
import Status from "./Status"
import UpdateStatus from "./UpdateStatus"
import { connect } from "react-redux";
import { toast } from "react-toastify";
import referral from "../../../services/referral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Referral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReferralDetailsModal: false,
      referralDetails: {},
      showPrintReferModal: false,
      editReferralModal: false,
      showApproveRejectModal: false,
      submitted: false,
      enterReasonModal: false,
      updateStatusModal: false,
      fields: {},
      errors: {}
    };

  }

  getReasons = (reasons) => {
    let reasonsArr = [];
    if (reasons !== null) {
      reasons.split(",").forEach((reason, index) => {
        this.props.reasons.forEach(r => {
          if (parseInt(r.id) === parseInt(reason)) {
            reasonsArr[index] = { label: r.name };
          }
          else if (r.children.length > 0) {
            r.children.forEach(rc => {
              if (parseInt(rc.id) === parseInt(reason)) {
                reasonsArr[index] = { label: rc.name };
              }
            })
          }
        })
      });
      return reasonsArr;
    }
  }
  prepareReferralDetails = () => {
    let selectedDocuments = [];
    if (this.props.referral.documents !== null) {
      this.props.referral.documents.split(",").forEach((doc, index) => {
        this.props.referral.patient.documents.forEach(d => {
          if (parseInt(d.id) === parseInt(doc)) {
            selectedDocuments[index] = d;
          }
        });
      });
    }
    let referralDetails = {
      patientName: `${this.props.referral.patient.FirstName} ${this.props.referral.patient.LastName}`,
      clinic_id: { label: this.props.referral.clinic.name },
      location_id: { label: this.props.referral.location.name },
      referred_to: { label: this.props.referral.referredto.name },
      referred_from: { label: this.props.referral.referredfrom.name },
      appointment_date: this.props.referral.appointment_date ? this.props.referral.appointment_date : null,
      slot: this.props.referral.slot_id !== null ? this.props.referral.slot.from_time + "-" + this.props.referral.slot.to_time : null,
      selectedTeeth: this.props.referral.teeth !== null ? this.props.referral.teeth.split(",") : null,
      reasons: this.getReasons(this.props.referral.reasons),
      selectedDocuments: selectedDocuments,
      notes: this.props.referral.notes,
      reason_for_rejection: this.props.referral.reason_for_rejection
    };
    this.setState({ referralDetails });
  }
  togglePrintRererralModal = () => {
    this.setState(prevState => ({
      showPrintReferModal: !prevState.showPrintReferModal,
    }));
  }
  toggleUpdateStatusModal = () => {
    this.setState(prevState => ({
      updateStatusModal: !prevState.updateStatusModal,
    }));
  }
  toggleShowRererralDetailsModal = () => {
    let showReferralDetailsModal = this.state.showReferralDetailsModal;
    if (!showReferralDetailsModal) {
      this.prepareReferralDetails();
      showReferralDetailsModal = true;
    }
    else {
      showReferralDetailsModal = false;
    }
    this.setState({ showReferralDetailsModal });
  }
  toggleEditRererralModal = () => {
    this.setState(prevState => ({
      editReferralModal: !prevState.editReferralModal,
    }));
  }
  toggleApproveRejectModal = () => {
    let showApproveRejectModal = this.state.showApproveRejectModal;
    if (!showApproveRejectModal) {
      this.prepareReferralDetails();
      showApproveRejectModal = true;
    }
    else {
      showApproveRejectModal = false;
    }
    this.setState({ showApproveRejectModal, submitted: false });
  }
  checkAppointmentDate = (date) => {
    let appointment_date = new Date(this.props.referral.appointment_date);
    let current_date = new Date();
    if (appointment_date.getTime() > current_date.getTime()) {
      return true;
    }
    else {
      return false;
    }
  }
  approveReferral = (id) => {
    if (window.confirm('Are you sure to approve?')) {
      this.setState({ submitted: true });
      referral.approve({ id: id }).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.toggleApproveRejectModal();
            this.props.getPendingApprovals();
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        });
      });
    }
  }
  toggleEnterReasonModal = () => {
    this.setState(prevState => ({
      enterReasonModal: !prevState.enterReasonModal,
    }));
  }
  handleRejectReferral = (e) => {
    e.preventDefault();
    let fields = this.state.fields;
    let errors = {};
    if (!fields["reason"] || fields["reason"].trim() === "") {
      errors["reason"] = "Please enter reason.";
      this.setState({ errors: errors });
    }
    else {
      this.setState({ submitted: true });
      referral.reject({ id: this.props.referral.id, reason_for_rejection: fields.reason }).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.toggleEnterReasonModal();
            setTimeout(() => {
              this.toggleApproveRejectModal();
              this.props.getPendingApprovals();
            }, 1000);
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        });
      });
    }
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };
  render() {
    const record = this.props.referral;
    return (
      <React.Fragment>
        <tr key={record.id}>
          {this.props.enableDiscard &&
            <td><input type="checkbox" value={record.id} onChange={this.props.chooseReferrals} /></td>
          }
          <td><span className="text-info" style={{ cursor: "pointer" }} onClick={this.toggleShowRererralDetailsModal}>{record.id}</span></td>
          <td>{record.referredfrom.name}</td>
          <td>{record.referredto.name}</td>
          <td>
            {record.reasons !== null ? this.getReasons(record.reasons).map(r => r.label).join(", ") : "N/A"}
          </td>
          <td>
            {this.props.enableEdit && this.checkAppointmentDate() &&
              <Button type="button" color="primary" className="btn-sm mr-2" data-id={record.patient_id} onClick={this.toggleEditRererralModal}>Edit</Button>
            }
            {this.props.enableApproval &&
              <Button type="button" color="success" className="btn-sm" data-id={record.id} onClick={this.toggleApproveRejectModal}> Approve Or Reject</Button>
            }
            {this.props.enableUpdateStatus &&
              <Button type="button" color="success" className="btn-sm" data-id={record.id} onClick={this.toggleUpdateStatusModal}>Update Status</Button>
            }
          </td>
        </tr>
        {this.props.enableProgress &&
          <tr>
            <td colSpan="6" style={{ borderTop: 0 }} className="mt-0 pt-0">
              <Status referral={record} />
            </td>
          </tr>
        }
        {this.props.enableDiscard &&
          <tr><td colSpan="6"><i><strong className="text-danger">Reason for rejection : </strong> {record.reason_for_rejection}</i></td></tr>
        }
        {this.state.showApproveRejectModal && (
          <Modal isOpen={this.state.showApproveRejectModal} size="lg">
            <ModalHeader toggle={this.toggleApproveRejectModal}>Approve Or Rejct Referral</ModalHeader>
            <ModalBody className="pl-4 pr-4">
              <ReferralDetails fields={this.state.referralDetails} documentTypes={this.props.documentTypes} />
            </ModalBody>
            <ModalFooter>
              <Button color="success" className="mr-1" type="button" onClick={() => this.approveReferral(record.id)} disabled={this.state.submitted}>
                {this.state.submitted && (
                  <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
                )}
                Approve
                </Button>
              <Button color="danger" type="button" onClick={this.toggleEnterReasonModal} disabled={this.state.submitted}>Reject</Button>
            </ModalFooter>
          </Modal>
        )}
        {this.state.showReferralDetailsModal && (
          <Modal isOpen={this.state.showReferralDetailsModal} size="lg">
            <ModalHeader toggle={this.toggleShowRererralDetailsModal}>Referral Details</ModalHeader>
            <ModalBody className="pl-4 pr-4">
              <ReferralDetails fields={this.state.referralDetails} documentTypes={this.props.documentTypes} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" className="mr-1" type="button" onClick={this.toggleShowRererralDetailsModal}>Close</Button>
              <Button color="primary" type="button" onClick={this.togglePrintRererralModal}>Print</Button>
            </ModalFooter>
          </Modal>
        )}
        {this.state.showPrintReferModal && (
          <PrintReferralModal
            showModal={this.state.showPrintReferModal}
            toggleModal={this.togglePrintRererralModal}
            referralId={record.id}
          />
        )}
        {this.state.editReferralModal && (
          <Refer
            showModal={this.state.editReferralModal}
            toggleModal={this.toggleEditRererralModal}
            togglePrintRererralModal={this.togglePrintRererralModal}
            patientId={record.patient_id}
            referralId={record.id}
          />
        )}
        {this.state.enterReasonModal && (
          <Modal isOpen={this.state.enterReasonModal}>
            <ModalHeader toggle={this.toggleEnterReasonModal}>Enter reason for the rejection</ModalHeader>
            <ModalBody className="pl-4 pr-4">
              <Form
                name="reason-form"
                method="post"
                onSubmit={this.handleRejectReferral}
              >
                <FormGroup>
                  <Input
                    name="reason"
                    type="textarea"
                    id="reason"
                    value={
                      this.state.fields["reason"]
                        ? this.state.fields["reason"]
                        : ""
                    }
                    onChange={event => this.handleChange("reason", event)}
                    invalid={this.state.errors["reason"] ? true : false}
                    bsSize="lg"
                    rows={3}
                  />
                  {this.state.errors["reason"] && (
                    <FormFeedback>{this.state.errors["reason"]}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup className="text-right"><Button color="danger" type="submit" disabled={this.state.submitted}>{this.state.submitted && (
                  <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
                )}Reject</Button></FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        )}
        {this.state.updateStatusModal && (
          <UpdateStatus
            showModal={this.state.updateStatusModal}
            toggleModal={this.toggleUpdateStatusModal}
            referral={record}
            getReferrals={this.props.getReferrals}
          />
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userId: state.userId,
    reasons: state.reasons,
    documentTypes: state.documentTypes
  };
};
export default connect(mapStateToProps)(Referral);
