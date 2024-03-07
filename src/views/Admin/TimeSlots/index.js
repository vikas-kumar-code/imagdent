import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
  Button,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import timeslot from "../../../services/timeslot";
import common from "../../../services/common";
import Slot from "./Slot";
import AddEditSlot from "./AddEditSlot";
import { Helmet } from "react-helmet";
import Select from "react-select";
import { connect } from "react-redux";

class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloader: true,
      showModal: false,
      slotId: "",
      error_403: false,
      days: [
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        // { id: 6, name: "Saturday" },
        // { id: 7, name: "Sunday" }
      ],
      selectedDay: 1,
      slots: [],
      locations: [],
      selectedLocation: {}
    };
  }

  getSlots = day_index => {
    this.setState({ isloader: true, selectedDay: parseInt(day_index) });
    let params = {
      fields: { day_index: day_index, location_id: this.state.selectedLocation.value }
    };
    let that = this;
    timeslot.getSlots(params).then(response => {
      this.setState({ isloader: false });
      if (response.data.success) {
        this.setState({
          slots: response.data.slots
        });
      }
    })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };

  getLocations = () => {
    common.getLocations().then(response => {
      if (response.data.success) {
        let locations = [];
        let selectedLocation = {};
        response.data.locations.forEach((location, index) => {
          locations[index] = { label: location.publish_name, value: location.id };
          if (parseInt(location.id) === parseInt(this.props.defaultLocation)) {
            selectedLocation = locations[index];
          }
        });
        this.setState({ locations, selectedLocation }, () => {
          this.getSlots(this.state.selectedDay);
        });
      }
    })
      .catch(error => {
        this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getLocations();
  };
  deleteSlot = id => {
    let params = { id: id };
    if (!common.isEmptyObject(this.state.selectedUser)) {
      params["user_id"] = this.state.selectedUser.value;
    }
    timeslot.deleteSlot(params).then(response => {
      if (response.data.success) {
        let slots = this.state.slots;
        slots = this.state.slots.filter(slot => slot.id !== id);
        this.setState({ slots });
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };
  toggleModal = e => {
    let slotId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      slotId
    }));
  };
  handleLocationChange = user => {
    this.setState({ selectedLocation: user }, () => {
      this.getSlots(this.state.selectedDay);
    });
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Time Slots : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Time Slots</h3></Col>
                  <Col md={4} sm={12} className="text-right">
                    <Row>
                      {parseInt(this.props.userType) === 1 && (
                        <Col sm={12} md={6}>
                          <Select
                            name="location_id"
                            value={
                              !common.isEmptyObject(this.state.selectedLocation) &&
                              this.state.selectedLocation
                            }
                            options={this.state.locations}
                            className="basic-multi-select m-1"
                            classNamePrefix="select"
                            onChange={this.handleLocationChange}
                            placeholder="Select Location"
                          />
                        </Col>
                      )}

                      <Col
                        md={parseInt(this.props.userType) === 1 ? 6 : 12}
                        className="text-right"
                        sm={12}
                      >
                        <Button
                          color="success"
                          type="button"
                          className="m-1 btn-block"
                          onClick={this.toggleModal}
                        >
                          Add New Slot
                        </Button>
                      </Col>

                    </Row>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={3} className="mb-4">
                    <ListGroup>
                      {this.state.days.map((day, index) => (
                        <ListGroupItem
                          action
                          active={day.id === this.state.selectedDay}
                          key={`day-index-${index}`}
                          tag="button"
                          onClick={() => this.getSlots(day.id)}
                        >
                          {day.name}
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </Col>
                  <Col md={9}>
                    <LoadingOverlay
                      active={this.state.isloader}
                      spinner={<Spinner color="dark" />}
                      fadeSpeed={200}
                      classNamePrefix="white"
                    >
                      <Row>
                        {this.state.slots.length > 0 ? (
                          this.state.slots.map((slot, index) => (
                            <Slot
                              key={`slot-index-${index}`}
                              slot={slot}
                              deleteSlot={this.deleteSlot}
                              toggleModal={this.toggleModal}
                              enableEdit={true}
                              enableSelection={false}
                            />
                          ))
                        ) : (
                          <Col md={12} className="text-center">
                            Slot not available!
                          </Col>
                        )}
                      </Row>
                    </LoadingOverlay>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showModal && (
          <AddEditSlot
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            slotId={this.state.slotId}
            getSlots={this.getSlots}
            days={this.state.days}
            selectedDay={this.state.selectedDay}
            selectedLocation={this.state.selectedLocation}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userId: state.userId,
    userType: state.userType,
    defaultLocation: state.defaultLocation
  };
};
export default connect(mapStateToProps)(TimeSlots);
