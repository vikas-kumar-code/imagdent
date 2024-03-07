import React, { Component } from "react";
import {
  Row,
  Col,
  Table,
  Card,
  CardHeader,
  CardBody,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownToggle,
  Spinner,
  Button,
  ModalBody,
} from "reactstrap";
import AddService from "./AddService";
import ChangePayee from "./ChangePayee";
import AddDiscount from "./AddDiscount";
import ReceivePayment from "./ReceivePayment";
import common from "../../../services/common";
import ccase from "../../../services/case";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import PrintInvoiceModal from "./PrintInvoiceModal.js";

class Charges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      serviceModal: false,
      payeeModal: false,
      paymentModal: false,
      paymentMode: common.modeArr,
      payment: null,
      fields: {},
      amount: 0.0,
      sendInvoiceLoader: false,
      anyAmountPaid: false,
      doctorPaid: false,
      patientPaid: false,
      showPrintInvoiceModal: false,
    };
  }

  toggleServiceModal = (payee) => {
    this.setState((prevState) => ({
      serviceModal: !prevState.serviceModal,
      who_will_pay: payee,
    }));
  };
  togglePayeeModal = (id) => {
    let cserviceId = id !== undefined ? id : "";
    this.setState((prevState) => ({
      payeeModal: !prevState.payeeModal,
      cserviceId,
    }));
    if (!this.state.payeeModal) {
      this.props.getServices(this.props.caseId);
    }
  };
  toggleDiscountModal = (id, discount, reason) => {
    let serviceId = id !== undefined ? id : "";
    this.setState((prevState) => ({
      discountModal: !prevState.discountModal,
      serviceId,
      discount: discount,
      reason: reason,
    }));
  };
  togglePaymentModal = (payee) => {
    let locationId = this.props.fields["location_id"];
    let userId = null;
    let patientId = null;
    let amount = 0.0;
    if (payee === 0) {
      userId = this.props.fields["user_id"];
      this.props.fields.invoices.forEach((ele) => {
        if (ele.user_id !== null) {
          amount = ele.balance_amount;
        }
      });
    } else if (payee === 1) {
      patientId = this.props.fields["patient_id"];
      this.props.fields.invoices.forEach((ele) => {
        if (ele.patient_id !== null) {
          amount = ele.balance_amount;
        }
      });
    }
    this.setState(
      (prevState) => ({
        paymentModal: !prevState.paymentModal,
        locationId,
        userId,
        patientId,
        amount,
      }),
      () => {
        if (!this.state.paymentModal) {
          this.props.getPayments(this.props.caseId);
          this.props.getServices(this.props.caseId);
        }
      }
    );
  };

  togglePrintInvoiceModal = (payee) => {
    this.setState((prevState) => ({
      showPrintInvoiceModal: !prevState.showPrintInvoiceModal,
      who_will_pay: payee,
    }));
  };

  deleteService = (id) => {
    if (window.confirm("Are you sure to delete this service?")) {
      ccase
        .deleteService({ case_id: this.props.caseId, service_id: id })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.getServices(this.props.caseId);
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        });
    }
  };
  deletePayment = (id) => {
    if (window.confirm("Are you sure to delete this payment?")) {
      let params = {
        fields: { case_id: this.props.caseId, id: id },
      };
      ccase.removePayment(params).then((response) => {
        if (response.data.success) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.getPayments(this.props.caseId);
          this.props.getServices(this.props.caseId);
        } else if (response.data.error) {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps !== this.props) {
      console.log(this.props.fields.invoices);
      let anyAmountPaid = this.state.anyAmountPaid;
      let doctorPaid = this.state.doctorPaid;
      let patientPaid = this.state.patientPaid;
      if (
        this.props.fields &&
        this.props.fields.invoices &&
        this.props.fields.invoices.length > 0
      ) {
        this.props.fields.invoices.map((ele) => {
          if (ele.payments.length > 0) {
            anyAmountPaid = true;
          } else {
            if (
              this.props.fields.invoices.every(
                (ele) => ele.payments.length === 0
              )
            ) {
              anyAmountPaid = false;
            }
          }
        });

        this.props.fields.invoices.map((ele) => {
          if (ele.status == 1) {
            if (ele.patient_id !== null) {
              patientPaid = true;
            } else {
              doctorPaid = true;
            }
          } else {
            if (ele.patient_id !== null) {
              patientPaid = false;
            } else {
              doctorPaid = false;
            }
          }
        });
      }
      this.setState({
        anyAmountPaid,
        doctorPaid,
        patientPaid,
      });
    }
  };

  render() {
    const { fields } = this.props;
    return (
      <React.Fragment>
        <LoadingOverlay
          active={this.props.chargeLoader}
          spinner={<Spinner color="dark" />}
          fadeSpeed={200}
          classNamePrefix="mitiz"
        >
          {fields["doctor_pay_list"] !== undefined && (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardHeader>
                    <Row>
                      <Col>
                        <h5 className="mt-1">Doctor Pay</h5>
                      </Col>
                      <Col className="text-right">
                        {fields["doctor_pay_list"].length > 0 && (
                          <Button
                            outline
                            color="dark"
                            className="mr-1"
                            onClick={() => this.togglePrintInvoiceModal(0)}
                          >
                            Print Invoice
                          </Button>
                        )}
                        {!this.state.anyAmountPaid && (
                          <Button
                            outline
                            color="info"
                            className="mr-1"
                            onClick={() => this.toggleServiceModal(0)}
                          >
                            Add Service
                          </Button>
                        )}
                        {fields["doctor_pay_list"].length > 0 &&
                          !this.state.doctorPaid && this.props.userType != 15 &&  (
                            <Button
                              outline
                              color="success"
                              onClick={() => this.togglePaymentModal(0)}
                            >
                              Receive Payment
                            </Button>
                          )}
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="pb-0">
                    <Row>
                      <Col md={12}>
                        <Table className="mb-0">
                          <thead>
                            <tr>
                              <th className="border-top-0">Name</th>
                              <th className="border-top-0">Price</th>
                              <th className="border-top-0">Discount</th>
                              <th className="border-top-0">Sub Total</th>
                              <th className="border-top-0" />
                            </tr>
                          </thead>
                          <tbody>
                            {fields["doctor_pay_list"].length > 0 ? (
                              fields["doctor_pay_list"].map(
                                (cservice, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {cservice.service &&
                                          cservice.service.name}
                                      </td>
                                      <td>{`$${cservice.price}`}</td>
                                      <td>{`$${cservice.discount}`}</td>
                                      <td>{`$${cservice.sub_total}`}</td>
                                      <td>
                                        {!this.state.anyAmountPaid && (
                                          <UncontrolledDropdown>
                                            <DropdownToggle
                                              caret
                                              className="btn-sm float-right"
                                            >
                                              Action
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                              <DropdownItem
                                                onClick={() =>
                                                  this.toggleDiscountModal(
                                                    cservice.service.id,
                                                    cservice.discount,
                                                    cservice.reason
                                                  )
                                                }
                                              >
                                                Add Discount
                                              </DropdownItem>
                                              <DropdownItem
                                                onClick={() =>
                                                  this.deleteService(
                                                    cservice.service.id
                                                  )
                                                }
                                              >
                                                Delete
                                              </DropdownItem>
                                              {!this.state.anyAmountPaid &&
                                                fields.status <= 2 && (
                                                  <DropdownItem
                                                    onClick={() =>
                                                      this.togglePayeeModal(
                                                        cservice.id
                                                      )
                                                    }
                                                  >
                                                    Change Payee
                                                  </DropdownItem>
                                                )}
                                            </DropdownMenu>
                                          </UncontrolledDropdown>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  Service Not Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                          {fields["doctor_total_bill"] && (
                            <tfoot>
                              <tr>
                                <td className="text-left" colSpan="1">
                                  <span style={{ fontSize: 20 }}>
                                    Doctor Total Bill:-
                                  </span>
                                  <span
                                    style={{ fontSize: 30 }}
                                  >{`$${common.numberFormat(
                                    fields["doctor_total_bill"]
                                  )}`}</span>
                                </td>
                                <td className="text-right" colSpan="3">
                                  <span style={{ fontSize: 20 }}>
                                    Remaining Balance:-
                                  </span>
                                  <span style={{ fontSize: 30 }}>
                                    $
                                    {(
                                      fields.invoices
                                        .filter((obj) => obj.user_id !== null)
                                        .map((ele, index) =>
                                          (ele.balance_amount)
                                        )
                                    )}
                                  </span>
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          )}
                        </Table>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {fields["patient_pay_list"] !== undefined && (
            <Row>
              <Col xl={12}>
                <Card className="mb-0">
                  <CardHeader>
                    <Row>
                      <Col>
                        <h5 className="mt-1">Patient Pay</h5>
                      </Col>
                      <Col className="text-right">
                        {fields["patient_pay_list"].length > 0 && (
                          <Button
                            outline
                            color="dark"
                            className="mr-1"
                            onClick={() => this.togglePrintInvoiceModal(1)}
                          >
                            Print Receipt
                          </Button>
                        )}
                        {!this.state.anyAmountPaid && fields.status <= 2 && (
                          <Button
                            outline
                            color="info"
                            className="mr-1"
                            onClick={() => this.toggleServiceModal(1)}
                          >
                            Add Service
                          </Button>
                        )}
                        {fields["patient_pay_list"].length > 0 &&
                          !this.state.patientPaid && this.props.userType != 15 && (
                            <Button
                              outline
                              color="success"
                              onClick={() => this.togglePaymentModal(1)}
                            >
                              Receive Payment
                            </Button>
                          )}
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="pb-0">
                    <Row>
                      <Col md={12}>
                        <Table className="mb-0">
                          <thead>
                            <tr>
                              <th className="border-top-0">Name</th>
                              <th className="border-top-0">Price</th>
                              <th className="border-top-0">Discount</th>
                              <th className="border-top-0">Sub Total</th>
                              <th className="border-top-0" />
                            </tr>
                          </thead>
                          <tbody>
                            {fields["patient_pay_list"].length > 0 ? (
                              fields["patient_pay_list"].map(
                                (cservice, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{cservice.service.name}</td>
                                      <td>{`$${cservice.price}`}</td>
                                      <td>{`$${cservice.discount}`}</td>
                                      <td>{`$${cservice.sub_total}`}</td>
                                      <td>
                                        {!this.state.anyAmountPaid && (
                                          <UncontrolledDropdown>
                                            <DropdownToggle
                                              caret
                                              className="btn-sm float-right"
                                            >
                                              Action
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                              <DropdownItem
                                                onClick={() =>
                                                  this.toggleDiscountModal(
                                                    cservice.service.id,
                                                    cservice.discount,
                                                    cservice.reason
                                                  )
                                                }
                                              >
                                                Add Discount
                                              </DropdownItem>
                                              <DropdownItem
                                                onClick={() =>
                                                  this.deleteService(
                                                    cservice.service.id
                                                  )
                                                }
                                              >
                                                Delete
                                              </DropdownItem>
                                              <DropdownItem
                                                onClick={() =>
                                                  this.togglePayeeModal(
                                                    cservice.id
                                                  )
                                                }
                                              >
                                                Change Payee
                                              </DropdownItem>
                                            </DropdownMenu>
                                          </UncontrolledDropdown>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  Service Not Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                          {fields["patient_total_bill"] && (
                            <tfoot>
                              <tr>
                                <td className="text-left" colSpan="1">
                                  <span style={{ fontSize: 20 }}>
                                    Patient Total Bill:-
                                  </span>
                                  <span
                                    style={{ fontSize: 30 }}
                                  >{`$${common.numberFormat(
                                    fields["patient_total_bill"]
                                  )}`}</span>
                                </td>
                                <td className="text-right" colSpan="3">
                                  <span style={{ fontSize: 20 }}>
                                    Remaining Balance:-
                                  </span>
                                  <span style={{ fontSize: 30 }}>
                                    $
                                    {(
                                      fields.invoices
                                        .filter(
                                          (obj) => obj.patient_id !== null
                                        )
                                        .map((ele, index) =>
                                          (ele.balance_amount)
                                        )
                                    )}
                                  </span>
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          )}
                        </Table>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {fields["invoices"] !== undefined &&
            fields["invoices"].length > 0 &&
            (fields["invoices"][0].payments.length > 0 ||
              fields["invoices"][1].payments.length > 0) && (
              <Row className="mt-4">
                <Col xl={12}>
                  <Card>
                    <CardHeader>
                      <h5 className="mb-0">Payment List</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={12}>
                          <Table>
                            <thead>
                              <tr>
                                <th className="border-top-0">Invoice Id</th>
                                <th className="border-top-0">Received from</th>
                                <th className="border-top-0">Amount</th>
                                <th className="border-top-0">Mode</th>
                                <th className="border-top-0" colSpan={2}>
                                  Received on
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {fields["invoices"].map((ele) => {
                                return ele.payments.map((payment, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{payment.actual_invoice_id}</td>
                                      <td>
                                        {payment.user_id !== null
                                          ? "Doctor"
                                          : "Patient"}
                                      </td>
                                      <td>{`$${payment.paid_amount}`}</td>

                                      <td>
                                        {this.state.paymentMode[payment.mode]}
                                      </td>
                                      <td>
                                        {common.customeFormat(
                                          payment.added_on,
                                          "MM dd, yyyy"
                                        )}
                                      </td>
                                      {this.props.userType == 1 && (
                                        <td>
                                          <Button
                                            className="btn btn-sm"
                                            color="danger"
                                            onClick={() =>
                                              this.deletePayment(payment.id)
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </td>
                                      )}
                                    </tr>
                                  );
                                });
                              })}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
        </LoadingOverlay>
        {this.state.serviceModal && (
          <AddService
            showServiceModal={this.state.serviceModal}
            toggleServiceModal={this.toggleServiceModal}
            locationId={this.props.fields["location"].id}
            caseId={this.props.caseId}
            who_will_pay={this.state.who_will_pay}
            caseServicesList={fields["caseServices"]}
            getServices={this.props.getServices}
          />
        )}
        {this.state.payeeModal && (
          <ChangePayee
            showPayeeModal={this.state.payeeModal}
            togglePayeeModal={this.togglePayeeModal}
            cserviceId={this.state.cserviceId}
            caseId={this.props.caseId}
            user={this.props.userId}
            getServices={this.props.getServices}
          />
        )}
        {this.state.discountModal && (
          <AddDiscount
            showDiscountModal={this.state.discountModal}
            toggleDiscountModal={this.toggleDiscountModal}
            serviceId={this.state.serviceId}
            caseId={this.props.caseId}
            discount={this.state.discount}
            reason={this.state.reason}
            getServices={this.props.getServices}
            getPayments={this.props.getPayments}
          />
        )}
        {this.state.paymentModal && (
          <ReceivePayment
            showPaymentModal={this.state.paymentModal}
            togglePaymentModal={this.togglePaymentModal}
            caseId={this.props.caseId}
            userId={this.state.userId}
            patientId={this.state.patientId}
            locationId={this.state.locationId}
            paymentMode={this.state.paymentMode}
            amount={this.state.amount}
          />
        )}

        {this.state.showPrintInvoiceModal && (
          <PrintInvoiceModal
            showModal={this.state.showPrintInvoiceModal}
            toggleModal={this.togglePrintInvoiceModal}
            who_will_pay={this.state.who_will_pay}
            caseId={this.props.caseId}
            diagnosis_codes={this.props.diagnosis_codes}
          />
        )}
      </React.Fragment>
    );
  }
}
export default Charges;
