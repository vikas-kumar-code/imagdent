import React, { Component } from "react";
import Error403 from "../../Error403";
import {
  Col,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import SearchPatient from "./SearchPatient";
import Patient from "./Patient";
import RecentPatient from "./RecentPatient";

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloader: false,
      error_403: false,
      activeTab: "1"
    };
  }

  setActiveTab = activeTab => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>Patients : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "1"
                  })}
                  onClick={() => this.setActiveTab("1")}
                  style={{ fontSize: 20 }}
                >
                  Search
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2"
                  })}
                  onClick={() => this.setActiveTab("2")}
                  style={{ fontSize: 20 }}
                >
                  Recent Patients
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab} className="mb-3">
              <TabPane tabId="1">
                <SearchPatient
                  enableSelection={false}
                  enablePatientDetail={true}
                />
              </TabPane>
              <TabPane tabId="2">
                <RecentPatient />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Patients;
