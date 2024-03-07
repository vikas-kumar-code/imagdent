import React, { Component } from "react";
import timeslot from "../../../services/timeslot";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import common from "../../../services/common";
import moment from "moment";

class AddEditType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: {},
      errors: {},
      submitted: false
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      let fields = Object.assign({}, this.state.fields);
      fields['from_time'] = moment(fields['from_time']).format("h:mm A");
      fields['to_time'] = moment(fields['to_time']).format("h:mm A");
      const params = {
        fields: fields,
      };

      timeslot.add(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
            this.props.getSlots(this.state.fields["day_index"]);
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        });
      });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["day_index"]) {
      formIsValid = false;
      errors["day_index"] = "Please select day name!";
    }
    if (!fields["from_time"]) {
      formIsValid = false;
      errors["from_time"] = "Can't be empty!";
    }
    if (!fields["to_time"]) {
      formIsValid = false;
      errors["to_time"] = "Can't be empty!";
    }
    if (fields["from_time"] && fields["to_time"]) {
      let from_time = new Date(fields["from_time"]);
      let to_time = new Date(fields["to_time"]);
      if (from_time > to_time) {
        formIsValid = false;
        errors["from_time"] = "Must be less than to time.";
        errors["to_time"] = "Must be greater than from time.";
      }
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getSlot = id => {
    this.setState({ loader: true });
    timeslot.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.slot;
        fields["from_time"] = new Date(response.data.slot.from_time);
        fields["to_time"] = new Date(response.data.slot.to_time);
        this.setState({
          loader: false,
          fields
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };

  componentDidMount = () => {
    if (this.props.selectedDay) {
      let fields = this.state.fields;
      fields["day_index"] = this.props.selectedDay;
      if(!common.isEmptyObject(this.props.selectedLocation)){
        fields['location_id'] = this.props.selectedLocation.value;
      }
      this.setState(fields);
    }
    if (this.props.slotId) {
      this.getSlot(this.props.slotId);
    }
  };
  handleFromTime = (date) => {
    let fields = this.state.fields;
    fields['from_time'] = date;
    this.setState({ fields });
  };
  handleToTime = (date) => {
    let fields = this.state.fields;
    fields['to_time'] = date;
    this.setState({ fields });
  };
  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.slotId ? "Update " : "Add New"} Slot
        </ModalHeader>
        <ModalBody className="pl-4 pr-4">
          <div className="animated fadeIn">
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Form
                name="add-edit-action-form"
                method="post"
                onSubmit={this.handleSubmit}
              >
                <FormGroup>
                  <Label for="day_index">Choose Day</Label>
                  <Input
                    type="select"
                    bsSize="lg"
                    name="day_index"
                    id="day_index"
                    onChange={event => this.handleChange("day_index", event)}
                    value={
                      this.state.fields["day_index"]
                        ? this.state.fields["day_index"]
                        : ""
                    }
                    invalid={this.state.errors["day_index"] ? true : false}
                    className="input-bg"
                  >
                    <option value="">-Select-</option>
                    {this.props.days.map(day => (
                      <option value={day.id} key={`key-day-${day.id}`}>
                        {day.name}
                      </option>
                    ))}
                  </Input>
                  {this.state.errors["day_index"] && (
                    <FormFeedback>
                      {this.state.errors["day_index"]}
                    </FormFeedback>
                  )}
                </FormGroup>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="from_time">From Time</Label>
                      <DatePicker
                        showTimeSelect
                        showTimeSelectOnly
                        className="input-bg form-control-lg form-control"
                        selected={this.state.fields["from_time"]
                          ? this.state.fields["from_time"]
                          : ""}
                        onChange={this.handleFromTime}
                        timeIntervals={15}
                        timeCaption="From Time"
                        dateFormat="h:mm aa"
                      />
                      {this.state.errors["from_time"] && (
                        <small className="fa-1x text-danger">{this.state.errors["from_time"]}</small>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="to_time">To Time</Label>
                      <DatePicker
                        showTimeSelect
                        showTimeSelectOnly
                        className="input-bg form-control-lg form-control"
                        selected={this.state.fields["to_time"]
                          ? this.state.fields["to_time"]
                          : ""}
                        onChange={this.handleToTime}
                        timeIntervals={15}
                        timeCaption="To Time"
                        dateFormat="h:mm aa"
                      />
                      {this.state.errors["to_time"] && (
                        <small className="fa-1x text-danger">{this.state.errors["to_time"]}</small>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="text-right">
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
                        <FontAwesomeIcon
                          icon="spinner"
                          className="mr-1"
                          spin={true}
                        />
                      )}
                      {this.props.slotId ? "Update" : "Add"}
                    </button>
                  </Col>
                </Row>
              </Form>
            </LoadingOverlay>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    defaultLocation:state.defaultLocation
  };
};
export default connect(mapStateToProps)(AddEditType);
