import React, { Component, Fragment } from "react";
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
  paidAmountFun = (subTotal, balanceAmount) => {
    let paidAmount = parseFloat(subTotal) - parseFloat(balanceAmount);
    return common.numberFormat(parseFloat(paidAmount).toFixed(2));
  };
  // componentDidMount = () => {
  //   let services = [];
  //   if (this.props.record.case !== null) {
  //     if (this.props.record.user_id !== null) {
  //       services = this.props.record.case.services.filter(
  //         (service) => parseInt(service.who_will_pay) === 0
  //       );
  //     } else {
  //       services = this.props.record.case.services.filter(
  //         (service) => parseInt(service.who_will_pay) === 1
  //       );
  //     }
  //   }
  //   this.setState({ services });
  // };
  toggleCaseModal = () => {
    this.setState((prevState) => ({
      showCaseModal: !prevState.showCaseModal,
    }));
  };

  calculateTotal = (userInvoices, range) => {
    let total = 0;
    if (userInvoices.invoices.length > 0) {
      userInvoices.invoices.forEach((ele) => {
        if(ele.case_status == 8){
        if (ele.hasOwnProperty(range)) {
          if (ele[`${range}`] === true) {
            total = parseFloat(total) + parseFloat(ele.balance_amount);
          }
        }
      }
      });
    }
    return parseFloat(total).toFixed(2);
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
        {record.invoices.length > 0 &&
          record.invoices.map((e, i) => (
            <React.Fragment key={i}>
              {
                e.case_status == 8 && (
                  <tr style={{ fontSize: "15px" }}>
                    <td style={{ borderTop: "0px solid white" }}> {i === 0 && `${record.first_name} ${record.last_name}`}</td>
                    <td>{e.invoice_id}</td>
                    <td>{moment(e.patient_checked_in).format("MM-DD-YYYY")}</td>
                    <td>
                      {e.user !== null
                        ? e.user.first_name !== null && e.user.last_name !== null
                          ? `${e.user.first_name} ${e.user.last_name}`
                          : "--"
                        : "--"}
                    </td>
                    <td>{e.zerotothirty === true ? `$${e.balance_amount}` : "--"}</td>
                    <td>{e.thirtyfirstToSixty === true ? `$${e.balance_amount}` : "--"}</td>
                    <td>{e.sixtyoneToNinty === true ? `$${e.balance_amount}` : "--"}</td>
                    <td colSpan={3}>{e.nintyPlus === true ? `$${e.balance_amount}` : "--"}</td>
                  </tr>
                )
              }
            </React.Fragment>
          ))}

        <td colSpan="4" style={{ borderTop: "2px solid black" }}></td>
        <td style={{ borderTop: "2px solid black" }}>
          ${this.calculateTotal(record, "zerotothirty")}
        </td>
        <td style={{ borderTop: "2px solid black" }}>
          ${this.calculateTotal(record, "thirtyfirstToSixty")}
        </td>
        <td style={{ borderTop: "2px solid black" }}>
          ${this.calculateTotal(record, "sixtyoneToNinty")}
        </td>
        <td style={{ borderTop: "2px solid black" }}>
          ${this.calculateTotal(record, "nintyPlus")}
        </td>
        <td style={{ borderTop: "2px solid black" }}>
          $
          {(
            parseFloat(this.calculateTotal(record, "zerotothirty")) +
            parseFloat(this.calculateTotal(record, "thirtyfirstToSixty")) +
            parseFloat(this.calculateTotal(record, "sixtyoneToNinty")) +
            parseFloat(this.calculateTotal(record, "nintyPlus"))
          ).toFixed(2)}
        </td>
        <tr>
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
