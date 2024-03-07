import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import Error403 from "../../Error403";
import form from "../../../services/form";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Spinner,
  InputGroup,
  Form,
} from "reactstrap";
import { Link } from "react-router-dom";
import Formm from "./Formm";

class Forms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      forms: [],
      isloader: false,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      error_403: false,
    };
  }

  getForms = (e, fields) => {
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
    form
      .list(params)
      .then((response) => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            pages: response.data.pages.totalCount,
            forms: response.data.forms,
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  deleteForms = (id)=>{
    let params = {id: id}
    if(window.confirm("Are you sure to delete this form")){
    form.delete(params).then((response)=>{
      if(response.data.success){
        let forms = this.state.forms;
        forms = this.state.forms.filter(Form => Form.id !== id);
        this.setState({ forms });
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
        console.log("delete sucesfull");
      }
    })
  }
  }


  componentDidMount = () => {
    this.getForms();
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
                    <Form>
                      <InputGroup>
                        <strong style={{ fontSize: 20 }}>Forms</strong>
                      </InputGroup>
                    </Form>
                  </Col>
                  <Col xs={6} className="text-right">
                    <Link to="/admin/forms/add" className="btn btn-success">
                      Add New Form
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
                          colSpan="2"
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.forms.length > 0 ? (
                        this.state.forms.map((form, index) => (
                          <Formm
                            form={form}
                            getTemplates={this.getTemplates}
                            deleteForms={this.deleteForms}
                            key={`key-page-${index}`}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">form not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.forms.length > 20 && (
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

export default Forms;