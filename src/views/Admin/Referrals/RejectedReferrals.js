import React, { Component } from "react";
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
  Button,
  Form
} from "reactstrap";
import referral from "../../../services/referral";
import Referral from "./Referral";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import ErrorBoundary from "../../Common/ErrorBoundary";
import { toast } from "react-toastify";

class RejectedReferrals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referrals: [],
      reasons: [],
      documentTypes: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      selectedReferrals: [],
      submitted: false
    };
  }

  getRejectedReferrals = (e, fields) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };

    referral
      .getRejectedReferrals(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            referrals: response.data.referrals,
            pages: response.data.pages.totalCount
          });
        }
      })
      .catch(error => {
        this.setState({
          isloader: false
        });
        throw new Error(error);
      });
  };
  componentDidMount = () => {
    this.getRejectedReferrals();
  };
  chooseReferrals = e => {
    let selectedReferrals = this.state.selectedReferrals;
    if (e.target.checked) {
      selectedReferrals.push(e.target.value);
      this.setState({ selectedReferrals });
    } else {
      let index_to_be_removed = selectedReferrals.indexOf(e.target.value);
      selectedReferrals.splice(index_to_be_removed, 1);
      this.setState({ selectedReferrals });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.selectedReferrals.length > 0) {
      let referrals = this.state.selectedReferrals;
      this.setState({ submitted: true, selectedReferrals: [] });
      const params = {
        referrals: referrals
      };

      referral.discard(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.getRejectedReferrals();
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        });
      });
    } else {
      toast.error("Please choose referral to discard!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };
  /* filterReferrals = () => {
        
    } */
  render() {
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Rejected referrals : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <strong style={{ fontSize: 20 }}>Rejected referrals</strong>
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
                <ErrorBoundary>
                  <LoadingOverlay
                    active={this.state.isloader}
                    spinner={<Spinner color="dark" />}
                    fadeSpeed={200}
                    classNamePrefix="mitiz"
                  >
                    <Form
                      onSubmit={this.handleSubmit}
                      name="add-edit-action-form"
                      method="post"
                    >
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th scope="col" className="border-top-0" />
                            <th scope="col" className="border-top-0">
                              Referral Number
                            </th>
                            <th scope="col" className="border-top-0">
                              Referred From
                            </th>
                            <th scope="col" className="border-top-0">
                              Referred To
                            </th>
                            <th scope="col" className="border-top-0">
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
                              enableDiscard={true}
                              chooseReferrals={this.chooseReferrals}
                            />
                          ))}
                          {!this.state.isloader &&
                            this.state.referrals.length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center">
                                  Record not found!
                                </td>
                              </tr>
                            )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="6" className="text-right">
                              <Button
                                color="danger"
                                disabled={
                                  this.state.selectedReferrals.length > 0
                                    ? false
                                    : true
                                }
                                type="submit"
                              >
                                {this.state.submitted && (
                                  <FontAwesomeIcon
                                    icon="spinner"
                                    className="mr-1"
                                    spin={true}
                                  />
                                )}
                                Discard Selected Referral
                              </Button>
                            </td>
                          </tr>
                          {this.state.totalItemsCount > 20 && (
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
                          )}
                        </tfoot>
                      </Table>
                    </Form>
                  </LoadingOverlay>
                </ErrorBoundary>
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
export default connect(mapStateToProps)(RejectedReferrals);
