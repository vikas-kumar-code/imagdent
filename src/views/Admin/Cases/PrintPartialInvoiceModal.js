import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Container,
  Row,
  Col,
} from "reactstrap";
import invoice_logo from "../../../assets/images/front-logo.png";
import ccase from "../../../services/case";
import common from "../../../services/common";
import moment from "moment";
import ReactToPrint from "react-to-print";

class PrintPartialInvoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      caseDetails: null,
    };
  }

  componentDidMount = () => {
    ccase.getCaseDetails({ id: this.props.caseId }).then((response) => {
      this.setState({ loader: true });
      if (response.data.success) {
        this.setState({
          caseDetails: response.data.case,
          loader: false,
        });
      }
    });
  };
  location = (loc) => {
    return (
      <>
        {loc.street_address}
        {loc.city && `, ${loc.city}`}
        {loc.state && `, ${loc.state.state}`}
        {loc.Zipcode && `, ${loc.Zipcode}`}
      </>
    );
  };
  blocation = (state) => {
    return (
      <>
        {state.user && state.user.b_street}
        {state.user && state.user.b_city && `, ${state.user.b_city}`}
        {state.user && state.user.bstate && `, ${state.user.bstate.state}`}
        {state.user && state.user.b_zipcode && `, ${state.user.b_zipcode}`}
      </>
    );
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>
          <ReactToPrint
            copayStyles={true}
            pageStyle={() => this.pageStyle}
            trigger={() => <Button color="primary">Print</Button>}
            content={() => this.componentRef}
          />
        </ModalHeader>

        <div
          ref={(el) => (this.componentRef = el)}
          className="printinvoicefont"
        >
          <ModalBody>
            {this.state.loader ? (
              <Spinner color="dark" style={{ marginLeft: "45%" }} />
            ) : this.props.who_will_pay ? (
              <Container fluid className="printinvoicetext">
                {this.state.caseDetails !== null && (
                  <Fragment>
                    <Row className="d-flex justify-content-between">
                      <Col>
                        <img height={50} src={invoice_logo} />
                      </Col>
                      <Col>
                        <p style={{ marginLeft: "8.5rem" }}>
                          {this.location(this.state.caseDetails.location)}
                        </p>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col className="text-center font-weight-bold">
                        <h3 className="reciept"> Payment of Receipt</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="font-weight-bold fontbig">
                        Patient Information
                      </Col>
                    </Row>
                    <Row style={{ borderStyle: "double" }} className="mt-2">
                      <Col className="d-flex">
                        <p className="font-weight-bold">Patient Name:</p>
                        <p className="ml-2">
                          {common.getFullName(this.state.caseDetails.patient)}
                        </p>
                      </Col>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Invoice No:</p>
                        <p className="ml-2">
                          {this.state.caseDetails &&
                            this.state.caseDetails.invoices.length > 0 &&
                            this.state.caseDetails.invoices
                              .filter((obj) => obj.patient_id !== null)
                              .map((ele, i) => ele.invoice_id)}
                        </p>
                      </Col>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Case Id:</p>
                        <p className="ml-2">
                          {this.state.caseDetails &&
                            this.state.caseDetails.c_id}
                        </p>
                      </Col>
                      <div class="w-100"></div>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Address:</p>
                        <p className="ml-2">
                          {this.state.caseDetails.patient.Address1}
                          {this.state.caseDetails.patient &&
                            `, ${this.state.caseDetails.patient.City}`}
                          {this.state.caseDetails.patient.statedetails &&
                            `, ${this.state.caseDetails.patient.statedetails.state}`}
                          {this.state.caseDetails.patient &&
                            `, ${this.state.caseDetails.patient.Zipcode}`}
                        </p>
                      </Col>
                      <Col className="d-flex">
                        {this.state.caseDetails.location.npi != null &&
                          this.state.caseDetails.location.npi != 0 && (
                            <>
                              <p className="ml-2">NPI:</p>
                              <p>{this.state.caseDetails.location.npi}</p>
                            </>
                          )}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="font-weight-bold fontbig">
                        Services Rendered By
                      </Col>
                      <Col className="font-weight-bold fontbig">
                        Referring Doctor Information
                      </Col>
                    </Row>
                    <Row style={{ borderStyle: "double" }}>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Location:</p>
                        <p className="ml-2">
                          {this.state.caseDetails.location.publish_name}
                        </p>
                      </Col>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Doctor’s Name:</p>
                        <p className="ml-2">
                          {common.getFullName(this.state.caseDetails.user)}
                        </p>
                      </Col>
                      <div class="w-100"></div>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Address:</p>
                        <p className="ml-2">
                          {this.location(this.state.caseDetails.location)}
                        </p>
                      </Col>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Address:</p>
                        <p className="ml-2">
                          {this.blocation(this.state.caseDetails)}
                        </p>
                      </Col>
                      <div class="w-100"></div>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Phone Number:</p>
                        <p className="ml-2">
                          {this.state.caseDetails.location &&
                            this.state.caseDetails.location.WorkPhone}
                        </p>
                      </Col>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Phone Number:</p>
                        <p className="d-flex ml-2">
                          {this.state.caseDetails.user &&
                            this.state.caseDetails.user.phone}
                        </p>
                      </Col>
                      <div class="w-100"></div>
                      <Col className="d-flex">
                        <p className="font-weight-bold ml-2">
                          {this.state.caseDetails.location.npi != null &&
                            this.state.caseDetails.location.npi != 0 &&
                            "NPI:"}
                        </p>
                        {this.state.caseDetails.location.npi != null &&
                          this.state.caseDetails.location.npi != 0 &&
                          this.state.caseDetails.location.npi}
                      </Col>
                      <Col className="d-flex">
                        <p className="font-weight-bold ml-2">
                          {this.state.caseDetails.user.npi != null &&
                            this.state.caseDetails.user.npi != 0 && (
                              <>
                                <p className="font-weight-bold ml-2">NPI:</p>
                                <p>&nbsp; {this.state.caseDetails.user.npi}</p>
                              </>
                            )}
                        </p>
                      </Col>
                    </Row>

                    <Row>
                      <Col className="font-weight-bold fontbig">Payments</Col>
                    </Row>
                    <Row style={{ borderStyle: "double" }}>
                      <Col className="d-flex">
                        <p className="font-weight-bold">Amount Paid:</p>
                        <p className="ml-2">
                          ${this.props.payment.paid_amount}
                        </p>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col className="text-justify font-weight-bold text-center fontbig">
                        iMagDent is an independent imaging lab. It is not a
                        hospital or located in a hospital setting. iMagDent does
                        not prescribe imaging services. This is NOT a bill.
                        Please pay insured directly. iMagDent does NOT accept
                        assignment. Fees are non-negotiable.
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col className="text-justify text-center fontsmall">
                        I hereby certify that the procedure, as indicated above,
                        have been completed and that the fees submitted are the
                        actual fees.
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col md={6} className=" font-weight-bold signature">
                        iMagDent Representative:________________
                      </Col>
                      <Col md={6} className=" font-weight-bold date">
                        Date:________________
                      </Col>
                    </Row>
                  </Fragment>
                )}
              </Container>
            ) : (
              <Container className="printinvoicetext">
                <Row>
                  <Col md={6}>
                    <img height={50} src={invoice_logo} />
                  </Col>
                  <Col md={6}>
                    <p style={{ marginLeft: "8.5rem" }} className="address">
                      {this.location(this.state.caseDetails.location)}
                    </p>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col className="text-center font-weight-bold">
                    <h3 className="invoice">Payment of Receipt</h3>
                  </Col>
                </Row>
                <Row style={{ borderStyle: "double" }}>
                  <table style={{ width: "100%", marginLeft: "10px" }}>
                    {this.state.caseDetails &&
                      this.state.caseDetails.invoices.length > 0 &&
                      this.state.caseDetails.invoices
                        .filter((obj) => obj.user_id !== null)
                        .map((ele, i) => (
                          <tr key={i}>
                            <th>
                              Invoice No:
                              <span className="ml-2 font-weight-normal">
                                {ele.invoice_id}
                              </span>
                            </th>
                            <th>
                              Invoice Total:
                              <span className="ml-2 font-weight-normal">
                                ${ele.amount}
                              </span>
                            </th>
                          </tr>
                        ))}
                  </table>
                </Row>

                <Row>
                  <Col className="font-weight-bold fontbig">Bill To</Col>
                </Row>
                <Row style={{ borderStyle: "double" }}>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Doctor’s Name:</p>
                    <p className="ml-2">
                      {common.getFullName(this.state.caseDetails.user)}
                    </p>
                  </Col>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Phone Number:</p>
                    <p className="ml-2">
                      {this.state.caseDetails.user &&
                        this.state.caseDetails.user.phone}
                    </p>
                  </Col>
                  <div class="w-100"></div>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Address:</p>
                    <p className="ml-2">
                      {this.blocation(this.state.caseDetails)}
                    </p>
                  </Col>
                  <Col className="d-flex">
                    {this.state.caseDetails.user.npi != null &&
                      this.state.caseDetails.user.npi != 0 && (
                        <>
                          <p className="text-right">NPI:</p>
                          <p className="ml-2">
                            {this.state.caseDetails.user.npi}
                          </p>
                        </>
                      )}
                  </Col>
                </Row>

                <Row>
                  <Col className="font-weight-bold fontbig">
                    Service Rendered By
                  </Col>
                </Row>
                <Row style={{ borderStyle: "double" }}>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Location:</p>
                    <p className="ml-2">
                      {this.state.caseDetails.location.publish_name}
                    </p>
                  </Col>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Phone Number:</p>
                    <p className="ml-2">
                      {this.state.caseDetails.location.WorkPhone}
                    </p>
                  </Col>
                  <div class="w-100"></div>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Address:</p>
                    <p className="ml-2">
                      {this.location(this.state.caseDetails.location)}
                    </p>
                  </Col>
                  <Col className="d-flex">
                    {this.state.caseDetails.location.npi != null &&
                      this.state.caseDetails.location.npi != 0 && (
                        <>
                          <p className="ml-2">NPI:</p>
                          <p>{this.state.caseDetails.location.npi}</p>
                        </>
                      )}
                  </Col>
                </Row>

                <Row>
                  <Col className="font-weight-bold fontbig">
                    Patient Information
                  </Col>
                </Row>
                <Row style={{ borderStyle: "double" }}>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Patient Name:</p>
                    <p className="ml-2">
                      {common.getFullName(this.state.caseDetails.patient)}
                    </p>
                  </Col>
                  <Col className="d-flex">
                    <p className="font-weight-bold">DOB:</p>
                    <p className="ml-2">
                      {this.state.caseDetails.patient.BirthDate &&
                        common.customeFormat(
                          this.state.caseDetails.patient.BirthDate,
                          "MM dd, yyyy"
                        ) + " "}
                    </p>
                  </Col>
                  <div class="w-100"></div>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Address:</p>
                    <p className="ml-2">
                      {this.state.caseDetails.patient.Address1}
                      {this.state.caseDetails.patient &&
                        `, ${this.state.caseDetails.patient.City}`}
                      {this.state.caseDetails.patient.statedetails &&
                        `, ${this.state.caseDetails.patient.statedetails.state}`}
                      {this.state.caseDetails.patient &&
                        `, ${this.state.caseDetails.patient.Zipcode}`}
                    </p>
                  </Col>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Phone Number:</p>
                    <p className=" ml-2">
                      {this.state.caseDetails.patient.HomePhone}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col className="font-weight-bold fontbig">Payments</Col>
                </Row>

                <Row style={{ borderStyle: "double" }}>
                  <Col className="d-flex">
                    <p className="font-weight-bold">Amount Paid:</p>
                    <p className="ml-2">${this.props.payment.paid_amount}</p>
                  </Col>
                </Row>
              </Container>
            )}
          </ModalBody>
        </div>
        <ModalFooter>
          <ReactToPrint
            copayStyles={true}
            pageStyle={() => this.pageStyle}
            trigger={() => <Button color="primary">Print</Button>}
            content={() => this.componentRef}
          />
          <Button color="secondary" onClick={this.props.toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default PrintPartialInvoiceModal;
