import React, { Component } from "react";
import appointment_logo from "../../../assets/images/front-logo.png";
import { Button } from "reactstrap";
import ReactToPrint from "react-to-print";
import ccase from "../../../services/case";
import LoadingOverlay from "react-loading-overlay";
import Spinner from "reactstrap/lib/Spinner";
import common from "../../../services/common";
import moment from "moment";
import { Link } from "react-router-dom";

class CaseSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
    };
  }

  componentDidMount = () => {
    this.setState({ loader: true });
    window.scrollTo(0, 0)
    if (this.props.match.params.id) {
      let params = {
        id: this.props.match.params.id,
      };
      ccase.getCaseDetails(params).then((response) => {
        console.log(response);
        if (response.data.success) {
          this.setState({ loader: false, fields: response.data.case });
        }
      });
    }
  };

  render() {
    const { fields, errors } = this.state;
    return (
      <div>
        <div className="d-flex justify-content-end print_buttons">
          <Link to="/admin/cases" className="btn btn-danger mr-3">
            Close
          </Link>
          <ReactToPrint
            trigger={() => <Button color="primary">Print Confirmation</Button>}
            content={() => this.componentRef}
            onAfterPrint={() => this.props.history.push("/admin/cases")}
          />
        </div>
        <div className="container letter">
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          />
          <div
            className="d-flex flex-column align-items-center"
            ref={(el) => (this.componentRef = el)}
          >
            <img
              src={appointment_logo}
              alt="appointment logo"
              className="img-fluid"
              style={{ height: 120, objectFit: "contain", marginTop: "130px" }}
            />
            {fields.clinic && (
              <>
                <div
                  className="d-flex flex-column align-items-center box"
                  style={{ fontFamily: "Roboto" }}
                >
                  <center>
                    <p style={{ fontFamily: "Roboto", fontWeight: "400" }}>
                      {fields.location.street_address && (
                        <p>{fields.location.street_address + ", "}</p>
                      )}
                      {fields.location.city && fields.location.city + ", "}
                      {fields.location.state.state &&
                        fields.location.state.state + " "}
                      {fields.location.Zipcode && fields.location.Zipcode}
                    </p>
                    {fields.location.WorkPhone && (
                      <p className="mt-2">Phone: {fields.location.WorkPhone}</p>
                    )}
                  </center>
                </div>
              </>
            )}
            <center>
              <h1
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "37px",
                  fontFamily: "Roboto",
                }}
              >
                Appointment Confirmation
              </h1>
              {!fields.appointment_date && !fields.appointment_date ? (
                <h3
                  style={{
                    fontFamily: "Roboto",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Our iMagDent team will contact you soon.
                </h3>
              ) : (
                ""
              )}
            </center>
            <div className="flex-column box font-design">
              <div className="d-flex">
                <h2>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "37px",
                      fontFamily: "Roboto",
                    }}
                  >
                    {" "}
                    Patient:{" "}
                  </span>
                  <span style={{ fontFamily: "Roboto", fontWeight: "400" }}>
                    {fields.patient && fields.patient.first_name}{" "}
                    {fields.patient && fields.patient.last_name}
                  </span>
                </h2>
              </div>

              <div className="d-flex">
                <h2>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "37px",
                      fontFamily: "Roboto",
                    }}
                  >
                    {" "}
                    For:{" "}
                  </span>{" "}
                  <span style={{ fontFamily: "Roboto", fontWeight: "400" }}>
                    {fields.user &&
                      common.getFullName(fields.user)
                    }
                  </span>
                </h2>
              </div>
              {fields.appointment_date && (
                <div className="d-flex">
                  <h2>
                    {" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "37px",
                        fontFamily: "Roboto",
                      }}
                    >
                      Date and Time of visit:{" "}
                    </span>
                    <span style={{ fontFamily: "Roboto", fontWeight: "400" }}>
                      {fields.appointment_date &&
                        moment(fields.appointment_date).format(
                          "MMMM DD, YYYY"
                        ) + ", "}
                      {fields["slot"] &&
                        `${moment(fields["slot"].from_time, "hh:mm").format(
                          "hh:mm A"
                        )}`
                        //   -
                        // ${moment(fields["slot"].to_time, "hh:mm").format(
                        //   "hh:mm A"
                        // )}
                      }
                    </span>
                  </h2>
                </div>
              )}

              <div>
                <h2>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "37px",
                      fontFamily: "Roboto",
                    }}
                  >
                    Procedures:
                  </span>

                  {fields.caseServices &&
                    fields.caseServices.length > 0 &&
                    fields.caseServices.map((ele, index) => {
                      if (ele.service) {
                        return (
                          <h2
                            style={{ fontFamily: "Roboto", fontWeight: "400" }}
                          >
                            {ele.service.name}
                            {index < fields.caseServices.length - 1 && ", "}
                          </h2>
                        );
                      }
                    })}
                </h2>
              </div>

              {fields.referral_note && fields.referral_note.length > 0 &&
                <div className="mt-2 d-flex">
                  <h2 className="">
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "37px",
                        fontFamily: "Roboto",
                      }}
                    >
                      Notes:{" "}
                    </span>
                    <span  style={{ fontFamily: "Roboto", fontWeight: "400" }}>
                    {fields.referral_note}
                    </span>
                  </h2>
                </div>


              }
              <h2>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "37px",
                    fontFamily: "Roboto",
                  }}
                >
                  {" "}
                  Patient Total: ${" "}
                  {common.numberFormat(parseInt(fields.patient_balance) && parseInt(fields.patient_balance).toFixed(2))}
                </span>
              </h2>

              <h2
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  marginTop: "70px",
                }}
              >
                Please give 24 hours notice for any changes to your reserved
                appointment. Should you have any questions, please do not
                hesitate to contact us.
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CaseSummary;
