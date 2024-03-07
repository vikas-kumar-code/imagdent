import React, { Component } from "react";
import {
  Row,
  Col,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Button
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import common from "../../../services/common";
import message from "../../../services/message";
import LoadingOverlay from "react-loading-overlay";
import Attachment from "./Attachment";
import { toast } from "react-toastify";
import moment from "moment";

class Read extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: true,
      message: {},
      attachments: [],
      recipients: [],
      submitted: false,
      fields: { id: [this.props.match.params.id] }
    };
  }

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.getMessage(this.props.match.params.id, this.props.match.params.folder);
    }
  };
  getMessage = (id,folder) => {
    message.getMessage({ id: id,folder:folder }).then(response => {
      if (response.data.success) {
        let message = {};
        let attachments = [];
        let recipients = this.state.recipients;
        response.data.recipients.forEach((rcpnt, index) => {
          recipients[index] = {
            label: `${rcpnt["user"].first_name} ${rcpnt["user"].last_name}`,
            value: rcpnt.user_id
          };
        });
        message = response.data.message;
        if (message.attachments !== null) {
          attachments = JSON.parse(message.attachments);
          //attachments = JSON.parse(message.attachments);
          //alert(message.attachments);
        }
        this.setState({ message, attachments, recipients, isLoader: false });
      }
    });
  };
  deleteMessage = () => {
    this.setState({ submitted: true });
    let params = { fields: this.state.fields };
    message.deleteMessage(params).then(response => {
      this.setState({ submitted: false }, () => {
        if (response.data.success) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
          this.props.history.push("/admin/messages");
        } else if (response.data.error) {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      });
    });
  };
  render() {
    return (
      <React.Fragment>
        <Card className="shadow" outline color="dark">
          <CardHeader className="bg-light">
            <h5 className="mb-0">
              {!this.state.isLoader && this.state.message.subject}
            </h5>
          </CardHeader>
          <CardBody>
            <LoadingOverlay
              active={this.state.isLoader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Row>
                <Col md={6}>
                  <strong>From:</strong>
                  {!this.state.isLoader &&
                    common.getFullName(this.state.message.user)}
                </Col>
                <Col md={6} className="text-right">
                  {!this.state.isLoadern && this.state.message.added_on &&
                   moment( this.state.message.added_on).format("LLL")}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={12} style={{ minHeight: 200 }}>
                  {!this.state.isLoader && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: this.state.message.message
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row className="mt-3">
                {this.state.attachments.map((attachment, index) => {
                  return (
                    <Col md={3} className="d-flex align-items-end">
                      <Attachment
                        attachment={attachment}
                        key={`attachment-${index}`}
                      />
                    </Col>
                  );
                })}
              </Row>
              <Row>
                <Col md={6}>
                  <button
                    onClick={this.props.history.goBack}
                    className="btn btn-primary btn-sm"
                  >
                    <FontAwesomeIcon icon="undo" className="mr-1" />
                    Back
                  </button>
                </Col>
                <Col md={6} className="text-right">
                  <button
                    className="btn btn-danger btn-sm"
                    type="button"
                    onClick={this.deleteMessage}
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
                  </button>
                  <button
                    className="btn btn-warning btn-sm ml-1"
                    onClick={e =>
                      this.props.toggleModal(e, this.state.recipients)
                    }
                  >
                    Reply
                  </button>
                </Col>
              </Row>
            </LoadingOverlay>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default Read;
