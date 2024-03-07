import React, { Component } from "react";
import { Card, CardHeader, Col, Button, CardFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

class Slot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enableSelection: false,
    };
  }
  deleteSlot = (id) => {
    if (window.confirm("Are you sure to delete this slot?")) {
      this.props.deleteSlot(id);
      // this.setState({ submitted: true }, () => {   /**  COMMENTED LOADING FOR NOW */
      //   this.props.deleteSlot(id);
      // });
    }
  };
  handleSelectedColor = () => {
    if (this.props.enableEdit) {
      return "dark";
    } else if (this.props.bookedSlots && this.props.bookedSlots.length > 0) {
      let matchedSlot = this.props.bookedSlots.filter(
        (slot) => parseInt(slot.id) === parseInt(this.props.slot.id)
      );
      if (matchedSlot.length > 0) {
        return "default";
      } else if (
        this.props.selectedSlot &&
        parseInt(this.props.selectedSlot) === parseInt(this.props.slot.id)
      ) {
        return "dark";
      } else {
        return "success";
      }
    } else if (
      this.props.selectedSlot &&
      parseInt(this.props.selectedSlot) === parseInt(this.props.slot.id)
    ) {
      return "dark";
    } else if (
      this.props.selectedSlot &&
      this.props.selectedSlot instanceof Array
    ) {
      let matchedSlot = this.props.selectedSlot.filter(
        (v) => parseInt(v) === parseInt(this.props.slot.id)
      );
      if (matchedSlot.length > 0) {
        return "dark";
      } else {
        return "success";
      }
    } else {
      return "success";
    }
  };

  checkBookedSlot = (record, timeText) => {
    if (this.props.bookedSlots && this.props.bookedSlots.length > 0) {
      let matchedSlot = this.props.bookedSlots.filter(
        (slot) => parseInt(slot.id) === parseInt(this.props.slot.id)
      );
      if (matchedSlot.length > 0) {
        return (
          <CardHeader
            className="text-center p-2"
            style={{ fontSize: 13, fontWeight: "bold", cursor: "not-allowed" }}
          >
            {timeText}
          </CardHeader>
        );
      } else {
        return (
          <CardHeader
            className="text-center p-2"
            style={{ fontSize: 13, fontWeight: "bold", cursor: "pointer" }}
            onClick={() =>
              this.props.chooseSlot(record.id, this.props.appointmentDate)
            }
          >
            {timeText}
          </CardHeader>
        );
      }
    } else {
      return (
        <CardHeader
          className="text-center p-2"
          style={{ fontSize: 13, fontWeight: "bold", cursor: "pointer" }}
          onClick={() =>
            this.props.chooseSlot(record.id, this.props.appointmentDate)
          }
        >
          {timeText}
        </CardHeader>
      );
    }
  };

  render() {
    const record = this.props.slot;
    const timeText = `${moment(record.from_time, "hh:mm").format(
      "hh:mm A"
    )} - ${moment(record.to_time, "hh:mm").format("hh:mm A")}`;
    return (
      <Col md={3}>
        <Card color={this.handleSelectedColor()}>
          {this.props.enableSelection ? (
            this.checkBookedSlot(record, timeText)
          ) : (
            <CardHeader
              className="text-center p-2"
              style={{
                fontSize: 13,
                fontWeight: "bold",
                cursor: "default",
              }}
            >
              {timeText}
            </CardHeader>
          )}
          {this.props.enableEdit && (
            <CardFooter className="text-center">
              <Button
                color="primary"
                size="sm"
                data-id={record.id}
                onClick={this.props.toggleModal}
              >
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                className="ml-2"
                onClick={() => this.deleteSlot(record.id)}
                disabled={this.state.submitted}
              >
                {this.state.submitted && (
                  <FontAwesomeIcon
                    icon="spinner"
                    className="mr-1"
                    spin={true}
                  />
                )}
                Delete
              </Button>
            </CardFooter>
          )}
        </Card>
      </Col>
    );
  }
}

export default Slot;
