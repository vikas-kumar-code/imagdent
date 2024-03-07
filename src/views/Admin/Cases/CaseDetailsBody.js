import React, { Component } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error403 from "../../Error403";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import {
  Col,
  Row,
  Label,
  FormGroup,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Spinner,
  Modal,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import classnames from "classnames";
import common from "../../../services/common";
import ccase from "../../../services/case";
import Documents from "./Documents";
import LoadingOverlay from "react-loading-overlay";
import AddEditDocument from "./AddEditDocument";
import Charges from "./Charges";
import Partner from "./Partner";
import AddNote from "./AddNote";
import Activities from "./Activities";
import ManageStatus from "./ManageStatus";
import Compose from "../Messages/Compose";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Reschedule from "./Reschedule";
import ErrorBox from "../../ErrorBox";
import { ErrorBoundary } from "react-error-boundary";
import moment from "moment";
import PatientDetailsBody from "../Patients/PatientDetailsBody";
import UserDetailsBody from "../Users/UserDetailsBody"
import { connect } from "react-redux";
import AddNoteModal from "./AddNoteModal";
import Badge from "reactstrap/lib/Badge";
import Document from "./Documents";
const htmlString = [
  "<p>",
  "<br>",
  "<br/>",
  "</p>",
  "<b>",
  "</b>",
  "<strong>",
  "</strong>",
  "<pre>",
  "</pre>",
  "<i>",
  "</i>"
];

class CaseDetailsBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: { logs: [] },
      error_403: false,
      partnerLoader: false,
      caseLoader: true,
      chargeLoader: false,
      noteLoader: false,
      activeTab: "1",
      services: [],
      diagnosis_codes: [],
      documents: [],
      locations: [],
      imageSource: "",
      files: [],
      documentTypes: common.getDocumentTypes()[1],
      fileTypes: common.getDocumentTypes()[2],
      roles: [],
      clinics: [],
      notes: [],
      submitted: false,
      enableDeleteButton: true,
      userId: "",
      cserviceId: "",
      caseId: "",
      showModal: false,
      showPatientModal: false,
      showDoctorModal: false,
      doctor: [],
      invoices: [],
      cancelSubmitted: false,
      openAddNoteModal: false,
    };
  }

  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  componentDidMount() {
    if (this.props.caseId) {
      this.getCase(this.props.caseId);
    }
  }
  getCase = (id) => {
    try {
      ccase.getCaseDetails({ id: id }).then((response) => {
        this.setState({ caseLoader: false });
        if (response.data.success) {
          let fields = response.data.case;
          let invoices = response.data.case.invoices;
          let documents = response.data.case.documents.filter(
            (doc) => doc.case_file === "0"
          );
          let files = response.data.case.documents.filter(
            (doc) => doc.case_file === "1"
          );
          fields["invoices"] = response.data.case.invoices;
          let notes = response.data.case.notes;
          if (fields["diagnosis_codes"] !== null) {
            common
              .getSelectedDiagnosisCodes({ codes: fields["diagnosis_codes"] })
              .then((response) => {
                console.log(response);
                let diagnosis_codes = response.data.diagnosis_codes;
                this.setState({ diagnosis_codes });
              });
          }
          this.setState({
            fields,
            documents,
            files,
            notes,
            invoices,
            userId: response.data.case.user_id,
          });
          //this.changeButton(this.state.fields["status"]);
          this.getBill(this.state.fields["caseServices"]);
        } else if (response.data.error) {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.history.push("/admin/cases")
        } else {
          throw new Error("Something went wrong");
        }
      });
    } catch (e) {
      console.log("Error - ", e);
    }
  };
  getServices = (id) => {
    this.setState({ chargeLoader: true });
    common
      .getSelectedServices({ case_id: id })
      .then((response) => {
        let fields = this.state.fields;
        if (response.data.success) {
          fields["caseServices"] = response.data.services;
          this.getBill(fields["caseServices"]);
          this.setState({ fields, chargeLoader: false });
          this.getLogs();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getBill = (cservices) => {
    let fields = this.state.fields;

    fields["doctor_pay_list"] = cservices.filter(
      (service) => service.who_will_pay == 0
    );
    let doctor_bill =
      fields["doctor_pay_list"].length > 0 &&
      fields["doctor_pay_list"].map((s) => s.sub_total);
    fields["doctor_total_bill"] =
      doctor_bill && common.calculatePrice(doctor_bill);

    fields["patient_pay_list"] = cservices.filter(
      (service) => service.who_will_pay == 1
    );
    let patient_bill =
      fields["patient_pay_list"].length > 0 &&
      fields["patient_pay_list"].map((s) => s.sub_total);
    fields["patient_total_bill"] =
      patient_bill && common.calculatePrice(patient_bill);

    this.setState({ fields });
  };
  getPayments = (id) => {
    this.setState({ chargeLoader: true });
    ccase
      .getPayments({ case_id: id })
      .then((response) => {
        let fields = this.state.fields;
        let invoices = this.state.invoices;
        if (response.data.success) {
          fields["invoices"] = response.data.payments;
          invoices = response.data.payments;
          this.setState({ fields, invoices, chargeLoader: false });
          this.getLogs();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getTeam = (id) => {
    this.setState({ partnerLoader: true });
    common.getTreatmentTeam({ case_id: id }).then((response) => {
      let fields = this.state.fields;
      if (response.data.success) {
        fields["team"] = response.data.team;
        this.setState((state) => {
          return { fields: state.fields, partnerLoader: false };
        });
        this.getLogs();
      }
    });
  };
  getNotes = () => {
    this.setState({ noteLoader: true });
    ccase
      .getNotes({ case_id: this.props.caseId })
      .then((response) => {
        if (response.data.success) {
          let notes = response.data.notes;
          this.setState({ notes, noteLoader: false });
          this.getLogs();
        } else if (response.data.error) {
          this.setState({ notes: [], noteLoader: false });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getLogs = () => {
    //this.setState({ activityLoader: true });
    ccase
      .getLogs({ case_id: this.props.caseId })
      .then((response) => {
        let fields = this.state.fields;
        if (response.data.success) {
          fields["logs"] = response.data.logs;
          this.setState({ fields });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  addDocument = (file) => {
    if (file.case_file === "0") {
      let documents = [...this.state.documents, file];
      this.setState({ documents });
    } else if (file.case_file === "1") {
      let files = [...this.state.files, file];
      this.setState({ files });
    }
  };

  removeDocument = (file_name, case_file) => {
    if (case_file === "0") {
      let documents = this.state.documents.filter(
        (document) => document.document_name !== file_name
      );
      this.setState({ documents });
    } else if (case_file === "1") {
      let files = this.state.files.filter(
        (document) => document.document_name !== file_name
      );
      this.setState({ files });
      this.getLogs();
    }
  };
  handleSubmit = (e, case_file) => {
    e.preventDefault();
    this.setState({ submitted: true });

    let params = {
      documents: case_file === "0" ? this.state.documents : this.state.files,
      caseId: this.props.caseId,
      case_file: case_file,
    };
    let that = this;
    ccase
      .addDocuments(params)
      .then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.getLogs();
            this.getCase(this.props.caseId);
          } else if (response.data.error) {
            if (response.data.message) {
              this.setState({ errors: response.data.message });
            }
          }
        });
      })
      .catch(function (error) {
        that.setState({ submitted: false });
      });
  };
  toggleModal = (user) => {
    let doctor = this.state.doctor;
    doctor[0] = user !== undefined ? { label: user.email, value: user.id } : [];
    this.setState(
      (prevState) => ({
        showModal: !prevState.showModal,
        doctor,
      }),
      () => {
        if (!this.state.showModal) {
          this.getLogs();
        }
      }
    );
  };
  toggleDoctorModal = (id) => {
    console.log(id);
    let doctorId = id !== undefined ? id : "";
    this.setState((prevState) => ({
      doctorId,
      showDoctorModal: !prevState.showDoctorModal,
    }));
  };

  togglePatientModal = (id) => {
    let patientId = id !== undefined ? id : "";
    this.setState((prevState) => ({
      patientId,
      showPatientModal: !prevState.showPatientModal,
    }));
  };

  skipFunc = () => {
    confirmAlert({
      message: "Do you want to skip ?",
      buttons: [
        {
          label: "Uploaded",
          onClick: () => {
            let fields = this.state.fields;
            fields["skip"] = "N";
            this.changeStatus();
          },
        },
        {
          label: "Skip",
          className: "btn-danger btn",
          onClick: () => {
            let fields = this.state.fields;
            fields["skip"] = "Y";
            this.changeStatus();
          },
        },
      ],
    });
  };

  skipReadyForRadiologist = () => {
    confirmAlert({
      message: "Do you want to skip ?",
      buttons: [
        {
          label: "Ready",
          onClick: () => {
            let fields = this.state.fields;
            fields["skip"] = "N";
            this.changeStatus();
          },
        },
        {
          label: "Skip",
          className: "btn-danger btn",
          onClick: () => {
            let fields = this.state.fields;
            fields["skip"] = "Y";
            this.changeStatus();
          },
        },
      ],
    });
  }

  skipCaptured = () => {
    confirmAlert({
      message: "Do you want to skip ?",
      buttons: [
        {
          label: "Captured",
          onClick: () => {
            let fields = this.state.fields;
            fields["skip"] = "N";
            this.changeStatus();
          },
        },
        {
          label: "Skip",
          className: "btn-danger btn",
          onClick: () => {
            let fields = this.state.fields;
            fields["skip"] = "Y";
            this.changeStatus();
          },
        },
      ],
    });
  }

  changeStatus = (e) => {
    this.setState({ submitted: true });
    let params = { fields: this.state.fields };
    ccase.changeStatus(params).then((response) => {
      this.setState({ submitted: false }, () => {
        if (response.data.success) {
          this.getLogs();
          if (parseInt(response.data.status) === 1) {
            this.setActiveTab("2");
          }
          if (parseInt(response.data.status) === 4) {
            this.setActiveTab("3");
          }
          if (parseInt(response.data.status) === 2) {
            this.setActiveTab("5");
          }
          if (parseInt(response.data.status) === 5) {
            this.setActiveTab("3");
          }
          if (parseInt(response.data.status) === 3) {
            this.getPayments(this.props.caseId);
          }
          let fields = this.state.fields;
          fields["status"] = response.data.status;
          fields["skip"] = null;
          this.setState({ fields });
        } else if (response.data.error) {
          confirmAlert({
            message: response.data.message,
            buttons: [
              {
                label: "Ok",
              },
              {
                label: "Skip",
                className: "btn-danger btn",
                onClick: () => {
                  let fields = this.state.fields;
                  fields["skip"] = "Y";
                  this.changeStatus();
                },
              },
            ],
          });
        }
      });
    });
  };
  toggleRescheduleModal = (e) => {
    this.setState((prevState) => ({
      showRescheduleModal: !prevState.showRescheduleModal,
    }));
  };

  cancelAppointment = (e) => {
    confirmAlert({
      message: "Are you sure to cancel this appointment?",
      buttons: [
        {
          label: "Yes",
          className: "btn-success btn",
          onClick: () => {
            this.setState({ cancelSubmitted: true });
            let fields = this.state.fields;
            const params = {
              case_id: this.state.fields["id"],
            };
            ccase.cancelAppointment(params).then((response) => {
              this.setState({ cancelSubmitted: false }, () => {
                if (response.data.success) {
                  fields["status"] = response.data.status;
                  toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                  this.getLogs();
                  if (this.props.toggle) {
                    this.props.toggle();
                  }
                } else if (response.data.error) {
                  toast.error(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
                this.setState({ submitted: false, fields });
              });
            });
          },
        },
        {
          label: "No",
          className: "btn-danger btn",
        },
      ],
    });
  };
  errorHandler(error, errorInfo) {
    console.log("ErrorBoundry - ", error, errorInfo);
  }

  saveDocument = (file) => {
    console.log(file);
    let documents = [...this.state.documents, file];
    this.setState({ submitted: true, documents });
    let params = {
      documents:
        file.case_file === "0"
          ? [...this.state.documents, file]
          : [...this.state.files, file],
      caseId: this.props.caseId,
      case_file: file.case_file,
    };
    let that = this;
    ccase
      .addDocuments(params)
      .then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.getLogs();
            this.getCase(this.props.caseId);
          } else if (response.data.error) {
            if (response.data.message) {
              this.setState({ errors: response.data.message });
            }
          }
        });
      })
      .catch(function (error) {
        that.setState({ submitted: false });
      });
  };

  toggleAddNoteModal = () => {
    this.setState({ openAddNoteModal: !this.state.openAddNoteModal });
  };

  render() {
    const { fields } = this.state;
    console.log(this.state.fields);
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <ErrorBoundary FallbackComponent={ErrorBox} onError={this.errorHandler}>
        <Row>
          <Col xl={12}>
            <Card className="mb-0">
              <CardHeader>
                <Row>
                  <Col md={5} sm={12}>
                    <h3 style={{ fontSize: 20 }}>Case Details </h3>
                    {parseInt(this.state.fields["status"]) === 8 && (
                      <Badge className="caseStatus-8 text-white ml-1">
                        Case Completed
                      </Badge>
                    )}
                  </Col>
                  {this.props.enableEditCase && (
                    <Col md={7} sm={12} className="text-right">
                      <Row className="d-flex justify-content-end">

                        {this.props.enableBackCase ? (
                          <Col sm={12} md={4}>
                            <Button
                              onClick={() => this.props.enableBackCase()}
                              className="btn btn-danger m-1 btn-block"
                            >
                              Close
                            </Button>
                          </Col>
                        ) : (
                          <Col sm={12} md={4}>
                            <Link to={`/admin/cases`} className="btn btn-danger m-1 btn-block">
                              <FontAwesomeIcon icon="undo" className="mr-2" />
                              Back
                            </Link>
                          </Col>
                        )}

                        {parseInt(this.state.fields["status"]) === 0 &&
                          (parseInt(this.props.userType) === 1 ||
                            parseInt(this.props.userType) === 15) && (
                            <Col sm={12} md={4}>
                              <Link
                                to={`/admin/cases/edit/${fields["id"]}`}
                                className="btn btn-primary m-1 btn-block"
                              >
                                Edit Case
                              </Link>
                            </Col>
                          )}
                        {parseInt(this.state.fields["status"]) !== 9 && (
                          <ManageStatus
                            caseDetails={this.state.fields}
                            changeStatus={this.changeStatus}
                            submitted={this.state.submitted}
                            skipFunc={this.skipFunc}
                            skipReadyForRadiologist={this.skipReadyForRadiologist}
                            skipCaptured={this.skipCaptured}
                            toggleAddNoteModal={this.toggleAddNoteModal}

                          />
                        )}

                      </Row>
                    </Col>

                  )}
                </Row>
              </CardHeader>
              <CardBody>
                <LoadingOverlay
                  active={this.state.caseLoader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  <Row>
                    <Col md={3}>
                      <h4 style={{ color: "#787878" }}>Basic Details</h4>
                      <hr />
                      <FormGroup>
                        <Label className="mr-2">
                          <strong>Patient :-</strong>
                        </Label>
                        {fields["patient"] !== undefined && (
                          <a
                            onClick={() =>
                              this.togglePatientModal(fields["patient"].id)
                            }
                            style={{ cursor: "pointer" }}
                            className="text-primary"
                          >
                            {common.getFullName(fields["patient"])}
                          </a>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label className="mr-2">
                          <strong>Doctor :-</strong>
                        </Label>
                        {fields["user"] !== undefined && (
                          <a
                            onClick={() =>
                              this.toggleDoctorModal(fields["user"].id)
                            }
                            style={{ cursor: "pointer" }}
                            className="text-primary"
                          >
                            {common.getFullName(fields["user"])}
                          </a>
                        )}
                      </FormGroup>
                      {fields["appointment_date"] !== undefined &&
                        fields["appointment_date"] !== null && (
                          <FormGroup>
                            <Label className="mr-2">
                              <strong>Appointment Date :-</strong>
                            </Label>
                            <br />
                            {moment(fields["appointment_date"]).format(
                              "dddd, MMMM Do, YYYY"
                            )}
                          </FormGroup>
                        )}

                      <FormGroup>
                        <Label className="mr-2">
                          <strong>Appointment Time :-</strong>
                        </Label>
                        <br />
                        {this.state.fields["slot"] !== undefined &&
                          this.state.fields["slot"] !== null
                          ? `${moment(
                            this.state.fields["slot"].from_time,
                            "hh:mm"
                          ).format("hh:mm A")} - ${moment(
                            this.state.fields["slot"].to_time,
                            "hh:mm"
                          ).format("hh:mm A")}`
                          : "Callback arranged"}
                        {(parseInt(this.state.fields["status"]) < 1 ||
                          parseInt(this.state.fields["status"]) > 8) && (
                            <React.Fragment>
                              <br />
                              <Button
                                color="primary"
                                className="btn-sm mr-2"
                                onClick={this.toggleRescheduleModal}
                              >
                                Re-schedule
                              </Button>
                            </React.Fragment>
                          )}
                        {parseInt(this.state.fields["status"]) < 1 && (
                          <React.Fragment>
                            <Button
                              color="danger"
                              className="btn-sm"
                              onClick={this.cancelAppointment}
                              disabled={this.state.cancelSubmitted}
                            >
                              {this.state.cancelSubmitted && (
                                <FontAwesomeIcon
                                  icon="spinner"
                                  className="mr-1"
                                  spin={true}
                                />
                              )}
                              Cancel Appointment
                            </Button>
                          </React.Fragment>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <Label className="mr-2">
                          <strong>Clinic :-</strong>
                        </Label>
                        {fields["clinic"] !== undefined &&
                          `${fields["clinic"].name}`}
                      </FormGroup>
                      <FormGroup>
                        <Label className="mr-2">
                          <strong>Imaging Center :-</strong>
                        </Label>
                        {fields["location"] !== undefined &&
                          fields["location"].publish_name}
                      </FormGroup>
                    </Col>
                    <Col md={9}>
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: this.state.activeTab === "1",
                            })}
                            onClick={() => this.setActiveTab("1")}
                            style={{ fontSize: "0.875em" }}
                          >
                            Case Information
                          </NavLink>
                        </NavItem>{" "}
                        {parseInt(fields["status"]) < 9 && (
                          <>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "2",
                                })}
                                onClick={() => this.setActiveTab("2")}
                                style={{ fontSize: "0.88em" }}
                              >
                                Case Documents
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "3",
                                })}
                                onClick={() => this.setActiveTab("3")}
                                style={{ fontSize: "0.875em" }}
                              >
                                Case Files
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "4",
                                })}
                                onClick={() => this.setActiveTab("4")}
                                style={{ fontSize: "0.875em" }}
                              >
                                Case Partners
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "5",
                                })}
                                onClick={() => this.setActiveTab("5")}
                                style={{ fontSize: "0.875em" }}
                              >
                                Case Charges
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "6",
                                })}
                                onClick={() => this.setActiveTab("6")}
                                style={{ fontSize: "0.875em" }}
                              >
                                Case Notes
                              </NavLink>
                            </NavItem>
                          </>
                        )}
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: this.state.activeTab === "7",
                            })}
                            onClick={() => this.setActiveTab("7")}
                            style={{ fontSize: "0.875em" }}
                          >
                            Case Activities
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={this.state.activeTab} className="mb-3">
                        <TabPane tabId="1">
                          <Row>
                            <Col xl={12}>
                              <Table>
                                <tbody>
                                  <tr>
                                    <td className="border-top-0">
                                      <strong>Case ID</strong>
                                    </td>
                                    <td className="border-top-0">
                                      {fields["c_id"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Doctor</strong>
                                    </td>
                                    <td>
                                      {fields["user"] !== undefined && (
                                        <a
                                          onClick={() =>
                                            this.toggleModal(fields["user"])
                                          }
                                          style={{ cursor: "pointer" }}
                                          className="text-primary"
                                        >
                                          {common.getFullName(fields["user"])}
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Case Partners</strong>
                                    </td>
                                    <td>
                                      {fields["team"] !== undefined &&
                                        fields["team"].map((t, i) => {
                                          return (
                                            <a
                                              onClick={() =>
                                                this.toggleModal(t.user)
                                              }
                                              style={{ cursor: "pointer" }}
                                              className="text-primary"
                                              key={t.id}
                                            >
                                              {common.getFullName(t.user).trim()}
                                              {i != fields["team"].length - 1 &&
                                                ", "}
                                            </a>
                                          );
                                        })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Procedures</strong>
                                    </td>
                                    <td>
                                      {fields["caseServices"] !== undefined &&
                                        fields["caseServices"]
                                          .map(
                                            (s) =>
                                              s.service !== null && s.service.name
                                          )
                                          .join(", ")}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Diagnostic Codes</strong>
                                    </td>
                                    <td>
                                      {fields["diagnosis_codes"] !== undefined &&
                                        this.state.diagnosis_codes
                                          .map((code) => code.name)
                                          .join(", ")}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Areas of Interest</strong>
                                    </td>
                                    <td>
                                      {fields["teeth"] !== undefined &&
                                        fields["teeth"] !== null &&
                                        fields["teeth"]
                                          .split(",")
                                          .map((v, i) => (
                                            <img
                                              key={i}
                                              src={`/assets/teeth/selected/${v}.jpg`}
                                            />
                                          ))}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Referral Form Notes</strong>
                                    </td>
                                    <td>
                                      {fields["referral_note"] ? fields["referral_note"] : "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Procedural Notes</strong>
                                    </td>
                                    <td>
                                      <ul className="px-1">
                                        {fields["caseServices"] !== undefined &&
                                          fields["caseServices"].map(
                                            (s) =>
                                              s.note !== null &&
                                              s.note !== "" && <li>{s.note}</li>
                                          )}
                                      </ul>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Col>
                          </Row>
                        </TabPane>

                        <TabPane tabId="2">
                          <Row>
                            <Col xl={12}>
                              <Documents
                                documents={this.state.documents}
                                documentTypes={this.state.documentTypes}
                                enableDelete={this.state.enableDeleteButton}
                                removeDocument={this.removeDocument}
                                title="Uploaded Documents"
                              />
                              <Col xl={12} className="px-0">
                                <AddEditDocument
                                  addDocument={this.addDocument}
                                  caseId={this.props.caseId}
                                  documentTypes={this.state.documentTypes}
                                  caseFile="0"
                                />
                              </Col>

                              {/* {this.state.documents.length > 0 && (
                            <Button
                              color="success"
                              className="float-right"
                              disabled={this.state.submitted}
                              onClick={(e) => this.handleSubmit(e, "0")}
                            >
                              {this.state.submitted && (
                                <FontAwesomeIcon
                                  icon="spinner"
                                  className="mr-1"
                                  spin={true}
                                />
                              )}{" "}
                              Save
                            </Button>
                          )} */}
                            </Col>
                          </Row>
                        </TabPane>

                        <TabPane tabId="3">
                          <Row>
                            <Col xl={12}>
                              <Documents
                                documents={this.state.files}
                                documentTypes={this.state.fileTypes}
                                enableDelete={this.state.enableDeleteButton}
                                removeDocument={this.removeDocument}
                                title="Uploaded Files"
                              />
                              <Col xl={12} className="px-0">
                                <AddEditDocument
                                  addDocument={this.addDocument}
                                  caseId={this.props.caseId}
                                  documentTypes={this.state.fileTypes}
                                  caseFile="1"
                                  callBack={this.saveDocument}
                                />
                              </Col>

                              {/* {this.state.files.length > 0 && (
                            <Button
                              color="success"
                              className="float-right"
                              disabled={this.state.submitted}
                              onClick={(e) => this.handleSubmit(e, "1")}
                            >
                              {this.state.submitted && (
                                <FontAwesomeIcon
                                  icon="spinner"
                                  className="mr-1"
                                  spin={true}
                                />
                              )}
                              Save
                            </Button>
                          )} */}
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="4">
                          <Partner
                            team={fields["team"]}
                            getTeam={this.getTeam}
                            caseId={this.props.caseId}
                            loader={this.state.partnerLoader}
                            toggleModal={this.toggleModal}
                            getCase={this.getCase}
                          />
                        </TabPane>
                        <TabPane tabId="5">
                          <Charges
                            fields={this.state.fields}
                            caseId={this.props.caseId}
                            userId={this.state.userId}
                            invoices={this.state.invoices}
                            getServices={this.getServices}
                            getPayments={this.getPayments}
                            userType={this.props.userType}
                            chargeLoader={this.state.chargeLoader}
                            apiUrl={this.props.apiUrl}
                          />
                        </TabPane>
                        <TabPane tabId="6">
                          <AddNote
                            caseId={this.props.caseId}
                            notes={this.state.notes}
                            noteLoader={this.state.noteLoader}
                            getNotes={this.getNotes}
                          />
                        </TabPane>
                        <TabPane tabId="7">
                          <Activities logs={fields["logs"]} />
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </LoadingOverlay>
                {this.props.enableEditCase && (
                  <Row>
                    <Col xl={12} className="text-right">
                      {this.props.enableBackCase ? (
                        <Button
                          onClick={() => this.props.enableBackCase()}
                          className="btn btn-danger"
                        >
                          Close
                        </Button>
                      ) : (
                        <Link to={`/admin/cases`} className="btn btn-danger">
                          <FontAwesomeIcon icon="undo" className="mr-2" />
                          Back
                        </Link>
                      )}
                      {parseInt(this.state.fields["status"]) === 0 &&
                        (parseInt(this.props.userType) === 1 ||
                          parseInt(this.props.userType) === 15) && (
                          <Link
                            to={`/admin/cases/edit/${fields["id"]}`}
                            className="btn btn-primary ml-1"
                          >
                            Edit Case
                          </Link>
                        )}
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showModal && (
          <Compose
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            recipients={this.state.doctor}
            caseId={this.props.caseId}
          />
        )}
        {this.state.showRescheduleModal && (
          <Reschedule
            showModal={this.state.showRescheduleModal}
            toggleModal={this.toggleRescheduleModal}
            caseId={this.props.caseId}
            getCase={this.getCase}
          />
        )}
        {this.state.showPatientModal && (
          <Modal isOpen={this.state.showPatientModal} size="lg">
            <ModalBody className="p-0">
              <PatientDetailsBody
                id={this.state.patientId}
                enableEditPatient={false}
              />
            </ModalBody>
            <ModalFooter className="border-top-0 pt-0">
              <Button
                color="danger"
                className="btn-sm"
                onClick={this.togglePatientModal}
              >
                Close
              </Button>
              <Link
                to={`/admin/patients/edit/${this.state.patientId}`}
                color="primary"
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>
            </ModalFooter>
          </Modal>
        )}
        {this.state.showDoctorModal && (
          <Modal isOpen={this.state.showDoctorModal} size="lg">
            <ModalBody className="p-0">
              <UserDetailsBody
                id={this.state.doctorId}
                enableEditDoctor={false}
              />
            </ModalBody>
            <ModalFooter className="border-top-0 pt-0">
              <Button
                color="danger"
                className="btn-sm"
                onClick={this.toggleDoctorModal}
              >
                Close
              </Button>
              <Link
                to={`/admin/users/edit/${this.state.doctorId}`}
                color="primary"
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>
            </ModalFooter>
          </Modal>
        )}
        {this.state.openAddNoteModal && (
          <AddNoteModal
            showModal={this.state.openAddNoteModal}
            toggleModal={this.toggleAddNoteModal}
            caseId={this.props.caseId}
            getCase={this.getCase}
            changeStatus={this.changeStatus}
          />
        )}
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiUrl: state.apiUrl,
    userType: state.userType,
  };
};
export default withRouter(connect(mapStateToProps)(CaseDetailsBody));
//export default CaseDetailsBody;
