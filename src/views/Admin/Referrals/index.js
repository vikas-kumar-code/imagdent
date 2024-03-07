import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import Search from "../Search";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Spinner,
  Button
} from "reactstrap";
import patient from "../../../services/patient";
import Referral from "./Referral";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";

class Referrals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referrals: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      search: false,
      searchFields: [
        {
          label: "Referred From",
          name: "referred_from",
          type: "select-with-search",
          values: []
        },
        { label: "First Name", name: "first_name", type: "text" },
        { label: "Last Name", name: "last_name", type: "text" },
        { label: "Social Security Number", name: "ssn", type: "text" },
        { label: "Phone", name: "phone", type: "text" },
        { label: "Zip Code", name: "zip_code", type: "text" },
        {
          label: "DOB (MM-DD-YYYY)",
          name: "dob",
          type: "date",
          placeholder: "MM-DD-YYYY"
        }
      ]
    };
  }

  getReferrals = (e, fields) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page,
      referred_to: this.props.userId
    };

    patient
      .getReferrals(params)
      .then(response => {
        this.setState({ isloader: false });
        let searchFields = this.state.searchFields;
        if (response.data.success) {
          response.data.referrals.forEach((v, index) => {
            searchFields[0].values[index] = {
              value: v.referredfrom.id,
              label: v.referredfrom.name
            };
          });
          this.setState({
            referrals: response.data.referrals,
            pages: response.data.pages.totalCount,
            searchFields
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.getReferrals();
  };

  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getReferrals();
    });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Referrals : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <strong style={{ fontSize: 20 }}>Referrals</strong>
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
                  heading="Search Referrals"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getReferrals}
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
                  <Table responsive>
                    <thead>
                      <tr>
                        <th scope="col" className="border-top-0">
                          Referral Number
                        </th>
                        <th scope="col" className="border-top-0">
                          Referred From
                        </th>
                        <th scope="col" className="border-top-0">
                          Referred To
                        </th>
                        <th scope="col" className="border-top-0" width="40%">
                          Reasons
                        </th>
                        <th scope="col" className="border-top-0" />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.referrals.map((referral, index) => (
                        <Referral
                          referral={referral}
                          key={`key-referral-${index}`}
                          enableProgress={true}
                          enableUpdateStatus={true}
                          getReferrals={this.getReferrals}
                        />
                      ))}
                      {!this.state.isloader &&
                        this.state.referrals.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center">
                              Record not found!
                            </td>
                          </tr>
                        )}
                    </tbody>
                    {this.state.totalItemsCount > 20 && (
                      <tfoot>
                        <tr>
                          <td colSpan="5">
                            <Pagination
                              activePage={this.state.page}
                              itemsCountPerPage={this.state.pageSize}
                              totalItemsCount={this.state.totalItemsCount}
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
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userId: state.userId
  };
};
export default connect(mapStateToProps)(Referrals);
