import React, { Component } from "react";
import {
  Card,
  CardHeader,
  Form,
  CardBody,
} from "reactstrap";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";
import { connect } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

class AddEditDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      submitted: false,
      loader: false,
      types: [],
      file: {},
      files: [],
    };
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
            <FilePond
              allowMultiple={true}
              maxFiles={30}
              allowRemove={true}
              ref={(ref) => (this.pond = ref)}
              value={this.props.caseId}
              server={{
                url: this.props.apiUrl,
                process: {
                  url: "/common/upload-case-documents",
                  headers: {
                    "X-Api-Key": `Bearer  ${this.props.token}`,
                  },
                  ondata: (formData) => {
                    console.log(formData);
                    formData.append(
                      "document_type_id",
                      this.state.fields.document_type_id
                    );
                    formData.append("case_file", this.props.caseFile);
                    formData.append("caseId", this.props.caseId);
                    formData.append("extension", "pdf");
                    return formData;
                  },
                  onload: (response) => {
                    let response_josn = JSON.parse(response);
                    if (response_josn.success) {
                      let file = response_josn.file;
                      file["case_file"] = this.props.caseFile;
                      let fields = this.state.fields;
                      this.props.addDocument(file);
                      //   this.setState({
                      //     file,
                      //     fields,
                      //   });
                    }
                  },
                  onerror: (error) => {
                    console.log("test");
                    return error;
                  },
                },
                revert: {
                  url: "/common/delete-file",
                  headers: {
                    "X-Api-Key": `Bearer  ${this.props.token}`,
                  },
                  onload: (response) => {
                    //console.log(response);
                  },
                },
              }}
              onwarning={(err) => {
                toast.error(
                  "You have exceed the limit of files to be uploaded",
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
                return err;
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
