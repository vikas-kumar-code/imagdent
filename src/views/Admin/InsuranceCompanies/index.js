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
  InputGroup,
  Button,
  Form
} from "reactstrap";
import company from "../../../services/company";
import Company from "./Company";
import AddEditCompany from "./AddEditCompany";
import { Helmet } from "react-helmet";
import Error403 from "../../Error403";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class InsuranceCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      companyId: "",
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false
    };
  }

  handleChange = e => {
    let keyword = e.target.value;
    this.setState({ keyword });
  };
  clear = () => {
    this.setState({ keyword: "" }, () => {
      this.getClinics();
    });
  };
  getCompanies = (e, fields) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };
    let that = this;
    company
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            companies: response.data.companies,
            pages: response.data.pages.totalCount
          });
        }
      })
      .catch(function(error) {
        that.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getCompanies();
  };
  deleteCompany = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this company?")) {
      company.delete(params).then(response => {
        if (response.data.success) {
          let plans = this.state.plans;
          plans = this.state.plans.filter(plan => plan.id !== id);
          this.setState({ plans });
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
    let companyId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      companyId
    }));
  };

  updateSearchFields = fields => {
    this.setState({ fields });
  };

  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getCompanies();
    });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Insurance Company : iMagDent</title>
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
                          Insurance Companies
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
                    <Button
                      color="success"
                      type="button"
                      onClick={this.toggleModal}
                    >
                      Add New Company
                    </Button>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Comapanies"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getCompanies}
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
                  <Table responsive hover>
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
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.companies.length > 0 ? (
                        this.state.companies.map((company, index) => (
                          <Company
                            company={company}
                            getCompanies={this.getCompanies}
                            deleteCompany={this.deleteCompany}
                            key={`key-company-${index}`}
                            toggleModal={this.toggleModal}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Company not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.companies.length > 20 && (
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
          <AddEditCompany
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            companyId={this.state.companyId}
            getCompanies={this.getCompanies}
          />
        )}
      </div>
    );
  }
}

export default InsuranceCompany;
