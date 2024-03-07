import React, { Component } from "react";
import ccase from "../../../services/case";
import user from "../../../services/user";
import common from "../../../services/common";
import {
  Row,
  Col,
  Input,
  Form,
  Spinner,
  Button,
  FormGroup,
  Card,
  CardBody,
} from "reactstrap";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardFooter from "reactstrap/lib/CardFooter";
import { connect } from "react-redux";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";

class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: { case_id: this.props.caseId },
      submitted: false,
      errors: [],
    };
  }

  handleChange = (e) => {
    let fields = this.state.fields;
    let { name, value } = e.target;
    fields[name] = value;
    this.setState({ fields });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
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
              let fields = this.state.fields;
              fields["notes"] = "";
              this.setState({ fields });
              this.props.getNotes();
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

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["notes"]) {
      formIsValid = false;
      errors["notes"] = "Note can not be empty!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  deleteNote = (id) => {
    if (window.confirm("Are you sure to delete this Note?")) {
      ccase.deleteNote({ id: id }).then((response) => {
        if (response.data.success) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.getNotes();
        } else if (response.data.error) {
          if (response.data.message) {
            this.setState({ errors: response.data.message });
          }
        }
      });
    }
  };

  render() {
    const { fields, errors } = this.state;
    const { notes } = this.props;
    return (
      <React.Fragment>
        {notes.length > 0 && (
          <LoadingOverlay
            active={this.props.noteLoader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Scrollbars
              autoHeight
              autoHeightMin={300}
              autoHeightMax={400}
              autoHide={true}
            >
              <Row>
                <Col xl={12}>
                  {notes.map((note, index) => {
                    return (
                      <Row key={index}>
                        <Col md={12}>
                          <Card>
                            <CardBody>
                              <Row>
                                <Col md={12}>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: note.notes,
                                    }}
                                  />
                                </Col>
                                <Col md={12} className="text-right">
                                  <strong>Added By: </strong>
                                  {common.getFullName(note.addedby)}
                                </Col>
                              </Row>
                            </CardBody>
                            <CardFooter>
                              <Row>
                                <Col md={4}>
                                  <strong>
                                    {moment(note.added_on).format("LLL")}
                                  </strong>
                                </Col>
                                {this.props.userId == note.added_by && (
                                  <Col md={8} className="text-right">
                                    <Button
                                      color="danger"
                                      className="btn-sm"
                                      onClick={() => this.deleteNote(note.id)}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                )}
                              </Row>
                            </CardFooter>
                          </Card>
                        </Col>
                      </Row>
                    );
                  })}
                </Col>
              </Row>
            </Scrollbars>
          </LoadingOverlay>
        )}
        <Row className="mt-3">
          <Col xl="12">
            <Form name="note-frm" method="post" onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md={12}>
                  <Input
                    type="textarea"
                    style={{ height: 100 }}
                    name="notes"
                    value={fields["notes"]}
                    onChange={this.handleChange}
                  />
                  {errors["notes"] && (
                    <small className="fa-1x text-danger">
                      {errors["notes"]}
                    </small>
                  )}
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md={12}>
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
                    Add Note
                  </button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};
export default connect(mapStateToProps)(AddNote);
