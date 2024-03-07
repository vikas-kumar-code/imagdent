import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error403 from "../../Error403";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Col,
  Row,
  Table,
  Spinner,
  InputGroup,
  Button,
  Form,
  Modal,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import ccase from "../../../services/case";
import common from "../../../services/common";
import Case from "./Case";
import { Helmet } from "react-helmet";
import Search from "../Search";
import { Link } from "react-router-dom";
import PatientDetailsBody from "../Patients/PatientDetailsBody";
import { connect } from "react-redux";

class Cases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      cases: [],
      pages: {},
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      showPatientModal: false,
      search: false,
      searchFields: [
        {
          label: "Choose Clinic",
          name: "clinic_id",
          type:
            parseInt(this.props.userType) === 1 ||
              parseInt(this.props.userType) === 15
              ? "select-with-ajax-search"
              : "select-with-search",
          values: [],
          loadOptions: this.promiseClinicOptions,
        },
        {
          label: "Choose Location",
          name: "location_id",
          type: "select-with-search",
          values: [],
        },
        {
          label: "Choose User",
          name: "user_id",
          type: "select-with-search",
          type:
            parseInt(this.props.userType) === 1 ||
              parseInt(this.props.userType) === 15
              ? "select-with-ajax-search"
              : "select-with-search",
          values: [],
          loadOptions: this.promiseUserOptions,
        },
        {
          label: "Appointment Date Range",
          name: "appointment_date",
          type: "date-range",
        },
        { label: "Patient Name", name: "name", type: "text" },
        {
          label: "Case Id",
          name: "case_id",
          type: "text"
        },
        {
          label: "Status",
          name: "status",
          type: "select-with-search-multiple",
          values: [],
          grid: 12,
        },

      ],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      defaultLocation: {},
      fieldsFromSearch: {},
    };
  }

  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getCases();
    });
  };
  getCases = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo,
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    ccase
      .list(params)
      .then((response) => {
        this.setState({ isloader: false });
        if (response.data.success) {
          let cases = [];
          if (fields !== undefined) {
            cases = response.data.cases;
          } else {
            cases = response.data.cases.filter(
              (v) =>
                parseInt(v.location_id) === parseInt(this.props.defaultLocation)
            );
          }

          this.setState({
            cases: cases,
            pages: response.data.pages,
          });
        }
      })
      .catch((error) => {
        this.setState({ error_403: true });
      });
  };

  getSearchCases = (fields) => {
    this.setState({ isloader: true, pageNo: 1 }, () => {
      let params = {
        fields: fields,
        pageSize: this.state.pageSize,
        page: this.state.pageNo,
      };
      if (this.state.sort !== "") {
        params["sort"] = this.state.sort;
      }
      ccase
        .list(params)
        .then((response) => {
          this.setState({ isloader: false });
          if (response.data.success) {
            let cases = [];
            if (fields !== undefined) {
              cases = response.data.cases;
            } else {
              cases = response.data.cases.filter(
                (v) =>
                  parseInt(v.location_id) === parseInt(this.props.defaultLocation)
              );
            }

            this.setState({
              cases: cases,
              pages: response.data.pages,
            });
          }
        })
        .catch((error) => {
          this.setState({ error_403: true });
        });
    });
  };

  promiseClinicOptions = (inputValue) => {
    return new Promise((resolve) => {
      if (inputValue !== "") {
        setTimeout(() => {
          common.getClinics({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let clinics = [];
              response.data.clinics.forEach((clinic, index) => {
                clinics[index] = { label: clinic.name, value: clinic.id };
              });
              this.setState({ clinics }, () => {
                resolve(this.filterClinic(inputValue));
              });
            }
          });
        }, 1000);
      } else {
        resolve(this.filterClinic(inputValue));
      }
    });
  };

  filterClinic = (inputValue) => {
    return this.state.clinics.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  handleClinicChange = (clinic) => {
    let fields = this.state.fields;
    fields["clinic_id"] = clinic;
    this.setState({ fields });
  };

  promiseUserOptions = (inputValue) => {
    return new Promise((resolve) => {
      if (inputValue !== "") {
        setTimeout(() => {
          common.getUsers({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let users = [];
              response.data.users.forEach((user, index) => {
                users[index] = {
                  label: common.getFullName(user),
                  value: user.id,
                  email: user.email,
                };
              });
              this.setState({ users }, () => {
                resolve(this.filterUser(inputValue));
              });
            }
          });
        }, 1000);
      } else {
        resolve(this.filterUser(inputValue));
      }
    });
  };

  filterUser = (inputValue) => {
    return this.state.users.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  componentDidMount = () => {
    let searchFields = this.state.searchFields;
    let fields = this.state.fields;
    fields["status"] = [];
    common.caseStatusArr.forEach((status, index) => {
      searchFields[6]["values"][index] = {
        label: status,
        value: index,
      };
      fields["status"][index] = {
        label: status,
        value: index,
      };
    });
    fields["status"] = fields["status"].filter((obj) => obj.value !== 9);
    this.setState({ searchFields, fields });
    common.getLocationsByUser().then((response) => {
      if (response.data.success) {
        let fields = this.state.fields;
        searchFields[1]["values"][0] = {
          label: "All locations",
          value: null,
        };
        response.data.locations.forEach((location, index) => {
          searchFields[1]["values"][index + 1] = {
            label: location.publish_name,
            value: location.id,
          };
          fields["location_id"] = searchFields[1]["values"][0];
        });
        this.setState({ searchFields, fields }, () => {
          this.getCases(this.state.fields);
        });
      }
    });
    if (
      parseInt(this.props.userType) === 1 ||
      parseInt(this.props.userType) === 15
    ) {
    } else {
      common.getClinicsByDoc({ user: this.props.userId }).then((response) => {
        if (response.data.success) {
          response.data.clinics.forEach((clinic, index) => {
            searchFields[0]["values"][index] = {
              label: clinic.name,
              value: clinic.id,
            };
          });
        }
      });
    }
    if (
      parseInt(this.props.userType) === 1 ||
      parseInt(this.props.userType) === 15
    ) {
    } else {
      common.getUsers().then((response) => {
        if (response.data.success) {
          response.data.users.forEach((user, index) => {
            searchFields[2]["values"][index] = {
              label: common.getFullName(user),
              value: user.id,
            };
          });
          this.setState({ searchFields });
        }
      });
    }
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.defaultLocation !== this.props.defaultLocation) {
      let fields = this.state.fields;
      common.getUserLocations().then((response) => {
        response.data.locations.map((location) => {
          if (parseInt(location.id) === parseInt(this.props.defaultLocation)) {
            fields["location_id"] = {
              label: location.publish_name,
              value: location.id,
            };
            this.setState({ fields, search: false });
          }
        });
      });
      this.getCases(this.state.fields);
    }
  };
  deleteCase = (id) => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this case?")) {
      ccase.delete(params).then((response) => {
        if (response.data.success) {
          let cases = this.state.cases;
          cases = this.state.cases.filter((c) => c.id !== id);
          this.setState({ cases });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };
  handlePageChange = (pageNo) => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.getCases(this.state.fieldsFromSearch);
    });
  };

  toggleModal = (e) => {
    let userId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      userId,
    }));
  };
  toggleSearch = (e) => {
    this.setState((prevState) => ({
      search: !prevState.search,
    }));
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
        let fieldsFromSearch = this.state.fieldsFromSearch;
        if (this.state.fields["location_id"] == undefined) {
          this.getCases(this.state.fieldsFromSearch);
        } else {
          fieldsFromSearch["location_id"] = this.state.fields["location_id"];
          this.getCases(this.state.fieldsFromSearch);
        }
      });
    });
  };
  updateSearchFields = (fields) => {
    this.setState({ fields });
  };
  togglePatientModal = (e) => {
    let patientId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      patientId,
      showPatientModal: !prevState.showPatientModal,
    }));
  };

  getFieldsfromSearch = (fields) => {
    this.setState({ fieldsFromSearch: fields });
  };
  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Cases : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Cases</h3></Col>
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
                        <Link
                          type="button"
                          className="btn btn-success m-1 btn-block"
                          to={`/admin/cases/create`}
                        >
                          Create New Case
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Case"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getSearchCases}
                  clearSearch={this.clearSearch}
                  defaultLocation={this.state.fields["location_id"]}
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
                  <Table
                    responsive
                    className="table-striped responsive-table-alignment"
                  >
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
                          onClick={(event) =>
                            this.sortRecord(event, "location")
                          }
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "name")}
                        >
                          Patient Name
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "doctor")}
                        >
                          Doctor
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "clinic")}
                        >
                          Clinic
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "price")}
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "status")}
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) =>
                            this.sortRecord(event, "appointment_date")
                          }
                        >
                          Appointment Date
                        </th>
                        <th
                          scope="col"
                          className="border-top-0">

                        </th>
                        {/* <th scope="col" className="border-top-0" /> */}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.cases.length > 0
                        ? this.state.cases.map((c, index) => (
                          <Case
                            caseDetails={c}
                            getCases={this.getCases}
                            deleteCase={this.deleteCase}
                            key={`key-case-${index}`}
                            toggleModal={this.toggleModal}
                            togglePatientModal={this.togglePatientModal}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                          />
                        ))
                        : !this.state.isloader && (
                          <tr>
                            <td key={0} colSpan="10">
                              <p className="text-center">Case not found.</p>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.pages &&
                  parseInt(this.state.pages.totalCount) > 20 && (
                    <Pagination
                      activePage={this.state.pageNo}
                      itemsCountPerPage={this.state.pageSize}
                      totalItemsCount={parseInt(this.state.pages.totalCount)}
                      onChange={this.handlePageChange}
                    />
                  )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showPatientModal && (
          <Modal isOpen={this.state.showPatientModal} size="lg">
            <ModalBody className="p-0">
              <PatientDetailsBody
                id={this.state.patientId}
                enableEditPatient={false}
              />
            </ModalBody>
            <ModalFooter className="border-top-0 pt-0">
              <Button
                color="danger"
                className="btn-sm"
                onClick={this.togglePatientModal}
              >
                Close
              </Button>
              <Link
                to={`/admin/patients/edit/${this.state.patientId}`}
                color="primary"
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultLocation: state.defaultLocation,
    userType: state.userType,
    userId: state.userId,
  };
};
export default connect(mapStateToProps)(Cases);
