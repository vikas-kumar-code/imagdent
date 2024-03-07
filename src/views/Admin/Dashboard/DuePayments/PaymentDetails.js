import React, { Component } from "react";
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import common from "../../../../services/common";
import AcceptPayment from "./AcceptPayment";

class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAcceptPaymentModal: false,
    };
  }

  calculateTotalAmount(services) {
    let subTotalArr = [];
    services.forEach((service, index) => {
      subTotalArr[index] = parseFloat(service.sub_total);
    });
    let totalAmount = 0.0;
    if (subTotalArr.length > 0) {
      totalAmount = subTotalArr.reduce((sum, amount) => {
        return amount + sum;
      });
    }
    
    return totalAmount;
  }

  toggleAcceptPaymentModal = () => {
    this.setState(
      (prevState) => ({
        showAcceptPaymentModal: !prevState.showAcceptPaymentModal,
      }),
      () => {
        if (this.state.showAcceptPaymentModal === false) {
          this.props.toggleModal();
        }
      }
    );
  };

  render() {
    return (
      <>
        <Modal isOpen={this.props.showModal} size="lg">
          <ModalHeader toggle={() => this.props.toggleModal(new Array())}>
            Payment Details(
            {`${this.props.patient.first_name} ${this.props.patient.last_name}`}
            )
          </ModalHeader>
          <ModalBody className="pl-4 pr-4">
            <Table responsive className="table-striped">
              <thead>
                <tr>
                  <th scope="col" width={7 + "%"} className="border-top-0"></th>
                  <th scope="col" className="border-top-0">
                    Service Name
                  </th>
                  <th scope="col" className="border-top-0">
                    Price
                  </th>
                  <th scope="col" className="border-top-0">
                    Discount
                  </th>
                  <th scope="col" className="border-top-0">
                    Sub Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.services.map((service, index) => (
                  <tr key={`services-key-${index}`}>
                    <td>{index + 1}.</td>
                    <td>{service.service.name}</td>
                    <td>${common.numberFormat(service.price)}</td>
                    <td>${common.numberFormat(service.discount)}</td>
                    <td>${common.numberFormat(service.sub_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    style={{ fontSize: 18, border: 0 }}
                    className="text-right py-1"
                  >
                    Total Amount:-
                  </td>
                  <td style={{ fontSize: 22, border: 0 }} className="py-1">
                    ${this.calculateTotalAmount(this.props.services).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    style={{ fontSize: 18, border: 0 }}
                    className="text-right py-1"
                  >
                    Amount Received:-
                  </td>
                  <td style={{ fontSize: 22, border: 0 }} className="py-1">
                    $
                    {(
                      this.calculateTotalAmount(this.props.services) -
                      parseFloat(this.props.balanceAmount)
                    )
                      .toFixed(2)
                      .toString()}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    style={{ fontSize: 22, border: 0 }}
                    className="text-right py-1"
                  >
                    Amount to be paid:-
                  </td>
                  <td style={{ fontSize: 28, border: 0 }} className="py-1">
                    ${common.numberFormat(this.props.balanceAmount)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => this.props.toggleModal(new Array())}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.toggleAcceptPaymentModal}
              disabled={true}
            >
              Pay Now
            </button>
          </ModalFooter>
        </Modal>
        {this.state.showAcceptPaymentModal && (
          <AcceptPayment
            showModal={this.state.showAcceptPaymentModal}
            toggleModal={this.toggleAcceptPaymentModal}
            amount={this.props.balanceAmount}
            selectedCases={[this.props.caseId]}
            getDuePayments={this.props.getDuePayments}
          />
        )}
      </>
    );
  }
}

export default PaymentDetails;
