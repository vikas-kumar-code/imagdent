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
  Button,
  Form
} from "reactstrap";
import tmtsummarytemplate from "../../../services/tmtsummarytemplate";
import { Link } from "react-router-dom";
import Template from "./Template";
import Search from "../Search";

class TmtSummaryTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      templates: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      search: false,
      searchFields: [
        { label: "Name", name: "name", type: "text" },
      ],
      error_403: false
    };
  }

  getTemplates = (e, fields) => {
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
    tmtsummarytemplate
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            templates: response.data.templates,
            pages: response.data.pages.totalCount
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
      tmtsummarytemplate.delete(params).then(response => {
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
    this.setState({ fields: {} }, () => {
      this.getTemplates();
    });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search,
    }));
  };

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
                  <Col xs={6}>
                    <strong style={{ fontSize: 20 }}>Treatment Summary Templates</strong>
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
                    <Link to="/admin/tmt-summary-templates/add" className="btn btn-success">
                      Add New Template
                    </Link>
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
                {this.state.templates.length > 20 && (
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

export default TmtSummaryTemplates;
