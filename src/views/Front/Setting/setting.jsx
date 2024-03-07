import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { setToken } from "../../../config";
import { Personal } from "./Personal";
import { ChangePassword } from "./ChangePassword";
import { Issues } from "./Issues";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import axios from "axios";
import classnames from "classnames";
class Setting extends Component {
  state = {
    activeTab: "1"
  };

  componentDidMount() {
    setToken();
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    return (
      <div className="front_body front_color">
        <section>
          <div className="feature-photo">
            <figure>
              <img src="/assets/img/Profile/profile-bg.jpg" alt="" />
            </figure>
          </div>
        </section>
        <section id="tabs">
          <div className="container">
            <h6 className="section-title  Profile-Settings h2 text-center">
              Profile Settings
            </h6>
            <div className="row">
              <div className="col-md-12 col-xs-12 ">
                <Nav tabs className="Setting_menu">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      Profile Infirmation
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      Account Settings
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3"
                      })}
                      onClick={() => {
                        this.toggle("3");
                      }}
                    >
                      Change Password
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "4"
                      })}
                      onClick={() => {
                        this.toggle("4");
                      }}
                    >
                      Hobbies & Interests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "5"
                      })}
                      onClick={() => {
                        this.toggle("5");
                      }}
                    >
                      Issues Categories
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Personal />
                  </TabPane>

                  <TabPane tabId="2">
                    <div className="pt-4 pr-3 pl-3 pb-3">
                      2 Et et consectetur ipsum labore excepteur est proident
                      excepteur ad velit occaecat qui minim occaecat veniam.
                      Fugiat veniam incididunt anim aliqua enim pariatur veniam
                      sunt est aute sit dolor anim. Velit non irure adipisicing
                      aliqua ullamco irure incididunt irure non esse consectetur
                      nostrud minim non minim occaecat. Amet duis do nisi duis
                      veniam non est eiusmod tempor incididunt tempor dolor
                      ipsum in qui sit. Exercitation mollit sit culpa nisi culpa
                      non adipisicing reprehenderit do dolore. Duis
                      reprehenderit occaecat anim ullamco ad duis occaecat ex.
                    </div>
                  </TabPane>
                  <TabPane tabId="3">
                    <ChangePassword issues={this.state.issues} />
                  </TabPane>
                  <TabPane tabId="4">
                    <div className="pt-4 pr-3 pl-3 pb-3">
                      2 Et et consectetur ipsum labore excepteur est proident
                      excepteur ad velit occaecat qui minim occaecat veniam.
                      Fugiat veniam incididunt anim aliqua enim pariatur veniam
                      sunt est aute sit dolor anim. Velit non irure adipisicing
                      aliqua ullamco irure incididunt irure non esse consectetur
                      nostrud minim non minim occaecat. Amet duis do nisi duis
                      veniam non est eiusmod tempor incididunt tempor dolor
                      ipsum in qui sit. Exercitation mollit sit culpa nisi culpa
                      non adipisicing reprehenderit do dolore. Duis
                      reprehenderit occaecat anim ullamco ad duis occaecat ex.
                    </div>
                  </TabPane>
                  <TabPane tabId="5">
                    <Issues />
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Setting;
