import React, { Component } from "react";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Form,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormFeedback,
  Collapse,
  CustomInput,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import TokenPay from "./TokenPay";
import ccase from "../../../services/case";
import { toast } from "react-toastify";
var tokenpay = TokenPay("tokenpay15590api20212619042621870");

class ReceivePayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        case_id: this.props.caseId,
        user_id: this.props.userId,
        patient_id: this.props.patientId,
        location_id: this.props.locationId,
        manual: false,
        amount:this.props.amount
      },
      errors: {},
      submitted: false,
      cardDetailBox: false,
      chequeDetailBox: false,
      cardDetail: true,
    };
  }
  componentDidMount = () => {
    tokenpay.initialize({
      dataElement: "#card",
      errorElement: "#errorMessage",
      useACH: false,
      useStyles: false,
      disableZip: true,
      amountElement: "amount",
    });
  };
  handleChange = (e) => {
    let fields = this.state.fields;
    let cardDetailBox = this.state.cardDetailBox;
    let cardDetail = this.state.cardDetail;
    let chequeDetailBox = this.state.chequeDetailBox;
    let { name, value } = e.target;
    if (e.target.type === "radio") {
      if (e.target.checked) {
        if (value == 1) {
          chequeDetailBox = true;
        } else {
          chequeDetailBox = false;
        }
        if (value > 1) {
          cardDetailBox = true;
        } else {
          cardDetailBox = false;
        }
        fields[name] = value;
      }
    } else if (e.target.type === "checkbox") {
      if (e.target.checked) {
        cardDetail = false;
      } else {
        cardDetail = true;
      }
      // fields[name] = e.target.checked; //uncomment when rectangle health is active
    } else {
      fields[name] = value;
    }
    if (fields["received_on"] == undefined) {
      fields["received_on"] = new Date();
    }
    fields["manual"] = true; 
    this.setState({ fields, cardDetailBox, cardDetail, chequeDetailBox });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let that = this;
    console.log(this.state.fields);
    console.log(this.state.errors);
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      if (
        this.state.fields["mode"] > 1 &&
        this.state.fields["manual"] === false
      ) {
        let fields = this.state.fields;
        if (
          document.getElementById("errorMessage").style.display === "" ||
          document.getElementById("errorMessage").style.display === "block"
        ) {
          this.setState({ submitted: false });
        } else {
          tokenpay.createToken(
            function (result, error) {
              if (result.token) {
                fields["token"] = result.token;
                that.setState({ fields });
                that.receivePayment();
              }
            },
            function (result) {
              console.log("error: " + result);
            }
          );
        }
      } else {
        this.receivePayment();
      }
    }
  };

  receivePayment = () => {
    //this.setState({ submitted: true });
    let params = {
      fields: this.state.fields,
    };
    ccase
      .receivePayment(params)
      .then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.togglePaymentModal();
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        });
      })
      .catch((error) => {
        this.setState({ submitted: false });
      });
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["mode"]) {
      formIsValid = false;
      errors["mode"] = "Choose a Payment Mode!";
    }
    if (
      fields["mode"] == 1 &&
      (!fields["cheque_number"] || !fields["cheque_number"] === "")
    ) {
      formIsValid = false;
      errors["cheque_number"] = "Enter the check number";
    }
    this.setState({ errors });
    return formIsValid;
  };
  handleDate = (date) => {
    let fields = this.state.fields;
    fields["received_on"] = date;
    this.setState({ fields });
  };
  render() {
    const { fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showPaymentModal}>
        <ModalHeader toggle={this.props.togglePaymentModal}>
          Receive Payment
        </ModalHeader>
        <Form
          name="payment-frm"
          id="paymentForm"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <ModalBody className="pl-4 pr-4">
            <div className="animated fadeIn">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                {this.props.userType == 1 && (
                  <FormGroup row>
                    <Col md={12}>
                      <Label>Payment Date</Label>
                      <DatePicker
                        className="form-control form-control-lg"
                        style={{ width: 100 + "%", float: "left" }}
                        selected={
                          fields["received_on"]
                            ? fields["received_on"]
                            : new Date()
                        }
                        onChange={this.handleDate}
                        dateFormat="MM-dd-yyyy"
                        name="received_on"
                        id="received_on"
                      />
                    </Col>
                  </FormGroup>
                )}
                <FormGroup>
                  <Label>Amount</Label>
                  {/* <span
                    style={{ fontSize: 25, marginLeft: 5, display: "block" }}
                  >
                    ${this.props.amount}
                  </span> */}
                  <Input
                    type="number"
                    name="amount"
                    value={fields["amount"] ? fields["amount"] : ""}
                    onChange={this.handleChange}
                    invalid={errors["amount"] ? true : false}
                  />
                  {errors["amount"] && (
                    <FormFeedback>{errors["amount"]}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup row className="mb-1">
                  <Col md={12}>
                    <Label>Payment Type</Label>
                  </Col>
                </FormGroup>
                {this.props.paymentMode.map((mode, index) => {
                  return (
                    <FormGroup check inline key={index}>
                      <Label>
                        <Input
                          type="radio"
                          name="mode"
                          value={index}
                          onChange={this.handleChange}
                        />
                        {mode}
                      </Label>
                    </FormGroup>
                  );
                })}
                {errors["mode"] && (
                  <small className="text-danger">{errors["mode"]}</small>
                )}
                <Collapse isOpen={this.state.cardDetailBox}>
                  <CustomInput
                    type="checkbox"
                    id="manual"
                    name="manual"
                    label="Manual"
                    checked={true}//to be removed when  rectangle health is live
                    disabled={true}//to be removed when  rectangle health is live
                    onChange={this.handleChange}
                  />
                   {/* <Collapse isOpen={this.state.cardDetail}>  */}
                   {/* to be removed when  rectangle health is live */}
                  <Collapse isOpen={false}>
                    <div id="card" />
                    <div id="errorMessage" />
                  </Collapse>
                </Collapse>
                <Collapse isOpen={this.state.chequeDetailBox}>
                  <Label>Check No:</Label>
                  <Input
                    type="text"
                    id="cheque_number"
                    name="cheque_number"
                    label="cheque_number"
                    onChange={this.handleChange}
                  />
                  {errors["cheque_number"] && (
                    <small className="text-danger">
                      {errors["cheque_number"]}
                    </small>
                  )}
                </Collapse>
              </LoadingOverlay>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-dark cp mr-1"
              disabled={this.state.submitted}
              onClick={this.props.togglePaymentModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger cbd-color cp"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Receive
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
  };
};
export default connect(mapStateToProps)(ReceivePayment);
