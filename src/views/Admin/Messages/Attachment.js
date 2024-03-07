import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { Card, CardFooter, CardBody, Button } from "reactstrap";

class Attachment extends Component {
  constructor(props) {
    super(props);
  }
  returnByExtension = () => {
    if (
      this.props.attachment.type === "jpg" ||
      this.props.attachment.type === "jpeg" ||
      this.props.attachment.type === "png" ||
      this.props.attachment.type === "gif"
    ) {
      return (
        <img
          src={`${this.props.baseUrl}/documents/${this.props.attachment.name}`}
          className="img-fluid"
        />
      );
    } else if (this.props.attachment.type === "pdf") {
      return (
        <FontAwesomeIcon
          icon="file-pdf"
          size="10x"
          /* style={{ width: 50, border: "1px solid #cccccc" }} */
          className="p-1"
        />
      );
    }
  };

  downloadFile = () => {
    return (
      <a
        className="btn btn-secondary"
        href={`${this.props.baseUrl}/documents/${this.props.attachment.name}`}
        target="_blank"
        download={`${this.props.attachment.name}`}
      >
        {this.props.attachment.name}
      </a>
    );
  };
  render() {
    return (
      <Card>
        <CardBody className="text-center">{this.returnByExtension()}</CardBody>
        <CardFooter>
          {this.props.attachment.name}
            <a
              href={`${this.props.baseUrl}/documents/${this.props.attachment.name}`}
              target="_blank"
              download={`${this.props.attachment.name}`}>
                <i className="fa fa-download fa-lg ml-5" aria-hidden="true"/>
                </a>
         
        </CardFooter>
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    apiUrl: state.apiUrl,
    baseUrl: state.baseUrl,
  };
};

export default connect(mapStateToProps)(Attachment);
