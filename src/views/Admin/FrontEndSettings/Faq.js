import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";

import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Col,
  Row,
  Button,
} from "reactstrap";
import Table from "reactstrap/lib/Table";
import Search from "../Search";
import page from "../../../services/page";
import { toast } from "react-toastify";
class Faq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      isloader: false,
      faqs: [],
      pageNo: 1,
      pageSize: 20,
      pages:{totalCount:0},
      search: false,
      searchFields: [{ label: "Question", name: "name", type: "text" }],
    };
  }
  getFaq = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo
    };

    page
      .listFaq(params)
      .then((response) => {
        this.setState({ loader: false });
        if (response.data.success) {
          this.setState({
            faqs: response.data.faqs,
            pages: response.data.pages,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  toggleSearch = (e) => {
    this.setState((prevState) => ({
      search: !prevState.search,
    }));
  };
  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getFaq(this.state.fields);
    });
  };
  componentDidMount = () => {
    this.getFaq();
  };
  deletePage = (id) => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this Faq?")) {
      page.deleteFaq(params).then((response) => {
        if (response.data.success) {
          let faqs = this.state.faqs;
          faqs = this.state.faqs.filter((fq) => fq.id !== id);
          this.setState({ faqs });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };
  handlePageChange = pageNo => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.getFaq(this.state.fields);
    });
  };
  render() {
    console.log(this.props);
    return (
      <Card className="shadow" outline color="dark">
        <CardHeader className="bg-default">
          <Row>
            <Col md={3} style={{ fontSize: 25 }}>
              Faq
            </Col>
            <Col md={9} className="text-right">
              <Button
                color="warning"
                type="button"
                onClick={this.toggleSearch}
                className="mr-2"
              >
                <FontAwesomeIcon icon="search" className="mr-1" />
                Search
              </Button>
              <Link
                to="/admin/front-end-settings/faq/add"
                className="btn btn-success"
              >
                Add New Faq
              </Link>
            </Col>
          </Row>
          <Search
            fields={this.state.fields}
            isOpen={this.state.search}
            heading="Search Faq"
            searchFields={this.state.searchFields}
            updateSearchFields={this.updateSearchFields}
            searchRecord={this.getFaq}
            clearSearch={this.clearSearch}
          />
        </CardHeader>
        <CardBody style={{ minHeight: 400 }}>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Table responsive hover>
              <thead>
                <tr>
                  <th scope="col" className="border-top-0" width={7 + "%"}>
                    ID
                  </th>
                  <th scope="col" className="border-top-0">
                    Question
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
                {this.state.faqs.length > 0
                  ? this.state.faqs.map((fq, index) => (
                      <tr key={`fq-${index}`}>
                        <td>{index + 1}</td>
                        <td>{fq.question}</td>

                        <td>
                          <Link
                            to={`/admin/front-end-settings/Faq/add/${fq.id}`}
                            className="btn-sm btn btn-primary"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            className="btn-sm"
                            onClick={() => this.deletePage(fq.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  : 
                      <tr>
                        <td key={0} colSpan="5">
                          <p className="text-center">Faq not found.</p>
                        </td>
                      </tr>
                    }
                  
              </tbody>
              {parseInt(this.state.pages.totalCount) > 20 && <tfoot>
                      <tr>
                        <td colSpan="9">
                          <Pagination
                            activePage={this.state.pageNo}
                            itemsCountPerPage={this.state.pageSize}
                            totalItemsCount={parseInt(this.state.pages.totalCount)}
                            onChange={this.handlePageChange}
                            innerClass="pagination float-right"
                          />
                        </td>
                      </tr>
                    </tfoot>}
            </Table>
          </LoadingOverlay>
        </CardBody>
      </Card>
    );
  }
}
export default Faq;
