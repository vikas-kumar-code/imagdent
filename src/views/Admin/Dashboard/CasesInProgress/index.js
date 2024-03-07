import React, { Component } from "react";
import { Spinner, Table, Card, CardBody, CardHeader, Badge } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import common from "../../../../services/common";
import { connect } from "react-redux";
import ccase from "../../../../services/case";
import moment from "moment";
import Scrollbars from "react-custom-scrollbars";
import { Link } from "react-router-dom";

class CasesInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      loader: true,
      sort: "",
      currentSortedColumn: null,
    };
  }

  getCaseInProgress = () => {
    this.setState({ loader: true });
    let params = {
      fields: {
        location_id: { value: this.props.defaultLocation },
        status: [
          { label: "Patient Checked-in", value: 1 },
          { label: "Patient Paper work uploaded", value: 2 },
          { label: "Payment Accepted", value: 3 },
          { label: "Records captured", value: 4 },
          { label: "Re-formatted files uploaded", value: 5 },
          { label: "Ready for Radiologist", value: 6 },
          { label: "Rad Report Completed", value: 7 },
        ],
      },
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    ccase.list(params).then((res) => {
      this.setState({ loader: false });
      let cases = [];
      if (res.data.success) {
        cases = res.data.cases
      }
      this.setState({ cases });
    });
  };

  componentDidMount = () => {
    this.getCaseInProgress();
  };

  componentDidUpdate(prevProps) {
    if (this.props.defaultLocation !== prevProps.defaultLocation) {
      this.getCaseInProgress();
    }
  }

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
        this.getCaseInProgress();
      });
    });
  };

  render() {
    return (
      <Card className="border-light shadow">
        <CardHeader className="bg-warning">
          <strong>Cases in progress</strong>
        </CardHeader>
        <CardBody>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Scrollbars style={{ minHeight: 250, maxHeight: 250 }}>
              <Table responsive className="table-striped">
                <thead>
                  <tr>
                    <th scope="col" className="border-top-0">
                      Case ID
                    </th>
                    <th
                      scope="col"
                      className="border-top-0 sortable"
                      onClick={(event) => this.sortRecord(event, "location")}
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
                      onClick={(event) => this.sortRecord(event, "status")}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.cases.length > 0 ? (
                    this.state.cases.map((record, index) => (
                      <tr key={index}>
                        <td scope="col" className="border-top-0">
                          <Link
                            to={`/admin/cases/details/${record.id}`}
                            style={{
                              color: "#20a8d8",
                            }}
                          >
                            {record.c_id}
                          </Link>
                        </td>
                        <td scope="col" className="border-top-0">
                          {record.location && record.location.publish_name}
                        </td>
                        <td scope="col" className="border-top-0">
                          {common.getFullName(record.patient)}
                        </td>
                        <td scope="col" className="border-top-0">
                          <Badge
                            color="primary"
                            className={`p-1 caseStatus-${record.status}`}
                          >
                            {common.caseStatusArr[record.status]}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td key={0} colSpan="5">
                        <p className="text-center">No case in progress.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Scrollbars>
          </LoadingOverlay>
        </CardBody>
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    defaultLocation: state.defaultLocation,
  };
};

export default connect(mapStateToProps)(CasesInProgress);
