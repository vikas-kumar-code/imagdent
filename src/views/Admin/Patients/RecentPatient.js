import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import Pagination from "react-js-pagination";
import { Table, Spinner } from "reactstrap";
import patient from "../../../services/patient";
import Patient from "./Patient";

class RecentPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      pages: { totalCount: 0 },
      searchResult: [],
    };
  }

  clearSearch = () => {
    this.setState({ fields: {}, showResult: false })
  };
  getPatients = () => {
    let params = {
      pageSize: this.state.pageSize,
      page: this.state.pageNo,
    };
    let that = this;
    patient
      .list(params)
      .then((response) => {
        if (response.data.success) {
          this.setState({
            isloader: false,
            patients: response.data.patients,
            pages: response.data.pages,
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  
  componentDidMount = () => {
    this.getPatients();
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
        } else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };
  render() {
    return (
      <LoadingOverlay
        active={this.state.isloader}
        spinner={<Spinner color="dark" />}
        fadeSpeed={200}
        classNamePrefix="mitiz"
      >
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
              {/*<th
                                scope="col"
                                className="border-top-0"
                            ></th>*/}
              <th scope="col" className="border-top-0" />
              <th scope="col" className="border-top-0" />
            </tr>
          </thead>
          <tbody>
            {this.state.patients.length > 0
              ? this.state.patients.map((patient, index) => (
                  <Patient
                    patient={patient}
                    getPatients={this.getPatients}
                    deletePatient={this.deletePatient}
                    key={`key-patient-${index}`}
                    toggleModal={this.toggleModal}
                    enableSelection={false}
                  />
                ))
              : !this.state.isloader && (
                  <tr>
                    <td key={0} colSpan="9">
                      <p className="text-center">Result not found.</p>
                    </td>
                  </tr>
                )}
          </tbody>       
        </Table>
      </LoadingOverlay>
    );
  }
}

export default RecentPatient;
