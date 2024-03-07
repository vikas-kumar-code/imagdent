import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import Error403 from "../../Error403";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
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
  InputGroupAddon,
  Button,
  Form
} from "reactstrap";
import clinic from "../../../services/clinic";
import Clinic from "./Clinic";
import AddEditClinic from "./AddEditClinic";
import { Helmet } from "react-helmet";
import Search from "../Search";

class Clinics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      clinics: [],
      pages: { totalCount: 0 },
      isloader: false,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      clinicId: "",
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      fieldsFromSearch: {}
    };
  }

  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getClinics();
    });
  };
  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };
  getClinics = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo
    };
    let that = this;
    clinic
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            clinics: response.data.clinics,
            pages: response.data.pages,
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  updateSearchFields = fields => {
    this.setState({ fields });
  };
  componentDidMount = () => {
    this.getClinics();
  };
  handlePageChange = pageNo => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.getClinics(this.state.fieldsFromSearch);
    });
  };

  deleteClinic = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this clinic?")) {
      clinic.delete(params).then(response => {
        if (response.data.success) {
          let clinics = this.state.clinics;
          clinics = this.state.clinics.filter(clinic => clinic.id !== id);
          this.setState({ clinics });
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
    let clinicId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      clinicId
    }));
  };

  getFieldsfromSearch = (fields) => {
    this.setState({ fieldsFromSearch: fields });
  }

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Clinics : Imagdent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Clinics</h3></Col>
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
                          className="btn btn-success m-1 btn-block"
                          to={`/admin/clinics/add`}
                        >
                          Add New Clinic
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Clinic"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getClinics}
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
                        <th scope="col" className="border-top-0">
                          Name
                        </th>
                        <th scope="col" className="border-top-0">
                          Email
                        </th>
                        <th scope="col" className="border-top-0">
                          Phone
                        </th>
                        <th scope="col" className="border-top-0">
                          Fax
                        </th>

                        <th scope="col" colSpan="2" className="border-top-0" />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.clinics.length > 0
                        ? this.state.clinics.map((clinic, index) => (
                          <Clinic
                            clinic={clinic}
                            getClinics={this.getClinics}
                            deleteClinic={this.deleteClinic}
                            key={`key-clinic-${index}`}
                            toggleModal={this.toggleModal}
                          />
                        ))
                        : !this.state.isloader && (
                          <tr>
                            <td key={0} colSpan="6">
                              <p className="text-center">Clinic not found.</p>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {parseInt(this.state.pages.totalCount) > 20 && (
                  <Pagination
                    activePage={this.state.pageNo}
                    itemsCountPerPage={this.state.pageSize}
                    totalItemsCount={parseInt(this.state.pages.totalCount)}
                    onChange={this.handlePageChange}
                    innerClass="pagination float-right"
                  />
                )}

              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showModal && (
          <AddEditClinic
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            clinicId={this.state.clinicId}
            getClinics={this.getClinics}
          />
        )}
      </div>
    );
  }
}

export default Clinics;
