import React, { Component } from "react";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
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

class OnlineTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        date_range:
          moment().format("MM-DD-YYYY") +
          " to " +
          moment().format("MM-DD-YYYY"),
      },
      payments: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      search: true,
      searchFields: [
        { label: "Date Range", name: "received_on", type: "date-range" },
        {
          label: "Location",
          name: "location_id",
          type: "select-with-search",
          values: [],
        },
      ],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      paymentDetails: {},
      export: false,
      format: null,
      groupPayments: [],
      arPaymentsCollected: [],
      totalPatientAr: 0.0,
      totalDoctorAr: 0.0,
      arPaymentsTotal:"",
    };
  }

  clearSearch = () => {
    this.setState(
      {
        fields: {
          date_range:
            moment().format("MM-DD-YYYY") +
            " to " +
            moment().format("MM-DD-YYYY"),
        },
      },
      () => {
        this.getOnlineTransactions(this.state.fields);
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

  getOnlineTransactions = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      export: this.state.export,
      format: this.state.format,
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    report
      .onlineTransactions(params)
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
              a.download = "report-of-online-transactions.pdf";
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
          this.setState({
            arPaymentsTotal: response.data.arPaymentsCollectedTotal,
            arPaymentsCollected: response.data.arPaymentsCollected,
            payments: response.data.invoices,
            groupPayments: response.data.groupPayments,
            totalPatientAr: parseFloat(response.data.totalPatientAr),
            totalDoctorAr: parseFloat(response.data.totalDoctorAr),
          });
        }
      })
      .catch((error) => {
        //this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    let searchFields = this.state.searchFields;
    this.getOnlineTransactions(this.state.fields);
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
        this.getOnlineTransactions(this.state.fields);
      });
    });
  };
  exportRecord = (format) => {
    this.setState({ export: true, format }, () => {
      this.getOnlineTransactions(this.state.fields);
      this.setState({ export: false });
    });
  };
  calculateTotalCc = () => {
    let totalArr = [];
    this.state.groupPayments.forEach((gp, index) => {
      if (parseInt(gp.mode) > 1) {
        totalArr[index] = parseFloat(gp.total);
      }
    });
    let totalCc = 0.0;
    if (totalArr.length > 0) {
      totalCc = totalArr.reduce((sum, total) => {
        return sum + total;
      });
    }
    return totalCc;
  };
  calculateGrandTotal = () => {
    let totalArr = [];
    this.state.groupPayments.forEach((gp, index) => {
      totalArr[index] = parseFloat(gp.total);
    });
    let totalGt = 0.0;
    if (totalArr.length > 0) {
      totalGt = totalArr.reduce((sum, total) => {
        return sum + total;
      });
    }
    return totalGt + this.state.totalPatientAr + this.state.totalDoctorAr;
  };
  returnPaidAmount = (arpaycollect) => {
    let paidAmountArr = [];
    arpaycollect.payments.forEach((payment, index) => {
      paidAmountArr[index] = parseFloat(payment.paid_amount);
    });
    let totalAmount = 0.0;
    if (paidAmountArr.length > 0) {
      totalAmount = paidAmountArr.reduce((sum, amount) => {
        return amount + sum;
      });
    }
    return totalAmount;
  };

  renderMode = (arpaycollect) => {
    let modeString = [];
    arpaycollect.payments.forEach((ele, i) => {
      if (!modeString.includes(common.modeArr[ele.mode])) {
        modeString.push(common.modeArr[ele.mode]);
      }
    });
    return modeString.join(`, `);
  };
  
  ARPaymentsCollected = () => {
    let ArAmount =
      parseFloat(this.state.totalPatientAr) +
      parseFloat(this.state.totalDoctorAr);
    return common.numberFormat(parseFloat(ArAmount).toFixed(2));
  };
  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Online Transactions : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>
                          Online Transactions
                        </strong>
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
                  searchRecord={this.getOnlineTransactions}
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
                  {this.state.payments.length > 0 && (
                    <Row>
                      <Col md={12} className="text-right">
                        {/* Export
                      <ButtonGroup className="ml-2">
                        <Button color="success" onClick={()=>this.exportRecord('pdf')}>PDF</Button>
                        <Button color="warning" onClick={()=>this.exportRecord('excel')}>Excel</Button>
                        <Button color="warning">CSV</Button>
                      </ButtonGroup> */}
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
                        {this.state.fields["location_id"]["label"]} - Online
                        Transactions
                      </strong>
                    </Alert>
                  )}
                  <Table responsive /*  className="table-striped" */>
                    <thead>
                      <tr class="patient-list">
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) =>
                            this.sortRecord(event, "received_on")
                          }
                        >
                          Date
                        </th>
                        {/* <th scope="col" className="border-top-0">
                          Case ID
                        </th> */}
                        <th scope="col" className="border-top-0">
                          Invoice ID
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "patient")}
                        >
                          Patient
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
                          onClick={(event) => this.sortRecord(event, "amount")}
                        >
                          Total Of Fees
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) =>
                            this.sortRecord(event, "discount")
                          }
                        >
                          Adjustments
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) =>
                            this.sortRecord(event, "discount")
                          }
                        >
                          Sub Total
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) =>
                            this.sortRecord(event, "discount")
                          }
                        >
                          Amount Paid
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) =>
                            this.sortRecord(event, "discount")
                          }
                        >
                          Balance Due
                        </th>

                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "mode")}
                        >
                          Mode
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.payments.length > 0
                        ? this.state.payments.map((payment, index) => (
                            <Payment
                              record={payment}
                              key={`key-user-${index}`}
                            />
                          ))
                        : !this.state.isloader && (
                            <tr>
                              <td key={0} colSpan="9">
                                <p className="text-center">
                                  Payment not found.
                                </p>
                              </td>
                            </tr>
                          )}
                    </tbody>
                  </Table>
                  {this.state.payments.length > 0 && (
                    <React.Fragment>
                      <Table style={{ border: "2px solid" }}>
                        <tbody>
                          <tr>
                            <td>
                              {this.state.groupPayments.map((gp, index) => {
                                if (parseInt(gp.mode) > 1) {
                                  return (
                                    <Row
                                      className="mb-2"
                                      key={`key-cc-${index}`}
                                    >
                                      <Col md={6} style={{ fontSize: 18 }}>
                                        Total Of{" "}
                                        {common.modeArr[parseInt(gp.mode)]}:
                                      </Col>
                                      <Col
                                        md={6}
                                        className="text-right"
                                        style={{ fontSize: 15 }}
                                      >
                                        ${common.numberFormat(gp.total)}
                                      </Col>
                                    </Row>
                                  );
                                }
                              })}
                            </td>
                            <td>
                              {this.state.groupPayments.map((gp, index) => {
                                if (parseInt(gp.mode) <= 1) {
                                  return (
                                    <Row
                                      className="mb-2"
                                      key={`key-cc-${index}`}
                                    >
                                      <Col md={6} style={{ fontSize: 18 }}>
                                        Total Of{" "}
                                        {common.modeArr[parseInt(gp.mode)]}:
                                      </Col>
                                      <Col
                                        md={6}
                                        className="text-right"
                                        style={{ fontSize: 15 }}
                                      >
                                        ${common.numberFormat(gp.total)}
                                      </Col>
                                    </Row>
                                  );
                                }
                              })}
                              <Row className="mb-2">
                                <Col md={6} style={{ fontSize: 18 }}>
                                  Total Of Patient A/R:
                                </Col>
                                <Col
                                  md={6}
                                  className="text-right"
                                  style={{ fontSize: 15 }}
                                >
                                  $
                                  {common.numberFormat(
                                    this.state.totalPatientAr.toFixed(2)
                                  )}
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col md={6} style={{ fontSize: 18 }}>
                                  Total Of Doctor A/R:
                                </Col>
                                <Col
                                  md={6}
                                  className="text-right"
                                  style={{ fontSize: 15 }}
                                >
                                  $
                                  {common.numberFormat(
                                    this.state.totalDoctorAr.toFixed(2)
                                  )}
                                </Col>
                              </Row>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{ borderTop: `2px solid`, fontSize: 30 }}
                            >
                              <Row className="mb-2">
                                <Col md={6} style={{ fontSize: 30 }}>
                                  Total Of CC:
                                </Col>
                                <Col md={6} style={{ fontSize: 30 }}>
                                  $
                                  {common.numberFormat(
                                    this.calculateTotalCc().toFixed(2)
                                  )}
                                </Col>
                              </Row>
                            </td>
                            <td
                              style={{ borderTop: `2px solid`, fontSize: 30 }}
                            >
                              <Row className="mb-2">
                                <Col md={6} style={{ fontSize: 30 }}>
                                  Grand Total:
                                </Col>
                                <Col md={6} style={{ fontSize: 30 }}>
                                  $
                                  {common.numberFormat(
                                    this.calculateGrandTotal().toFixed(2)
                                  )}
                                </Col>
                              </Row>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Alert color="dark" style={{ fontSize: 25 }}>
                        <strong>A/R Payments Collected:</strong> $
                        {common.numberFormat(this.state.arPaymentsTotal.toFixed(2))}
                      </Alert>

                      {
                        this.state.arPaymentsCollected.length > 0 && (
                          <Table responsive>
                            <thead>
                              <tr>
                                <th scope="col" className="border-top-0">Invoice Id</th>
                                <th scope="col" className="border-top-0">Name</th>
                                <th scope="col" className="border-top-0">Location</th>
                                <th scope="col" className="border-top-0">Amount</th>
                                <th scope="col" className="border-top-0">Payment Method</th>
                                <th scope="col" className="border-top-0">Recieved By</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.arPaymentsCollected.map((arpaycollect, i) => (

                                  <tr key={i}>
                                    <td>{arpaycollect.invoice_id}</td>
                                    <td>{arpaycollect.case.user !== null
                                      ? common.getFullName(arpaycollect.case.user)
                                      : "--"}</td>
                                    <td>{arpaycollect.location.publish_name}</td>
                                    <td>${
                                      this.returnPaidAmount(arpaycollect).toFixed(2)
                                    }</td>
                                    <td>{this.renderMode(arpaycollect)}</td>
                                    <td>{arpaycollect.payments[0].receivedBy.username}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </Table>
                        )
                      }






                    </React.Fragment>
                  )}
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
const mapStateToProps = (state) => {
  return {
    userType: parseInt(state.userType),
    apiUrl: state.apiUrl,
  };
};
export default connect(mapStateToProps)(OnlineTransactions);
