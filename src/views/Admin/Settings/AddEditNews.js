import React, { Component } from "react";
import news from "../../../services/news";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  FormText,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class AddEditNews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: {},
      errors: {},
      submitted: false
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleTextArea = description => {
    this.setState({ description });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        url: this.state.fields["url"],
        id: this.props.newsId
      };

      news.create(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
            this.props.getAllNews();
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.title) {
              errors["title"] = response.data.message.title[0];
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
    if (!fields["url"]) {
      formIsValid = false;
      errors["url"] = "News URL can not be empty!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getNews = id => {
    this.setState({ loader: true });
    news.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = {
          url: response.data.news.url
        };
        this.setState({
          loader: false,
          fields
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };

  componentDidMount = () => {
    if (this.props.newsId) {
      this.getNews(this.props.newsId);
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.newsId ? "Update " : "Add "} News
        </ModalHeader>
        <ModalBody className="pl-4 pr-4">
          <div className="animated fadeIn">
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Form
                name="add-edit-action-form"
                method="post"
                onSubmit={this.handleSubmit}
              >
                <FormGroup>
                  <Label for="url">News URL</Label>
                  <Input
                    type="url"
                    name="url"
                    id="url"
                    value={
                      this.state.fields["url"] ? this.state.fields["url"] : ""
                    }
                    onChange={event => this.handleChange("url", event)}
                    invalid={this.state.errors["url"] ? true : false}
                    className="input-bg"
                    bsSize="lg"
                  />
                  {this.state.errors["url"] && (
                    <FormFeedback>{this.state.errors["url"]}</FormFeedback>
                  )}
                  <FormText>
                    URL of the news that provides additional information about
                    this news
                  </FormText>
                </FormGroup>
                {/* <FormGroup>
                  <Label for="description">Brief Description</Label>
                  <ReactSummernote
                    options={{
                      height: 150,
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
                    value={this.state.description}
                    onChange={this.handleTextArea}
                  />
                </FormGroup> */}
                <Row>
                  <Col md={12} className="text-right">
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
                        <FontAwesomeIcon
                          icon="spinner"
                          className="mr-1"
                          spin={true}
                        />
                      )}
                      {this.props.newsId ? "Update" : "Add"}
                    </button>
                  </Col>
                </Row>
              </Form>
            </LoadingOverlay>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl
  };
};
export default connect(mapStateToProps)(AddEditNews);
