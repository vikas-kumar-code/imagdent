import React, { Component } from "react";
import common from "../../../services/common";
import ccase from "../../../services/case";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Spinner,
  Collapse,
  Badge,
  Navbar,
  NavbarBrand,
  Modal,
  ModalBody,
  ModalHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import Slot from "../TimeSlots/Slot";
import DatePicker from "react-datepicker";
import moment from "moment";

class Reschedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      fields: {
        id: this.props.caseId,
        appointment: { disableDate: false, chooseSlot: true },
      },
      errors: {},
      submitted: false,
      slotLoader: false,
      availableSlots: [],
    };
  }

  getCaseDetail = () => {
    let params = {
      id: this.props.caseId,
    };

    ccase.getCaseDetails(params).then((response) => {
      this.setState({ loader: false }, () => {
        if (response.data.success) {
          let fields = {};
          fields["id"] = response.data.case.id;
          fields["location_id"] = {
            value: response.data.case.location_id,
          };

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
            
          }
          fields["slot_id"] = response.data.case.slot_id;
          fields["slot"] =
            response.data.case.slot !== null &&
            `${response.data.case.slot.from_time}-${response.data.case.slot.to_time}`;
          this.setState({ fields },()=>{
            this.getAvailableSlots();
          });
        } else if (response.data.error) {
        }
      });
    });
  };
  getAvailableSlots = () =>{
    common
        .getAvailableSlots({
          date:
          moment(this.state.fields.appointment_date).format("YYYY-MM-DD") >=
            moment().format("YYYY-MM-DD")
              ? this.state.fields.appointment_date
              : moment().format("YYYY-MM-DD"),
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
              availableSlots: data,
              slotLoader: false,
            });
          }
        });
  }
  componentDidMount = () => {
    this.getCaseDetail();
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

  handleSubmit = (e) => {
    e.preventDefault();
    let frm = e.target.attributes.name.value;
    if (this.handleValidation(frm)) {
      this.setState({ submitted: true });
      let fields = this.state.fields;
      if (fields["appointment_date"] !== "") {
        fields["new_appointment_date"] = moment(
          fields["appointment_date"]
        ).format("YYYY-MM-DD");
      }
      const params = {
        fields: fields,
      };
      ccase.rescheduleAppointment(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.toggleModal();
            this.getCaseDetail();
            if (this.props.getCase) {
              this.props.getCase(this.props.caseId);
            }
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            let errors = {};
            if (response.data.message.name) {
              errors["name"] = response.data.message.name[0];
            }
            this.setState({ errors: errors });
          }
        });
      });
    }
  };

  handleValidation = (frm) => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

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

    this.setState({ errors: errors });
    return formIsValid;
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
      this.setState({ fields, slotLoader: true });
      this.getAvailableSlots();
    }
  };
  render() {
    const { fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>
          Reschedule Appointment
        </ModalHeader>
        <Form name="payee-frm" method="post" onSubmit={this.handleSubmit}>
          <ModalBody className="pl-4 pr-4">
            <div className="animated fadeIn">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <Row form>
                  <Col md={5}>
                    <FormGroup>
                      <Label for="appointment_date">
                        Choose Appointment Date
                      </Label>
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
                          className="form-control form-control-lg"
                          filterDate={(e) => {
                            const d = moment.utc(e);
                            const day = d.isoWeekday();
                            return day !== 6 && day !== 7;
                          }}
                          selected={
                            this.state.fields["appointment_date"]
                              ? this.state.fields["appointment_date"]
                              : ""
                          }
                          onChange={this.handleDate}
                          dateFormat="MM-dd-yyyy"
                          minDate={new Date(moment())}
                          id="appointment_date"
                          disabled={fields["appointment"].disableDate}
                        />{" "}
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
                  <Col md={6} className="text-nowrap cases-edit-marking">
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
                        <strong>Arrange call back</strong>
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
                                {moment(slot.appointment_date).format(
                                  "dddd, MMMM Do, YYYY"
                                )}
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
              </LoadingOverlay>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-dark cp mr-1"
              disabled={this.state.submitted}
              onClick={this.props.toggleModal}
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
              Save
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default Reschedule;
