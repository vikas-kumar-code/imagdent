import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error403 from "../../../Error403";

import {
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  Col,
  Row,
  Table,
  Spinner,
  InputGroup,
  Button,
  Form,
  Alert,
} from "reactstrap";
import report from "../../../../services/report";
import common from "../../../../services/common";
import Payment from "./Payment";
import { Helmet } from "react-helmet";
import Search from "../../Search";
import moment from "moment";
import InvoiceModal from "./InvoiceModal";

class DoctorAr extends Component {
  constructor(props) {
    super(props);
    this.searchTimeOut = 0;
    this.state = {
      fields: {},
      isloader: true,
      showModal: false,
      search: true,
      doctorArTotal: "",
      showInvoiceModal: false,
      searchFields: [
        {
          label: "Date Range",
          name: "appointment_date",
          type: "date-range"
        },
        {
          label: "Location",
          name: "location_id",
          type: "select-with-search",
          values: [],
        },
        {
          label: "Choose Doctor",
          name: "user_id",
          type: "select-with-search",
          type:
          (common.imd_roles.includes(parseInt(this.props.userType)) ||
          parseInt(this.props.userType) === 15)
              ? "select-with-ajax-search"
              : "select-with-search",
          values: [],
          loadOptions: this.promiseUserOptions,
        },
      ],
      records: [],
      user: [],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      paymentDetails: {},
      export: false,
      format: null,
      totalAr: 0.0,
    };
  }
  promiseUserOptions = (inputValue) => {
    if (this.searchTimeOut > 0) {
      clearTimeout(this.searchTimeOut);
    }
    return new Promise((resolve) => {
      if (inputValue !== "") {
        this.searchTimeOut = setTimeout(() => {
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
        }, 500);
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
  clearSearch = () => {
    this.setState(
      {
        fields: {},
      },
      () => {
        this.getDoctorAr(this.state.fields);
      }
    );
  };
  base64ToArrayBuffer(data) {
    var binaryString = window.atob(data);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  getDoctorAr = (fields) => {
    this.setState({ isloader: true, fields });
    let params = {
      fields: fields,
      export: this.state.export,
      format: this.state.format,
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    report
      .doctorAr(params)
      .then((response) => {
        this.setState({ isloader: false });
        if (response && params.export === true) {
          let arrBuffer = this.base64ToArrayBuffer(response.data);
          let fname = "";
          let disposition = response.headers["content-disposition"];
          if (disposition) {
            let filenameRegex = /fname[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            let matches = filenameRegex.exec(disposition);
            if (matches !== null && matches[1])
              fname = matches[1].replace(/['"]/g, "");
          }
          try {
            let blob = new Blob([arrBuffer], { type: "application/pdf" });
            console.log(blob);
            if (typeof window.navigator.msSaveBlob !== "undefined") {
              window.navigator.msSaveBlob(blob, fname);
            } else {
              let URL = window.URL || window.webkitURL;
              let downloadUrl = URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = downloadUrl;
              a.download = "report-doctor-ar.pdf";
              document.body.append(a);
              a.click();
              a.remove();
            }
          } catch (error) {
            console.log(error);
          }

          /* const bObject = new Blob([response.data],{ type: 'application/pdf' });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(bObject);
        link.download = "end-of-the-day.pdf";
        link.click();
        document.body.appendChild(link);
        link.remove();
        document.body.removeChild(link); */
        } else if (response.data.success) {
          console.log(response);
          this.setState({
            records: response.data.users,
            doctorArTotal: response.data.doctorArTotal
          });
        }
      })
      .catch((error) => {
        // this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    let searchFields = this.state.searchFields;
    this.getDoctorAr(this.state.fields);
    this.setState({ searchFields });
    common.getLocations().then((response) => {
      if (response.data.success) {
        response.data.locations.forEach((location, index) => {
          searchFields[1].values[index] = {
            value: location.id,
            label: location.publish_name,
          };
        });
      }
    });
    this.setState({ searchFields });
  };

  calculateTotal = (userInvoices, range) => {
    let total = 0;
    if (userInvoices.invoices.length > 0) {
      userInvoices.invoices.forEach((ele) => {
        if (ele.hasOwnProperty(range)) {
          if (ele[`${range}`] === true) {
            total = parseFloat(total) + parseFloat(ele.balance_amount);
          }
        }
      });
    }
    return parseFloat(total).toFixed(2);
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
        this.getDoctorAr(this.state.fields);
      });
    });
  };
  exportRecord = (format) => {
    this.setState({ export: true, format }, () => {
      this.getDoctorAr(this.state.fields);
      this.setState({ export: false });
    });
  };


  toggleInvoiceModal = () => {
    this.setState((prevState) => ({
      showInvoiceModal: !prevState.showInvoiceModal,
    }));
  };

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Doctor A/R : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>Doctor A/R</strong>
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
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Payments"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getDoctorAr}
                  clearSearch={this.clearSearch}
                  grid={12}
                />
              </CardHeader>
              <CardBody>
                <LoadingOverlay
                  active={this.state.isloader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  {this.state.records.length > 0 && (
                    <Row>
                      <Col md={12} className="text-right">
                        <Button className="mr-2 text-white" color="primary"
                          onClick={() => this.toggleInvoiceModal()}  disabled={this.state.isloader}>
                          <FontAwesomeIcon
                           icon={this.state.isloader ? "spinner" : "file"}
                            color="white"
                            className="mr-1"
                            spin={this.state.isloader ? true : false}
                          />
                          Invoice</Button>

                        <Button
                          color="success"
                          onClick={() => this.exportRecord("pdf")}
                          disabled={this.state.isloader}
                        >
                          <FontAwesomeIcon
                            icon={this.state.isloader ? "spinner" : "download"}
                            className="mr-1"

                            spin={this.state.isloader ? true : false}
                          />
                          Export As PDF
                        </Button>

                      </Col>
                    </Row>
                  )}
                  {this.state.fields["location_id"] && (
                    <Alert
                      color="dark"
                      style={{ fontSize: 25 }}
                      className="mt-2"
                    >
                      <strong>
                        {this.state.fields["location_id"]["label"]} - Doctor A/R
                      </strong>
                    </Alert>
                  )}
                  <Table responsive>
                    <thead className=" border-bottom-0" style={{ fontSize: "18px" }}>
                      <tr>
                        <th scope="col" className="border-top-0">
                          Name
                        </th>
                        <th scope="col" className="border-top-0">
                          Invoice ID
                        </th>
                        <th scope="col" className="border-top-0">
                          Date
                        </th>
                        <th scope="col" className="border-top-0">
                          Patient
                        </th>

                        <th scope="col" className="border-top-0">
                          0-30
                        </th>
                        <th scope="col" className="border-top-0">
                          31-60
                        </th>

                        <th scope="col" className="border-top-0">
                          61-90
                        </th>
                        <th scope="col" className="border-top-0">
                          91+
                        </th>
                        <th scope="col" className="border-top-0">
                          Grand Total
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    {this.state.records.length > 0
                      ? this.state.records.map((payment, index) => (
                        <Payment record={payment} key={`key-user-${index}`} />
                      ))
                      : !this.state.isloader && (
                        <tr>
                          <td key={0} colSpan="9">
                            <p className="text-center">Payment not found.</p>
                          </td>
                        </tr>
                      )}
                  </Table>
                  {this.state.records.length > 0 && (
                    <Alert
                      color="dark"
                      style={{ fontSize: 25 }}
                      className="mt-2 d-flex justify-content-end align-items-center"
                    >
                      <strong>
                        Total Doctor A/R : ${common.numberFormat(parseFloat(this.state.doctorArTotal).toFixed(2))}
                      </strong>
                    </Alert>
                  )}
                </LoadingOverlay>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {this.state.showInvoiceModal && (
          <InvoiceModal
            showModal={this.state.showInvoiceModal}
            toggleModal={this.toggleInvoiceModal}
            fields={this.state.fields}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userType: parseInt(state.userType),
    apiUrl: state.apiUrl,
  };
};
export default connect(mapStateToProps)(DoctorAr);
