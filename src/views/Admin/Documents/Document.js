import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import common from "../../../services/common";
import moment from "moment";

class Document extends Component {
  state = {
    submitted: false,
  };
  handleIconByExtension = (document) => {
    let fileSrc;
    if (document.document_name.search("temp") >= 0)
      fileSrc = `${this.props.baseUrl}/documents/temp`;
    else fileSrc = `${this.props.baseUrl}/documents`;

    if (document.extension === "pdf")
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="file-pdf" size="3x" className="mt-1" />
        </a>
      );
    else if (document.extension === "xlsx" || document.extension === "xls")
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="file-excel" size="3x" className="mt-1" />
        </a>
      );
    else if (document.extension === "docx" || document.extension === "doc")
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="file-doc" size="3x" className="mt-1" />
        </a>
      );
    else if (document.extension === "ppt" || document.extension === "pptx")
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="file-powerpoint" size="2x" className="mt-1" />
        </a>
      );
    else if (
      document.extension === "archive" ||
      document.extension === "archive"
    )
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="file-archive" size="2x" className="mt-1" />
        </a>
      );
    else if (
      document.extension === "jpg" ||
      document.extension === "png" ||
      document.extension === "jpeg"
    )
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="image" size="3x" className="mt-1" />
        </a>
      );
    else {
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          <FontAwesomeIcon icon="file" size="3x" className="mt-1" />
        </a>
      );
    }
  };
  handleLinkByExtension = (document) => {
    let fileSrc;
    if (document.document_name.search("temp") >= 0)
      fileSrc = `${this.props.baseUrl}/documents/temp`;
    else fileSrc = `${this.props.baseUrl}/documents`;

    if (
      document.extension === "pdf" ||
      document.extension === "xlsx" ||
      document.extension === "xls" ||
      document.extension === "docx" ||
      document.extension === "doc" ||
      document.extension === "ppt" ||
      document.extension === "pptx" ||
      document.extension === "archive" ||
      document.extension === "jpg" ||
      document.extension === "jpeg" ||
      document.extension === "png"
    ) {
      return (
        <a href={`${fileSrc}/${document.document_name}`} target="_blank">
          {document.document_name_original}
        </a>
      );
    } else {
      return (
        <span
        // data-src={`${fileSrc}/${document.document_name}`}
        // onClick={this.props.showImage}
        // style={{ cursor: "pointer" }}
        >
          <a href={`${fileSrc}/${document.document_name}`} target="_blank">
            {document.document_name_original}
          </a>
        </span>
      );
    }
  };
  handleDeleteFile = (e) => {
    if (window.confirm("Are you sure to delete this file?")) {
      let file_name = e.target.dataset.file;
      let case_file = this.props.document.case_file;

      const params = {
        file_name: file_name,
      };
      this.setState({ submitted: true });
      this.props.serviceName.deleteDocument(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.removeDocument(file_name, case_file);
          }
        });
      });
    }
  };
  getDocumentTypeName = (id) => {
    let documentType = this.props.documentTypes.filter(
      (type, i) => parseInt(i + 1) === parseInt(id)
    );
    if (documentType.length > 0) {
      return documentType[0];
    }
  };
  render() {
    const record = this.props.document;
    return (
      <tr key={record.document_name}>
        {this.props.chooseDocument && (
          <td>
            <input
              type="checkbox"
              onChange={this.props.handleChooseDocument}
              value={record.id}
              checked={this.props.checked}
            />
          </td>
        )}
        <td className="pt-0">{this.handleIconByExtension(record)} </td>
        <td>{this.handleLinkByExtension(record)}</td>
        <td>{this.getDocumentTypeName(record.document_type_id)}</td>
        <td>
          {this.props.document["uploadedby"]
            ? common.getFullName(this.props.document["uploadedby"])
            : this.props.uploadedby}
        </td>
        {this.props.uploadedOn && (
          <td>{moment(record.added_on).format("MMMM DD, YYYY")}</td>
        )}
        {this.props.enableEdit && (
          <td align="center">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={this.handleDeleteFile}
              data-file={record.document_name}
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Edit
            </button>
          </td>
        )}

        {this.props.enableDelete && (
          <td align="center">
            <button
              className="btn btn-danger btn-sm"
              type="button"
              onClick={this.handleDeleteFile}
              data-file={record.document_name}
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon
                  icon="spinner"
                  /*className="mr-1"*/ spin={true}
                />
              )}
              Delete
            </button>
          </td>
        )}
      </tr>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    uploadedby: state.name,
  };
};
export default connect(mapStateToProps)(Document);
