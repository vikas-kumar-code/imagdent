import React, { Component } from "react";
import { Button, ModalFooter, Modal, ModalBody } from "reactstrap";
import { Badge } from "reactstrap";
import common from "../../../../services/common";
import moment from "moment";
import { connect } from "react-redux";
import CaseDetailsBody from "../../Cases/CaseDetailsBody";

class Payment extends Component {
  state = {
    showMenu: false,
    services: [],
    showCaseModal: false,
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };
  toggleCaseModal = () => {
    this.setState((prevState) => ({
      showCaseModal: !prevState.showCaseModal,
    }));
  };
  paidAmountFun = (subTotal, balanceAmount) => {
    let paidAmount = parseFloat(subTotal) - parseFloat(balanceAmount);
    return common.numberFormat(parseFloat(paidAmount).toFixed(2));
  };

  componentDidMount = () => {
    let services = [];
    if (this.props.record.user_id !== null) {
      services = this.props.record.case.services.filter(
        (service) => parseInt(service.who_will_pay) === 0
      );
    } else {
      services = this.props.record.case.services.filter(
        (service) => parseInt(service.who_will_pay) === 1
      );
    }
    this.setState({ services });
  };
  renderMode = (payments) => {
    let modeString = [];
    payments.forEach((ele, i) => {
      if (!modeString.includes(common.modeArr[ele.mode])) {
        modeString.push(common.modeArr[ele.mode]);
      }
    });
    return modeString.join(`, `);
  };
  render() {
    const record = this.props.record;
    return (
      <React.Fragment>
        <tr class="patient-data">
          <td style={{ borderTop: `3px solid` }}>
          {record.case.patient_checked_in !== null
              ? moment(record.case.patient_checked_in).format("MM-DD-YYYY")
              : "--"}
          </td>
          {/* <td style={{ borderTop: `3px solid` }}>
            {record.case && record.case.c_id !== null ? (
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={this.toggleCaseModal}
              >
                {record.case && record.case.c_id}
              </span>
            ) : (
              <span className="text-primary">--</span>
            )}
          </td> */}

          <td style={{ borderTop: `3px solid` }}>
            {record.invoice_id && record.invoice_id !== null ? (
              <span>{record.invoice_id && record.invoice_id}</span>
            ) : (
              <span className="text-primary">--</span>
            )}
          </td>

          <td style={{ borderTop: `3px solid` }}>
            {record.patient_id !== null
              ? `${record.case.patient.first_name} ${record.case.patient.last_name}`
              : "--"}
          </td>

          <td style={{ borderTop: `3px solid` }}>
            {record.case.user !== null
              ? common.getFullName(record.case.user)
              : "--"}
          </td>

          <td style={{ borderTop: `3px solid` }}>${record.amount}</td>
          <td style={{ borderTop: `3px solid` }} className="text-danger">
            <strong>${common.numberFormat(record.discount)}</strong>
          </td>
          <td style={{ borderTop: `3px solid` }}>
            $
            {record.sub_total !== null
              ? common.numberFormat(record.sub_total)
              : "--"}
          </td>
          <td style={{ borderTop: `3px solid` }}>
            $
            {record.amount !== null
              ? this.paidAmountFun(record.sub_total, record.balance_amount)
              : "--"}
          </td>
          <td style={{ borderTop: `3px solid` }}>
            $
            {record.balance_amount !== null
              ? common.numberFormat(record.balance_amount)
              : "--"}
          </td>

          <td style={{ borderTop: `3px solid`, width: "120px" }}>
            {this.renderMode(record.payments)}
          </td>
        </tr>
        <tr class="patient-service">
          <td colSpan="5">
            <strong>Services Rendered</strong>
          </td>
          <td>
            <strong>Fee</strong>
          </td>
          <td>
            <strong>Discount</strong>
          </td>
          <td>
            <strong>Sub Total</strong>
          </td>
          <td colSpan="5">
            <strong>Paid By</strong>
          </td>
        </tr>
        {this.state.services.map((cs, sindex) => (
          <tr key={`service-key-${sindex}`}>
            <td colSpan="5">{cs.service.name}</td>
            <td>${cs.price}</td>
            <td className="text-danger">${cs.discount}</td>
            <td>${cs.sub_total}</td>
            <td colSpan="5">
              {cs.who_will_pay === "0" ? "Doctor" : "Patient"}
            </td>
          </tr>
        ))}
         {this.state.showCaseModal && (
          <Modal isOpen={this.state.showCaseModal} size="xl">
            <ModalBody className="p-0">
              <CaseDetailsBody caseId={record.case_id} enableEditCase={false} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.toggleCaseModal}>
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
    userId: state.userId,
    userType: state.userType,
  };
};
export default connect(mapStateToProps)(Payment);
