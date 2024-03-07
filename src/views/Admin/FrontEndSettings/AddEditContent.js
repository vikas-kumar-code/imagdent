import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
import { Link } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Select from "react-select";
import { connect } from "react-redux";
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
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback,
  FormGroup,
  Input,
  FormText,
} from "reactstrap";
import page from "../../../services/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilePond } from "react-filepond";
import ImageModal from "./ImageModal";

class AddEditContent extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    content: "",
    parents: [],
    url: "",
    showModal: false,
  };
  getPage = (id) => {
    this.setState({ isloader: true });
    page.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = response.data.content;
        this.setState({
          fields,
          content: response.data.content.content,
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
      this.getPage(this.props.match.params.id);
    }
    page
      .getParent()
      .then((response) => {
        let pages = [];
        if (response.data.success) {
          response.data.pages.forEach((page, index) => {
            pages[index] = {
              label: page.name,
              value: page.id,
            };
          });
          this.setState({ parents: pages });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (e) => {
    let fields = this.state.fields;
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked === true) {
        fields[name] = 1;
      } else {
        fields[name] = 0;
      }
    } else {
      fields[name] = value;
    }
    this.setState({ fields });
  };

  handleDropChange = (e) => {
    let fields = this.state.fields;
    fields["parent_id"] = e.value;
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
      };
      page.add(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.history.push("/admin/front-end-settings/pages");
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.name) {
              errors["name"] = response.data.message.name[0];
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
  toggleModal = (e) => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Page name can not be empty!";
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
        {this.state.showModal && (
          <ImageModal
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
          />
        )}
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
                      <Label for="parent_id">Main page</Label>
                      <Select
                        name="parent_id"
                        id="parent_id"
                        options={this.state.parents}
                        value={this.state.parents.filter((e) => {
                          return e.value === this.state.fields["parent_id"];
                        })}
                        onChange={(event) => this.handleDropChange(event)}
                        invalid={this.state.errors["parent_id"] ? true : false}
                      />
                      {this.state.errors["parent_id"] && (
                        <FormFeedback>
                          {this.state.errors["parent_id"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
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
                        onChange={(event) => this.handleChange(event)}
                        invalid={this.state.errors["name"] ? true : false}
                      />
                      {this.state.errors["name"] && (
                        <FormFeedback>{this.state.errors["name"]}</FormFeedback>
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
                        onChange={(event) => this.handleChange(event)}
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
                        onChange={(event) => this.handleChange(event)}
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
                        onChange={(event) => this.handleChange(event)}
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
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <Button type="button" onClick={this.toggleModal}>
                      Choose Images
                    </Button>
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
                            ["insert", ["link", "picture"]],
                            ["view", ["fullscreen", "codeview"]],
                          ],
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
                    <FormGroup check inline>
                      <Label>
                        <Input
                          type="checkbox"
                          name="top_navigation"
                          // value={1}
                          onChange={(e) => this.handleChange(e)}
                          checked={this.state.fields["top_navigation"] == "1"}
                        />
                        Display in top navigation
                      </Label>
                    </FormGroup>
                    <Row>
                      <Col md={12} className="text-right">
                        <Link
                          to="/admin/front-end-settings/pages"
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
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    apiUrl: state.apiUrl,
    token: state.token,
  };
};

export default connect(mapStateToProps)(AddEditContent);
