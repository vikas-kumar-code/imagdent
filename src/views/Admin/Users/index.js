import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error403 from "../../Error403";

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
  Button,
  Form
} from "reactstrap";
import user from "../../../services/user";
import role from "../../../services/role";
import location from "../../../services/location";
import User from "./User";
import AddEditUser from "./AddEditUser";
import { Helmet } from "react-helmet";
import Search from "../Search";
import { Link } from "react-router-dom";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      users: [],
      clinics: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      userId: "",
      search: false,
      searchFields: [
        //{ label: "Clinic", name: "clinic_id", type: "select", values: [] },
        { label: "Name", name: "name", type: "text" },
        { label: "Username", name: "username", type: "text" },
        { label: "Email", name: "email", type: "text" },
        { label: "Phone", name: "phone", type: "numberFormat" },
        { label: "Location", name: "location_id", type: "select", values: [] },
        { label: "Role", name: "role_id", type: "select", values: [] }
      ],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      pages: { totalCount: 0 },
      fieldsFromSearch: {}
    };
  }

  clearSearch = () => {
    this.setState({ fields: {}, fieldsFromSearch: {} }, () => {
      this.getUsers(this.state.fields);
    });
  };
  getUsers = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.pageNo
    };
    if (this.state.sort !== "") {
      params["sort"] = this.state.sort;
    }
    let that = this;
    user.list(params).then(response => {
      this.setState({ isloader: false });
      if (response.data.success) {
        this.setState({
          users: response.data.users,
          pages: response.data.pages,
        });
      }
    })
      .catch(function (error) {
        that.setState({ error_403: true });
      });
  };
  componentDidMount = () => {
    this.getUsers();
    let searchFields = this.state.searchFields;

    location.list().then(response => {
      if (response.data.success) {
        response.data.locations.forEach((location, index) => {
          searchFields[4].values[index] = {
            value: location.id,
            label: location.publish_name
          };
        });
      }
    });
    role.list().then(response => {
      if (response.data.success) {
        response.data.roles.forEach((role, index) => {
          searchFields[5].values[index] = {
            value: role.id,
            label: role.name
          };
        });
      }
    });
    this.setState({ searchFields });
  };
  deleteUser = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this user?")) {
      user.delete(params).then(response => {
        if (response.data.success) {
          let users = this.state.users;
          users = this.state.users.filter(user => user.id !== id);
          this.setState({ users });
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
    let userId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      userId
    }));
  };
  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };
  sortRecord = (e, column) => {
    e.persist();
    let sort;
    if (e.target.className.indexOf("sortable") > 0) {
      sort = column;
      e.target.className = "border-top-0 asc";
    } else if (e.target.className.indexOf("asc") > 0) {
      sort = "-" + column;
      e.target.className = "border-top-0 desc";
    } else if (e.target.className.indexOf("desc") > 0) {
      sort = column;
      e.target.className = "border-top-0 asc";
    }
    this.setState({ sort }, () => {
      if (this.state.currentSortedColumn !== null) {
        if (this.state.currentSortedColumn.target !== e.target) {
          this.state.currentSortedColumn.target.className =
            "border-top-0 sortable";
        }
      }
      this.setState({ currentSortedColumn: e }, () => {
        this.getUsers(this.state.fieldsFromSearch);
      });
    });
  };
  handlePageChange = pageNo => {
    this.setState({ pageNo: pageNo, isloader: true }, () => {
      this.getUsers(this.state.fieldsFromSearch);
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
        <Helmet>
          <title>Users : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={8} sm={12}><h3>Users</h3></Col>
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
                        <Link className="btn btn-success m-1 btn-block" to={`/admin/users/add`}>
                          Add New User
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search User"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getUsers}
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
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={event => this.sortRecord(event, "name")}
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={event => this.sortRecord(event, "username")}
                        >
                          Username
                        </th>
                        <th
                          scope="col"
                          className="border-top-0 sortable"
                          onClick={event => this.sortRecord(event, "email")}
                        >
                          Email
                        </th>
                        <th scope="col" className="border-top-0">
                          Phone
                        </th>
                        {/*<th scope="col" className="border-top-0">
                          Location
    </th>*/}
                        <th scope="col" className="border-top-0">
                          Role
                        </th>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.users.length > 0
                        ? this.state.users.map((user, index) => (
                          <User
                            user={user}
                            getUsers={this.getUsers}
                            deleteUser={this.deleteUser}
                            key={`key-user-${index}`}
                            toggleModal={this.toggleModal}
                            fieldsFromSearch={this.state.fieldsFromSearch}
                          />
                        ))
                        : !this.state.isloader && (
                          <tr>
                            <td key={0} colSpan="8">
                              <p className="text-center">User not found.</p>
                            </td>
                          </tr>
                        )}
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
          </Col>
        </Row>
        {this.state.showModal && (
          <AddEditUser
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            userId={this.state.userId}
            getUsers={this.getUsers}
          />
        )}
      </div>
    );
  }
}

export default Users;
