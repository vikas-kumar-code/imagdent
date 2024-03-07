import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
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
import page from "../../../services/page";
import { Link } from "react-router-dom";
import Page from "./Page";
import Search from "../Search";

class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      contents: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      search: false,
      searchFields: [
        { label: "Page", name: "name", type: "text" },
      ],
    };
  }

  getPages = (e,fields) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };

    page
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            contents: response.data.contents,
            pages: response.data.pages.totalCount
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  componentDidMount = () => {
    this.getPages();
  };
  deletePage = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this page?")) {
      page.delete(params).then(response => {
        if (response.data.success) {
          let contents = this.state.contents;
          contents = this.state.contents.filter(content => content.id !== id);
          this.setState({ contents });
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
      this.getPages();
    });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search,
    }));
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>Static Pages</strong>
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
                    <Link to="/admin/add-page" className="btn btn-success">
                      Add Page
                    </Link>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Pages"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getPages}
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
                        <th scope="col" className="border-top-0">
                          URL
                        </th>
                        <th
                          colSpan="2"
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.contents.length > 0 ? (
                        this.state.contents.map((content, index) => (
                          <Page
                            content={content}
                            getPages={this.getPages}
                            deletePage={this.deletePage}
                            key={`key-page-${index}`}
                          />
                        ))
                      ) : !this.state.isloader && (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Page not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.contents.length > 20 && (
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

export default Pages;
