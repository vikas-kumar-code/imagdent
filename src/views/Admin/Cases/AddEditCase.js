import React, { Component } from "react";
import common from "../../../services/common";
import ccase from "../../../services/case";
import { connect } from "react-redux";
import { updateSearchPatientData } from "../../../store/actions";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Spinner,
  Table,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Collapse,
  Badge,
  Navbar,
  NavbarBrand,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import SearchPatient from "../Patients/SearchPatient";
import DatePicker from "react-datepicker";
import Slot from "../TimeSlots/Slot";
import PatientDetailsBody from "../Patients/PatientDetailsBody";
import Teeth from "../Patients/Teeth";
import moment from "moment";
import AddServiceNote from "./AddServiceNote";

class AddEditCase extends Component {
  constructor(props) {
    super(props);
    this.searchTimeOut = 0;
    this.state = {
      fields: {
        diagnosis_codes: [],
        services: [],
        selectedServices: [],
        appointment: { disableDate: false, chooseSlot: true },
        priceForLocation: [],
        selectedTeeth: [],
        arrange_callback: 0,
        appointment_date: new Date(Date.now()),
        appointment_date_selected: new Date(Date.now()),
      },
      errors: {},
      step: 1,
      currentStep: 0,
      locations: [],
      users: [],
      clinics: [],
      services: [],
      diagonisCodes: [],
      availableSlots: [],
      slotLoader: false,
      submitted: false,
      showModal: false,
      showServiceNoteModal: false,
      dropdownPlaceholder: "Select",
      selectedService: null,
    };
  }
  getUsers = () => {
    common.getUsers().then((response) => {
      if (response.data.success) {
        let users = [];
        let fields = this.state.fields;
        response.data.users.forEach((user, index) => {
          users[index] = {
            label: common.getFullName(user),
            value: user.id,
            email: user.email,
          };
        });
        if (response.data.users.length > 0) {
          // fields["user_id"] = {
          //   label: common.getFullName(response.data.users[0]),
          //   value: response.data.users[0].id,
          //   email: response.data.users[0].email,
          // };
          common
            .getClinicsByDoc({
              //user: response.data.users[0].id,
              user: this.props.userId,
            })
            .then((response) => {
              if (response.data.success) {
                let clinics = [];
                response.data.clinics.forEach((clinic, index) => {
                  clinics[index] = { label: clinic.name, value: clinic.id };
                });
                this.setState({ clinics });
              }
              // fields["clinic_id"] = {
              //   label: response.data.clinics[0].name,
              //   value: response.data.clinics[0].id,
              // };
            });
        }
        this.setState({
          users,
          fields,
          dropdownPlaceholder: users.length > 0 ? "Select" : "Record not found",
        });
      } else {
        if (response.data.error) {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.history.push("/admin/dashboard");
        }
      }
    });
  };

