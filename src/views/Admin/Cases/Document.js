import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import common from "../../../services/common";
import moment from "moment";
import ccase from "../../../services/case";

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
          <FontAwesomeIcon icon="file-word" size="3x" className="mt-1" />
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
        <a href={`${fileSrc}/${document.document_name}`} target="_blank" style={{
          width: "175px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "block",
        }}>
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
          <a href={`${this.props.apiUrl}/site/download/?file=${document.document_name}`}  target="_blank">
            {document.document_name_original}
          </a>
        </span>
      );
    }
  };
  handleDeleteFile = (e, file) => {
    if (window.confirm("Are you sure to delete this file?")) {
      let file_name = file;
      let case_file = this.props.document.case_file;

      const params = {
        file_name: file_name,
      };
      this.setState({ submitted: true });
      ccase.deleteDocument(params).then((response) => {
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
        <td className="pt-0">{this.handleIconByExtension(record)} </td>
        <td>
          {this.handleLinkByExtension(record)}
        </td>
        <td>{record.extension}</td>
        <td>{`${(record.size / 1024).toFixed(0)} kb`}</td>
        <td>{moment(record.added_on).format("ll")}</td>
        <td>{common.getFullName(this.props.document["uploadedby"])}</td>

        {this.props.enableDelete && (
          <td align="center">
            <FontAwesomeIcon
              icon="trash"
              size="lg"
              onClick={(e) => this.handleDeleteFile(e, record.document_name)}
              disabled={this.state.submitted}
            />
          </td>
        )}
      </tr>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    apiUrl:state.apiUrl,
    uploadedby: state.name,
  };
};
export default connect(mapStateToProps)(Document);
