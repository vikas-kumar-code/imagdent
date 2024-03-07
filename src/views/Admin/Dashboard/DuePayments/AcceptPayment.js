import React, { Component } from "react";
import {
  Spinner,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import TokenPay from "../../Cases/TokenPay";
import common from "../../../../services/common";
import { toast } from "react-toastify";
var tokenpay = TokenPay("tokenpay15590api20212619042621870");

class AcceptPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      errors: {},
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    const amount = this.props.amount;
    const selectedCases = this.props.selectedCases;
    e.preventDefault();
    let that = this;
    tokenpay.createToken(
      function (result) {
        if (result.token) {
          that.setState({ submitted: true });
          const params = {
            token: result.token,
            amount: amount,
            selectedCases: selectedCases,
          };
          common
            .receivePayment(params)
            .then((response) => {
              if (response.data.success) {
                toast.success(response.data.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
                that.props.toggleModal();
                that.props.getDuePayments();
              } else if (response.data.error) {
                if (response.data.message) {
                }
              }
              that.setState({ submitted: false });
            })
            .catch(function (error) {
              that.setState({ submitted: false });
            });
        }
      },
      function (result) {
        console.log("error: " + result);
      }
    );
  };

  componentDidMount = () => {
    tokenpay.initialize({
      dataElement: "#card",
      errorElement: "#errorMessage",
      useACH: false,
      useStyles: false,
      disableZip: true,
      amountElement: "amount",
    });
    console.log(this.props);
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <Form onSubmit={this.handleSubmit}>
          <ModalHeader toggle={this.props.toggleModal}>
            Accept Payment
          </ModalHeader>
          <ModalBody className="pl-4 pr-4">
            <span style={{ fontSize: 25, marginLeft: 5 }}>
              ${this.props.amount}
            </span>
            <div id="card">
              <Spinner color="dark" />
            </div>
            <div className="text-danger" id="errorMessage" />
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-danger"
              onClick={this.props.toggleModal}
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <Spinner style={{ width: 15, height: 15 }} />
              )}{" "}
              Pay Now
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default AcceptPayment;
