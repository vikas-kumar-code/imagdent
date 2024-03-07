import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import patient from "../../../services/patient";
import Patient from "./Patient";
import Search from "../Search";
import { updateSearchPatientData } from "../../../store/actions";
import { connect } from "react-redux";
import AddEditPatientBody from "./AddEditPatientBody";
import Row from "reactstrap/lib/Row";

class SearchPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      isloader: false,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      search: true,
      searchFields: [
        { label: "First Name", name: "first_name", type: "text" },
        { label: "MI", name: "middle_name", type: "text" },
        { label: "Last Name", name: "last_name", type: "text" },
        {
          label: "sex",
          name: "sex",
          type: "select",
          values: [
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ],
        },
        { label: "Phone", name: "phone", type: "numberFormat" },
        { label: "City", name: "City", type: "text" },
        { label: "Zip Code", name: "Zipcode", type: "numberFormat" },
        {
          label: "Date Of Birth (MM-DD-YYYY)",
          name: "BirthDate",
          type: "date",
          placeholder: "MM-DD-YYYY",
        },
      ],
      showModal: false,
      pages: { totalCount: 0 },
      patientId: "",
      searchResult: [],
      showResult: false,
    };
  }

  clearSearch = () => {
    this.setState({ fields: {}, showResult: false });
    this.props.updateSearchPatientData({
      searchPatientData: {
        searchFields: {},
        searchResult: [],
      },
    });
  };
  searchPatients = (fields = {}) => {
    this.setState({ showResult: true, isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo,
    };
    if (this.props.getAll) {
      params["getAll"] = true;
    }
    let that = this;
    patient
      .list(params)
      .then((response) => {
        this.setState({
          isloader: false,
          patients: response.data.patients,
          pages: response.data.pages,
        });
        if (response.data.success) {
          this.props.updateSearchPatientData({
            searchPatientData: {
              searchFields: fields,
              searchResult: response.data.patients,
            },
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  handlePageChange = (pageNo) => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.searchPatients(this.props.searchFields);
    });
  };

  componentDidMount = () => {
    if (this.props.searchResult.length > 0) {
      this.setState({ showResult: true });
    }
  };

  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  deletePatient = (id) => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this patient?")) {
      var that = this;
      patient.delete(params).then((response) => {
        if (response.data.success) {
          let patients = this.state.patients;
          patients = this.state.patients.filter((patient) => patient.id !== id);
          this.setState({ patients });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.updateSearchPatientData({
            searchPatientData: {
              searchFields: this.props.searchFields,
              searchResult: this.props.searchResult.filter(
                (patient) => patient.id !== id
              ),
            },
          });
        }else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };
  togglePatientModal = (e) => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };
  render() {
    return (
      <Card className="mb-0">
        <CardHeader className="p-2">
          <Search
            fields={this.state.fields}
            isOpen={this.state.search}
            heading="Search Patient"
            searchFields={this.state.searchFields}
            searchRecord={this.searchPatients}
            clearSearch={this.clearSearch}
          />
        </CardHeader>
        {this.state.showResult && (
          <CardBody>
            <LoadingOverlay
              active={this.state.isloader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Row>
                {this.props.enablePatientDetail ? (
                  <Link
                    to="/admin/patients/add"
                    className="btn btn-success mr-o ml-auto"
                  >
                    Add New Patient
                  </Link>
                ) : (
                  <button
                    onClick={this.togglePatientModal}
                    className="btn btn-success mr-o ml-auto"
                  >
                    Add New Patient
                  </button>
                )}
              </Row>
              <Row>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col" className="border-top-0" width={7 + "%"}>
                        ID
                      </th>
                      <th scope="col" className="border-top-0">
                        Name
                      </th>
                      <th scope="col" className="border-top-0">
                        Birth Date
                      </th>
                      <th scope="col" className="border-top-0">
                        Age
                      </th>
                      <th scope="col" className="border-top-0">
                        Phone
                      </th>
                      <th scope="col" className="border-top-0">
                        City
                      </th>
                      <th scope="col" className="border-top-0">
                        State
                      </th>
                      <th scope="col" className="border-top-0">
                        Sex
                      </th>
                      <th scope="col" className="border-top-0" />
                      <th scope="col" className="border-top-0" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.props.searchResult.length > 0
                      ? this.props.searchResult.map((patient, index) => (
                          <Patient
                            patient={patient}
                            getPatients={this.getPatients}
                            deletePatient={this.deletePatient}
                            key={`key-patient-${index}`}
                            toggleModal={this.toggleModal}
                            enableSelection={this.props.enableSelection}
                            enablePatientDetail={this.props.enablePatientDetail}
                            choosePatient={this.props.choosePatient}
                          />
                        ))
                      : !this.state.isloader && (
                          <tr>
                            <td key={0} colSpan="11">
                              <p className="text-center">Result not found.</p>
                              <p className="text-center">
                                {this.props.enablePatientDetail ? (
                                  <Link
                                    to="/admin/patients/add"
                                    className="btn btn-success"
                                  >
                                    Add New Patient
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-success"
                                    onClick={this.togglePatientModal}
                                  >
                                    Add New Patient
                                  </button>
                                )}
                              </p>
                            </td>
                          </tr>
                        )}
                  </tbody>
                  {parseInt(this.state.pages.totalCount) > 20 && (
                    <tfoot>
                      <tr>
                        <td colSpan="12">
                          <Pagination
                            activePage={this.state.pageNo}
                            itemsCountPerPage={this.state.pageSize}
                            totalItemsCount={parseInt(
                              this.state.pages.totalCount
                            )}
                            onChange={this.handlePageChange}
                            innerClass="pagination float-right"
                          />
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </Table>
              </Row>
            </LoadingOverlay>
          </CardBody>
        )}
        {this.state.showModal && (
          <Modal isOpen={this.state.showModal} size="xl">
            <ModalHeader toggle={this.togglePatientModal}>
              Add New Patient
            </ModalHeader>
            <ModalBody className="p-0">
              <AddEditPatientBody
                enableEditPatient={false}
                isModal={true}
                choosePatient={this.props.choosePatient}
                toggleModal={this.togglePatientModal}
              />
            </ModalBody>
          </Modal>
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    searchFields:
      state.searchPatientData !== undefined
        ? state.searchPatientData.searchFields
        : [],
    searchResult:
      state.searchPatientData !== undefined
        ? state.searchPatientData.searchResult
        : [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchPatientData: (data) => {
      dispatch(updateSearchPatientData(data));
    },
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(SearchPatient);
