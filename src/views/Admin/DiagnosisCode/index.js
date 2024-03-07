import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import Error403 from "../../Error403";

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
import diagnosis from "../../../services/diagnosiscode";
import Diagnosis from "./Diagnosis";
import AddEditDiagnosis from "./AddEditDiagnosis";
import { Helmet } from "react-helmet";
import Search from "../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DiagnosisCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      diagnosis_codes: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      itemsCountPerPage: [20, 50, 100],
      totalItemsCount: 0,
      hasMore: false,
      showModal: false,
      diagnosisCodeId: "",
      search: false,
      searchFields: [
        { label: "Name", name: "name", type: "text" },
        { label: "Code", name: "code", type: "text" }
      ],
      sort: "",
      currentSortedColumn: null,
      error_403: false,
      fieldsFromSearch: {}
    };
  }

  updateSearchFields = fields => {
    this.setState({ fields });
  };
  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getDiagnosisCodes();
    });
  };
  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };
  getDiagnosisCodes = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    diagnosis
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            diagnosis_codes: response.data.diagnosis_codes,
            totalItemsCount: response.data.pages.totalCount
          });
        }
      })
      .catch(function (error) {
        this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getDiagnosisCodes();
  };
  deleteDiagnosisCode = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this diagnosis code?")) {
      diagnosis.deleteDiagnosisCode(params).then(response => {
        if (response.data.success) {
          let diagnosis_codes = this.state.diagnosis_codes;
          diagnosis_codes = this.state.diagnosis_codes.filter(d => d.id !== id);
          this.setState({ diagnosis_codes });
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
    let diagnosisCodeId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      diagnosisCodeId
    }));
  };
  handlePageChange = e => {
    this.setState({ page: e, isloader: true }, () => {
      this.getDiagnosisCodes(this.state.fieldsFromSearch);
    });
  };
  sortRecord = (e, column) => {
    e.persist();
    let sort;
    if (e.target.className.indexOf("sortable") > 0) {
      sort = column;
      e.target.className = "border-top-0 asc";
    } else if (e.target.className.indexOf("asc") > 0) {
      sort = "-" + column;
      e.target.className = "border-top-0 desc";
    } else if (e.target.className.indexOf("desc") > 0) {
      sort = column;
      e.target.className = "border-top-0 asc";
    }
    this.setState({ sort }, () => {
      if (this.state.currentSortedColumn !== null) {
        if (this.state.currentSortedColumn.target !== e.target) {
          this.state.currentSortedColumn.target.className =
            "border-top-0 sortable";
        }
      }
      this.setState({ currentSortedColumn: e }, () => {
        this.getDiagnosisCodes(this.state.fieldsFromSearch);
      });
    });
  };

  getFieldsfromSearch = (fields) => {
    this.setState({ fieldsFromSearch: fields })
  }

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Diagnosis Code : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Diagnosis Codes</h3></Col>

                  <Col md={4} sm={12} className="text-right">
                    <Row>
                      <Col sm={12} md={6}>
                        <Button
                          color="warning"
                          type="button"
                          onClick={this.toggleSearch}
                          className="mr-2 m-1 btn-block"
                        >
                          <FontAwesomeIcon icon="search" className="mr-1" />
                          Search
                        </Button>
                      </Col>
                      <Col sm={12} md={6}>
                        <Button
                          color="success"
                          type="button"
                          className="m-1 btn-block"

                          onClick={this.toggleModal}
                        >
                          Add New Diagnosis Code
                        </Button>
                      </Col>
                    </Row>

                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Diagnosis code"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getDiagnosisCodes}
                  clearSearch={this.clearSearch}
                  getFieldsfromSearch={this.getFieldsfromSearch}
                />
              </CardHeader>
              <CardBody>
                <LoadingOverlay
                  active={this.state.isloader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  <Row>
                    <Col md={12} className="text-right">
                      {this.state.totalItemsCount > 20 && (
                        <Pagination
                          activePage={this.state.page}
                          itemsCountPerPage={this.state.pageSize}
                          totalItemsCount={this.state.totalItemsCount}
                          onChange={this.handlePageChange}
                        />
                      )}
                    </Col>
                  </Row>
                  <Table responsive className="table-striped">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={7 + "%"}
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={event => this.sortRecord(event, "name")}
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={event => this.sortRecord(event, "code")}
                        >
                          Code
                        </th>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                          colSpan="2"
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.diagnosis_codes.length > 0 ? (
                        this.state.diagnosis_codes.map((diagnosis, index) => (
                          <Diagnosis
                            diagnosis={diagnosis}
                            getDiagnosisCodes={this.getDiagnosisCodes}
                            deleteDiagnosisCode={this.deleteDiagnosisCode}
                            key={`key-diagnosis-${index}`}
                            enableEditDelete={true}
                            toggleModal={this.toggleModal}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">
                              Diagnosis code not found.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {this.state.totalItemsCount > 20 && (
                      <tfoot>
                        <tr>
                          <td colSpan="10">
                            <Pagination
                              activePage={this.state.page}
                              itemsCountPerPage={this.state.pageSize}
                              totalItemsCount={parseInt(
                                this.state.totalItemsCount
                              )}
                              onChange={this.handlePageChange}
                            />
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </Table>
                </LoadingOverlay>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showModal && (
          <AddEditDiagnosis
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            diagnosisCodeId={this.state.diagnosisCodeId}
            getDiagnosisCodes={this.getDiagnosisCodes}
            fieldsFromSearch={this.state.fieldsFromSearch}
          />
        )}
      </div>
    );
  }
}

export default DiagnosisCode;
