import React, { Component } from "react";
import { connect } from "react-redux";
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
  Form
} from "reactstrap";
import payment from "../../../services/payment";
import common from "../../../services/common";
import Payment from "./Payment";
import { Helmet } from "react-helmet";
import Search from "../Search";
import moment from 'moment';


class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {status:1,date_range:moment().format('MM-DD-YYYY') +' to '+ moment().format('MM-DD-YYYY'),mode:6},
      payments: [],
      clinics: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      search: true,
      searchFields: [
        { label: "Status", name: "status", type: "select", values: [{label:"Paid",value:1},{label:"Un-paid",value:0}] },
        { label: "Date Range", name: "received_on", type: "date-range" },
        {
          label: "Mode",
          name: "mode",
          type: "select",
          values: [
            {label:'All',value:6},
            {label:'Cash',value:0},
            {label:'Check',value:1},
            {label:'Visa',value:2},
            {label:'MasterCard',value:3},
            {label:'Amex',value:4},
            {label:'Discover',value:5},
          ],
        },
        { label: "Invoice No", name: "invoice_id", type: "text" },
        { label: "Location", name: "location_id", type: "select-with-search", values: [] },
        { label: "Clinic", name: "clinic_id", type: "select-with-search", values: [] },
      ],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      paymentDetails:{},
    };
  }

  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getPayments();
    });
  };
  getPayments = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };
    if (this.state.sort !== "") {
      params['sort'] = this.state.sort;
    }
    payment.list(params).then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            payments: response.data.payments,
            pages: response.data.pages.totalCount
          });
        }
      })
      .catch( (error) => {
        this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    let searchFields = this.state.searchFields;
    this.getPayments(this.state.fields);
    common.getClinics().then(response => {
      if (response.data.success) {
        response.data.clinics.forEach((clinic, index) => {
          searchFields[5].values[index] = { value: clinic.id, label: clinic.name };
        });
      }
    });
    common.getLocations().then(response => {
      if (response.data.success) {
        response.data.locations.forEach((location, index) => {
          searchFields[4].values[index] = { value: location.id, label: location.publish_name };
        });
      }
    });
    this.setState({ searchFields });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search,
    }));
  };
  sortRecord = (e, column) => {
    e.persist();
    let sort;
    if (e.target.className.indexOf("sortable") > 0) {
        sort = column;
        e.target.className = "border-top-0 asc";
    }
    else if (e.target.className.indexOf("asc") > 0) {
        sort = "-" + column;
        e.target.className = "border-top-0 desc";
    }
    else if (e.target.className.indexOf("desc") > 0) {
        sort = column;
        e.target.className = "border-top-0 asc";
    }
    this.setState({ sort }, () => {
        if (this.state.currentSortedColumn !== null) {
            if (this.state.currentSortedColumn.target !== e.target) {
                this.state.currentSortedColumn.target.className = "border-top-0 sortable";
            }
        }
        this.setState({ currentSortedColumn: e }, () => {
            this.getPayments();
        });
    });
}
  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Payments : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>Payments</strong>
                      </InputGroup>
                    </Form>
                  </Col>
                  <Col xs={6} className="text-right">
                    <Button
                      color="warning"
                      type="button"
                      onClick={this.toggleSearch}
                      className="mr-2"
                    ><FontAwesomeIcon
                        icon="search"
                        className="mr-1"
                      />
                      Search
                    </Button>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Payments"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getPayments}
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
                  <Table responsive className="table-striped">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'invoice')}
                        >
                          Invoice No
                        </th>
                        <th scope="col" className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'clinic')}>
                          Location
                        </th>
                        <th scope="col" className="border-top-0">
                          Doctor
                        </th>
                        <th scope="col" className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'amount')}>
                          Patient
                        </th>
                        <th scope="col" className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'amount')}>
                          Mode
                        </th>
                        <th scope="col" className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'amount')}>
                          Amount
                        </th>
                        <th scope="col" className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'amount')}>
                          Status
                        </th>
                        <th colSpan="2" scope="col" className="border-top-0 sortable" onClick={(event) => this.sortRecord(event, 'received_on')}>
                          Received On
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.payments.length > 0 ? (
                        this.state.payments.map((payment, index) => (
                          <Payment
                            user={payment}
                            getUsers={this.getUsers}
                            deleteUser={this.deleteUser}
                            key={`key-user-${index}`}
                            toggleModal={this.toggleModal}
                          />
                        ))
                      ) : !this.state.isloader && (
                        <tr>
                          <td key={0} colSpan="9">
                            <p className="text-center">Payment not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.payments.length > 20 && (
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
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    userType:parseInt(state.userType)
  };
};
export default connect(mapStateToProps)(Payments);