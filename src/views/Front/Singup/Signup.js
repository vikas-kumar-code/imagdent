import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "../../../services/http";
import SignupConfirmationModal from "./SignupConfirmationModal";
import {
  Col,
  Row,
  FormGroup,
  Spinner,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import { Helmet } from "react-helmet";
import ReCAPTCHA from "react-google-recaptcha";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      loader: false,
      issues: [],
      issues_error: false,
      selected_issues: [],
      issueLoader: true,
      showConfirmationModal: false,
      loader: false,
      captcha: false
    };
  }
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }
  handleIssue = e => {
    let selected_issues = this.state.selected_issues;
    if (e.target.className === "btn interests-btn") {
      selected_issues.push(e.target.id);
      e.target.className = "btn interests-btn selected";
      this.setState({ selected_issues });
    } else {
      let index_to_be_removed = selected_issues.indexOf(e.target.id);
      selected_issues.splice(index_to_be_removed, 1);
      e.target.className = "btn interests-btn";
      this.setState({ selected_issues });
    }
  };
  reCaptcha = value => {
    this.setState({ captcha: value });
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Please enter your email.";
    }
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Please enter your username.";
    }
    if (!fields["display_name"]) {
      formIsValid = false;
      errors["display_name"] = "Please enter your name.";
    }
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Please enter your password.";
    }
    /* if (!fields["phone"]) {
      formIsValid = false;
      errors["phone"] = "Please enter your phone number.";
    } */
    if (!fields["zip_code"]) {
      formIsValid = false;
      errors["zip_code"] = "Please enter your zip code.";
    }
    if (!fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "Please confirm your password";
    } else if (fields["password"] !== fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "Your password did not match";
    }
    if (this.state.selected_issues.length === 0) {
      formIsValid = false;
      errors["issue"] = "Please choose at least one issue.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ loader: true });
      this.doSignup(e.target);
    }
  };

  doSignup = target => {
    let reqData = {
      username: this.state.fields["username"],
      name: this.state.fields["display_name"],
      email: this.state.fields["email"],
      phone: this.state.fields["phone"],
      password: this.state.fields["password"],
      selected_issues: this.state.selected_issues,
      zip_code: this.state.fields["zip_code"],
      action: "login",
      scenario: "Signup",
      captcha: this.state.captcha,
      invitation_code: this.props.match.params.code
    };
    this.setState({ loader: true });
    var that = this;
    http
      .post("/user/add", reqData)
      .then(function(response) {
        that.setState({ loader: false });
        let errors = {};
        if (response.data.error) {
          if (response.data.message.username) {
            errors["username"] = response.data.message.username[0];
          }
          if (response.data.message.email) {
            errors["email"] = response.data.message.email[0];
          }
          if (response.data.message.phone) {
            errors["phone"] = response.data.message.phone[0];
          }
          if (response.data.message.password) {
            errors["password"] = response.data.message.password[0];
          }
          that.setState({ errors });
        } else if (response.data.success) {
          target.reset();
          that.setState({ showConfirmationModal: true });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  componentDidMount() {
    var that = this;
    http
      .get("/category/list")
      .then(function(response) {
        if (response.data.success) {
          that.setState({
            issues: response.data.categories,
            issueLoader: false
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Singup : iMagDent</title>
        </Helmet>

        <div id="lp-register">
          <div className="container wrapper">
            <Row className="mt-5">
              <Col sm={4} md={4} lg={4}>
                <h2 className="privacy-protected">
                  A powerful privacy-protected social platform for civic
                  engagement
                </h2>
                <Link
                  to="/login"
                  className="btn btn-warning Register-btn text-uppercase"
                >
                  Log In
                </Link>
              </Col>
              <Col sm={7} md={7} lg={7} className="mx-auto">
                <div className="card log-reg-area">
                  <div className="log-reg">
                    <h2 className="login-title text-center mt-5">
                      <b>Register</b>
                    </h2>

                    <form
                      className="px-lg-5 login-form"
                      method="post"
                      onSubmit={this.handleSubmit}
                    >
                      <FormGroup>
                        <Label for="username">Email Address</Label>
                        <Input
                          className="input-bg"
                          type="text"
                          name="email"
                          id="email"
                          value={
                            this.state.fields["email"]
                              ? this.state.fields["email"]
                              : ""
                          }
                          onChange={event => this.handleChange("email", event)}
                          invalid={this.state.errors["email"] ? true : false}
                        />
                        {this.state.errors["email"] && (
                          <FormFeedback>
                            {this.state.errors["email"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="username">Username</Label>
                        <Input
                          className="input-bg"
                          type="text"
                          name="username"
                          id="username"
                          value={
                            this.state.fields["username"]
                              ? this.state.fields["username"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("username", event)
                          }
                          invalid={this.state.errors["username"] ? true : false}
                        />
                        {this.state.errors["username"] && (
                          <FormFeedback>
                            {this.state.errors["username"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="display_name">Display Name</Label>
                        <Input
                          className="input-bg"
                          type="text"
                          name="display_name"
                          id="display_name"
                          value={
                            this.state.fields["display_name"]
                              ? this.state.fields["display_name"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("display_name", event)
                          }
                          invalid={
                            this.state.errors["display_name"] ? true : false
                          }
                        />
                        {this.state.errors["display_name"] && (
                          <FormFeedback>
                            {this.state.errors["display_name"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="username">Password</Label>
                        <Input
                          className="input-bg"
                          type="password"
                          name="password"
                          id="password"
                          value={
                            this.state.fields["password"]
                              ? this.state.fields["password"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("password", event)
                          }
                          invalid={this.state.errors["password"] ? true : false}
                        />
                        {this.state.errors["password"] && (
                          <FormFeedback>
                            {this.state.errors["password"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="confirm_password">Confirm Password</Label>
                        <Input
                          className="input-bg"
                          type="password"
                          name="confirm_password"
                          id="confirm_password"
                          value={
                            this.state.fields["confirm_password"]
                              ? this.state.fields["confirm_password"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("confirm_password", event)
                          }
                          invalid={
                            this.state.errors["confirm_password"] ? true : false
                          }
                        />
                        {this.state.errors["confirm_password"] && (
                          <FormFeedback>
                            {this.state.errors["confirm_password"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <Row>
                        <Col md={12} className="mt-4 px-3 mb-4">
                          <h4>Interests</h4>
                          <p className="mb-0 Interests-info">
                            Please tell us which issues you are interested in.
                            We will use this information to send you action
                            alerts for the issues that are important to you.
                          </p>
                          <div className="Interests mt-3">
                            {this.state.issueLoader && (
                              <React.Fragment>
                                <Spinner size="sm" color="dark" /> Please wait..
                              </React.Fragment>
                            )}
                            {this.state.issues.length > 0 &&
                              this.state.issues.map(issue => (
                                <button
                                  type="button"
                                  className="btn interests-btn"
                                  onClick={this.handleIssue}
                                  key={issue.id}
                                  id={issue.id}
                                >
                                  {issue.name}
                                </button>
                              ))}
                            <FormGroup>
                              {this.state.errors["issue"] && (
                                <FormFeedback style={{ display: "block" }}>
                                  {this.state.errors["issue"]}
                                </FormFeedback>
                              )}
                            </FormGroup>
                          </div>
                        </Col>
                      </Row>
                      <FormGroup>
                        <Label for="zip_code">Phone</Label>
                        <Input
                          className="input-bg"
                          type="text"
                          name="phone"
                          id="phone"
                          value={
                            this.state.fields["phone"]
                              ? this.state.fields["phone"]
                              : ""
                          }
                          onChange={event => this.handleChange("phone", event)}
                          invalid={this.state.errors["phone"] ? true : false}
                        />
                        {this.state.errors["phone"] && (
                          <FormFeedback>
                            {this.state.errors["phone"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="zip_code">Zip / Postal Code</Label>
                        <Input
                          className="input-bg"
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          value={
                            this.state.fields["zip_code"]
                              ? this.state.fields["zip_code"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("zip_code", event)
                          }
                          invalid={this.state.errors["zip_code"] ? true : false}
                        />
                        {this.state.errors["zip_code"] && (
                          <FormFeedback>
                            {this.state.errors["zip_code"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <ReCAPTCHA
                          sitekey="6LeTodUUAAAAAE6uO_PsdEOBx1jHZUAsCRCcYqZh"
                          onChange={this.reCaptcha}
                        />
                      </FormGroup>
                      <Col md={12} className="text-center log-bt pb-5 pt-4">
                        <button
                          className="btn btn btn-danger text-uppercase login-btn"
                          type="submit"
                          disabled={this.state.loader || !this.state.captcha}
                        >
                          {this.state.loader && (
                            <Spinner
                              size="sm"
                              color="#887d7d"
                              className="mr-1"
                            />
                          )}
                          Register
                        </button>
                        <div className="back-btn mt-4">
                          <Link to="/forgot-password">Forgot password</Link> |
                          <Link to="/terms-and-condition">
                            Terms & Conditions
                          </Link>
                        </div>
                      </Col>
                    </form>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <SignupConfirmationModal showModal={this.state.showConfirmationModal} />
      </React.Fragment>
    );
  }
}

export default Signup;
