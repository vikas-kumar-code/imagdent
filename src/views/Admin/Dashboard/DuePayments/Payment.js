import React, { Component } from "react";
import {
  Button,
  Spinner,
  Table,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import common from "../../../../services/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaymentDetails from "./PaymentDetails";

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPaymentDetailModal: false,
      services: [],
    };
  }

  /* calculateTotalAmount(services){
      let subTotalArr = [];
      services.forEach((service,index)=>{
        subTotalArr[index] = parseFloat(service.sub_total);
      });
      let totalAmount = 0.00;
      if(subTotalArr.length > 0){
        totalAmount = subTotalArr.reduce((sum, amount)=>{
            return amount + sum;
        });
      }
      
    return totalAmount.toFixed(2);
  } */
  togglePaymentDetailsModal = (services) => {
    this.setState((prevState) => ({
      showPaymentDetailModal: !prevState.showPaymentDetailModal,
      services,
    }));
  };
  render() {
    const payment = this.props.payment;
    console.log(payment);
    return (
      <React.Fragment>
        <tr key={payment.id}>
          <td>
            <input
              type="checkbox"
              onChange={this.props.selectCase}
              value={payment.case_id}
              checked={
                this.props.selectedCases.indexOf(payment.case_id) >= 0
                  ? true
                  : false
              }
            />
          </td>
          <td>{payment.case.c_id}</td>
          <td>{`${payment.case.patient.first_name} ${payment.case.patient.last_name}`}</td>
          <td>${payment.balance_amount}</td>
          <td className="text-center">
            <Button
              type="button"
              color="primary"
              className="btn-sm mr-2"
              onClick={() => this.togglePaymentDetailsModal(payment.services)}
            >
              <FontAwesomeIcon icon="list" className="mr-1" />
              Details
            </Button>
          </td>
        </tr>
        {this.state.showPaymentDetailModal && (
          <PaymentDetails
            showModal={this.state.showPaymentDetailModal}
            toggleModal={this.togglePaymentDetailsModal}
            caseId={payment.case_id}
            services={payment.case.services}
            patient={payment.case.patient}
            balanceAmount={payment.balance_amount}
            getDuePayments={this.props.getDuePayments}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Payment;
