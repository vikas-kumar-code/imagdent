import React, { Component } from "react";
import message from "../../../services/message";
import common from "../../../services/common";
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
  ModalFooter,
  FormFeedback
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
import Select from "react-select";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";

class Compose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: {},
      errors: {},
      submitted: false,
      users: [],
      recipients: [],
      attachments: [],
      sender: ""
    };
  }
  handleChange = e => {
    let fields = this.state.fields;
    let { name, value } = e.target;
    fields[name] = value;
    this.setState({ fields });
  };
  handleMultiChange = (field, option) => {
    let recipients = this.state.recipients;
    recipients = option;
    this.setState({ recipients });
  };
  handleTextArea = text => {
    let fields = this.state.fields;
    fields["message"] = text;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        recipients: this.state.recipients,
        attachments: this.state.attachments,
        case_id: this.props.caseId ? this.props.caseId : ""
      };
      //console.log(params);
      message.sendMessage(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message) {
              errors = response.data.message;
            }
            this.setState({ errors: errors });
          }
        });
      });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let recipients = this.state.recipients;
    let attachments = this.state.attachments;
    let errors = {};
    let formIsValid = true;
    if (!recipients || recipients.length == 0) {
      formIsValid = false;
      errors["recipients"] = "Please specify atleast one recipient!";
    }
    if (fields["Cc"] && !common.isValidEmail(fields["Cc"])) {
      formIsValid = false;
      errors["Cc"] = "Please enter a valid Email address!";
    }
    if (!fields["subject"]) {
      formIsValid = false;
      errors["subject"] = "Subject cannot be empty!";
    }
    if (!fields["message"]) {
      formIsValid = false;
      errors["message"] = "Message cannot be empty!";
    }
    if (attachments.length > 10) {
      formIsValid = false;
      this.pond.removeFiles();
      this.setState({ attachments: [] });
      errors["attachments"] = "Please upload files in zip format";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getUsers = () => {
    this.setState({ loader: true });
    common.getUsers().then(response => {
      this.setState({ loader: false }, () => {
        if (response.data.success) {
          let users = [];
          if (response.data.users.length > 0) {
            response.data.users.forEach((user, index) => {
              users[index] = { label: user.email, value: user.id };
            });
            this.setState({ users });
          }
        }
      });
    });
  };
  componentDidMount = () => {
    if (this.props.recipients) {
      let recipients = [];
      this.props.recipients.map((v, i) => {
        recipients[i] = v;
      });
      this.setState({ recipients });
    }
    this.getUsers();
  };
  checkCallBack = (file, progress) => {
    console.log(file);
  };

  render() {
    const { fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>
          Compose New Message
        </ModalHeader>
        <Form
          name="compose-message-form"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <ModalBody className="pl-4 pr-4">
            <div className="animated fadeIn">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <FormGroup>
                  <Label>To</Label>
                  <Select
                    name="recipients"
                    //placeholder={<div>Select Diagnosis Code...</div>}
                    value={this.state.recipients ? this.state.recipients : []}
                    options={this.state.users}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isMulti
                    onChange={option =>
                      this.handleMultiChange("recipients", option)
                    }
                  />
                  {errors["recipients"] && (
                    <small className="text-danger">
                      {errors["recipients"]}
                    </small>
                  )}
                </FormGroup>
                {this.props.caseId && (
                  <FormGroup>
                    <Label for="Cc">Cc</Label>
                    <Input
                      type="email"
                      name="Cc"
                      id="Cc"
                      value={fields["Cc"] ? fields["Cc"] : ""}
                      onChange={this.handleChange}
                      invalid={errors["Cc"] ? true : false}
                      className="input-bg"
                      bsSize="lg"
                    />
                    {errors["Cc"] && (
                      <FormFeedback>{errors["Cc"]}</FormFeedback>
                    )}
                  </FormGroup>
                )}
                <FormGroup>
                  <Label>Subject</Label>
                  <Input
                    type="text"
                    name="subject"
                    value={fields["subject"] ? fields["subject"] : ""}
                    onChange={this.handleChange}
                    invalid={errors["subject"] ? true : false}
                    className="input-bg"
                    bsSize="lg"
                  />
                  {errors["subject"] && (
                    <FormFeedback>{errors["subject"]}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <FilePond
                    allowMultiple={true}
                    allowRemove={true}
                    ref={ref => (this.pond = ref)}
                    server={{
                      url: this.props.apiUrl,
                      process: {
                        url: "/common/upload-documents",
                        headers: {
                          "X-Api-Key": `Bearer  ${this.props.token}`
                        },
                        onload: response => {
                          let response_josn = JSON.parse(response);
                          let file = response_josn.file;
                          let attachments = this.state.attachments;
                          attachments.push(file.document_name);
                          this.setState({
                            attachments
                          });
                          return file.name;
                        }
                      },
                      revert: {
                        url: "/common/delete-file",
                        headers: {
                          "X-Api-Key": `Bearer  ${this.props.token}`
                          //file_name: files
                        },
                        onload: response => {
                          //console.log(response);
                        }
                      }
                    }}
                    onprocessfileprogress={(file, progress) =>
                      this.checkCallBack(file, progress)
                    }
                    /*onprocessfilerevert={file => {
                      let attachments = this.state.attachments;
                      this.setState({
                        attachments: []
                      });
                      //console.log(this.state.attachments);
                    }}*/
                    onprocessfilestart={file => {
                      if (this.state.attachments.length > 0) {
                        let errors = this.state.errors;
                        errors["attachments"] =
                          "If you have more than 10 files, please upload the files in Zip format";
                        this.setState({ errors });
                      }
                    }}
                  />
                  {errors["attachments"] && (
                    <small className="text-danger">
                      {errors["attachments"]}
                    </small>
                  )}
                </FormGroup>
                <FormGroup>
                  <ReactSummernote
                    name="message"
                    value={fields["message"] ? fields["message"] : ""}
                    options={{
                      height: 250,
                      dialogsInBody: true,
                      toolbar: [
                        ["style", ["style"]],
                        ["font", ["bold", "underline", "clear"]],
                        ["fontname", ["fontname"]],
                        ["para", ["ul", "ol", "paragraph"]],
                        ["table", ["table"]],
                        ["insert", ["link" /*, "picture" , "video"*/]],
                        ["view", ["fullscreen", "codeview"]]
                      ]
                    }}
                    onChange={this.handleTextArea}
                  />
                  {errors["message"] && (
                    <small className="text-danger">{errors["message"]}</small>
                  )}
                </FormGroup>
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
              Send
            </button>
          </ModalFooter>{" "}
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    apiUrl: state.apiUrl,
    token: state.token
  };
};
export default connect(mapStateToProps)(Compose);
