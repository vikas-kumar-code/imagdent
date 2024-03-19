import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, Card, CardHeader, CardBody } from "reactstrap";
import { connect } from "react-redux";
import Document from "./Document";
import ViewImage from "./ViewImage";
import { Scrollbar } from "react-scrollbars-custom";

class Documents extends Component {
  state = {
    imageSource: "",
    showModal: false,
    chooseDocuments: [],
  };
  toggleSubModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };
  showImage = (e) => {
    this.setState({ imageSource: e.target.dataset.src });
    this.toggleSubModal();
  };
  removeDocument = (file_name, case_file) => {
    this.props.removeDocument(file_name, case_file);
  };
  handleChooseDocument = (e) => {
    let chooseDocuments = this.state.chooseDocuments;
    if (e.target.checked) {
      let indexToBePuhsed = this.props.documents.filter(
        (doc) => parseInt(doc.id) === parseInt(e.target.value)
      );
      chooseDocuments.push(indexToBePuhsed[0]);
    } else {
      let docToBeRemoved = this.props.documents.filter(
        (doc) => parseInt(doc.id) === parseInt(e.target.value)
      );
      chooseDocuments.splice(docToBeRemoved[0], 1);
    }
    this.setState({ chooseDocuments }, () => {
      this.props.updateSelectedDocuments(chooseDocuments);
    });
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
          <Scrollbar
            thumbYProps={{ style: { width: "5px" } }}
            thumbXProps={{ style: { width: "5px" } }}
            trackXProps={{ style: { width: "5px" } }}
            trackYProps={{ style: { width: "5px" } }}
          >
            <Table hover>
              <thead>
                <tr>
                  {this.props.chooseDocument && (
                    <th scope="col" className="border-top-0" width={3 + "%"}>
                      <input type="checkbox" />
                    </th>
                  )}
                  <th scope="col" className="border-top-0" width={7 + "%"} />

                  <th scope="col" className="border-top-0">
                    Name
                  </th>
                  <th scope="col" className="border-top-0">
                    Type
                  </th>
                  <th scope="col" className="border-top-0">
                    Uploaded By
                  </th>
                  {this.props.uploadedOn && (
                    <th scope="col" className="border-top-0">
                      Uploaded On
                    </th>
                  )}
                  {this.props.enableEdit && (
                    <th scope="col" className="border-top-0" />
                  )}
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
                        chooseDocument={this.props.chooseDocument}
                        handleChooseDocument={this.handleChooseDocument}
                        checked={this.checkDocument(document.id)}
                        serviceName={this.props.serviceName}
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
          </Scrollbar>
        </CardBody>
        {this.state.showModal && (
          <ViewImage
            showModal={this.state.showModal}
            toggleSubModal={this.toggleSubModal}
            imageSource={this.state.imageSource}
          />
        )}
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
