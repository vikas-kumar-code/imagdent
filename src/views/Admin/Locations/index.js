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
import location from "../../../services/location";
import Location from "./Location";
import AddEditLocation from "./AddEditLocation";
import { Helmet } from "react-helmet";
import Search from "../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      locations: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      locationId: "",
      search: false,
      searchFields: [
        { label: "Legal Name", name: "legal_name", id: "legal_name", type: "text" },
        { label: "Published Name", name: "publish_name", type: "text" },
        { label: "City", name: "City", type: "text" },
        { label: "Zipcode", name: "Zipcode", type: "numberFormat" },
        { label: "Email", name: "email", type: "text" },
        { label: "EIN", name: "ein", type: "text" }
      ],
      error_403: false,
      fieldsFromSearch: {}
    };
  }

  updateSearchFields = fields => {
    this.setState({ fields });
  };
  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getLocations();
    });
  };
  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };
  getLocations = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };
    location.list(params).then(response => {
      this.setState({ isloader: false });
      if (response.data.success) {
        this.setState({
          locations: response.data.locations,
          pages: response.data.pages.totalCount
        });
      }
    })
      .catch(function (error) {
        this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getLocations();
  };
  deleteLocation = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this location?")) {
      location.deleteLocation(params).then(response => {
        if (response.data.success) {
          let locations = this.state.locations;
          locations = this.state.locations.filter(
            location => location.id !== id
          );
          this.setState({ locations });
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
    let locationId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      locationId
    }));
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
          <title>Locations : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Locations</h3></Col>
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
                          className="m-1 b btn-block"
                          onClick={this.toggleModal}
                        >
                          Add New Location
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Location"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getLocations}
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
                          Published Name
                        </th>
                        <th scope="col" className="border-top-0">
                          Address
                        </th>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                        <th
                          scope="col"
                          className="border-top-0"
                          width={35 + "%"}
                          colSpan="3"
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.locations.length > 0 ? (
                        this.state.locations.map((location, index) => (
                          <Location
                            location={location}
                            getLocations={this.getLocations}
                            deleteLocation={this.deleteLocation}
                            key={`key-location-${index}`}
                            enableEditDelete={true}
                            toggleModal={this.toggleModal}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Location not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.locations.length > 20 && (
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
          <AddEditLocation
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            locationId={this.state.locationId}
            fieldsFromSearch={this.state.fieldsFromSearch}
            getLocations={this.getLocations}
          />
        )}
      </div>
    );
  }
}

export default Locations;
