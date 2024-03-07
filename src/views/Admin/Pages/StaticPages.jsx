import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Col,
  Row,
  Table,
  Spinner,
  InputGroup,
  InputGroupAddon,
  Button,
  Form
} from "reactstrap";
import page from "../../../services/page";
import { Link } from "react-router-dom";
import Page from "./Page";

class StaticPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      contents: [],
      page: 1,
      pageSize: 20,
      isloader: true,
      id: ""
    };
  }

  handleChange = e => {
    let keyword = e.target.value;
    this.setState({ keyword });
  };
  getPages = e => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({ isloader: true });
    let params = {
      keyword: this.state.keyword,
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
      .catch(function(error) {
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
                  <Col xs={4} className="text-right">
                    <Form
                      method="post"
                      onSubmit={event => this.searchContent(event)}
                    >
                      <InputGroup>
                        <Input
                          type="text"
                          placeholder="Search"
                          autoComplete="off"
                          value={this.state.search}
                          onChange={this.handleChange}
                        />
                        <InputGroupAddon addonType="append">
                          <Button color="primary" type="submit">
                            Search
                          </Button>
                          <Button color="danger" onClick={() => this.clear()}>
                            Clear
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Form>
                  </Col>
                  <Col xs={2} className="text-right">
                    <Link to="/admin/add-page" className="btn btn-success">
                      Add Page
                    </Link>
                  </Col>
                </Row>
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
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Page not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                <Pagination
                  activePage={this.state.page}
                  itemsCountPerPage={this.state.pageSize}
                  totalItemsCount={this.state.pages}
                  onChange={this.handlePageChange}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default StaticPages;
