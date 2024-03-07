import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Form,
  Label,
  FormFeedback,
  FormGroup,
  Input,
  CardBody,
} from "reactstrap";
//import user from "../../../services/user";
import common from "../../../services/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";
import { connect } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class AddEditDocument extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    types: [],
    file: {},
  };

  componentDidMount() {
    if (this.props.id) {
      this.getPatient(this.props.id);
    }
  }
  handleChange = (field, e) => {
    if (this.props.checkUploadedFile) {
      this.props.checkUploadedFile(true);
    }
    let fields = this.state.fields;
    let { options, selectedIndex } = e.target;
    if (
      field === "document_type_id" &&
      options[selectedIndex].text === "DICOM"
    ) {
      confirmAlert({
        message: "Make sure the uploaded file is a Zip file!",
        buttons: [
          {
            label: "Ok",
          },
          {
            label: "Cancel",
          },
        ],
      });
    }
    fields[field] = e.target.value;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      let fields = this.state.fields;
      if (this.props.caseFile !== undefined) {
        fields["case_file"] = this.props.caseFile;
      }
      this.setState({ submitted: true, fields });
      const params = {
        fields: this.state.fields,
        file: this.state.file,
      };
      common.saveDocument(params).then((response) => {
        if (response.data.success) {
          this.setState(
            {
              submitted: false,
              fields: {},
              errors: {},
            },
            () => {
              if(this.props.callBack){
                this.props.callBack(response.data.file_details)
              }
              this.props.addDocument(response.data.file_details);
              this.pond.removeFiles();
              if (this.props.checkUploadedFile) {
                this.props.checkUploadedFile(false);
              }
            }
          );
        }
      });
    }
  };

  handleReset = () => {
    if (this.props.checkUploadedFile) {
      this.props.checkUploadedFile(false);
    }
    this.pond.removeFiles();
    this.setState({
      submitted: false,
      fields: {},
      errors: {},
    });
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["document_type_id"]) {
      formIsValid = false;
      errors["document_type_id"] = "Please select document type.";
    }
    if (!fields["document_name_original"]) {
      formIsValid = false;
      errors["document_name_original"] = "Document name can not be empty!";
    }
    if (common.isEmptyObject(this.state.file)) {
      formIsValid = false;
      errors["file"] = "Please browse file to upload.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  checkCallBack = (file, progress) => {
    console.log(file.id);
    //console.log(this.state.files);
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Card>
          <CardHeader>
            <strong>
              {this.props.document_id ? "Update " : "Add New"} Document
            </strong>
          </CardHeader>
          <CardBody>
            <FormGroup>
              {this.props.documentTypes !== undefined && (
                <>
                  <Label for="document_type_id">Document Type</Label>
                  <Input
                    type="select"
                    name="document_type_id"
                    id="document_type_id"
                    onChange={(event) =>
                      this.handleChange("document_type_id", event)
                    }
                    value={
                      this.state.fields["document_type_id"]
                        ? this.state.fields["document_type_id"]
                        : ""
                    }
                    invalid={
                      this.state.errors["document_type_id"] ? true : false
                    }
                    className="input-bg"
                  >
                    <option value="">-Select-</option>
                    {this.props.documentTypes.map((document, i) => (
                      <option value={i + 1} key={`key-document-${i + 1}`}>
                        {document}
                      </option>
                    ))}
                  </Input>
                </>
              )}
              {this.state.errors["document_type_id"] && (
                <FormFeedback>
                  {this.state.errors["document_type_id"]}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="document_name_original">Document Name</Label>
              <Input
                type="text"
                name="document_name_original"
                id="document_name_original"
                value={
                  this.state.fields["document_name_original"]
                    ? this.state.fields["document_name_original"]
                    : ""
                }
                onChange={(event) =>
                  this.handleChange("document_name_original", event)
                }
                invalid={
                  this.state.errors["document_name_original"] ? true : false
                }
              />
              {this.state.errors["document_name_original"] && (
                <FormFeedback>
                  {this.state.errors["document_name_original"]}
                </FormFeedback>
              )}
            </FormGroup>
            <FilePond
              allowMultiple={false}
              allowRemove={true}
              ref={(ref) => (this.pond = ref)}
              server={{
                url: this.props.apiUrl,
                process: {
                  url: "/common/upload-documents",
                  headers: {
                    "X-Api-Key": `Bearer  ${this.props.token}`,
                  },
                  onload: (response) => {
                    let response_josn = JSON.parse(response);
                    if (response_josn.success) {
                      let file = response_josn.file;
                      let fields = this.state.fields;
                      if (!fields["document_name_original"]) {
                        fields["document_name_original"] =
                          file.document_name_original;
                      }
                      this.setState({
                        file,
                        fields,
                      });
                      return response_josn.file.name;
                    }
                  },
                  onerror: (error) => {
                    return error;
                  },
                },
                revert: {
                  url: "/common/delete-file",
                  headers: {
                    "X-Api-Key": `Bearer  ${this.props.token}`,
                    //file_name: files
                  },
                  onload: (response) => {
                    //console.log(response);
                  },
                },
              }}
              onprocessfileprogress={(file, progress) =>
                this.checkCallBack(file, progress)
              }
              onprocessfilerevert={(file) => {
                let documents = this.state.documents.filter(
                  (document) => document != file.serverId
                );
                this.setState({
                  documents,
                });
              }}
              labelFileProcessingError={(error) => {
                let message = JSON.parse(error.body);
                return message.message;
              }}
            />
            {this.state.errors["file"] && (
              <small className="fa-1x text-danger">
                {this.state.errors["file"]}
              </small>
            )}
          </CardBody>
          <CardFooter className="text-right">
            <Button type="button" color="danger" className="mr-2" size="sm" onClick = {this.handleReset}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              size="sm"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Save Document
            </Button>
          </CardFooter>
        </Card>
      </Form>
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
export default connect(mapStateToProps)(AddEditDocument);
