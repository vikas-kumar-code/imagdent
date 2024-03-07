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
import page from "../../../services/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddEditFaq extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
  };
    getFaq = id => {
      this.setState({ isloader: true });
      page.getOneFaq({ id: id }).then(response => {
        if (response.data.success) {
          let fields = response.data.faq;
          this.setState({
            fields,
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
      this.getFaq(this.props.match.params.id);
    }
  }

  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleTextArea = (answer) => {
    let fields = this.state.fields;
    fields["answer"] = answer;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
      };
      page.addFaq(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.history.push("/admin/front-end-settings/Faq");
          } else {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.setState({ errors: response.data.error });
          }
        });
      });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["question"]) {
      formIsValid = false;
      errors["question"] = "Question can not be empty!";
    }

    if (!fields["answer"]) {
      formIsValid = false;
      errors["answer"] = "Answer can not be empty!";
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
                    <Col xs={12}>FAQ</Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label for="question">Question</Label>
                      <Input
                        type="text"
                        name="question"
                        id="question"
                        value={
                          this.state.fields["question"]
                            ? this.state.fields["question"]
                            : ""
                        }
                        onChange={(event) =>
                          this.handleChange("question", event)
                        }
                        invalid={this.state.errors["question"] ? true : false}
                      />
                      {this.state.errors["question"] && (
                        <FormFeedback>
                          {this.state.errors["question"]}
                        </FormFeedback>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label for="answer">Answer</Label>
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
                          ],
                        }}
                        value={
                          this.state.fields["answer"]
                            ? this.state.fields["answer"]
                            : ""
                        }
                        onChange={this.handleTextArea}
                        invalid={this.state.errors["answer"] ? true : false}
                      />
                      {this.state.errors["answer"] && (
                        <FormText color="danger" size="md">
                          {this.state.errors["answer"]}
                        </FormText>
                      )}
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

export default AddEditFaq;
