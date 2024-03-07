import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
import { Link } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
  Button,
  Form,
  Label,
  FormFeedback,
  FormGroup,
  Input,
  FormText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import emailtemplate from "../../../services/emailtemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import common from "../../../services/common";

class AddEditTemplate extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    content: "",
    activeTab: "1",
  };
  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  getTemplate = (id) => {
    this.setState({ isloader: true });
    emailtemplate.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = response.data.template;
        this.setState({
          fields,
          content: response.data.template.content,
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      this.setState({ isloader: false });
    });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getTemplate(this.props.match.params.id);
    }
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    if (e.target.type === "checkbox") {
      fields[field] = e.target.checked;
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  };
  handleTextArea = (content) => {
    this.setState({ content });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        content: this.state.content,
        id: this.props.match.params.id ? this.props.match.params.id : "",
      };

      emailtemplate.add(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.history.push("/admin/email-templates");
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.subject) {
              errors["subject"] = response.data.message.subject[0];
            }
            if (response.data.message.from_email) {
              errors["from_email"] = response.data.message.from_email[0];
            }
            if (response.data.message.from_label) {
              errors["from_label"] = response.data.message.from_label[0];
            }
            if (response.data.message.content) {
              errors["content"] = response.data.message.content[0];
            }
            if (response.data.message.reply_to_email) {
              errors["reply_to_email"] =
                response.data.message.reply_to_email[0];
            }
            this.setState({ errors: errors });
          }
        });
      });
    }
  };




  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["subject"]) {
      formIsValid = false;
      errors["subject"] = "Subject can not be empty!";
    }
    if (fields["from_email"] && !common.isValidEmail(fields["from_email"])) {
      formIsValid = false;
      errors["from_email"] = "Enter valid Email Address!";
    }
    if (fields["reply_to_email"] && !common.isValidEmail(fields["reply_to_email"])) {
      formIsValid = false;
      errors["reply_to_email"] = "Enter valid Email Address!";
    }
    if (!fields["from_label"]) {
      formIsValid = false;
      errors["from_label"] = "From label can not be empty!";
    }
    if (this.state.content === "") {
      formIsValid = false;
      errors["content"] = "Template can not be empty!";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <LoadingOverlay
                active={this.state.isloader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <CardHeader>
                  <Row>
                    <Col xs={12}>
                      <strong>
                        {this.props.match.params.id ? "Update " : "Add "} Email
                        Templete
                      </strong>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label for="subject">Subject</Label>
                      <Input
                        type="text"
                        name="subject"
                        id="subject"
                        value={
                          this.state.fields["subject"]
                            ? this.state.fields["subject"]
                            : ""
                        }
                        onChange={(event) =>
                          this.handleChange("subject", event)
                        }
                        invalid={this.state.errors["subject"] ? true : false}
                      />
                      {this.state.errors["subject"] && (
                        <FormFeedback>
                          {this.state.errors["subject"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="from_email">From Email</Label>
                      <Input
                        type="text"
                        name="from_email"
                        id="from_email"
                        value={
                          this.state.fields["from_email"]
                            ? this.state.fields["from_email"]
                            : ""
                        }
                        onChange={(event) =>
                          this.handleChange("from_email", event)
                        }
                        invalid={this.state.errors["from_email"] ? true : false}
                      />
                      {this.state.errors["from_email"] && (
                        <FormFeedback>
                          {this.state.errors["from_email"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="from_label">From Label</Label>
                      <Input
                        type="text"
                        name="from_label"
                        id="from_label"
                        value={
                          this.state.fields["from_label"]
                            ? this.state.fields["from_label"]
                            : ""
                        }
                        onChange={(event) =>
                          this.handleChange("from_label", event)
                        }
                        invalid={this.state.errors["from_label"] ? true : false}
                      />
                      {this.state.errors["from_label"] && (
                        <FormFeedback>
                          {this.state.errors["from_label"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="reply_to_email">ReplyTo Email</Label>
                      <Input
                        type="text"
                        name="reply_to_email"
                        id="reply_to_email"
                        value={
                          this.state.fields["reply_to_email"]
                            ? this.state.fields["reply_to_email"]
                            : ""
                        }
                        onChange={(event) =>
                          this.handleChange("reply_to_email", event)
                        }
                        invalid={
                          this.state.errors["reply_to_email"] ? true : false
                        }
                      />
                      {this.state.errors["reply_to_email"] && (
                        <FormFeedback>
                          {this.state.errors["reply_to_email"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "1",
                          })}
                          onClick={() => this.setActiveTab("1")}
                          style={{ fontSize: 20 }}
                        >
                          Email Content
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "2",
                          })}
                          onClick={() => this.setActiveTab("2")}
                          style={{ fontSize: 20 }}
                        >
                          SMS Content
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      activeTab={this.state.activeTab}
                      className="mb-3"
                    >
                      <TabPane tabId="1">
                        <FormGroup>
                          <ReactSummernote
                            options={{
                              height: 250,
                              dialogsInBody: true,
                              toolbar: [
                                ["style", ["style"]],
                                ["font", ["bold", "underline", "clear"]],
                                ["fontname", ["fontname"]],
                                ["para", ["ul", "ol", "paragraph"]],
                                ["table", ["table"]],
                                ["view", ["fullscreen", "codeview"]],
                              ],
                            }}
                            value={this.state.content}
                            onChange={this.handleTextArea}
                            invalid={
                              this.state.errors["content"] ? true : false
                            }
                          />
                          {this.state.errors["content"] && (
                            <FormText color="danger" size="md">
                              {this.state.errors["content"]}
                            </FormText>
                          )}
                        </FormGroup>
                      </TabPane>
                      <TabPane tabId="2">
                        <FormGroup>
                          <Input
                            type="textarea"
                            name="sms"
                            id="sms"
                            value={
                              this.state.fields["sms"]
                                ? this.state.fields["sms"]
                                : ""
                            }
                            onChange={(event) =>
                              this.handleChange("sms", event)
                            }
                            invalid={this.state.errors["sms"] ? true : false}
                            className="input-bg"
                            bsSize="lg"
                            rows={5}
                          />
                        </FormGroup>
                      </TabPane>
                    </TabContent>

                    <Row>
                      <Col md={12} className="text-right">
                        <Link
                          to="/admin/email-templates"
                          className="btn btn-danger mr-2"
                        >
                          Cancel
                        </Link>
                        <Button
                          type="submit"
                          color="success"
                          disabled={this.state.submitted}
                        >
                          {this.state.submitted && (
                            <FontAwesomeIcon
                              icon="spinner"
                              className="mr-1"
                              spin={true}
                            />
                          )}
                          {this.props.match.params.id ? "Update" : "Save"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </LoadingOverlay>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddEditTemplate;