  getAvailableSlots = () => {
    common
      .getAvailableSlots({
        date: this.state.fields.appointment_date,
        location_id: this.state.fields["location_id"].value,
      })
      .then((response) => {
        if (response.data.success) {
          let data = response.data.availableSlots;
          for (let i in data) {
            let newSlots = [];
            for (let sl in data[i].slots) {
              if (
                data[i].blockedSlots[sl] !== undefined &&
                data[i].blockedSlots[sl].id === data[i].slots[sl].id
              ) {
              } else {
                newSlots.push(data[i].slots[sl]);
              }
            }
            data[i].slots = newSlots;
          }
          this.setState({
            availableSlots: response.data.availableSlots,
          });
        }
        this.setState({
          slotLoader: false,
        });
      });
  };
  componentDidMount = () => {
    this.setState({ slotLoader: true });
    common.getLocations().then((response) => {
      this.setState({ dropdownPlaceholder: "Loading..." });
      let fields = this.state.fields;
      if (response.data.success) {
        let locations = [];
        response.data.locations.forEach((location, index) => {
          locations[index] = {
            label: location.publish_name,
            value: location.id,
          };
          if (parseInt(location.id) === parseInt(this.props.defaultLocation)) {
            fields["location_id"] = {
              label: location.publish_name,
              value: location.id,
            };
          }
        });

        this.setState(
          { locations, fields, dropdownPlaceholder: "Select" },
          () => {
            let location = this.state.fields["location_id"].value;
            this.getAvailableSlots();
            common.getServices({ location }).then((response) => {
              if (response.data.success) {
                this.setState({ services: response.data.services });
              }
            });
            if (!common.imd_roles.includes(parseInt(this.props.userType))) {
              this.getUsers();
            }
          }
        );
      }
    });

    common.getDiagnosisCodes().then((response) => {
      let diagonisCodes = [];
      if (response.data.success) {
        response.data.codes.forEach((code, index) => {
          diagonisCodes[index] = {
            label: code.name,
            value: code.id,
          };
        });
        this.setState({
          diagonisCodes,
        });
      }
    });
    if (this.props.match.params.id) {
      let params = {
        id: this.props.match.params.id,
      };
      ccase.getCaseDetails(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            console.log(response.data.case.total_price);
            let fields = {};
            fields["id"] = response.data.case.id;
            fields["location_id"] = {
              label: response.data.case.location.publish_name,
              value: response.data.case.location.id,
            };
            fields["user_id"] = {
              label: common.getFullName(response.data.case.user),
              value: response.data.case.user.id,
              email: response.data.case.user.email,
            };
            fields["clinic_id"] = {
              label: response.data.case.clinic.name,
              value: response.data.case.clinic.id,
            };
            fields["patient_id"] = {
              label: common.getFullName(response.data.case.patient),
              value: response.data.case.patient.id,
              email: response.data.case.patient.email,
              HomePhone: response.data.case.patient.HomePhone,
              WorkPhone: response.data.case.patient.WorkPhone,
            };
            fields["selectedServices"] = [];
            if (response.data.case.caseServices.length > 0) {
              response.data.case.caseServices.forEach((service, index) => {
                fields["selectedServices"][index] = {
                  id: service.service_id,
                  case_id: service.case_id,
                  name: service.service.name,
                  price: service.price,
                  discount: service.discount,
                  sub_total: service.sub_total,
                  who_will_pay: service.who_will_pay,
                  note: service.note,
                };
              });
            }
            fields["diagnosis_codes"] = [];
            if (response.data.case.diagnosis_codes !== null) {
              response.data.case.diagnosis_codes
                .split(",")
                .forEach((id, index) => {
                  this.state.diagonisCodes.forEach((dc) => {
                    if (parseInt(id) === parseInt(dc.value)) {
                      fields["diagnosis_codes"][index] = dc;
                    }
                  });
                });
            }
            fields["selectedTeeth"] = [];
            if (response.data.case.teeth !== null) {
              fields["selectedTeeth"] = response.data.case.teeth.split(",");
            }
            fields["arrange_callback"] = parseInt(
              response.data.case.arrange_callback
            );
            if (fields["arrange_callback"] == 0) {
              fields["appointment"] = { disableDate: false, chooseSlot: true };
            } else if (fields["arrange_callback"] == 1) {
              fields["appointment"] = { disableDate: true, chooseSlot: false };
            }
            if (response.data.case.appointment_date !== null) {
              fields["appointment_date"] = new Date(
                moment(response.data.case.appointment_date)
              );
              this.setState({ slotLoader: true });
              this.getAvailableSlots();
            }
            fields["slot_id"] = response.data.case.slot_id;
            fields["total_price"] = response.data.case.total_price;
            fields["slot"] =
              response.data.case.slot !== null &&
              `${moment(response.data.case.slot.from_time, "hh:mm").format(
                "hh:mm A"
              )}
            ${" - "}${moment(response.data.case.slot.to_time, "hh:mm").format(
                "hh:mm A"
              )}`;
            fields["referral_note"] =
              response.data.case && response.data.case.referral_note
                ? response.data.case.referral_note
                : "";
            this.setState({ fields, oldFields: fields }, () => {
              this.setTotalPrice();
            });
          } else if (response.data.error) {
          }
        });
      });
    }
  };
  arrangeCallback = (e) => {
    let oldFields = { ...this.state.oldFields };
    let fields = { ...this.state.fields };
    if (e.target.checked) {
      fields["arrange_callback"] = 1;
      fields["appointment"] = { disableDate: true, chooseSlot: false };
      fields["appointment_date"] = "";
      fields["slot_id"] = "";
    } else {
      fields["appointment"] = { disableDate: false, chooseSlot: true };
      fields["arrange_callback"] = 0;
      fields["appointment_date"] = oldFields["appointment_date"];
      fields["slot_id"] = oldFields["slot_id"];
    }
    this.setState({ fields });
  };
  renderButtons = (step) => {
    return (
      <React.Fragment>
        {step > 1 && (
          <button
            type="button"
            className="btn btn-outline-secondary grey-btn mr-lg-2 mb-2 mt-lg-2 mt-2 mr-2"
            onClick={this.navigateStep}
            disabled={this.state.submitted}
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="btn btn-danger post-comment crate-group-next"
          disabled={this.state.submitted}
        >
          {this.state.submitted && (
            <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
          )}
          {step === 7 ? "Finish" : "Next"}
        </button>
      </React.Fragment>
    );
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let frm = e.target.attributes.name.value;
    if (this.handleValidation(frm)) {
      this.setState({ submitted: true });
      let fields =
        this.state.fields && JSON.parse(JSON.stringify(this.state.fields));
      if (fields["appointment_date"] !== "") {
        fields["appointment_date"] = moment(fields["appointment_date"]).format(
          "YYYY-MM-DD"
        );
      }
      const params = {
        fields: fields,
      };
      ccase.add(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.history.push(
              `/admin/cases/print-confirmation/${response.data.caseId}`
            );
            this.props.updateSearchPatientData({
              searchPatientData: {
                searchFields: {},
                searchResult: [],
              },
            });
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message) {
              errors["name"] = response.data.message;
              toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
            this.setState({ errors: errors, submitted: false });
          }
        });
      });
    }
  };
  setCurrentStep = (step) => {
    if (this.state.currentStep < this.state.step) {
      this.setState({ currentStep: step - 1 });
    }
  };
  handleValidation = (frm) => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (frm === "step-1") {
      if (!fields["location_id"] || fields["location_id"].value === "") {
        formIsValid = false;
        errors["location_id"] = "Please choose location.";
      }
      if (formIsValid) {
        formIsValid = false;
        this.setState({ errors: errors, step: 2 });
        this.setCurrentStep(2);
      } else {
        formIsValid = false;
        this.setState({ errors: errors });
      }
    } else if (frm === "step-2") {
      if (!fields["clinic_id"] || fields["clinic_id"].value === "") {
        formIsValid = false;
        errors["clinic_id"] = "Please choose clinic.";
      }
      if (!fields["user_id"] || fields["user_id"].value === "") {
        formIsValid = false;
        errors["user_id"] = "Please choose any doctor.";
      }
      if (formIsValid) {
        formIsValid = false;
        this.setState({ errors: errors, step: 3 });
        this.setCurrentStep(3);
      } else {
        formIsValid = false;
        this.setState({ errors: errors });
      }
    } else if (frm === "step-4") {
      if (fields["selectedServices"].length === 0) {
        formIsValid = false;
        errors["services"] = "Please choose at least one service.";
      }
      if (formIsValid) {
        formIsValid = false;
        this.setState({ errors: errors, step: 5 });
        this.setCurrentStep(5);
      } else {
        formIsValid = false;
        this.setState({ errors: errors });
      }
    } else if (frm === "step-5") {
      /*if (
        !fields["diagnosis_codes"] ||
        fields["diagnosis_codes"].length === 0
      ) {
        formIsValid = false;
        errors["diagnosis_codes"] = "Please choose diagnosis code.";
      }*/
      // if (fields["selectedServices"].length > 0) {
      //   fields["selectedServices"].find((o, i) => {
      //     if (o.id === "77") {
      //       if (!fields["notes"] || fields["notes"].value === "") {
      //         formIsValid = false;
      //         errors["notes"] = "This is a required field.";
      //       }
      //     }
      //     if (o.id === "91") {
      //       if (!fields["notes"] || fields["notes"].value === "") {
      //         formIsValid = false;
      //         errors["notes"] =
      //           "Please provide an analysis type you would like.";
      //       }
      //     }
      //   });
      // }
      // if (!fields["selectedTeeth"] || fields["selectedTeeth"].length === 0) {
      //   formIsValid = false;
      //   errors["selectedTeeth"] = "Please choose teeth from the above image.";
      // }
      if (formIsValid) {
        formIsValid = false;
        this.setState({ errors: errors, step: 6 });
        this.setCurrentStep(6);
      } else {
        formIsValid = false;
        this.setState({ errors: errors });
      }
    } else if (frm === "step-6") {
      if (!fields["appointment"].disableDate && !fields["appointment_date"]) {
        formIsValid = false;
        errors["appointment_date"] = "Please choose appointment date.";
      }
      if (
        !fields["appointment"].disableDate &&
        fields["appointment_date"] &&
        !fields["slot_id"]
      ) {
        formIsValid = false;
        errors["slot_id"] = "Please select slot.";
      }
      if (formIsValid) {
        formIsValid = false;
        this.setState({ errors: errors, step: 7 });
        this.setCurrentStep(7);
      } else {
        formIsValid = false;
        this.setState({ errors: errors });
      }
    }
    return formIsValid;
  };

  navigateStep = (e) => {
    let innerHTML = e.target.innerHTML;
    this.setState((prevState) => {
      if (innerHTML === "Next") {
        if (this.state.step === 4) {
          this.setTotalPrice();
        }
        return { step: prevState.step + 1 };
      } else {
        return { step: prevState.step - 1 };
      }
    });
  };

  handleLocationChange = (location) => {
    let fields = this.state.fields;
    fields["location_id"] = location;
    this.setState({ fields }, () => {
      let location = null;
      if (this.state.fields["location_id"] !== null) {
        location = this.state.fields["location_id"].value;
        this.getAvailableSlots();
      }
      common.getServices({ location }).then((response) => {
        if (response.data.success) {
          this.setState({ services: response.data.services });
        }
      });
    });
    if (this.props.match.params.id) {
      this.handlePriceOnLocChange();
    }
  };

  handleUserChange = (user) => {
    let fields = this.state.fields;
    fields["user_id"] = user;
    this.setState({ fields });
  };

  handleAsyncUserChange = (user) => {
    let fields = this.state.fields;
    fields["user_id"] = user;
    this.setState({ fields }, () => {
      if (user !== null) {
        common.getClinicsByDoc({ user: user.value }).then((response) => {
          if (response.data.success) {
            let clinics = [];
            response.data.clinics.forEach((clinic, index) => {
              clinics[index] = { label: clinic.name, value: clinic.id };
            });
            this.setState({ clinics, fields });
            if (
              this.state.fields["clinic_id"] != null ||
              this.state.fields["clinic_id"] != undefined
            ) {
              let data = response.data.clinics.find(
                (ele) => ele.id == this.state.fields["clinic_id"].value
              );
              if (data == undefined || data == null) {
                let fields = this.state.fields;
                fields["clinic_id"] = null;
                this.setState({ fields });
              }
            }
          }
        });
      }
    });
  };

  handleClinicChange = (clinic) => {
    let fields = this.state.fields;
    fields["clinic_id"] = clinic;
    this.setState({ fields }, () => {
      common
        .getAssociatedUsers({ clinic_id: clinic.value })
        .then((response) => {
          if (response.data.success) {
            let users = [];
            response.data.users.forEach((user, index) => {
              users[index] = {
                label: common.getFullName(user),
                value: user.id,
                email: user.email,
              };
            });
            this.setState({ users });
          }
        });
    });
  };

  handleAsyncClinicChange = (clinic) => {
    let fields = this.state.fields;
    fields["clinic_id"] = clinic;
    this.setState({ fields }, () => {
      if (clinic !== null) {
        this.setState({ dropdownPlaceholder: "Loading..." });
        common.getUserByClinic({ clinic: clinic.value }).then((response) => {
          if (response.data.success) {
            let users = [];
            response.data.users.forEach((user, index) => {
              users[index] = {
                label: common.getFullName(user),
                value: user.id,
                email: user.email,
              };
            });
            this.setState({
              users,
              fields,
              dropdownPlaceholder:
                users.length > 0 ? "Select" : "Record not found",
            });
            if (
              this.state.fields["user_id"] != null ||
              this.state.fields["user_id"] != undefined
            ) {
              let data = response.data.users.find(
                (ele) => ele.id == this.state.fields["user_id"].value
              );
              if (data == undefined || data == null) {
                let fields = this.state.fields;
                fields["user_id"] = null;
                this.setState({ fields });
              }
            }
          }
        });
      }
    });
  };

  choosePatient = (patient) => {
    let fields = this.state.fields;
    fields["patient_id"] = {
      label: common.getFullName(patient),
      value: patient.id,
      email: patient.email,
      HomePhone: patient.HomePhone,
      WorkPhone: patient.WorkPhone,
    };
    this.setState({ fields }, () => {
      this.setState((prevState) => {
        return { step: prevState.step + 1 };
      });
    });
    this.handlePriceOnLocChange();
  };

  handlePriceOnLocChange = () => {
    let fields = this.state.fields;
    let selectedServices = fields["selectedServices"].map(
      (service) => service.id
    );
    this.state.services.map((parent) =>
      parent.child
        .filter((child) => selectedServices.includes(child.id))
        .map((c) =>
          fields["selectedServices"]
            .filter((s) => parseInt(c.id) === parseInt(s.id))
            .map((p) => {
              let price = this.getLocationPrice(c).price;
              p.price = price;
              p.discount =
                p.discount !== "0.00" && price > p.discount
                  ? common.numberFormat(p.discount)
                  : "0.00";
              p.sub_total =
                p.discount !== "0.00" && price > p.discount
                  ? price - p.discount
                  : price;
              p.location_id = this.getLocationPrice(c).location_id;
            })
        )
    );
    this.setState({ fields });
    this.setTotalPrice();
  };

  setTotalPrice = () => {
    let fields = this.state.fields;

    let doctor_total_bill = [];
    let patient_total_bill = [];

    fields["selectedServices"].map((v) => {
      if (v.who_will_pay == 0) {
        doctor_total_bill.push(v.sub_total);
      } else if (v.who_will_pay == 1) {
        patient_total_bill.push(v.sub_total);
      }
    });

    fields["doctor_total_bill"] = common.calculatePrice(doctor_total_bill);

    fields["patient_total_bill"] = common.calculatePrice(patient_total_bill);

    fields["totalPrice"] = common.calculatePrice(
      fields["selectedServices"].map((v) => v.price)
    );
    fields["total_price"] = common.calculatePrice(
      fields["selectedServices"].map((v) => v.sub_total)
    );

    this.setState({ fields });
  };

  handleServiceChange = (e, c) => {
    let fields = this.state.fields;
    if (e.target.checked) {
      fields["selectedServices"].push({
        id: c.id,
        name: c.name,
        price: this.getLocationPrice(c).price,
        discount: "0.00",
        sub_total: this.getLocationPrice(c).price,
        location_id: this.getLocationPrice(c).location_id,
        who_will_pay: "1",
        note: "",
      });
    } else {
      let service_to_be_removed = fields["selectedServices"]
        .map((s) => s.id)
        .indexOf(e.target.value);
      fields["selectedServices"].splice(service_to_be_removed, 1);
    }
    this.setTotalPrice();
    this.setState({
      fields,
      showServiceNoteModal: e.target.checked && c.note_required == "1",
      selectedService: c,
    });
  };

  updateNoteInSelectedService = (selectedServices) => {
    let fields = this.state.fields;
    fields.selectedServices = selectedServices;
    this.setState({ fields });
  };

  EditNoteModal = (e, c) => {
    let fields = this.state.fields;
    this.setState({
      fields,
      showServiceNoteModal: true,
      selectedService: c,
    });
  };

  getLocationPrice = (service) => {
    let fields = this.state.fields;
    let loc = {};
    if (fields["location_id"]) {
      loc = service.locations
        .split(",")
        .filter(
          (v) =>
            parseInt(v.location_id) === parseInt(fields["location_id"].value)
        );
    }
    return loc.length > 0 &&
      fields["location_id"] !== null &&
      loc[0].price !== null
      ? { price: loc[0].price, location_id: fields["location_id"].value }
      : { price: service.price, location_id: 0 };
  };

  handleDiagnosisCodeChange = (e) => {
    let fields = this.state.fields;
    if (e.target.checked) {
      fields["diagnosis_codes"].push(e.target.value);
      this.setState({ fields });
    } else {
      let index_to_be_removed = fields["diagnosis_codes"].indexOf(
        e.target.value
      );
      fields["diagnosis_codes"].splice(index_to_be_removed, 1);
      this.setState({ fields });
    }
  };

  handleDate = (date) => {
    let fields = this.state.fields;
    let errors = this.state.errors;
    if (!fields["location_id"]) {
      errors["location_id"] = "Please choose location.";
      fields["appointment_date"] = "";
      this.setState({ errors });
    } else {
      fields["slot_id"] = "";
      fields["appointment_date"] = date;
      this.setState({ fields, slotLoader: true }, () => {
        this.getAvailableSlots();
      });
    }
  };

  chooseSlot = (id, appointmentDate) => {
    let fields = this.state.fields;
    fields["slot_id"] = id;
    fields["appointment_date"] = new Date(moment(appointmentDate));
    fields["slot"] = common.getSelectedSlot(
      this.state.availableSlots,
      fields["appointment_date"],
      id
    );
    this.setState({ fields }, () => {
      console.log(fields);
    });
  };

  checkSelectedData = (id, data) => {
    let checkData = this.state.fields["selectedServices"].filter(
      (v) => parseInt(v.id) === parseInt(id)
    );
    if (checkData.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  handleView = (patient) => {
    console.log(patient["patient_id"]);
    return (
      <span
        data-id={patient["patient_id"].value}
        onClick={this.toggleModal}
        style={{ cursor: "pointer", color: "#20a8d8" }}
      >
        {patient["patient_id"].label}
      </span>
    );
  };

  toggleModal = (e) => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    if (e.target.type === "radio") {
      if (e.target.checked) {
        fields["selectedServices"]
          .filter((v) => parseInt(v.id) === parseInt(e.target.name))
          .map((v) => (v.who_will_pay = e.target.value));
      }
      this.setTotalPrice();
    } else {
      fields[e.target.name] = e.target.value;
    }
    this.setState({ fields });
  };

  handleMultiChange = (field, option) => {
    let fields = this.state.fields;
    fields[field] = option;
    this.setState({ fields });
  };

  updateSelectedTeeth = (selectedTeeth) => {
    let fields = this.state.fields;
    fields["selectedTeeth"] = selectedTeeth;
    this.setState({ fields });
  };

  navigateTab = (e, t) => {
    if (e.target.parentElement.className.includes("hoverPointer")) {
      this.setState({ step: t });
    }
  };

  promiseClinicOptions = (inputValue) => {
    if (this.searchTimeOut > 0) {
      clearTimeout(this.searchTimeOut);
    }
    return new Promise((resolve) => {
      if (inputValue !== "") {
        this.searchTimeOut = setTimeout(() => {
          common.getClinicsByDoc({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let clinics = [];
              response.data.clinics.forEach((clinic, index) => {
                clinics[index] = { label: clinic.name, value: clinic.id };
              });
              this.setState({ clinics }, () => {
                resolve(this.filterClinic(inputValue));
              });
            }
          });
        }, 500);
      } else {
        resolve(this.filterClinic(inputValue));
      }
    });
  };

  filterClinic = (inputValue) => {
    return this.state.clinics.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  promiseUserOptions = (inputValue) => {
    if (this.searchTimeOut > 0) {
      clearTimeout(this.searchTimeOut);
    }
    return new Promise((resolve) => {
      if (inputValue !== "") {
        this.searchTimeOut = setTimeout(() => {
          common.getUsers({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let users = [];
              response.data.users.forEach((user, index) => {
                users[index] = {
                  label: common.getFullName(user),
                  value: user.id,
                  email: user.email,
                };
              });
              this.setState(
                {
                  users,
                  // fields,
                  dropdownPlaceholder:
                    users.length > 0 ? "Select" : "Record not found",
                },
                () => {
                  resolve(this.filterUser(inputValue));
                }
              );
            }
          });
        }, 500);
      } else {
        resolve(this.filterUser(inputValue));
      }
    });
  };

  filterUser = (inputValue) => {
    return this.state.users.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  componentWillUnmount = () => {
    this.props.updateSearchPatientData({
      searchPatientData: {
        searchFields: {},
        searchResult: [],
      },
    });
  };

  render() {
    const { fields, errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Row form>
          <Col md={12}>
            <div className="step-form mb-3">
              <ul className="step d-flex flex-nowrap">
                <li
                  onClick={(e) => this.navigateTab(e, 1)}
                  className={`${
                    this.state.step === 1 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 0 && "hoverPointer"}`}
                >
                  <span />
                </li>
                <li
                  onClick={(e) => this.navigateTab(e, 2)}
                  className={`${
                    this.state.step === 2 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 1 && "hoverPointer"}`}
                >
                  <span />
                </li>
                <li
                  onClick={(e) => this.navigateTab(e, 3)}
                  className={`${
                    this.state.step === 3 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 2 && "hoverPointer"}`}
                >
                  <span />
                </li>
                <li
                  onClick={(e) => this.navigateTab(e, 4)}
                  className={`${
                    this.state.step === 4 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 3 && "hoverPointer"}`}
                >
                  <span />
                </li>
                <li
                  onClick={(e) => this.navigateTab(e, 5)}
                  className={`${
                    this.state.step === 5 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 4 && "hoverPointer"}`}
                >
                  <span />
                </li>
                <li
                  onClick={(e) => this.navigateTab(e, 6)}
                  className={`${
                    this.state.step === 6 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 5 && "hoverPointer"}`}
                >
                  <span />
                </li>
                <li
                  onClick={(e) => this.navigateTab(e, 7)}
                  className={`${
                    this.state.step === 7 ? "step-item active" : "step-item"
                  } ${this.state.currentStep > 6 && "hoverPointer"}`}
                >
                  <span />
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        {this.state.step === 1 && (
          <Form name="step-1" method="post" onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Col md={4}>
                <Label for="location_id">Choose Location</Label>
                <Select
                  name="location_id"
                  value={
                    this.state.fields["location_id"] &&
                    this.state.fields["location_id"]
                  }
                  options={this.state.locations}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.handleLocationChange}
                  isClearable={true}
                  placeholder={this.state.dropdownPlaceholder}
                />
                {this.state.errors["location_id"] && (
                  <small className="fa-1x text-danger">
                    {this.state.errors["location_id"]}
                  </small>
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={12} className="text-right">
                {this.renderButtons(1)}
              </Col>
            </FormGroup>
          </Form>
        )}
        {this.state.step === 2 && (
          <Form name="step-2" method="post" onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Col md={6}>
                <Label for="user_id">Choose Doctor</Label>
                {common.imd_roles.includes(parseInt(this.props.userType)) ? (
                  <AsyncSelect
                    cacheOptions
                    name="user_id"
                    value={
                      this.state.fields["user_id"] &&
                      this.state.fields["user_id"]
                    }
                    defaultOptions={this.state.users ? this.state.users : []}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    loadOptions={this.promiseUserOptions}
                    onChange={this.handleAsyncUserChange}
                    isClearable={true}
                    placeholder={this.state.dropdownPlaceholder}
                  />
                ) : (
                  <Select
                    name="user_id"
                    placeholder={this.state.dropdownPlaceholder}
                    value={
                      this.state.fields["user_id"] &&
                      this.state.fields["user_id"]
                    }
                    options={this.state.users ? this.state.users : []}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleUserChange}
                  />
                )}
                {this.state.errors["user_id"] && (
                  <small className="fa-1x text-danger">
                    {this.state.errors["user_id"]}
                  </small>
                )}
              </Col>
              <Col md={6}>
                <Label for="clinic_id">Choose Clinic</Label>
                {common.imd_roles.includes(parseInt(this.props.userType)) ? (
                  <AsyncSelect
                    cacheOptions
                    name="clinic_id"
                    value={
                      this.state.fields["clinic_id"] &&
                      this.state.fields["clinic_id"]
                    }
                    defaultOptions={
                      this.state.clinics ? this.state.clinics : []
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    loadOptions={this.promiseClinicOptions}
                    onChange={this.handleAsyncClinicChange}
                    isClearable={true}
                    placeholder={this.state.dropdownPlaceholder}
                  />
                ) : (
                  <Select
                    name="clinic_id"
                    placeholder={this.state.dropdownPlaceholder}
                    value={
                      this.state.fields["clinic_id"] &&
                      this.state.fields["clinic_id"]
                    }
                    options={this.state.clinics ? this.state.clinics : []}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleClinicChange}
                  />
                )}
                {this.state.errors["clinic_id"] && (
                  <small className="fa-1x text-danger">
                    {this.state.errors["clinic_id"]}
                  </small>
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={12} className="text-right">
                {this.renderButtons(2)}
              </Col>
            </FormGroup>
          </Form>
        )}
        {this.state.step === 3 && (
          <React.Fragment>
            {this.props.match.params.id ? (
              <PatientDetailsBody
                id={this.state.fields["patient_id"].value}
                enableEditPatient={false}
              />
            ) : (
              <SearchPatient
                enableSelection={true}
                enablePatientDetail={false}
                choosePatient={this.choosePatient}
                getAll={true}
              />
            )}
            <FormGroup row>
              {this.props.match.params.id ? (
                <Col md={12} className="text-right">
                  <button
                    type="button"
                    className="btn btn-outline-secondary grey-btn mt-2"
                    onClick={this.navigateStep}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger grey-btn mt-2 ml-2"
                    onClick={this.navigateStep}
                  >
                    Next
                  </button>
                </Col>
              ) : (
                <Col md={12} className="text-right">
                  <button
                    type="button"
                    className="btn btn-outline-secondary grey-btn mt-2"
                    onClick={this.navigateStep}
                  >
                    Back
                  </button>
                </Col>
              )}
            </FormGroup>
          </React.Fragment>
        )}
        {this.state.step === 4 && (
          <Form name="step-4" method="post" onSubmit={this.handleSubmit}>
            <Card>
              <CardHeader style={{ fontSize: 25 }}>Choose Services</CardHeader>
              <CardBody>
                <Row>
                  <Col md={6}>
                    <Row>
                      {this.state.services.map((service, index) => (
                        <Col md={6} key={index}>
                          <h5>{service.name}</h5>
                          {service.child.map((c, ci) => (
                            <FormGroup check key={ci}>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  value={`${c.id}`}
                                  checked={this.checkSelectedData(c.id)}
                                  onChange={(e) =>
                                    this.handleServiceChange(e, c)
                                  }
                                />
                                {c.name}
                              </Label>
                            </FormGroup>
                          ))}
                        </Col>
                      ))}
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CardHeader style={{ fontSize: 20 }}>
                        Selected Services
                      </CardHeader>
                      {fields["selectedServices"].length > 0 ? (
                        <CardBody className="pt-0">
                          <Row>
                            <Col md={12}>
                              <Table responsive className="bt-0">
                                <thead>
                                  <tr>
                                    <th className="border-top-0">Name</th>
                                    <th className="border-top-0" colSpan="2">
                                      Who will pay?
                                    </th>
                                    <th className="border-top-0" />
                                    <th className="border-top-0" />
                                  </tr>
                                </thead>
                                <tbody>
                                  {fields["selectedServices"].map((s, i) => (
                                    <>
                                      <tr key={i}>
                                        <td>{s.name}</td>
                                        <td>
                                          <FormGroup check inline>
                                            <Label check>
                                              <input
                                                type="radio"
                                                name={`${s.id}`}
                                                value="0"
                                                checked={
                                                  s.who_will_pay === "0"
                                                    ? true
                                                    : false
                                                }
                                                onChange={this.handleChange}
                                              />{" "}
                                              Doctor
                                            </Label>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup check inline>
                                            <Label check>
                                              <input
                                                type="radio"
                                                name={`${s.id}`}
                                                value="1"
                                                checked={
                                                  s.who_will_pay === "1"
                                                    ? true
                                                    : false
                                                }
                                                onChange={this.handleChange}
                                              />{" "}
                                              Patient
                                            </Label>
                                          </FormGroup>
                                        </td>
                                        <td>{`$${s.price}`}</td>
                                        <td></td>
                                      </tr>
                                      {s.note && (
                                        <tr className="text-primary">
                                          <td
                                            colSpan="5"
                                            className="pt-0"
                                            style={{ fontSize: "14px" }}
                                          >
                                            <strong>Note: </strong> {s.note}
                                            {"    "}
                                            <FontAwesomeIcon
                                              icon="edit"
                                              style={{ cursor: "pointer" }}
                                              onClick={(e) =>
                                                this.EditNoteModal(e, s)
                                              }
                                            />
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  ))}
                                  {this.state.errors["services"] && (
                                    <tr>
                                      <td colSpan="2">
                                        <small className="fa-1x text-danger">
                                          {this.state.errors["services"]}
                                        </small>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                            </Col>
                            <Col md={3} />
                          </Row>
                        </CardBody>
                      ) : (
                        <CardBody
                          className="pt-0"
                          style={{ height: "150px" }}
                        ></CardBody>
                      )}
                      <CardFooter className="text-right">
                        Total:-{" "}
                        <span className="display-4">
                          <small>$</small>
                          {this.state.fields["totalPrice"]
                            ? common.numberFormat(
                                this.state.fields["totalPrice"]
                              )
                            : "0.00"}
                        </span>
                      </CardFooter>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="text-right">
                {this.renderButtons(4)}
              </CardFooter>
            </Card>
          </Form>
        )}
        {this.state.step === 5 && (
          <Form name="step-5" method="post" onSubmit={this.handleSubmit}>
            <Row>
              <Col md={12}>
                <Label>
                  {" "}
                  Choose Diagnosis Code (For Insurance Reimbursement)
                </Label>
                <FormGroup>
                  <Select
                    name="diagnosis_codes"
                    placeholder={<div>Select Diagnosis Code...</div>}
                    value={
                      fields["diagnosis_codes"] ? fields["diagnosis_codes"] : []
                    }
                    options={this.state.diagonisCodes}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isMulti
                    onChange={(option) =>
                      this.handleMultiChange("diagnosis_codes", option)
                    }
                  />
                  {errors["diagnosis_codes"] && (
                    <small className="fa-1x text-danger">
                      {errors["diagnosis_codes"]}
                    </small>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Label>Choose Area Of Interest</Label>
              </Col>
            </Row>
            <Row form>
              <Col
                md={12}
                className="d-flex justify-content-center"
                style={{ height: 200 }}
              >
                <Teeth
                  updateSelectedTeeth={this.updateSelectedTeeth}
                  selectedTeeth={fields["selectedTeeth"]}
                />
              </Col>
              {errors["selectedTeeth"] && (
                <Col md={12}>
                  <small className="fa-1x text-danger">
                    {errors["selectedTeeth"]}
                  </small>
                </Col>
              )}
            </Row>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="referral_note">Note</Label>
                  <Input
                    type="textarea"
                    name="referral_note"
                    id="referral_note"
                    value={
                      fields["referral_note"] ? fields["referral_note"] : ""
                    }
                    onChange={this.handleChange}
                    invalid={errors["referral_note"] ? true : false}
                    className="input-bg"
                    bsSize="lg"
                    rows={3}
                  />
                  {errors["referral_note"] && (
                    <small className="fa-1x text-danger">
                      {errors["referral_note"]}
                    </small>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="text-right">
                {this.renderButtons(5)}
              </Col>
            </Row>
          </Form>
        )}
        {this.state.step === 6 && (
          <Form name="step-6" method="post" onSubmit={this.handleSubmit}>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="appointment_date">Choose Appointment Date</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <FontAwesomeIcon
                          icon="calendar"
                          className="custom_size"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <DatePicker
                      filterDate={(e) => {
                        const d = moment.utc(e);
                        const day = d.isoWeekday();
                        return day !== 6 && day !== 7;
                      }}
                      className="form-control form-control-lg"
                      style={{ width: 100 + "%", float: "left" }}
                      selected={
                        this.state.fields["appointment_date"]
                          ? this.state.fields["appointment_date"]
                          : ""
                      }
                      onChange={this.handleDate}
                      dateFormat="MM-dd-yyyy"
                      timeFormat="HH:mm"
                      minDate={new Date(moment())}
                      id="appointment_date"
                      disabled={fields["appointment"].disableDate}
                    />
                  </InputGroup>

                  {errors["appointment_date"] && (
                    <small className="fa-1x text-danger">
                      {errors["appointment_date"]}
                    </small>
                  )}
                </FormGroup>
              </Col>
              <Col md={1} className="cases-edit-marking">
                <strong>Or</strong>
              </Col>
              <Col md={4} className="text-nowrap cases-edit-marking">
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.arrangeCallback}
                      checked={
                        this.state.fields["arrange_callback"] === 1
                          ? true
                          : false
                      }
                    />
                    <strong> Arrange call back</strong>
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            <Collapse isOpen={this.state.fields["appointment"].chooseSlot}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="slot">Choose Slot</Label>
                  </FormGroup>
                </Col>
                <Col md={6} className="text-right">
                  <Badge color="success" className="ml-2 p-1 shadow-badge">
                    Available
                  </Badge>
                  <Badge color="gray" className="ml-2 p-1 shadow-badge">
                    Already booked
                  </Badge>
                  <Badge color="dark" className="ml-2 p-1 shadow-badge">
                    Selected
                  </Badge>
                </Col>
                {errors["slot_id"] && (
                  <Col md={12} className="text-right text-danger">
                    {errors["slot_id"]}
                  </Col>
                )}
                <Col md={12}>
                  <LoadingOverlay
                    active={this.state.slotLoader}
                    spinner={<Spinner color="dark" />}
                    fadeSpeed={200}
                    classNamePrefix="mitiz"
                  >
                    {this.state.availableSlots.map((slot, index) => (
                      <React.Fragment key={`slot-key-${index}`}>
                        <Navbar
                          color="warning"
                          light
                          expand="md"
                          className="mb-2"
                        >
                          <NavbarBrand
                            style={{
                              fontSize: "20px",
                              color: "#444",
                              fontWeight: "600",
                            }}
                          >
                            {moment
                              .utc(slot.appointment_date)
                              .format("dddd, MMMM Do, YYYY")}
                          </NavbarBrand>
                        </Navbar>
                        <Row>
                          {slot.slots.length > 0 ? (
                            slot.slots.map((s, index) => (
                              <Slot
                                key={`slot-index-${index}`}
                                slot={s}
                                enableEdit={false}
                                chooseSlot={this.chooseSlot}
                                selectedSlot={this.state.fields["slot_id"]}
                                appointmentDate={slot.appointment_date}
                                bookedSlots={slot.bookedSlots}
                                enableSelection={true}
                              />
                            ))
                          ) : (
                            <Col
                              md={12}
                              className="text-center mb-2"
                              style={{ color: "red" }}
                            >
                              Slot not available.
                            </Col>
                          )}
                        </Row>
                      </React.Fragment>
                    ))}
                  </LoadingOverlay>
                </Col>
              </Row>
            </Collapse>
            <Row>
              <Col md={12} className="text-right">
                {this.renderButtons(6)}
              </Col>
            </Row>
          </Form>
        )}
        {this.state.step === 7 && (
          <Form name="step-7" method="post" onSubmit={this.handleSubmit}>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader style={{ fontSize: 25 }}>
                    Confirm Details
                  </CardHeader>
                  <CardBody>
                    <Table>
                      <tbody>
                        <tr>
                          <th scope="row">Clinic</th>
                          <td>{fields["clinic_id"].label}</td>
                        </tr>
                        <tr>
                          <th scope="row">Location</th>
                          <td>{fields["location_id"].label}</td>
                        </tr>
                        <tr>
                          <th scope="row">Doctor Name</th>
                          <td>
                            <a href={`mailto:${fields["user_id"].email}`}>
                              {fields["user_id"].label}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Patient Name</th>
                          <td>{this.handleView(fields)}</td>
                        </tr>
                        {fields.appointment_date ? (
                          <React.Fragment>
                            <tr>
                              <th scope="row">Appointment Date</th>

                              <td>
                                {moment(fields.appointment_date).format(
                                  "dddd, MMMM D, YYYY"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">TimeSlot</th>
                              <td>{fields["slot"]}</td>
                            </tr>
                          </React.Fragment>
                        ) : (
                          <tr>
                            <th scope="row">Arrange Callback</th>
                            <td>Yes</td>
                          </tr>
                        )}
                        <tr>
                          <th scope="row">Diagnosis Codes</th>
                          <td>
                            {fields["diagnosis_codes"] &&
                            fields["diagnosis_codes"].length > 0
                              ? fields["diagnosis_codes"]
                                  .map((code) => code.label)
                                  .join(", ")
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Selected Teeth</th>
                          <td>
                            {fields["selectedTeeth"].map((v, i) => (
                              <img
                                key={i}
                                src={`/assets/teeth/selected/${v}.jpg`}
                              />
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Note</th>
                          <td>
                            {fields["referral_note"]
                              ? fields["referral_note"]
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            <Card>
                              <CardHeader>
                                <strong>Selected Services</strong>
                              </CardHeader>
                              <CardBody>
                                <Table className="responsive">
                                  <thead>
                                    <tr>
                                      <th className="border-top-0" />
                                      <th className="border-top-0">Name</th>
                                      <th className="border-top-0">
                                        Who will pay?
                                      </th>
                                      <th className="border-top-0">Price</th>
                                      <th className="border-top-0">Discount</th>
                                      <th className="border-top-0">
                                        Sub Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.fields["selectedServices"].map(
                                      (service, index) => {
                                        return (
                                          <>
                                            <tr
                                              key={index}
                                              style={{ fontSize: "16px" }}
                                            >
                                              <td>{index + 1}.</td>
                                              <td>{service.name}</td>
                                              <td>
                                                {service.who_will_pay === "0"
                                                  ? "Doctor"
                                                  : "Patient"}
                                              </td>
                                              <td> {`$${service.price}`}</td>
                                              <td> {`$${service.discount}`}</td>
                                              <td>
                                                {" "}
                                                {`$${service.sub_total}`}
                                              </td>
                                            </tr>
                                            {service.note && (
                                              <tr>
                                                <td></td>
                                                <td
                                                  className="py-1 text-primary"
                                                  colSpan={5}
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  <strong>Note: </strong>
                                                  {service.note}
                                                </td>
                                              </tr>
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </Table>
                              </CardBody>
                              <CardFooter>
                                <Row>
                                  <Col md={6}>
                                    <Row>
                                      <Col sm={12}>
                                        <strong>Doctor Total Bill :-</strong>{" "}
                                        <span style={{ fontSize: 20 }}>$</span>
                                        <span style={{ fontSize: 30 }}>
                                          {this.state.fields[
                                            "doctor_total_bill"
                                          ]
                                            ? common.numberFormat(
                                                this.state.fields[
                                                  "doctor_total_bill"
                                                ]
                                              )
                                            : "0.00"}
                                        </span>
                                      </Col>
                                      <Col sm={12} className="text-left">
                                        <strong>Patient Total Bill :-</strong>{" "}
                                        <span style={{ fontSize: 20 }}>$</span>
                                        <span style={{ fontSize: 30 }}>
                                          {this.state.fields[
                                            "patient_total_bill"
                                          ]
                                            ? common.numberFormat(
                                                this.state.fields[
                                                  "patient_total_bill"
                                                ]
                                              )
                                            : "0.00"}
                                        </span>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col md={6} className="text-right">
                                    Total:-{" "}
                                    <span className="display-4">
                                      <small>$</small>

                                      {this.state.fields["total_price"]
                                        ? common.numberFormat(
                                            this.state.fields["total_price"]
                                          )
                                        : "0.00"}
                                    </span>
                                  </Col>
                                </Row>
                              </CardFooter>
                            </Card>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <Row>
                      <Col md={12} className="text-right">
                        {this.renderButtons(7)}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        )}
        {this.state.showModal && (
          <Modal isOpen={this.state.showModal} size="lg">
            <ModalHeader toggle={this.toggleModal} />
            <ModalBody className="pl-4 pr-4">
              <PatientDetailsBody
                id={fields["patient_id"].value}
                enableEditPatient={false}
              />
            </ModalBody>
          </Modal>
        )}
        {this.state.showServiceNoteModal && (
          <AddServiceNote
            showModal={this.state.showServiceNoteModal}
            closeModal={() => this.setState({ showServiceNoteModal: false })}
            selectedServices={this.state.fields.selectedServices}
            selectedService={this.state.selectedService}
            updateNoteInSelectedService={this.updateNoteInSelectedService}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
    userId: state.userId,
    defaultLocation: state.defaultLocation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchPatientData: (data) => {
      dispatch(updateSearchPatientData(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditCase);
