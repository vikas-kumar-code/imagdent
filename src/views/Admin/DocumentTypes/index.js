import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Spinner,
  InputGroup,
  Button,
  Form
} from "reactstrap";
import patient from "../../../services/patient";
import DocumentType from "./DocumentType";
import AddEditType from "./AddEditType";
import { Helmet } from "react-helmet";
import Search from "../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DocumentTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      types: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      documentTypeId: "",
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false
    };
  }

  updateSearchFields = fields => {
    this.setState({ fields });
  };
  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getDocumentTypes();
    });
  };
  getDocumentTypes = e => {
    if (e !== undefined) {
      e.preventDefault();
    }

    this.setState({ isloader: true });
    let params = {
      fields: this.state.fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };
    let that = this;

    patient
      .getDocumentTypes(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            types: response.data.types,
            pages: response.data.pages.totalCount
          });
        }
      })
      .catch(function(error) {
        that.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getDocumentTypes();
  };
  deleteDocumentType = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this type?")) {
      patient.deleteDocumentType(params).then(response => {
        if (response.data.success) {
          let types = this.state.types;
          types = this.state.types.filter(document => document.id !== id);
          this.setState({ types });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        } else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      });
    }
  };
  toggleModal = e => {
    let documentTypeId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      documentTypeId
    }));
  };
  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Document Types : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>Document Types</strong>
                      </InputGroup>
                    </Form>
                  </Col>
                  <Col xs={6} className="text-right">
                    <Button
                      color="warning"
                      type="button"
                      onClick={this.toggleSearch}
                      className="mr-2"
                    >
                      <FontAwesomeIcon icon="search" className="mr-1" />
                      Search
                    </Button>
                    <Button
                      color="success"
                      type="button"
                      onClick={this.toggleModal}
                    >
                      Add New Document Type
                    </Button>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Document"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getDocumentTypes}
                  clearSearch={this.clearSearch}
                />
              </CardHeader>
              <CardBody>
                <LoadingOverlay
                  active={this.state.isloader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={7 + "%"}
                        >
                          ID
                        </th>
                        <th scope="col" className="border-top-0">
                          Name
                        </th>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.types.length > 0 ? (
                        this.state.types.map((document, index) => (
                          <DocumentType
                            document={document}
                            getDocumentTypes={this.getDocumentTypes}
                            deleteDocumentType={this.deleteDocumentType}
                            key={`key-document-type-${index}`}
                            toggleModal={this.toggleModal}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">
                              Document type not found.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.types.length > 20 && (
                  <Pagination
                    activePage={this.state.page}
                    itemsCountPerPage={this.state.pageSize}
                    totalItemsCount={this.state.pages}
                    onChange={this.handlePageChange}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showModal && (
          <AddEditType
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            documentTypeId={this.state.documentTypeId}
            getDocumentTypes={this.getDocumentTypes}
          />
        )}
      </div>
    );
  }
}

export default DocumentTypes;
