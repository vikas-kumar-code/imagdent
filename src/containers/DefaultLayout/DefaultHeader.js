import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown,
} from "reactstrap";
import { connect } from "react-redux";
import {
  AppHeaderDropdown,
  AppNavbarBrand,
  AppSidebarToggler,
} from "@coreui/react";
import logo from "../../assets/images/admin-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChangeLoc from "./ChangeLoc";
import Button from "reactstrap/lib/Button";

class DefaultHeader extends Component {
  state = { submitted: false, showModal: false };
  toggleModal = (e) => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };
  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand full={{ src: logo, height: 40, alt: "iMagDent" }} />
        <Link
          to="/admin/cases/create"
          className="btn btn-success"
          style={{ marginLeft: 55 }}
        >
          Create New Case
        </Link>
        {/* <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="d-md-down-none" navbar>
          {!this.props.menuLoader &&
            this.props.navigation.items.map((nav, ni) => {
              if (ni < 10) {
                if(nav.children !== undefined){
                  return <UncontrolledDropdown nav inNavbar key={`dropdown-link-${ni}`}>
                  <DropdownToggle nav caret className="px-3" >
                    {nav.name}
                  </DropdownToggle>
                  <DropdownMenu right>
                    {nav.children.map((cnav, cni) => {
                        return (
                          <DropdownItem
                            tag={Link}
                            key={`header-link-${cni}`}
                            to={`${cnav.url}`}
                          >
                            {cnav.name}
                          </DropdownItem>
                        );
                      })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                }
                else{
                  return (
                    <NavItem className="px-3" key={ni}>
                      <NavLink
                        to={`${nav.url}`}
                        activeClassName="nav-link"
                      >
                        {nav.name}
                      </NavLink>
                    </NavItem>
                  );
                }
                
              }
            })}
          {!this.props.menuLoader && this.props.navigation.items.length > 10 && (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                More
              </DropdownToggle>
              <DropdownMenu right>
                {!this.props.menuLoader &&
                  this.props.navigation.items.map((nav, ni) => {
                    if (ni > 9) {
                      return (
                        <DropdownItem
                          tag={Link}
                          key={ni}
                          to={`/admin/${nav.url}`}
                        >
                          {nav.name}
                        </DropdownItem>
                      );
                    }
                  })}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </Nav> */}
        {/* <Nav className="ml-auto" navbar></Nav> */}
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <FontAwesomeIcon icon="user-circle" style={{ fontSize: 40 }} />
            </DropdownToggle>
            <DropdownMenu right style={{ right: "auto" }}>
              <DropdownItem header tag="div" className="text-center">
                <h5>{`Account (${this.props.userName})`}</h5>
              </DropdownItem>
              {/*this.props.userType !== "1" && (*/}
              <React.Fragment>
                <DropdownItem onClick={this.toggleModal}>
                  <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />{" "}
                  Change Location
                </DropdownItem>
              </React.Fragment>
              {/*})*/}
              <DropdownItem
                tag={Link}
                to={`/admin/users/edit/${this.props.userId}`}
              >
                <FontAwesomeIcon icon="sign-out-alt" className="mr-2" /> Edit
                Profile
              </DropdownItem>
              <DropdownItem tag={Link} to={`/logout`}>
                <FontAwesomeIcon icon="sign-out-alt" className="mr-2" /> Logout
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {this.state.showModal && (
          <ChangeLoc
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    navigation: state.navigation,
    name: state.name,
    userType: state.userType,
    userId: state.userId,
    userName: state.userName,
  };
};

export default connect(mapStateToProps)(DefaultHeader);
