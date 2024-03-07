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
  CustomInput
} from "reactstrap";
import page from "../../../services/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddPage extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    content: ""
  };
  getPage = id => {
    this.setState({ isloader: true });
    page.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.content;
        this.setState({
          fields,
          content: response.data.content.content
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
      this.getPage(this.props.match.params.id);
    }
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
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
      };
      page.add(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.history.push("/admin/static-pages");
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.name) {
              errors["name"] = response.data.message.name[0];
            }
            if (response.data.message.url) {
              errors["url"] = response.data.message.url[0];
            }
            if (response.data.message.page_title) {
              errors["page_title"] = response.data.message.page_title[0];
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
      errors["name"] = "Page name can not be empty!";
    }
    if (!fields["url"]) {
      formIsValid = false;
      errors["url"] = "Url name can not be empty!";
    }
    if (!fields["page_title"]) {
      formIsValid = false;
      errors["page_title"] = "Page title can not be empty!";
    }
    if (this.state.content === "") {
      formIsValid = false;
      errors["content"] = "Page content can not be empty!";
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
                    <Col xs={12}>Add Page</Col>
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
                      <Label for="url">URL</Label>
                      <Input
                        type="text"
                        name="url"
                        id="url"
                        value={
                          this.state.fields["url"]
                            ? this.state.fields["url"]
                            : ""
                        }
                        onChange={event => this.handleChange("url", event)}
                        invalid={this.state.errors["url"] ? true : false}
                      />
                      {this.state.errors["url"] && (
                        <FormFeedback>{this.state.errors["url"]}</FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="page_title">Page Title</Label>
                      <Input
                        type="text"
                        name="page_title"
                        id="page_title"
                        value={
                          this.state.fields["page_title"]
                            ? this.state.fields["page_title"]
                            : ""
                        }
                        onChange={event =>
                          this.handleChange("page_title", event)
                        }
                        invalid={this.state.errors["page_title"] ? true : false}
                      />
                      {this.state.errors["page_title"] && (
                        <FormFeedback>
                          {this.state.errors["page_title"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="meta_keyword">Meta Keyword</Label>
                      <Input
                        type="text"
                        name="meta_keyword"
                        id="meta_keyword"
                        value={
                          this.state.fields["meta_keyword"]
                            ? this.state.fields["meta_keyword"]
                            : ""
                        }
                        onChange={event =>
                          this.handleChange("meta_keyword", event)
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="meta_description">Meta Description</Label>
                      <Input
                        type="text"
                        name="meta_description"
                        id="meta_description"
                        value={
                          this.state.fields["meta_description"]
                            ? this.state.fields["meta_description"]
                            : ""
                        }
                        onChange={event =>
                          this.handleChange("meta_description", event)
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="meta_info">Meta Info</Label>
                      <Input
                        type="text"
                        name="meta_info"
                        id="meta_info"
                        value={
                          this.state.fields["meta_info"]
                            ? this.state.fields["meta_info"]
                            : ""
                        }
                        onChange={event =>
                          this.handleChange("meta_info", event)
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content">Page Content</Label>
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
                      {/* <Input
                        type="textarea"
                        name="content"
                        id="content"
                        rows="10"
                        value={
                          this.state.fields["content"]
                            ? this.state.fields["content"]
                            : ""
                        }
                        onChange={event => this.handleChange("content", event)}
                      /> */}
                    </FormGroup>

                    <Row>
                      <Col md={12} className="text-right">
                        <Link
                          to="/admin/static-pages"
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

export default AddPage;
