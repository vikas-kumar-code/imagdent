/* eslint-disable-next-line react/no-multi-comp */
/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */
import * as React from "react";
import { toast } from "react-toastify";
import common from "../../../services/common";
import {
  Button,
  Row,
  Col,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import CaseDetailsBody from "../Cases/CaseDetailsBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import { connect } from "react-redux";

import {
  Inject,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  Month,
  Resize,
  EventSettingsModel,
} from "@syncfusion/ej2-react-schedule";

import "../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import scheduler from "../../../services/scheduler";
import Badge from "reactstrap/lib/Badge";
import Form from "reactstrap/lib/Form";
import Input from "reactstrap/lib/Input";
import moment from "moment";

class Scheduler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLocation: this.props.defaultLocation,
      events: [],
      locations: [],
      draggedEvent: null,
      showPopup: true,
      eventLoader: false,
      showCaseModal: false,
      showAddEditModal: false,
      droppedData: null,
      formData: null,
      deleteLoder: false,
      currentDate: new Date(moment()),
      startDayHour: "08:00",
      endDayHour: "20:00",
      blockedDetail: null,
      slotLoader: false,
      currentView: "Week",
      fields: [
        {
          Id: 1,
          Subject: "NO APPOINTMENT",
          StartTime: "2018-09-03T02:00:00.000Z",
          EndTime: "2018-09-03T04:00:00.000Z",
        },
      ],
    };
  }
  resetEvent = (id) => {
    let events = this.state.events;
    if (window.confirm("Are you sure?")) {
      let event_to_be_removed = events.map((event) => event.id).indexOf(id);
      events.splice(event_to_be_removed, 1);
      this.setState({ events, showPopup: false });
    }
  };

  onTreeDragStop = (e) => {
    if (typeof this.scheduleObj.getCellDetails(e.target) !== "undefined") {
      this.setState({ showAddEditModal: true, droppedData: e.target });
    }
  };

  componentDidMount() {
    this.setState({ eventLoader: true });
    this.getEvents(this.props.defaultLocation);
    common.getUserLocations().then((response) => {
      if (response.data.locations) {
        let eventLocations = response.data.locations.map((loc) => loc);
        let locations = eventLocations.filter(
          (item, i, ar) => ar.map((c) => c.id).indexOf(item.id) === i
        );
        this.setState({ locations });
      }
    });
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      // moment(prevState.currentDate).format("MMMM") !==
      // moment(this.state.currentDate).format("MMMM") ||
      //* NOT REQURIRED AS change of date is calling events list already
      prevProps.defaultLocation !== this.props.defaultLocation ||
      prevState.currentView !== this.state.currentView ||
      prevState.currentDate !== this.state.currentDate
    ) {
      this.getEvents(this.state.activeLocation);
    }
  };

  toggleCaseModal = (id) => {
    let caseId = id !== undefined ? id : "";
    this.setState((prevState) => ({
      caseId,
      showCaseModal: !prevState.showCaseModal,
    }));
  };

  toggleAditEditModal = (id) => {
    let caseId = id !== undefined ? id : "";
    this.setState((prevState) => ({
      caseId,
      showAddEditModal: !prevState.showAddEditModal,
      formData: null,
      blockedDetail: null,
    }));
  };

  deleteBlockedSlots = () => {
    this.setState({ deleteLoder: true });
    scheduler.delete({ id: this.state.caseId }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.getEvents(this.state.activeLocation);
        this.toggleAditEditModal();
        this.setState({
          formData: null,
          blockedDetail: null,
        });
      }
      this.setState({ deleteLoder: false });
    });
  };

  colorCode = (status) => {
    let color = null;
    if (status === "0") {
      color = "#1eb653";
    }
    if (status === "1") {
      color = "#faea12";
    }
    if (status === "2") {
      color = "#e83e8c";
    }
    if (status === "3") {
      color = "#3254eb";
    }
    if (status === "4") {
      color = "#ca0cdb";
    }
    if (status === "5") {
      color = "#c14018";
    }
    if (status === "6") {
      color = "#0fbd99";
    }
    if (status === "7") {
      color = "#2f353a";
    }
    if (status === "8") {
      color = "#026112";
    }
    if (status === "9") {
      color = "#da0704";
    }
    if (status === "10") {
      color = "#808080";
    }
    return color;
  };

  getEvents = (id) => {
    this.setState({ eventLoader: true, activeLocation: id });
    scheduler
      .getCaseList({
        fields: {
          location_id: id,
          currentDate: moment(this.state.currentDate).format("YYYY-MM-DD"),
          view: this.state.currentView,
        },
      })
      .then((response) => {
        if (response.data.success) {
          let events = [];
          response.data.cases.map((c) => {
            events.push({
              Id: c.id,
              Subject: common.getFullName(c.patient),
              StartTime: new Date(
                c.appointment_date + " " + c["slot"].from_time
              ),
              EndTime: new Date(c.appointment_date + " " + c["slot"].to_time),
              CategoryColor: this.colorCode(c.status),
            });
          });

          response.data.blocked.map((c) => {
            events.push({
              Id: c.id,
              Subject: c.subject,
              StartTime: new Date(c.appointment_date + " " + c.from_time),
              EndTime: new Date(c.appointment_date + " " + c.to_time),
              CategoryColor: "#808080",
              type: "blocked",
            });
          });
          this.setState({ data: events });
        }
        this.setState({ eventLoader: false });
      });
  };

  onPopupOpen = (args) => {
    args.cancel = true;
    if (args.data.Id && args.data.type !== "blocked") {
      this.toggleCaseModal(args.data.Id);
    } else if (args.data.Id && args.data.type === "blocked") {
      this.toggleAditEditModal(args.data.Id);
      this.getBlockedDetail(args.data.Id);
    } else if (args.data.event) {
      args.cancel = false;
    }
  };

  getBlockedDetail = (id) => {
    this.setState({ slotLoader: true });
    let params = { id: id };
    scheduler
      .getOne(params)
      .then((response) => {
        if (response.data.success) {
          this.setState({
            blockedDetail: response.data.form,
            formData: response.data.form.subject,
            slotLoader: false,
          });
        }
      })
      .catch(function (error) {
        this.setState({ error_403: true });
      });
  };

  onEventRendered = (args) => {
    if (args) {
      args.element.style.backgroundColor = args.data.CategoryColor;
    }
  };

  handleChange = (e) => {
    this.setState({ formData: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let fields = {};
    let eventData = {};
    let cellData = this.scheduleObj.getCellDetails(this.state.droppedData);
    if (this.state.blockedDetail) {
      fields = {
        id: this.state.blockedDetail.id,
        user_id: this.props.userId,
        location_id: this.state.activeLocation,
        subject: this.state.formData,
        appointment_date: this.state.blockedDetail.appointment_date,
        from_time: this.state.blockedDetail.from_time,
        to_time: this.state.blockedDetail.to_time,
        full_day_off:
          this.state.blockedDetail.from_time === "08:00:00" &&
            this.state.blockedDetail.to_time === "20:00:00"
            ? "1"
            : "0",
      };
      eventData = {
        Subject: this.state.formData,
        StartTime: this.state.blockedDetail.from_time,
        EndTime: this.state.blockedDetail.to_time,
        // IsAllDay: cellData.isAllDay,
        // IsBlock: true,
      };
    } else if (cellData.startTime.toLocaleTimeString() === "12:00:00 AM") {
      fields = {
        user_id: this.props.userId,
        location_id: this.state.activeLocation,
        subject: this.state.formData,
        appointment_date: cellData.startTime.toLocaleDateString("zh-Hans-CN"),
        from_time: "08:00:00",
        to_time: "20:00:00",
        full_day_off: "1",
      };
      eventData = {
        Subject: this.state.formData,
        StartTime: cellData.startTime,
        EndTime: cellData.endTime,
        IsAllDay: cellData.isAllDay,
        // IsBlock: true,
      };
    } else {
      fields = {
        user_id: this.props.userId,
        location_id: this.state.activeLocation,
        subject: this.state.formData,
        appointment_date: cellData.startTime.toLocaleDateString("zh-Hans-CN"),
        from_time: cellData.startTime.toLocaleTimeString(),
        to_time: cellData.endTime.toLocaleTimeString(),
      };
      eventData = {
        Subject: this.state.formData,
        StartTime: cellData.startTime,
        EndTime: cellData.endTime,
        IsAllDay: cellData.isAllDay,
        // IsBlock: true,
      };
    }
    scheduler.add({ fields: fields }).then((res) => {
      this.getEvents(this.state.activeLocation);
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.setState({
          showAddBlockedModal: false,
          formData: null,
          blockedDetail: null,
        });
        this.scheduleObj.addEvent(eventData);
      } else {
        toast.error(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    this.toggleAditEditModal();
  };

  onresizeStart = (args) => {
    if (args.data.CategoryColor !== "#808080") {
      args.cancel = true;
    }
  };

  onresizeStop = (args) => {
    if (args.data.CategoryColor !== "#808080") {
      args.cancel = true;
    }
    let fields = {
      id: args.data.Id,
      user_id: this.props.userId,
      location_id: this.state.activeLocation,
      subject: args.data.Subject,
      appointment_date: args.data.StartTime.toLocaleDateString("zh-Hans-CN"),
      from_time: args.data.StartTime.toLocaleTimeString(),
      to_time: args.data.EndTime.toLocaleTimeString(),
      full_day_off:
        args.data.StartTime.toLocaleTimeString() === "8:00:00 AM" &&
          args.data.EndTime.toLocaleTimeString() === "8:00:00 PM"
          ? "1"
          : "0",
    };
    let eventData = {
      Subject: args.data.Subject,
      appointment_date: args.data.StartTime.toLocaleDateString("zh-Hans-CN"),
      StartTime: args.data.StartTime.toLocaleTimeString(),
      EndTime: args.data.EndTime.toLocaleTimeString(),
      // IsAllDay: cellData.isAllDay,
      // IsBlock: true,
    };
    scheduler.add({ fields: fields }).then((res) => {
      this.getEvents(this.state.activeLocation);
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    this.scheduleObj.addEvent(eventData);
  };

  render() {
    const { currentDate, data, startDayHour, endDayHour } = this.state;
    return (
      <div>
        <Row>
          <Col sm={2} />
          <Col sm={10}>
            {this.state.locations.map((loc, i) => (
              <Button
                color="primary"
                outline={
                  parseInt(this.state.activeLocation) !== parseInt(loc.id)
                }
                key={i}
                className={
                  parseInt(this.state.activeLocation) === parseInt(loc.id)
                    ? "mr-3 mb-3 active"
                    : "mr-3 mb-3"
                }
                onClick={() => this.getEvents(loc.id)}
              >
                {loc.publish_name}
              </Button>
            ))}
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <div style={{position:'fixed'}}>
              <div>
                <h5 className="m-b-15">Draggable Event</h5>
                <span>
                  <TreeViewComponent
                    fields={{
                      dataSource: this.state.fields,
                      id: "Id",
                      text: "Subject",
                    }}
                    allowDragAndDrop
                    nodeDragStop={this.onTreeDragStop}
                    className="no-appointment"
                  />
                </span>
              </div>
              <div>
                <h5 className="pt-5">
                  <Badge color="primary" className="p-1 caseStatus-0">
                    New Cases
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-1">
                    Patient Checked-in
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-2">
                    Patient Paper work uploaded
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-3">
                    Payment Accepted
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-4">
                    Records captured
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-5">
                    Re-formated files uploaded
                  </Badge>
                </h5>

                <h5>
                  <Badge color="primary" className="p-1 caseStatus-6">
                    Ready for Radiologist
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-7">
                    Rad Report Completed
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-8">
                    Case Completed
                  </Badge>
                </h5>
                <h5>
                  <Badge color="primary" className="p-1 caseStatus-10">
                    Blocked
                  </Badge>
                </h5>
              </div>
            </div>
          </Col>
          <Col sm={10}>
            <LoadingOverlay
              active={this.state.eventLoader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <ScheduleComponent
                ref={(schedule) => (this.scheduleObj = schedule)}
                popupOpen={this.onPopupOpen}
                eventSettings={{ dataSource: this.state.data }}
                navigating={(e) => {
                  this.setState({
                    currentDate: e.currentDate,
                    currentView: e.currentView
                      ? e.currentView
                      : this.state.currentView,
                  });
                }}
                eventRendered={this.onEventRendered}
                resizeStart={this.onresizeStart}
                resizeStop={this.onresizeStop}
                currentView={"Week"}
              >
                <ViewsDirective>
                  <ViewDirective
                    option="Day"
                    startHour={startDayHour}
                    endHour={endDayHour}
                  />
                  <ViewDirective
                    option="Week"
                    startHour={startDayHour}
                    endHour={endDayHour}
                  />
                  <ViewDirective option="Month" />
                </ViewsDirective>
                <Inject services={[Month, Week, Day, Resize]} />
              </ScheduleComponent>
            </LoadingOverlay>
          </Col>
        </Row>
        {this.state.showCaseModal && (
          <Modal isOpen={this.state.showCaseModal} size="xl">
            <ModalBody className="p-1">
              <CaseDetailsBody
                caseId={this.state.caseId}
                enableEditCase={true}
                enableBackCase={this.toggleCaseModal}
                toggle={() => {
                  this.setState({ showCaseModal: false });
                  this.getEvents(this.state.activeLocation);
                }}
              />
            </ModalBody>
          </Modal>
        )}
        {this.state.showAddEditModal && (
          <Modal isOpen={this.state.showAddEditModal}>
            <LoadingOverlay
              active={this.state.slotLoader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <ModalHeader>Update Label</ModalHeader>
              <Form onSubmit={this.handleSubmit}>
                <ModalBody style={{ fontSize: 18 }}>
                  <Input
                    type="text"
                    onChange={(e) => this.handleChange(e)}
                    value={this.state.formData ? this.state.formData : ""}
                    placeholder="Enter Label"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="button"
                    color="secondary"
                    size="md"
                    onClick={this.toggleAditEditModal}
                  >
                    Cancel
                  </Button>
                  {this.state.blockedDetail && this.state.blockedDetail.id && (
                    <Button
                      type="button"
                      color="danger"
                      size="md"
                      disabled={this.state.deleteLoder}
                      onClick={this.deleteBlockedSlots}
                    >
                      {this.state.deleteLoder && (
                        <FontAwesomeIcon
                          icon="spinner"
                          className="mr-1"
                          spin={true}
                        />
                      )}
                      Delete
                    </Button>
                  )}
                  <Button size="md" color="success" type="submit">
                    {this.state.blockedDetail && this.state.blockedDetail.id
                      ? "Update"
                      : "Save"}
                  </Button>
                </ModalFooter>
              </Form>
            </LoadingOverlay>
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultLocation: state.defaultLocation,
    userId: state.userId,
  };
};
export default connect(mapStateToProps)(Scheduler);
