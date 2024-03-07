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
} from "reactstrap";
import tmtsummarytemplate from "../../../services/tmtsummarytemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddEditTmtSummaryTemplate extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    content: ""
  };
  getTemplate = id => {
    this.setState({ isloader: true });
    tmtsummarytemplate.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.template;
        this.setState({
          fields,
          content: response.data.template.content
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
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
  handleTextArea = content => {
    this.setState({ content });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        content: this.state.content,
        id: this.props.match.params.id ? this.props.match.params.id : ""
      };

      tmtsummarytemplate.add(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.history.push("/admin/tmt-summary-templates");
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
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Name can not be empty!";
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
                    <Col xs={12}><strong>{this.props.match.params.id ? "Update " : "Add "} Templete</strong></Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={
                          this.state.fields["name"]
                            ? this.state.fields["name"]
                            : ""
                        }
                        onChange={event => this.handleChange("name", event)}
                        invalid={this.state.errors["name"] ? true : false}
                      />
                      {this.state.errors["name"] && (
                        <FormFeedback>{this.state.errors["name"]}</FormFeedback>
                      )}
                    </FormGroup>
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
                            ["view", ["fullscreen", "codeview"]]
                          ]
                        }}
                        value={this.state.content}
                        onChange={this.handleTextArea}
                        invalid={this.state.errors["content"] ? true : false}
                      />
                      {this.state.errors["content"] && (
                        <FormText color="danger" size="md">
                          {this.state.errors["content"]}
                        </FormText>
                      )}
                    </FormGroup>

                    <Row>
                      <Col md={12} className="text-right">
                        <Link
                          to="/admin/tmt-summary-templates"
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

export default AddEditTmtSummaryTemplate;
