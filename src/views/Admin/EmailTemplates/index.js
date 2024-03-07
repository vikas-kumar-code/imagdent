import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import Error403 from "../../Error403";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
import emailtemplate from "../../../services/emailtemplate";
import { Link } from "react-router-dom";
import Template from "./Template";
import Search from "../Search";

class EmailTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      templates: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      totalCount: 0,
      search: false,
      searchFields: [
        { label: "Subject", name: "subject", type: "text" },
      ],
      error_403: false,
      fieldsFromSearch: {}
    };
  }

  getTemplates = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo
    };
    let that = this;
    emailtemplate
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            templates: response.data.templates,
            pages: response.data.pages.totalCount,
            totalCount: response.data.pages.totalCount
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getTemplates();
  };
  deleteTemplate = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this template?")) {
      emailtemplate.delete(params).then(response => {
        if (response.data.success) {
          let templates = this.state.templates;
          templates = this.state.templates.filter(template => template.id !== id);
          this.setState({ templates });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      });
    }
  };

  updateSearchFields = (fields) => {
    this.setState({ fields });
  };

  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getTemplates();
    });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search,
    }));
  };

  handlePageChange = pageNo => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.getTemplates(this.state.fieldsFromSearch);
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
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Email Templates</h3></Col>
                  <Col md={4} sm={12} className="text-right">
                    <Row>
                      <Col sm={12} md={6}>
                        <Button
                          color="warning"
                          type="button"
                          onClick={this.toggleSearch}
                          className="mr-2  m-1 btn-block"
                        ><FontAwesomeIcon
                            icon="search"
                            className="mr-1"
                          />
                          Search
                        </Button>
                      </Col>
                      <Col sm={12} md={6}>

                        <Link to="/admin/email-templates/add" className="btn btn-success m-1 btn-block">
                          Add New Template
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Templates"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getTemplates}
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
                          Subject
                        </th>
                        <th scope="col" className="border-top-0">
                          From Email
                        </th>
                        <th scope="col" className="border-top-0">
                          ReplyTo Email
                        </th>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                          colSpan="2"
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.templates.length > 0 ? (
                        this.state.templates.map((template, index) => (
                          <Template
                            template={template}
                            getTemplates={this.getTemplates}
                            deleteTemplate={this.deleteTemplate}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                            key={`key-page-${index}`}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Template not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.totalCount > 20 && (
                  <Pagination
                    activePage={this.state.pageNo}
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

export default EmailTemplates;
