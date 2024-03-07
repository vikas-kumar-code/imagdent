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
  Button
} from "reactstrap";
import plan from "../../../services/plan";
import Plan from "./Plan";
import AddEditPlan from "./AddEditPlan";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Plans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [],
      isloader: true,
      pageNo: 1,
      pageSize: 20,
      hasMore: false,
      showModal: false,
      planId: "",
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }]
    };
  }

  updateSearchFields = fields => {
    this.setState({ fields });
  };

  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getPlans();
    });
  };

  toggleSearch = e => {
    this.setState(prevState => ({
      search: !prevState.search
    }));
  };
  getPlans = (e, fields) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({ isloader: true });
    let params = {
      fields: fields,
      pageSize: this.state.pageSize,
      page: this.state.page
    };

    plan
      .list(params)
      .then(response => {
        this.setState({ isloader: false });
        if (response.data.success) {
          this.setState({
            plans: response.data.plans,
            pages: response.data.pages.totalCount
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  componentDidMount = () => {
    this.getPlans();
  };
  deletePlan = id => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this plan?")) {
      plan.delete(params).then(response => {
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
    let planId = e !== undefined ? e.target.dataset.id : "";
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      planId
    }));
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Plans : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={6}>
                    <strong style={{ fontSize: 20 }}>Plans</strong>
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
                      Add New Plan
                    </Button>
                  </Col>
                </Row>
                <Search
                  fields={this.state.fields}
                  isOpen={this.state.search}
                  heading="Search Plans"
                  searchFields={this.state.searchFields}
                  updateSearchFields={this.updateSearchFields}
                  searchRecord={this.getPlans}
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
                          Duration In Month
                        </th>
                        <th scope="col" className="border-top-0">
                          Price
                        </th>
                        <th
                          scope="col"
                          className="border-top-0"
                          width={10 + "%"}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.plans.length > 0 ? (
                        this.state.plans.map((plan, index) => (
                          <Plan
                            plan={plan}
                            getPlans={this.getPlans}
                            deletePlan={this.deletePlan}
                            key={`key-clinic-${index}`}
                            toggleModal={this.toggleModal}
                          />
                        ))
                      ) : (
                        <tr>
                          <td key={0} colSpan="5">
                            <p className="text-center">Plan not found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </LoadingOverlay>
                {this.state.plans.length > 20 && (
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
          <AddEditPlan
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            planId={this.state.planId}
            getPlans={this.getPlans}
          />
        )}
      </div>
    );
  }
}

export default Plans;
