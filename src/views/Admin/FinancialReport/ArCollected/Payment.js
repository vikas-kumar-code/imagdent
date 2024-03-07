import React, { Component } from "react";
import { Button, ModalFooter, Modal, ModalBody } from "reactstrap";
import common from "../../../../services/common";
import { connect } from "react-redux";
import CaseDetailsBody from "../../Cases/CaseDetailsBody";
import moment from "moment";

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


  renderMode = (record) => {
    let modeString = [];
    this.props.record.payments.forEach((ele, i) => {
      if (!modeString.includes(common.modeArr[ele.mode])) {
        modeString.push(common.modeArr[ele.mode]);
      }
    });
    return modeString.join(`, `);
  };

  returnPaidAmount = (record) => {
    let paidAmountArr = [];
    this.props.record.payments.forEach((payment, index) => {
      paidAmountArr[index] = parseFloat(payment.paid_amount);
    });
    let totalAmount = 0.0;
    if (paidAmountArr.length > 0) {
      totalAmount = paidAmountArr.reduce((sum, amount) => {
        return amount + sum;
      });
    }
    return totalAmount;
  };
  render() {
    const record = this.props.record;
    return (
      <React.Fragment>
        <tr>
          <td>
            {record.invoice_id}
          </td>
          <td>{record.case.user !== null
            ? common.getFullName(record.case.user)
            : "--"}</td>

          <td>{record.location.publish_name}</td>
          <td>${
            this.returnPaidAmount(record).toFixed(2)
          }</td>
          <td>{this.renderMode(record)}</td>
          <td>{record.payments[0].receivedBy.username}</td>
        </tr>
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
