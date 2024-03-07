import React, { Component } from "react";
import { Link, Redirect, Route, Switch, NavLink } from "react-router-dom";
import "../../Front.scss";
import routes from "../../front-routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify";
import LoginForm from "../../views/Front/Login/LoginForm";
import common from "../../services/common";
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  TetherContent,
  Tooltip
} from "reactstrap";

class FrontLayout extends Component {
  constructor(props) {
    super(props);
    this.navRef = React.createRef();
    this.state = {
      loader: true,
      sticky: false,
      isOpen: false,
      pages: [],
      year: new Date()
    };
  }
  componentDidMount = () => {
    window.addEventListener("scroll", this.scrollFunction, true);
    common.getPage().then((res) => {
      if (res.data.success) {
        this.setState({ pages: res.data.pages });
      }
    });
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollFunction, true);
  }
  scrollFunction = () => {
    var navbar = this.navRef;
    var stickybar = navbar.current.offsetTop;
    if (window.pageYOffset > stickybar) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  };
  onClickHandler = () => {
    this.setState((currentState) => ({
      isOpen: !currentState.isOpen,
    }));
  };
  accessToken = localStorage.getItem("token");
  
  
  render() {
    const { pages } = this.state;
    return (
      <div className="imagdent_front">
        <ToastContainer />
        <header>
          <div className="header_top_contact d-flex">
            <div className="container">
              <div className="row">
                <div className="col-auto ml-auto py-1">
                  <div className="header_right_contact">
                    <LoginForm section="top" history={this.props.history} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              this.state.sticky ? `sticky-wrapper sticky` : `sticky-wrapper`
            }
            id="navbar"
            ref={this.navRef}
          >
            <div className="header_main">
              <div className="container">
                <div className="header_content">
                  <div className="">
                    <Link to="/" className="brand-logo">
                      <img
                        src={require("../../assets/images/front-logo.png")}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="ml-auto">
                    <button
                      className="navbar-toggler collapsed"
                      data-toggle="collapse"
                      data-target="#navbarNavDropdown"
                      style={{ top: "12px" }}
                      onClick={this.onClickHandler}
                      aria-expanded={this.state.isOpen}
                    >
                      <FontAwesomeIcon
                        icon={this.state.isOpen ? "times" : "bars"}
                        className="icon-menu"
                      />
                    </button>
                    <div className="">
                      <nav className="navbar navbar-expand-lg pr-0">
                        <div
                          className={
                            this.state.isOpen
                              ? "collapse navbar-collapse justify-content-end show"
                              : "collapse navbar-collapse justify-content-end"
                          }
                          id="navbarNavDropdown"
                          style={{ maxHeight: "460px" }}
                        >
                          <ul className="navbar-nav">
                            <li className="nav-item">
                              <Link to="/" className="nav-link">
                                Home
                              </Link>
                            </li>
                            <li className="nav-item">
                              {pages.map((ele, index) => {
                                if (ele.url !== "home") {
                                  return (
                                    <div
                                      className="dropdown"
                                      key={`parent-${index + 1}`}
                                    >
                                      {ele.children.length > 0 ? (
                                        <div className="nav-link">
                                          {ele.name}
                                        </div>
                                      ) : (
                                        <Link
                                          to={`/page/${ele.url}`}
                                          className="nav-link"
                                        >
                                          {ele.name}
                                        </Link>
                                      )}
                                      {ele.children.length > 0 && (
                                        <div 
                                          className="dropdown-content"
                                          >
                                          <ul>
                                            {ele.children.map((child, idx) => {
                                              return (
                                                <li key={`child-${idx + 1}`}>
                                                  <Link
                                                    to={`/page/${child.url}`}
                                                    className="nav-link"
                                                  >
                                                    {child.name}
                                                  </Link>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              })}
                            </li>
                            {/* <li className="nav-item">
                              {pages.map((ele, index) => {
                                if (ele.url !== "home") {
                                  return (
                                    <Dropdown  
                                      key={`parent-${index + 1}`}
                                      isOpen={this.state.multipledropdown} 
                                      toggle={() => { this.setState({ multipledropdown: !this.state.multipledropdown })}}
                                      >
                                        {ele.children.length > 0 ? (
                                          <DropdownToggle caret>
                                            <Button color="primary">
                                              {ele.name}
                                            </Button>
                                          </DropdownToggle>
                                          ) : (
                                            <Link
                                              to={`/page/${ele.url}`}
                                              className="nav-link"
                                            >
                                              {ele.name}
                                            </Link>
                                          )}
                                          {ele.children.length > 0 && (
                                            <>
                                            <DropdownMenu>
                                              <DropdownItem>
                                                <ul>
                                                  {ele.children.map((child, idx) => {
                                                    return (
                                                      <li key={`child-${idx + 1}`}>
                                                        <Link
                                                          to={`/page/${child.url}`}
                                                          className="nav-link"
                                                        >
                                                          {child.name}
                                                        </Link>
                                                      </li>
                                                    );
                                                  })}
                                                </ul>
                                              </DropdownItem>
                                            </DropdownMenu>
                                            </>
                                          )}
                                    </Dropdown>
                                 );
                                }
                              })}
                            </li> */}
                            <li className="nav-item">
                              <Link to="/faq" className="nav-link">
                                Faq
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/locations" className="nav-link">
                                CONTACT Us
                              </Link>
                            </li>
                            <li className="nav-item">
                              {this.accessToken ? (
                                <Link
                                  to="/admin/dashboard"
                                  className={
                                    this.state.active
                                      ? `nav-link active`
                                      : `nav-link`
                                  }
                                >
                                  Login
                                </Link>
                              ) : (
                                <Link
                                  to="/login"
                                  className={
                                    this.state.active
                                      ? `nav-link active`
                                      : `nav-link`
                                  }
                                >
                                  Login
                                </Link>
                              )}
                            </li>
                          </ul>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Switch>
          {routes.map((route, idx) => {
            return route.component ? (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={(props) => <route.component {...props} />}
              />
            ) : <Redirect to="/" key={idx}/>;
          })}
        </Switch>
        <section className="footer-Section">
          <div className="footer mt-0">
            {/* <div className="container">
              <div className="row py-1 py-md-2 px-lg-0 d-flex align-items-center justify-content-center">
                <div className="col-lg-4">
                  <h3>Coming Soon</h3>
                   <div className="row flex-column flex-md-row flex-lg-column">
                    <div className="col-md col-lg-auto">
                      <div className="footer-logo">
                        <img
                          src={require("../../assets/images/front-logo.png")}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="mt-2 mt-lg-0" />
                      <div className="footer-social d-none d-md-block d-lg-none">
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
                        </Link>
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "twitter"]} /> 
                        </Link>
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "google"]} />
                        </Link>
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "instagram"]} />
                        </Link>
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="footer-text mt-1 mt-lg-2">
                        <p>
                          To receive email releases, simply provide
                          <br />
                          us with your email below
                        </p>
                        <form action="#" className="footer-subscribe">
                          <div className="input-group">
                            <input
                              name="subscribe_mail"
                              type="text"
                              className="form-control rounded"
                              placeholder="Your Email"
                            />
                            <span>
                              <FontAwesomeIcon
                                icon="envelope"
                                className="pr-2"
                              />
                            </span>
                          </div>
                        </form>
                      </div>
                      <div className="footer-social d-md-none d-lg-block mt-4">
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
                        </Link>
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "twitter"]} />
                        </Link>
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "google"]} />
                        </Link>
                        <Link to="/" target="blank" className="hovicon">
                          <FontAwesomeIcon icon={["fab", "instagram"]} />
                        </Link>
                      </div>
                    </div>
                  </div> 
                </div>
                <div className="col-sm-6 col-lg-4 d-flex align-items-center justify-content-center">
                  <h3>Coming Soon</h3>
                   <h3 className="mb-3">Blog Posts</h3>
                  <div className="h-divider" />
                  <div className="footer-post d-flex">
                    <div className="footer-post-photo">
                      <img
                        src={require("../../assets/images/img1.jpg")}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="footer-post-text">
                      <div className="footer-post-title">
                        <a href="post.html">Medications &amp; Oral Health</a>
                      </div>
                      <p>September 26, 2018</p>
                    </div>
                  </div>
                  <div className="footer-post d-flex">
                    <div className="footer-post-photo">
                      <img
                        src={require("../../assets/images/img2.jpg")}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="footer-post-text">
                      <div className="footer-post-title">
                        <a href="post.html">Smile For Your Health!</a>
                      </div>
                      <p>August 22, 2018</p>
                    </div>
                  </div>
                  <div className="footer-post d-flex">
                    <div className="footer-post-photo">
                      <img
                        src={require("../../assets/images/img3.jpg")}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="footer-post-text">
                      <div className="footer-post-title">
                        <a href="post.html">Tooth Fairy Traditions...</a>
                      </div>
                      <p>July 25, 2018</p>
                    </div>
                  </div> 
                </div>

                <div className="col-sm-6 col-lg-4">
                  <h3 className="mb-3">Our Contacts</h3>
                  <div className="h-divider" />
                  <ul className="icn-list pl-0">
                    <li>
                      <FontAwesomeIcon
                        icon="map-marker"
                        className="icn-size pr-2"
                      />
                      1560 Holden Street San Diego, CA 92139
                      <br />
                      <Link
                        to="/locations"
                        className="btn btn-outline-primary btn-gradient text-white"
                      >
                        <span>Get directions on the map</span>
                        <FontAwesomeIcon
                          icon="arrow-right"
                          className="position-relative text-white pl-1"
                          style={{ top: "3px" }}
                        />
                        <i className="icon-right-arrow position-relative text-white pl-1" />
                      </Link>
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon="phone-alt"
                        className="icn-size pr-2"
                      />
                      <b>
                        <span className="phone">
                          <span className="text-nowrap">1-800-267-0000</span>,{" "}
                          <span className="text-nowrap">1-800-267-0001</span>
                        </span>
                      </b>
                      <br />
                      (24/7 General inquiry)
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon="envelope"
                        className="icn-size pr-2"
                      />
                      <a
                        href="mailto:support@imagdent.com"
                        className="text-decoration-none"
                      >
                        support@imagdent.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
            <div className="footer-bottom">
              <div className="container">
                <div className="row  text-md-left">
                  <div className="col-sm text-center justify-content-center">
                    Copyright © {this.state.year.getFullYear()}{" "}
                    <a href="#">iMagDent</a>
                    {/* <Link to="/">Privacy Policy</Link> */}
                  </div>
                  {/* <div className="col-sm-auto ml-auto">
                    <span className="d-none d-sm-inline">
                      For emergency cases&nbsp;&nbsp;&nbsp;
                    </span>
                    <FontAwesomeIcon icon="phone-alt" />
                    &nbsp;&nbsp;<b>1-800-267-000045454554</b>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default FrontLayout;
