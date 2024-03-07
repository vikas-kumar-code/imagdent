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
import Service from "./Service";
import { Helmet } from "react-helmet";
import Search from "../../Search";
import moment from "moment";

class TopServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        date_range:
          moment().format("MM-DD-YYYY") +
          " to " +
          moment().format("MM-DD-YYYY"),
      },
      services: [],
      isloader: true,
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
      export: false,
      format: null,
      groupPayments: [],
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
        this.getServices(this.state.fields);
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

  getServices = (fields) => {
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
      .topServices(params)
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
              a.download = "report-top-services.pdf";
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
            services: response.data.services,
          });
        }
      })
      .catch((error) => {
        //this.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    let searchFields = this.state.searchFields;
    this.getServices(this.state.fields);
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
        this.getServices(this.state.fields);
      });
    });
  };
  exportRecord = (format) => {
    this.setState({ export: true, format }, () => {
      this.getServices(this.state.fields);
      this.setState({ export: false });
    });
  };

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Top Services : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>Top Services</strong>
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
                  heading="Search Services"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getServices}
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
                  {this.state.services.length > 0 && (
                    <Row>
                      <Col md={12} className="text-right">
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
                        {this.state.fields["location_id"]["label"]} - Top
                        Services
                      </strong>
                    </Alert>
                  )}
                  <Table responsive className="table-striped">
                    <thead>
                      <tr class="patient-list">
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={(event) => this.sortRecord(event, "name")}
                        >
                          Name
                        </th>
                        <th scope="col" className="border-top-0">
                          Code
                        </th>
                        <th scope="col" className="border-top-0">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.services.length > 0
                        ? this.state.services.map((c, index) => (
                            <Service
                              record={c.service}
                              key={`key-user-${index}`}
                            />
                          ))
                        : !this.state.isloader && (
                            <tr>
                              <td key={0} colSpan="9">
                                <p className="text-center">
                                  Services not found.
                                </p>
                              </td>
                            </tr>
                          )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
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
export default connect(mapStateToProps)(TopServices);
