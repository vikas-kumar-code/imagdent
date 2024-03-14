import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
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
  InputGroupAddon,
  Button,
  Form,
} from "reactstrap";
import service from "../../../services/service";
import Service from "./Service";
import AddEditService from "./AddEditService";
import UpdateAppearance from "./UpdateAppearance";
import { Helmet } from "react-helmet";
import Search from "../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import common from "../../../services/common";

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      services: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      totalItemsCount: 0,
      itemsCountPerPage: [20, 50, 100],
      hasMore: false,
      showAddEditModal: false,
      showAppearanceModal: false,
      showLocationModal: false,
      serviceId: "",
      search: false,
      searchFields: [
        { label: "Name", name: "name", type: "text" },
        { label: "Code", name: "code", type: "text" },
        { label: "ADA Code", name: "ada_code", type: "text" },
        { label: "CPT Code", name: "cpt_code", type: "text" },
        {
          label: "Parent service",
          name: "parent_id",
          type: "select",
          values: [],
        },
      ],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      fieldsFromSearch: {}
    };
  }

  updateSearchFields = (fields) => {
    this.setState({ fields });
  };
  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getServices();
    });
  };
  toggleSearch = (e) => {
    this.setState((prevState) => ({
      search: !prevState.search,
    }));
  };
  getServices = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page,
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    let that = this;
    service
      .list(params)
      .then((response) => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            services: response.data.services,
            totalItemsCount: response.data.pages.totalCount,
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getServices();
    common.getParentServices().then((response) => {
      let searchFields = this.state.searchFields;

      response.data.services.forEach((service, index) => {
        searchFields[4].values[index] = {
          value: service.id,
          label: service.name,
        };
      });
      this.setState({
        searchFields,
      });
    });
  };
  deleteService = (id) => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this service?")) {
      service.delete(params).then((response) => {
        if (response.data.success) {
          let services = this.state.services;
          services = this.state.services.filter((service) => service.id !== id);
          this.setState({ services });
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
  toggleAddEditModal = (e) => {
    let serviceId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showAddEditModal: !prevState.showAddEditModal,
      serviceId,
    }));
  };
  toggleAppearanceModal = (e) => {
    this.setState((prevState) => ({
      showAppearanceModal: !prevState.showAppearanceModal,
    }));
  };
  toggleLocationModal = (e) => {
    let serviceId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showLocationModal: !prevState.showLocationModal,
      serviceId,
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
        this.getServices(this.state.fieldsFromSearch);
      });
    });
  };
  handlePageChange = (e) => {
    this.setState({ page: e, isloader: true }, () => {
      this.getServices(this.state.fieldsFromSearch);
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
          <title>Services : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={3} sm={12}><h3>Services</h3></Col>
                  <Col md={9} sm={12} className="text-right">
                    <Row>
                      <Col sm={12} md={4}>
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
                      <Col sm={12} md={4}>
                        <Button
                          color="info"
                          type="button"
                          onClick={this.toggleAppearanceModal}
                          className="mr-1 m-1 btn-block"
                        >
                          Update Parent Services Appearance
                        </Button>
                      </Col>
                      <Col sm={12} md={4}>
                        <Button
                          color="success"
                          type="button"
                          className="m-1 btn-block"
                          onClick={this.toggleAddEditModal}
                        >
                          Add New Service
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Service"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getServices}
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
                    <Col className="text-right" md={6} />
                    <Col md={6} className="text-right">
                      {/*<Input
                        type="select"
                        bsSize="lg"
                        name="pageSize"
                        id="pageSize"
                        onChange={event => this.handlePageSize(event)}
                        value={this.state.pageSize ? this.state.pageSize : ""}
                        className="input-sm"
                      >
                        <option value="">-Select-</option>
                        {this.state.itemsCountPerPage.map((perPage, i) => (
                          <option value={perPage} key={i + 1}>
                            {perPage}
                          </option>
                        ))}
                        </Input>*/}
                      {this.state.totalItemsCount > 20 && (
                        <Pagination
                          activePage={this.state.page}
                          itemsCountPerPage={this.state.pageSize}
                          totalItemsCount={parseInt(this.state.totalItemsCount)}
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
                          width={5 + "%"}
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "name")}
                        >
                          Name
                        </th>
                        <th scope="col" className="border-top-0">
                          Parent Service
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "code")}
                        >
                          Code
                        </th>
                        <th scope="col" className="border-top-0">
                          Price
                        </th>
                        {/* <th scope="col" className="border-top-0">
                          ADA Code
                        </th>
                        <th scope="col" className="border-top-0">
                          CPT Code
                        </th> */}
                        <th scope="col" className="border-top-0" colSpan="4" />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.services.length > 0 ? (
                        this.state.services.map((service, index) => (
                          <Service
                            service={service}
                            deleteService={this.deleteService}
                            key={`key-service-${index}`}
                            toggleModal={this.toggleAddEditModal}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                            getServices={this.getServices}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="8">
                            <p className="text-center">Service not found.</p>
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
        {this.state.showAddEditModal && (
          <AddEditService
            showModal={this.state.showAddEditModal}
            toggleModal={this.toggleAddEditModal}
            serviceId={this.state.serviceId}
            fieldsFromSearch={this.state.fieldsFromSearch}
            getServices={this.getServices}
          />
        )}
        {this.state.showAppearanceModal && (
          <UpdateAppearance
            showModal={this.state.showAppearanceModal}
            toggleModal={this.toggleAppearanceModal}
          />
        )}
      </div>
    );
  }
}

export default Services;
