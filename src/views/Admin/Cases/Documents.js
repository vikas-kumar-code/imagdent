import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, Card, CardHeader, CardBody } from "reactstrap";
import { connect } from "react-redux";
import Document from "./Document";
import { Scrollbars } from "react-custom-scrollbars";

class Documents extends Component {
  state = {
    imageSource: "",
    showModal: false,
    chooseDocuments: [],
  };

  removeDocument = (file_name, case_file) => {
    this.props.removeDocument(file_name, case_file);
  };
  checkDocument = (id) => {
    let chooseDocuments = this.state.chooseDocuments.filter(
      (doc) => parseInt(doc.id) === parseInt(id)
    );
    if (chooseDocuments.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  componentDidMount = () => {
    if (this.props.selectedDocuments) {
      this.setState({ chooseDocuments: this.props.selectedDocuments });
    }
  };
  render() {
    return (
      <Card>
        <CardHeader>
          <strong>{this.props.title}</strong>
        </CardHeader>
        <CardBody>
          <Scrollbars
            autoHeight
            autoHeightMin={200}
            autoHeightMax={300}
            autoHide={true}
          >
            <Table hover>
              <thead>
                <tr>
                  <th scope="col" className="border-top-0" width={7 + "%"} />
                  <th scope="col" className="border-top-0">
                    Name
                  </th>
                  <th scope="col" className="border-top-0">
                    Extension
                  </th>
                  <th scope="col" className="border-top-0">
                    Size
                  </th>
                  <th scope="col" className="border-top-0">
                    Uploaded On
                  </th>
                  <th scope="col" className="border-top-0">
                    Uploaded By
                  </th>
                  {this.props.enableDelete && (
                    <th scope="col" className="border-top-0" />
                  )}
                </tr>
              </thead>
              <tbody>
                {this.props.documents.length > 0
                  ? this.props.documents.map((document, index) => (
                      <Document
                        document={document}
                        removeDocument={this.removeDocument}
                        enableDelete={this.props.enableDelete}
                        enableEdit={this.props.enableEdit}
                        uploadedOn={this.props.uploadedOn}
                        showImage={this.showImage}
                        key={`document-key-${index}`}
                        documentTypes={this.props.documentTypes}
                        checked={this.checkDocument(document.id)}
                      />
                    ))
                  : !this.state.isloader && (
                      <tr>
                        <td key={0} colSpan="7">
                          <p className="text-center">Document not found.</p>
                        </td>
                      </tr>
                    )}
              </tbody>
            </Table>
          </Scrollbars>
        </CardBody>
      </Card>
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
export default connect(mapStateToProps)(Documents);
