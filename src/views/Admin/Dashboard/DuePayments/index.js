import React, { Component } from "react";
import {
  Spinner,
  Table,
  Card,
  CardBody,
  CardHeader,
  Button,
  Row,
  Col,
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import common from "../../../../services/common";
import Payment from "./Payment";
import AcceptPayment from "./AcceptPayment";
import { connect } from "react-redux";
import Scrollbars from "react-custom-scrollbars";

class DuePayments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duePayments: [],
      loader: true,
      selectedCases: [],
      showAcceptPaymentModal: false,
    };
  }

  getDuePayments = () => {
    this.setState({ loader: true });
    let params = {
      location_id: this.props.defaultLocation,
    };
    common
      .getDuePayments(params)
      .then((response) => {
        if (response.data.success) {
          let selectedCases = [];
          response.data.payments.forEach((payment, index) => {
            selectedCases[index] = payment.case_id;
          });
          this.setState({
            duePayments: response.data.payments,
            loader: false,
            selectedCases,
          });
        }
      })
      .catch((error) => {
        this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getDuePayments();
  };
  calculateTotalPrice = () => {
    let totalAmount = 0.0;
    let totalAmountArr = [];
    this.state.duePayments.forEach((payment, index) => {
      this.state.selectedCases.forEach((sc) => {
        if (parseInt(payment.case_id) === parseInt(sc)) {
          totalAmountArr[index] = parseFloat(payment.balance_amount);
        }
      });
    });
    totalAmount = totalAmountArr.reduce((sum, amount) => {
      return amount + sum;
    });
    return totalAmount.toFixed(2);
  };
  selectCase = (e) => {
    let selectedCases = this.state.selectedCases;
    if (e.target.checked) {
      selectedCases.push(e.target.value);
    } else {
      let index_to_be_removed = selectedCases.indexOf(e.target.value);
      selectedCases.splice(index_to_be_removed, 1);
    }
    this.setState({ selectedCases });
  };
  toggleAcceptPaymentModal = () => {
    this.setState(
      (prevState) => ({
        showAcceptPaymentModal: !prevState.showAcceptPaymentModal,
      }),
      () => {
        if (!this.state.showAcceptPaymentModal) {
          //window.location.reload();
        }
      }
    );
  };
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.defaultLocation !== prevProps.defaultLocation) {
      this.getDuePayments();
    }
  }
  render() {
    return (
      <Card className="border-light shadow" style={{ height: "340px" }}>
        <CardHeader className="bg-danger">
          <strong>Payments Due</strong>
        </CardHeader>
        <CardBody>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Scrollbars autoHeight>
              <Table responsive className="table-striped">
                <thead>
                  <tr>
                    <th scope="col" className="border-top-0"></th>
                    <th scope="col" className="border-top-0">
                      Case ID
                    </th>
                    <th scope="col" className="border-top-0">
                      Patient Name
                    </th>
                    <th scope="col" className="border-top-0">
                      Amount Due
                    </th>
                    <th scope="col" className="border-top-0" />
                  </tr>
                </thead>
                <tbody>
                  {this.state.duePayments.length > 0 ? (
                    this.state.duePayments.map((payment, index) => (
                      <Payment
                        payment={payment}
                        key={`key-payment-${index}`}
                        selectCase={this.selectCase}
                        selectedCases={this.state.selectedCases}
                        getDuePayments={this.getDuePayments}
                      />
                    ))
                  ) : (
                    <tr>
                      <td key={0} colSpan="5">
                        <p className="text-center">No due payment found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Scrollbars>
          </LoadingOverlay>
          {this.state.selectedCases.length > 0 && (
            <Row>
              <Col md={12} className="text-center">
                <Button
                  color="success"
                  className="btn-lg mt-2"
                  onClick={this.toggleAcceptPaymentModal}
                  disabled={true}
                >
                  Pay{" "}
                  <strong>
                    ${common.numberFormat(this.calculateTotalPrice())}
                  </strong>
                </Button>
              </Col>
            </Row>
          )}
        </CardBody>

        {this.state.showAcceptPaymentModal && (
          <AcceptPayment
            showModal={this.state.showAcceptPaymentModal}
            toggleModal={this.toggleAcceptPaymentModal}
            amount={this.calculateTotalPrice()}
            selectedCases={this.state.selectedCases}
            getDuePayments={this.getDuePayments}
          />
        )}
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    defaultLocation: state.defaultLocation,
  };
};
export default connect(mapStateToProps)(DuePayments);
