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
  Form,
} from "reactstrap";
import role from "../../../services/role";
import Role from "./Role";
import AddEditRole from "./AddEditRole";
import { Helmet } from "react-helmet";
import AssignPermission from "./AssignPermission";
import Search from "../Search";

class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      roles: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showEditModal: false,
      showPermissionModal: false,
      roleId: "",
      error_403: false,
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      fieldsFromSearch: {},
      pages: { totalCount: 0 },
    };
  }

  getRoles = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo,
    };
    let that = this;
    role
      .list(params)
      .then((response) => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            roles: response.data.roles,
            pages: response.data.pages,
          });
        }
      })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getRoles();
  };
  deleteRole = (id) => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this role?")) {
      role.delete(params).then((response) => {
        if (response.data.success) {
          let roles = this.state.roles;
          roles = this.state.roles.filter((role) => role.id !== id);
          this.setState({ roles });
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
  toggleEditModal = (e) => {
    let roleId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showEditModal: !prevState.showEditModal,
      roleId,
    }));
  };
  togglePermissionModal = (e) => {
    let roleId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showPermissionModal: !prevState.showPermissionModal,
      roleId,
    }));
  };

  updateSearchFields = (fields) => {
    this.setState({ fields });
  };

  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getRoles();
    });
  };

  toggleSearch = (e) => {
    this.setState((prevState) => ({
      search: !prevState.search,
    }));
  };
  handlePageChange = pageNo => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.getRoles(this.state.fieldsFromSearch);
    });
  };
  getFieldsfromSearch = (fields) => {
    this.setState({ fieldsFromSearch: fields });
  };

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>User Roles : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>User Roles</h3></Col>
                  <Col md={4} sm={12} className="text-right">
                    <Row>
                      <Col sm={12} md={6}>
                        <Button
                          color="warning"
                          type="button"
                          onClick={this.toggleSearch}
                          className="mr-2 m-1 btn-block"
                        >
                          <FontAwesomeIcon icon="search" className="mr-1" />
                          Search
                        </Button>
                      </Col>
                      <Col sm={12} md={6}>
                        <Button
                          color="success"
                          type="button"
                          className="m-1 btn-block"
                          onClick={this.toggleEditModal}
                        >
                          Add New Role
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Roles"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getRoles}
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
                  <Table responsive className="table-striped">
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
                          colSpan={3}
                          scope="col"
                          className="border-top-0"
                          width={35 + "%"}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.roles.length > 0 ? (
                        this.state.roles.map((role, index) => (
                          <Role
                            role={role}
                            getRoles={this.getRoles}
                            deleteRole={this.deleteRole}
                            key={`key-role-${index}`}
                            toggleEditModal={this.toggleEditModal}
                            togglePermissionModal={this.togglePermissionModal}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Role not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {parseInt(this.state.pages.totalCount) > 20 && (
                  <Pagination
                    activePage={this.state.pageNo}
                    itemsCountPerPage={this.state.pageSize}
                    totalItemsCount={parseInt(this.state.pages.totalCount)}
                    onChange={this.handlePageChange}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.showEditModal && (
          <AddEditRole
            showModal={this.state.showEditModal}
            toggleEditModal={this.toggleEditModal}
            roleId={this.state.roleId}
            getRoles={this.getRoles}
            fieldsFromSearch={this.state.fieldsFromSearch}
          />
        )}
        {this.state.showPermissionModal && (
          <AssignPermission
            showModal={this.state.showPermissionModal}
            togglePermissionModal={this.togglePermissionModal}
            roleId={this.state.roleId}
            getRoles={this.getRoles}
            fieldsFromSearch={this.state.fieldsFromSearch}
          />
        )}
      </div>
    );
  }
}

export default Roles;
