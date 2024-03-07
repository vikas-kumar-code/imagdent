import React, { Component } from "react";
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
import { Scrollbars } from "react-custom-scrollbars";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import common from "../../../services/common";
import images from "../../../services/images";
import ModalFooter from "reactstrap/lib/ModalFooter";
class ImageModal extends Component {
  state = {
    loader: true,
    fields: {},
    errors: {},
    images: [],
    submitted: false,
    files: {},
  };

  copyUrl = (e, content) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(`${this.props.baseUrl}/api/web/images/${content.file_name}`)
      .then(
        () => {
          toast.success("Address copied to clipboard.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        },
        function () {
          toast.success("Sorry! Your browser does not support this feature.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      );
  };

  imageFetch = () => {
    images.list().then((res) => {
      if (res.data.success) {
        this.setState({ images: res.data.images, loader: false });
      }
    });
  };

  componentDidMount = () => {
    this.imageFetch();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true, loader: true });
      const data = new FormData();
      Object.keys(this.state.fields.file_names).forEach((f) => {
        data.append("file_names[]", this.state.fields.file_names[f]);
      });
      images.addimages(data).then((res) => {
        if (res.data.success) {
          this.setState({ submitted: false });
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.imageFetch();
        } else if (res.data.error) {
          toast.error(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };

  handleChange = (e, field) => {
    let fields = this.state.fields;
    fields[field] = e.target.files;
    this.setState({ fields });
  };

  deleteCode = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      images.delete({ id: id }).then((res) => {
        if (res.data.success) {
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          let newImageLists = this.state.images.filter(
            (img) => parseInt(img.id) !== parseInt(id)
          );
          this.setState({ images: newImageLists });
        } else if (res.data.error) {
          toast.error(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };

  handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (common.isEmptyObject(this.state.fields.file_names)) {
      formIsValid = false;
      errors["file_names"] = "Please choose image(s) to upload!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>Images</ModalHeader>
        <ModalBody className="pl-4 pr-4">
          <div className="animated fadeIn">
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Form
                name="add-edit-banner-form"
                method="post"
                onSubmit={this.handleSubmit}
              >
                <Row>
                  <Col>
                    <Input
                      type="file"
                      id="file_names"
                      name="file_names"
                      multiple="multiple"
                      onChange={(event) =>
                        this.handleChange(event, "file_names")
                      }
                    />
                    <br />
                    {this.state.errors["file_names"] && (
                      <small className="fa-1x text-danger">
                        {this.state.errors["file_names"]}
                      </small>
                    )}
                  </Col>

                  <Col className="text-right">
                   
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
                      Add
                    </button>
                  </Col>
                </Row>
                {this.state.images.length > 0 ? (
                  <Scrollbars style={{ minHeight: 400 }} autoHide={true}>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {this.state.images.map((img) => (
                            <Col md={4}>
                              <img
                                src={`${this.props.baseUrl}/api/web/images/${img.file_name}`}
                                className="img-thumbnail"
                                style={{ height: 140, width: 350 }}
                              />
                              <br />
                              <div class="d-flex justify-content-center">
                                <Button
                                  color="danger"
                                  className="btn-sm mt-1 mb-2 mr-3"
                                  onClick={() => this.deleteCode(img.id)}
                                >
                                  Delete
                                </Button>

                                <Button
                                  color="success"
                                  className="btn-sm mt-1 mb-2"
                                  onClick={(e) => this.copyUrl(e, img)}
                                >
                                  Copy
                                </Button>
                              </div>
                            </Col>
                          ))}
                     </div>
                  </Scrollbars>
                ) : (
                  <h5 className="text-center">No records found</h5>
                )}
              </Form>
            </LoadingOverlay>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            color="primary"
            className="btn btn-outline-dark"
            onClick={() => this.props.toggleModal()}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
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
export default connect(mapStateToProps)(ImageModal);
