import React, { Component } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Select from "react-select";
import ccase from "../../../services/case";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
import { withRouter } from "react-router";
import emailtemplate from "../../../services/emailtemplate";

class AddNoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        case_id: this.props.caseId,
        template_id: 9,
      },
      submitted: false,
      errors: [],
    };
  }

  componentDidMount = () => {
    ccase.fetchCaseDeliveredContent(this.state.fields).then((res) => {
      let fields = this.state.fields;
      if (res.data.success) {
        fields["notes"] = res.data.content;
        fields["to"] = res.data.to;
      }
      this.setState({fields});
    });
  };

  handleEditorChange = (value) => {
    let fields = this.state.fields;
    fields["notes"] = value;
    this.setState({ fields });
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["notes"]) {
      formIsValid = false;
      errors["notes"] = "Note can not be empty!";
    }
    if (!fields["template_id"]) {
      formIsValid = false;
      errors["template_id"] = "Please choose email template.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  addNoteHandler = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        cc: this.state.cc,
      };
      let that = this;
      ccase
        .addNote(params)
        .then((response) => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              this.props.toggleModal();
              this.props.getCase(this.props.caseId);
              this.props.changeStatus();
              ccase.sendDeliveryEmail(params).then((res) => {
                console.log(res);
              });
              this.props.history.push("/admin/dashboard")
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
    }
  };

  handleChange = (e, field) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    if (field === "template_id") {
      ccase.fetchCaseDeliveredContent({ case_id: this.props.caseId, template_id: e.target.value }).then((res) => {
        let fields = this.state.fields;
        if (res.data.success) {
          fields["notes"] = res.data.content
          this.setState({fields})
        }
      })
    }
   
  };
  render() {
    const { fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>
          Delivery Email & Confirmation
        </ModalHeader>
        <ModalBody>
          <Row className="mt-3">
            <Col xl="12">
              <Form name="note-frm" onSubmit={this.addNoteHandler}>
                <FormGroup row>
                  <Col md={12}>
                    <Label for="emailTemplate">Select Email Template</Label>
                    <Input
                        name="template_id"
                        type="select"
                        onChange={(event) => this.handleChange(event, "template_id")}
                        value={
                          this.state.fields.template_id !== undefined
                            ? this.state.fields.template_id
                            : ""
                        }
                      >
                        <option value="">Choose Email Template</option>
                        <option value={9}>Delivery Confirmation </option>
                        <option value={8}>Invisalign Delivery Confirmation</option>
                      </Input>
                    {errors["template_id"] && (
                      <FormFeedback>{errors["template_id"]}</FormFeedback>
                    )}
                  </Col>

                  <Col md={12}>
                    <Label>Mail To:</Label>
                    <Input type="text" name="to" id="to" value={fields.to} disabled={true} />
                  </Col>
                  <Col md={12}></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={12}>
                    <Label>CC</Label>
                    <Input
                      type="text"
                      name="cc"
                      onChange={(e) => this.handleChange(e, "cc")}
                      placeholder="Add email address"
                    />
                    {errors["cc"] && (
                      <small className="text-danger">{errors["cc"]}</small>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={12}>
                    <ReactSummernote
                      options={{
                        height: 200,
                        toolbar: [
                          ["style", ["style"]],
                          ["font", ["bold", "underline", "clear"]],
                          ["fontname", ["fontname"]],
                          ["view", ["fullscreen"]],
                        ],
                      }}
                      value={
                        this.state.fields["notes"]
                          ? this.state.fields["notes"]
                          : ""
                      }
                      onChange={this.handleEditorChange}
                    />
                    {errors["notes"] && (
                      <small className="fa-1x text-danger">
                        {errors["notes"]}
                      </small>
                    )}
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md={12} className="text-right">
                    <button className="btn btn-secondary mr-1" type="button" onClick={this.props.toggleModal}>Cancel</button>
                    <button
                      type="submit"
                      className="btn btn-success cbd-color cp"
                      disabled={this.state.submitted}
                    >
                      {this.state.submitted && (
                        <FontAwesomeIcon
                          icon="spinner"
                          className="mr-1"
                          spin={true}
                        />
                      )}
                      Send
                    </button>

                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

export default withRouter(AddNoteModal);
