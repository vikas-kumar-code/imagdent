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
import ccase from "../../../services/case";
import common from "../../../services/common";
import invoice_logo from "../../../assets/images/front-logo.png";
import moment from "moment";
import ReactToPrint from "react-to-print";

class PrintInvoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      caseDetails: null,
      partialPaymentArray: [],
    };
    const pageStyle = `
      @page {
        size: 80mm 50mm;
        font-size:20px
      },
      @media print {
        @page { size: landscape; }
      } 
  `;
  }

  componentDidMount = () => {
    ccase.getCaseDetails({ id: this.props.caseId }).then((response) => {
      this.setState({ loader: true });
      let partialPaymentArray = [];
      if (response.data.success) {
        response.data.case.invoices.map((ele) => {
          if (ele.patient_id !== null) {
            partialPaymentArray = ele.payments;
          }
        });
        if (response.data.case.diagnosis_codes !== null) {
          common
            .getSelectedDiagnosisCodes({
              codes: response.data.case.diagnosis_codes,
            })
            .then((response) => {
              let diagnosis_codes = response.data.diagnosis_codes;
              this.setState({ diagnosis_codes });
            });
        }
        this.setState({
          partialPaymentArray,
          caseDetails: response.data.case,
          loader: false,
        });
      }
    });
  };

  paidAmountFun = (subTotal, balanceAmount) => {
    let paidAmount = parseFloat(subTotal - balanceAmount).toFixed(2);
    return parseInt(paidAmount).toFixed(2);
  };
  location = (loc) => {
    return (
      <>
        {loc.street_address !== null && loc.street_address !== "" ? (
          <span>
            {loc.street_address}
            <br />{" "}
          </span>
        ) : (
          ""
        )}
        {loc.city && `${loc.city},`}
        {loc.state && ` ${loc.state.state}`}
        {loc.Zipcode && ` ${loc.Zipcode}`}
      </>
    );
  };
  blocation = (state) => {
    return (
      <>
        {state.user &&
        state.user.b_street !== null &&
        state.user.b_street !== "" ? (
          <span>
            {state.user.b_street}
            <br />{" "}
          </span>
        ) : (
          ""
        )}
        {state.user && state.user.b_city && ` ${state.user.b_city},`}
        {state.user && state.user.bstate && ` ${state.user.bstate.state}`}
        {state.user && state.user.b_zipcode && ` ${state.user.b_zipcode}`}
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
              <Container>
                <table width={`100%`}>
                  <tbody>
                    <tr>
                      <td align="center" colSpan={2}>
                        <img
                          src={invoice_logo}
                          height="50"
                          className="imgdent-logo"
                        />
                        <br />
                        <h2 className="text-dark">Receipt of Payment</h2>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-dark" colSpan={2}>
                        <h4>Patient Information</h4>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000000" }} colSpan={2}>
                        <table width="100%" cellPadding={5}>
                          <tr>
                            <td className="text-dark">
                              <strong>Patient Name:</strong>{" "}
                              {common.getFullName(
                                this.state.caseDetails.patient !== null
                                  ? this.state.caseDetails.patient
                                  : "Please request"
                              )}
                            </td>
                            <td className="text-dark">
                              <strong>Invoice No: </strong>
                              {this.state.caseDetails &&
                                this.state.caseDetails.invoices.length > 0 &&
                                this.state.caseDetails.invoices
                                  .filter((obj) => obj.patient_id !== null)
                                  .map((ele, i) => ele.invoice_id)}
                            </td>
                            <td className="text-dark">
                              <strong>Case Id: </strong>
                              {this.state.caseDetails &&
                              this.state.caseDetails.c_id !== null
                                ? this.state.caseDetails.c_id
                                : "Please request"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="text-dark">
                              <strong>Address:</strong>{" "}
                              {this.state.caseDetails.patient.Address1 !==
                              null ? (
                                <span
                                  class="font-weight-normal"
                                  style={{ width: "50%" }}
                                >
                                  {this.state.caseDetails.patient.Address1}{" "}
                                  <br />{" "}
                                </span>
                              ) : (
                                ""
                              )}
                              {this.state.caseDetails.patient &&
                                `${this.state.caseDetails.patient.City}`}
                              {this.state.caseDetails.patient.statedetails &&
                                `, ${this.state.caseDetails.patient.statedetails.state}`}
                              {this.state.caseDetails.patient &&
                                ` ${
                                  this.state.caseDetails.patient.Zipcode !==
                                  null
                                    ? this.state.caseDetails.patient.Zipcode
                                    : ""
                                }`}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-dark pt-3">
                        <h4>Services Renderd By</h4>
                      </td>
                      <td className="text-dark pt-3">
                        <h4>Referring Doctor Information</h4>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="text-dark"
                        style={{ border: "1px solid #000000" }}
                        colspan={2}
                      >
                        <table width={`100%`} cellPadding={10}>
                          <tr>
                            <td valign="top" style={{ lineHeight: 2.2 }}>
                              <strong>Location:</strong>{" "}
                              {this.state.caseDetails.location.publish_name}
                              <br />
                              <strong>Address:</strong>{" "}
                              {this.location(this.state.caseDetails.location)}
                              <br />
                              <strong>Phone:</strong>{" "}
                              {this.state.caseDetails.location &&
                              this.state.caseDetails.location.WorkPhone !== null
                                ? this.state.caseDetails.location.WorkPhone
                                : "Please request"}
                              {(this.state.caseDetails.location.npi != 0 ||
                                this.state.caseDetails.location.ein) && (
                                <>
                                  <br />
                                  {this.state.caseDetails.location.npi != 0 && (
                                    <>
                                      <strong> NPI: </strong>{" "}
                                      {this.state.caseDetails.location.npi}
                                    </>
                                  )}
                                  {this.state.caseDetails.location.ein != 0 && (
                                    <>
                                      <strong> Tax ID: </strong>{" "}
                                      {this.state.caseDetails.location.ein}
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                            <td
                              valign="top"
                              style={{ lineHeight: 2.3, paddingLeft: 60 }}
                            >
                              <strong>Doctor’s Name:</strong>{" "}
                              {common.getFullName(
                                this.state.caseDetails.user !== null
                                  ? this.state.caseDetails.user
                                  : "Please request"
                              )}
                              <br />
                              <strong>Address:</strong>{" "}
                              {this.blocation(this.state.caseDetails)}
                              <br />
                              <strong>Phone:</strong>{" "}
                              {this.state.caseDetails.user &&
                              this.state.caseDetails.user.phone !== null
                                ? this.state.caseDetails.user.phone
                                : "Please request"}
                              {(this.state.caseDetails.user.npi != 0 ||
                                this.state.caseDetails.user.licence_no) && (
                                <>
                                  <br />
                                  {this.state.caseDetails.user.npi != 0 && (
                                    <>
                                      <strong> NPI: </strong>{" "}
                                      {this.state.caseDetails.user.npi}
                                    </>
                                  )}
                                  {this.state.caseDetails.user.licence_no !=
                                    null && (
                                    <>
                                      <strong> Tax ID: </strong>{" "}
                                      {this.state.caseDetails.user.licence_no}
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text-dark pt-3">
                        <h4>Services</h4>
                      </td>
                    </tr>
                    <tr>
                      <td colspan={2}>
                        <table
                          width="100%"
                          cellPadding={5}
                          style={{ border: "1px solid #000000" }}
                        >
                          <tr>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Date
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Procedure
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Medical code
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Dental Code
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Fee
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Adjustment
                            </th>
                          </tr>
                          {this.state.caseDetails.caseServices.length > 0 &&
                            this.state.caseDetails.caseServices.map(
                              (ele, index) => {
                                return (
                                  ele.who_will_pay == 1 && (
                                    <tr key={index}>
                                      <td className="text-dark">
                                        {moment(
                                          this.state.caseDetails
                                            .patient_checked_in
                                        ).format("MM/DD/YYYY")}
                                      </td>
                                      <td className="text-dark">
                                        {ele.service.name}
                                      </td>
                                      <td className="text-dark">
                                        {ele.service.cpt_code}
                                      </td>
                                      <td className="text-dark">
                                        {ele.service.ada_code}
                                      </td>
                                      <td className="text-dark">
                                        ${ele.service.price}
                                      </td>
                                      {ele.discount > 0 ? (
                                        <td
                                          style={{
                                            color: "red",
                                            padding: "0px",
                                          }}
                                        >
                                          ${ele.discount}
                                        </td>
                                      ) : (
                                        <td className="text-dark">
                                          ${ele.discount}
                                        </td>
                                      )}
                                    </tr>
                                  )
                                );
                              }
                            )}
                          <tr>
                            <td colspan={5} className="text-right text-dark">
                              <strong>SubTotal: </strong>
                            </td>
                            <td className="text-dark">
                              <strong>
                                $
                                {this.state.caseDetails &&
                                  (
                                    parseInt(
                                      this.state.caseDetails.patient_balance
                                    ) +
                                    parseInt(
                                      this.state.caseDetails.patient_discount
                                    )
                                  ).toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td colspan={5} className="text-right text-dark">
                              <strong>Total of Adjustments: </strong>
                            </td>
                            <td className="text-dark">
                              {this.state.caseDetails &&
                              this.state.caseDetails.patient_discount > 0 ? (
                                <td style={{ color: "red" }}>
                                  <u className="font-weight-bold ">
                                    $
                                    {this.state.caseDetails &&
                                      this.state.caseDetails.patient_discount}
                                  </u>
                                  <br />
                                </td>
                              ) : (
                                <td className="text-dark">
                                  <u className="font-weight-bold ">
                                    $
                                    {this.state.caseDetails &&
                                      this.state.caseDetails.patient_discount}
                                  </u>
                                  <br />
                                </td>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td colspan={5} className="text-right text-dark">
                              <strong>Total Patient Due: </strong>
                            </td>
                            <td className="text-dark">
                              <strong>
                                $
                                {parseInt(
                                  this.state.caseDetails &&
                                    this.state.caseDetails.patient_balance
                                ).toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    {this.state.diagnosis_codes != null && (
                      <>
                        <tr>
                          <td className="text-dark pt-3" colspan={2}>
                            <h4>Diagnosis Code</h4>
                          </td>
                        </tr>
                        <tr>
                          <td colspan={2}>
                            <table
                              width="100%"
                              style={{ border: "1px solid #000000" }}
                              cellPadding={5}
                            >
                              <thead>
                                <tr>
                                  <th
                                    className="text-dark"
                                    style={{ border: "1px solid #000000" }}
                                  >
                                    Diagnosis Code
                                  </th>
                                  <th
                                    className="text-dark"
                                    style={{ border: "1px solid #000000" }}
                                  >
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.diagnosis_codes != null &&
                                  this.state.diagnosis_codes.map((ele, i) => (
                                    <tr key={i}>
                                      <td className="text-dark">{ele.code}</td>
                                      <td className="text-dark">{ele.name}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td className="text-dark pt-3" colSpan={2}>
                        <h4>Payments</h4>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <table
                          style={{ border: "1px solid #000000", width: "100%" }}
                          cellPadding={5}
                        >
                          <thead>
                            <tr>
                              <th
                                className="text-dark"
                                style={{ border: "1px solid #000000" }}
                              >
                                Payment Date
                              </th>
                              <th
                                className="text-dark"
                                style={{ border: "1px solid #000000" }}
                              >
                                Payment Method
                              </th>
                              <th
                                className="text-dark"
                                style={{ border: "1px solid #000000" }}
                              >
                                Payment Amount
                              </th>
                              <th
                                className="text-dark"
                                style={{ border: "1px solid #000000" }}
                              >
                                Balance Remaining
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.partialPaymentArray.map((ele) => (
                              <tr key={ele.id}>
                                <td className="text-dark">
                                  {moment(ele.added_on).format(
                                    "MMMM DD, YYYY"
                                  ) + " "}
                                </td>
                                {ele.mode == 0 && (
                                  <td className="text-dark">Cash</td>
                                )}
                                {ele.mode == 1 && (
                                  <td className="text-dark">
                                    Check #{ele.cheque_number}
                                  </td>
                                )}
                                {ele.mode == 2 && (
                                  <td className="text-dark">Visa</td>
                                )}
                                {ele.mode == 3 && (
                                  <td className="text-dark">MasterCard</td>
                                )}
                                {ele.mode == 4 && (
                                  <td className="text-dark">Amex</td>
                                )}
                                {ele.mode == 5 && (
                                  <td className="text-dark">Discover</td>
                                )}
                                <td className="text-dark">
                                  ${ele.paid_amount}
                                </td>
                                <td className="text-dark">
                                  ${ele.remaining_amount}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                className="text-dark"
                                colspan={2}
                                align="right"
                              >
                                <strong>Total of Payments:</strong>
                              </td>
                              <td className="text-dark">
                                <strong>
                                  $
                                  {parseInt(
                                    this.state.caseDetails &&
                                      this.state.caseDetails.invoices
                                        .filter(
                                          (obj) => obj.patient_id !== null
                                        )
                                        .map((ele, index) =>
                                          parseFloat(ele.sub_total)
                                        )
                                  ).toFixed(2)}
                                </strong>
                              </td>

                              <td className="text-dark">
                                <strong>
                                  Balance Remaining: $
                                  {parseInt(
                                    this.state.caseDetails &&
                                      this.state.caseDetails.invoices
                                        .filter(
                                          (obj) => obj.patient_id !== null
                                        )
                                        .map((ele, index) =>
                                          parseFloat(ele.balance_amount)
                                        )
                                  ).toFixed(2)}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-3" colspan={2}>
                        <table width="100%">
                          <tr>
                            <td>
                              {" "}
                              <strong className="text-justify text-dark">
                                iMagDent is an independent imaging lab. It is
                                not a hospital or located in a hospital setting.
                                iMagDent does not prescribe imaging services.
                                This is NOT a bill. Please pay insured directly.
                                iMagDent does NOT accept assignment. Fees are
                                non-negotiable.
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {" "}
                              <strong className="text-dark text-justify">
                                {" "}
                                I hereby certify that the procedure, as
                                indicated above, have been completed and that
                                the fees submitted are the actual fees.
                              </strong>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-5">
                        <strong className="text-dark">
                          iMagDent
                          Representative:_______________________________
                        </strong>
                      </td>
                      <td className="pt-5 text-right">
                        <strong className="text-dark">
                          Date:______________________________________
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Container>
            ) : (
              <Container>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr className="text-dark">
                      <td align="center" className="border-top-0">
                        <img
                          src={invoice_logo}
                          height="50"
                          className="imgdent-logo"
                        />
                        <br />
                        <h4> Invoice</h4>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ border: "1px solid #000000" }}>
                        <table width="100%" cellPadding={5}>
                          {this.state.caseDetails &&
                            this.state.caseDetails.invoices.length > 0 &&
                            this.state.caseDetails.invoices
                              .filter((obj) => obj.user_id !== null)
                              .map((ele, i) => (
                                <tr key={i}>
                                  <td className="text-dark">
                                    <strong> Invoice No: </strong>{" "}
                                    {ele.invoice_id}
                                  </td>
                                  {this.state.caseDetails.patient_checked_in !==
                                    null && (
                                    <td className="text-dark">
                                      <strong> Date of Services: </strong>
                                      {moment(
                                        this.state.caseDetails
                                          .patient_checked_in
                                      ).format("MM/DD/YYYY")}
                                    </td>
                                  )}
                                  <td className="text-dark">
                                    <strong> Invoice Total: </strong> $
                                    {ele.amount}
                                  </td>
                                </tr>
                              ))}
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-dark pt-3">
                        <h4>Bill To</h4>
                      </td>
                    </tr>
                    <tr>
                      <td colspan={2}>
                        <table
                          style={{ border: "1px solid #000000", width: "100%" }}
                          cellPadding={5}
                        >
                          <tr>
                            <td className="text-dark">
                              <strong>Doctor’s Name:</strong>{" "}
                              {common.getFullName(
                                this.state.caseDetails.user !== null
                                  ? this.state.caseDetails.user
                                  : "Please request"
                              )}
                              <br />
                              <strong>Address:</strong>{" "}
                              {this.blocation(this.state.caseDetails)}
                              {(this.state.caseDetails.user.npi != 0 ||
                                this.state.caseDetails.user.licence_no !=
                                  null) && (
                                <>
                                  <br />
                                  {this.state.caseDetails.user.npi != 0 && (
                                    <>
                                      <strong> NPI: </strong>{" "}
                                      {this.state.caseDetails.user.npi}
                                    </>
                                  )}
                                  {this.state.caseDetails.user.licence_no !=
                                    null && (
                                    <>
                                      <strong> Tax ID: </strong>{" "}
                                      {this.state.caseDetails.user.licence_no}
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="text-dark" valign="top">
                              <strong>Phone:</strong>{" "}
                              {this.state.caseDetails.user &&
                              this.state.caseDetails.user.phone !== null
                                ? this.state.caseDetails.user.phone
                                : "Please request"}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-dark pt-3">
                        <h4>Services Rendered By</h4>
                      </td>
                    </tr>
                    <tr>
                      <td colspan={2}>
                        <table
                          style={{ border: "1px solid #000000", width: "100%" }}
                          cellPadding={5}
                        >
                          <tr>
                            <td className="text-dark">
                              <strong>Location:</strong>{" "}
                              {this.state.caseDetails.location.publish_name}
                              <br />
                              <strong>Address:</strong>{" "}
                              {this.location(this.state.caseDetails.location)}
                              {(this.state.caseDetails.location.npi != 0 ||
                                this.state.caseDetails.location.ein) && (
                                <>
                                  <br />
                                  {this.state.caseDetails.location.npi != 0 && (
                                    <>
                                      <strong> NPI: </strong>{" "}
                                      {this.state.caseDetails.location.npi}
                                    </>
                                  )}
                                  {this.state.caseDetails.location.ein !=
                                    null && (
                                    <>
                                      <strong> Tax ID: </strong>{" "}
                                      {this.state.caseDetails.location.ein}
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="text-dark" valign="top">
                              <strong>Phone:</strong>{" "}
                              {this.state.caseDetails.location.WorkPhone !==
                              null
                                ? this.state.caseDetails.location.WorkPhone
                                : "Please request"}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                  <tr>
                    <td className="text-dark pt-3">
                      <h4>Patient Information</h4>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        width="100%"
                        style={{ border: "1px solid black" }}
                        cellPadding={5}
                      >
                        <tr>
                          <td className="text-dark">
                            <strong>Patient Name:</strong>{" "}
                            {common.getFullName(this.state.caseDetails.patient)}
                            <br />
                            <strong>Address:</strong>{" "}
                            {this.state.caseDetails.patient.Address1 !==
                            null ? (
                              <span
                                className="font-weight-normal"
                                style={{ width: "50%" }}
                              >
                                {this.state.caseDetails.patient.Address1}
                                <br />{" "}
                              </span>
                            ) : (
                              ""
                            )}
                            {this.state.caseDetails.patient &&
                              `${this.state.caseDetails.patient.City}`}
                            {this.state.caseDetails.patient.statedetails &&
                              `, ${this.state.caseDetails.patient.statedetails.state}`}
                            {this.state.caseDetails.patient &&
                              ` ${
                                this.state.caseDetails.patient.Zipcode !== null
                                  ? this.state.caseDetails.patient.Zipcode
                                  : ""
                              }`}
                          </td>
                          <td className="text-dark">
                            <strong>DOB: </strong>{" "}
                            {this.state.caseDetails.patient.BirthDate &&
                              common.customeFormat(
                                this.state.caseDetails.patient.BirthDate,
                                "MM dd, yyyy"
                              ) + " "}
                            <br />
                            <strong>Phone: </strong>{" "}
                            {this.state.caseDetails.patient.HomePhone !== null
                              ? this.state.caseDetails.patient.HomePhone
                              : "Please request"}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td className="pt-3">
                      <h4>Services Completed</h4>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        style={{ border: "1px solid #000000", width: "100%" }}
                        cellPadding={5}
                      >
                        <thead>
                          <tr style={{ border: "1px solid #000000" }}>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Procedure
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Medical code{" "}
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Dental Code
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Fee
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Adjustment
                            </th>
                            <th
                              className="text-dark"
                              style={{ border: "1px solid #000000" }}
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        {this.state.caseDetails.caseServices.length > 0 &&
                          this.state.caseDetails.caseServices.map(
                            (ele, index) =>
                              ele.who_will_pay == 0 && (
                                <tr key={index}>
                                  <td className="text-dark">
                                    {ele.service.name}
                                  </td>
                                  <td className="text-dark">
                                    {ele.service.cpt_code}
                                  </td>
                                  <td className="text-dark">
                                    {ele.service.ada_code}
                                  </td>
                                  <td className="text-dark">
                                    ${ele.service.price}
                                  </td>
                                  {ele.discount > 0 ? (
                                    <td
                                      style={{
                                        color: "red",
                                        textAlign: "left",
                                      }}
                                    >
                                      ${ele.discount}
                                    </td>
                                  ) : (
                                    <td className="text-dark">
                                      ${ele.discount}
                                    </td>
                                  )}
                                  <td className="text-dark">
                                    ${ele.sub_total}
                                  </td>
                                </tr>
                              )
                          )}
                        <tr>
                          <td colspan={5} className="text-right text-dark">
                            <strong>SubTotal: </strong>
                          </td>
                          <td className="text-dark">
                            <strong>
                              $
                              {parseInt(
                                (this.state.caseDetails &&
                                  this.state.caseDetails.doctor_balance) +
                                  (this.state.caseDetails &&
                                    this.state.caseDetails.doctor_discount)
                              ).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td colspan={5} className="text-right text-dark">
                            <strong>Total of Adjustments: </strong>
                          </td>
                          <td className="text-dark">
                            {this.state.caseDetails &&
                            this.state.caseDetails.doctor_discount > 0 ? (
                              <td className="text-danger">
                                <u className="font-weight-bold">
                                  $
                                  {this.state.caseDetails &&
                                    this.state.caseDetails.doctor_discount}
                                </u>
                              </td>
                            ) : (
                              <td>
                                <u className="font-weight-bold">
                                  $
                                  {this.state.caseDetails &&
                                    this.state.caseDetails.doctor_discount}
                                </u>
                              </td>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colspan={5} className="text-right text-dark">
                            <strong>Total Paid: </strong>
                          </td>
                          <td className="text-dark">
                            {" "}
                            <strong>
                              $
                              {parseInt(
                                this.state.caseDetails &&
                                  this.state.caseDetails.invoices
                                    .filter((obj) => obj.doctor_id !== null)
                                    .map((ele, index) =>
                                      this.paidAmountFun(
                                        ele.amount,
                                        ele.balance_amount
                                      )
                                    )
                              ).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td colspan={5} className="text-right text-dark">
                            <strong>Balance Remaining: </strong>
                          </td>
                          <td className="text-dark">
                            {" "}
                            <strong>
                              $
                              {parseInt(
                                this.state.caseDetails &&
                                  this.state.caseDetails.invoices
                                    .filter((obj) => obj.doctor_id !== null)
                                    .map((ele, index) =>
                                      parseFloat(ele.balance_amount)
                                    )
                              ).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </Container>
            )}
          </ModalBody>
        </div>
        <ModalFooter>
          <ReactToPrint
            copyStyles={true}
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

export default PrintInvoiceModal;
