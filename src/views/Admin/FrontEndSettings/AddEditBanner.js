import React, { Component } from "react";
import setting from "../../../services/setting";
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
  FormFeedback,
  FormText
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";

class AddEditBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: {},
      errors: {},
      submitted: false,
      file:{}
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        id: this.props.bannerId
      };

      setting.addBanner(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
            this.props.getBanners();
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.name) {
              errors["name"] = response.data.message.name[0];
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
    if (common.isEmptyObject(fields['file'])) {
      formIsValid = false;
      errors["file"] = "Please choose banner image to upload!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getBanner = id => {
    this.setState({ loader: true });
    setting.getBanner({ id: id }).then(response => {
      if (response.data.success) {
        let fields = response.data.banner;
        fields['file'] = {file_name:response.data.banner.file_name};
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
    if (this.props.bannerId) {
      this.getBanner(this.props.bannerId);
    }
  };
  checkCallBack = (file, progress) => {
    console.log(file.id);
    //console.log(this.state.files);
  };
  handleTextArea = content => {
    let fields = this.state.fields;
    fields['html'] = content;
    this.setState({ fields });
  };
  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.bannerId ? "Update " : "Add "} Banner
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
                name="add-edit-banner-form"
                method="post"
                onSubmit={this.handleSubmit}
              >
                  <FormGroup>
                    <ReactSummernote
                      options={{
                        height: 200,
                        dialogsInBody: true,
                        toolbar: [
                          ["style", ["style"]],
                          ["font", ["bold", "underline", "clear"]],
                          ["fontname", ["fontname"]],
                          //["para", ["ul", "ol", "paragraph"]],
                          //["table", ["table"]],
                          ["view", ["fullscreen", "codeview"]]
                        ]
                      }}
                      value={
                        this.state.fields["html"] ? this.state.fields["html"] : ""
                      }
                      onChange={this.handleTextArea}
                      invalid={this.state.errors["html"] ? true : false}
                    />
                    {this.state.errors["html"] && (
                      <FormText color="danger" size="md">
                        {this.state.errors["html"]}
                      </FormText>
                    )}
                  </FormGroup>
                  <FilePond
                    allowMultiple={false}
                    allowRemove={true}
                    ref={ref => (this.pond = ref)}
                    server={{
                        url: this.props.apiUrl,
                        process: {
                        url: "/common/upload-banner",
                        headers: {
                            "X-Api-Key": `Bearer  ${this.props.token}`
                        },
                        onload: response => {
                            let response_josn = JSON.parse(response);
                            if (response_josn.success) {
                            let fields = this.state.fields;
                            fields['file'] = response_josn.file;
                            this.setState({
                                fields
                            });
                            return response_josn.file.name;
                            }
                        },
                        onerror: error => {
                            return error;
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
                    labelFileProcessingError={error => {
                        let message = JSON.parse(error.body);
                        return message.message;
                    }}
                    />
                    {this.state.errors["file"] && (
                    <small className="fa-1x text-danger">
                        {this.state.errors["file"]}
                    </small>
                    )}
                {/* <FormGroup>
                  <Label for="name">URL</Label>
                  <Input
                    type="name"
                    name="name"
                    id="name"
                    value={
                      this.state.fields["name"] ? this.state.fields["name"] : ""
                    }
                    onChange={event => this.handleChange("name", event)}
                    invalid={this.state.errors["name"] ? true : false}
                    className="input-bg"
                    bsSize="lg"
                  />
                  {this.state.errors["name"] && (
                    <FormFeedback>{this.state.errors["name"]}</FormFeedback>
                  )}
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
                      {this.props.bannerId ? "Update" : "Add"}
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
        baseUrl: state.baseUrl,
        apiUrl: state.apiUrl,
        token: state.token
    };
};
export default connect(mapStateToProps)(AddEditBanner);
