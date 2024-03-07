import React, { Component } from "react";
import EmailVarificationModal from "./EmailVarificationModal";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Col,
  Row,
  FormGroup,
  Spinner,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import user from "../../../services/user";
import page from "../../../services/page";
import { doLogin } from "../../../store/actions";
import common from "../../../services/common";
import Scrollbars from "react-custom-scrollbars";

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    userType: state.userType,
  };
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      loader: false,
      htmlLoader: false,
      agreementModule: false,
      referral: [],
      page: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.userId) {
      this.props.history.push("/admin/dashboard");
    }
    let referral = [];
    common.referral.forEach(
      (ref, index) =>
        (referral[index] = {
          label: ref,
          value: index,
        })
    );

    this.setState({ referral },()=>{
      console.log(this.state.referral);
    });
  }

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!fields["first_name"]) {
      formIsValid = false;
      errors["first_name"] = "First name can not be empty!";
    }
    if (!fields["last_name"]) {
      formIsValid = false;
      errors["last_name"] = "Last name can not be empty!";
    }
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email can not be empty!";
    }
    if (regex.test(fields["email"]) == false) {
      formIsValid = false;
      errors["email"] = "Email Id is not valid!";
    }
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Password can not be empty!";
    }
    if (!fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "Password can not be empty!";
    }
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Username can not be empty!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getPage = () => {
    this.setState({ htmlLoader: true });
    let fields = this.state.fields;
    page.getOneByName({ url: "agreement" ,first_name:fields["first_name"],last_name:fields["last_name"]}).then((response) => {
      if (response.data.success) {
        this.setState({
          loader: false,
          page: response.data.content,
          htmlLoader: false,
        });
      } else if (response.data.error) {
        this.setState({ loader: false, notFound: true, htmlLoader: false });
      }
    });
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked === true) {
        fields[name] = 1;
      } else {
        fields[name] = 0;
      }
    } else {
      fields[name] = value;
    }
    this.setState({ fields });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (!this.state.agreementModule) {
        this.setState({ agreementModule: true });
        this.getPage();
      } else {
        this.setState({ loader: true });
        const params = {
          fields: this.state.fields,
        };
        user.addRefferingUser(params).then((response) => {
          if (response.data.success) {
            if (response.data.userDetails) {
              {
                localStorage.clear();
                localStorage.setItem("token", response.data.userDetails.token);
                localStorage.setItem(
                  "userType",
                  response.data.userDetails.user_type
                );
                localStorage.setItem(
                  "userName",
                  response.data.userDetails.username
                );
                localStorage.setItem(
                  "userId",
                  response.data.userDetails.user_id
                );
                localStorage.setItem(
                  "userImage",
                  response.data.userDetails.image
                );
                localStorage.setItem("name", response.data.userDetails.name);
                localStorage.setItem("userId", response.data.userDetails.user_id);
                this.props.doLogin({
                  token: response.data.userDetails.token,
                  authenticated: true,
                  userName: response.data.userDetails.username,
                  userId: response.data.userDetails.user_id,
                  userType: response.data.userDetails.user_type,
                  userImage: response.data.userDetails.image,
                  name: response.data.userDetails.name,
                });
                this.setState({ loader: false });
                this.props.history.push(
                  `/admin/users/edit/${response.data.userDetails.user_id}`
                );
              }
            }
          } else if (response.data.error) {
            if (response.data.message) {
              this.setState({
                errors: response.data.message,
                loader: false,
                agreementModule: false,
              });
            }
          }
        });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Login : iMagDent</title>
        </Helmet>

        <section className="login-enter-section mb-md-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12">
                <div className="left-side-login">
                  <h2 className="mb-3">Login to your Account</h2>
                  <LoginForm section="body" history={this.props.history} />
                </div>
              </div>
              {!this.state.agreementModule ? (
                <div className="col-lg-8 col-md-12">
                  <div className="right-area-login pl-lg-3 pl-0">
                    <h2 className="mt-4 mt-lg-0">
                      Don't have an account? Sign up now.
                    </h2>
                    <p className="mb-md-0 pt-3 mb-0">
                      Are you ready to simplify the referral process while
                      enhancing the benefits of working cohesively as a
                      treatment team? Sign up below! We look forward to helping
                      you take your practice to the next level.
                    </p>
                    <form method="post" onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <FormGroup>
                            <Label>First Name *</Label>
                            <Input
                              className="select-btn"
                              type="text"
                              name="first_name"
                              id="first_name"
                              value={
                                this.state.fields["first_name"]
                                  ? this.state.fields["first_name"]
                                  : ""
                              }
                              onChange={(event) => this.handleChange(event)}
                              invalid={
                                this.state.errors["first_name"] ? true : false
                              }
                              tabIndex="1"
                            />
                            {this.state.errors["first_name"] && (
                              <FormFeedback>
                                {this.state.errors["first_name"]}
                              </FormFeedback>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <Label>Username *</Label>
                            <Input
                              className="select-btn"
                              type="text"
                              name="username"
                              id="username"
                              value={
                                this.state.fields["username"]
                                  ? this.state.fields["username"]
                                  : ""
                              }
                              onChange={(event) => this.handleChange(event)}
                              invalid={
                                this.state.errors["username"] ? true : false
                              }
                              tabIndex="3"
                            />
                            {this.state.errors["username"] && (
                              <FormFeedback>
                                {this.state.errors["username"]}
                              </FormFeedback>
                            )}
                          </FormGroup>
                          <FormGroup>
                            <Label>Choose Password *</Label>
                            <Input
                              className="select-btn"
                              type="text"
                              style={{ webkitTextSecurity: "disc" }}
                              name="password"
                              id="password"
                              value={
                                this.state.fields["password"]
                                  ? this.state.fields["password"]
                                  : ""
                              }
                              onChange={(event) => this.handleChange(event)}
                              invalid={
                                this.state.errors["password"] ? true : false
                              }
                              tabIndex="5"
                            />
                            {this.state.errors["password"] && (
                              <FormFeedback>
                                {this.state.errors["password"]}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <FormGroup>
                            <Label>Last Name *</Label>
                            <Input
                              className="select-btn"
                              type="text"
                              name="last_name"
                              id="last_name"
                              value={
                                this.state.fields["last_name"]
                                  ? this.state.fields["last_name"]
                                  : ""
                              }
                              onChange={(event) => this.handleChange(event)}
                              invalid={
                                this.state.errors["last_name"] ? true : false
                              }
                              tabIndex="2"
                            />
                            {this.state.errors["last_name"] && (
                              <FormFeedback>
                                {this.state.errors["last_name"]}
                              </FormFeedback>
                            )}
                          </FormGroup>
                          <FormGroup>
                            <Label>Email Address *</Label>
                            <Input
                              className="select-btn"
                              type="text"
                              name="email"
                              id="email"
                              value={
                                this.state.fields["email"]
                                  ? this.state.fields["email"]
                                  : ""
                              }
                              onChange={(event) => this.handleChange(event)}
                              invalid={
                                this.state.errors["email"] ? true : false
                              }
                              tabIndex="4"
                            />
                            {this.state.errors["email"] && (
                              <FormFeedback>
                                {this.state.errors["email"]}
                              </FormFeedback>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <Label>Confirm Password *</Label>
                            <Input
                              className="select-btn"
                              type="text"
                              style={{ webkitTextSecurity: "disc" }}
                              name="confirm_password"
                              id="confirm_password"
                              value={
                                this.state.fields["confirm_password"]
                                  ? this.state.fields["confirm_password"]
                                  : ""
                              }
                              onChange={(event) => this.handleChange(event)}
                              invalid={
                                this.state.errors["confirm_password"]
                                  ? true
                                  : false
                              }
                              tabIndex="6"
                            />
                            {this.state.errors["confirm_password"] && (
                              <FormFeedback>
                                {this.state.errors["confirm_password"]}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </div>
                      </div>

                      <FormGroup>
                        <Label>How did you hear about us ? </Label>
                        <Input
                          className="select-btn"
                          type="select"
                          name="referral"
                          onChange={(event) => this.handleChange(event)}
                          value={this.state.fields["referral"] ? this.state.fields["referral"] : ""}
                        >
                          <option value="">
                            {this.state.referral.length === 0
                              ? "Loading..."
                              : "-Select-"}
                          </option>
                          {this.state.referral.map((ref, i) => (
                            <option value={i+1} key={`key-ref-${ref}`}>
                              {ref.label}
                            </option>
                          ))}
                        </Input>
                        {this.state.errors["referral"] && (
                              <FormFeedback>
                                {this.state.errors["referral"]}
                              </FormFeedback>
                            )}
                      </FormGroup>

                      <FormGroup>
                        <button
                          className="btn btn-primary artical-button"
                          type="submit"
                          disabled={this.state.loader}
                        >
                          {this.state.loader && (
                            <Spinner
                              size="sm"
                              color="#887d7d"
                              className="mr-1"
                            />
                          )}
                          Sign Up
                        </button>
                      </FormGroup>
                    </form>
                  </div>
                </div>
              ) : (
                <div
                  className="col-lg-8 col-md-12"
                  style={{ minHeight: "400px" }}
                >
                  {this.state.htmlLoader ? (
                    <center>
                      <Spinner
                        color="#887d7d"
                        className="mr-1 justify-content-center align-items-center mt-5"
                      />
                    </center>
                  ) : (
                    <form method="post" onSubmit={this.handleSubmit}>
                      <Scrollbars
                        autoHeight
                        autoHeightMin={300}
                        autoHeightMax={400}
                        autoHide={false}
                      >
                        <div className="right-area-login pl-lg-3 pl-0">
                          <div
                            className="mb-3"
                            dangerouslySetInnerHTML={{
                              __html: this.state.page.content,
                            }}
                          />
                          <FormGroup className="mx-4">
                            <Label>
                              <Input
                                type="checkbox"
                                onChange={(e) => this.handleChange(e)}
                                name="accept_compliance"
                                id="accept_compliance"
                                checked={
                                  this.state.fields["accept_compliance"] == "1"
                                }
                              />
                              I have read the above agreement and accept the
                              same.
                            </Label>
                          </FormGroup>
                        </div>
                      </Scrollbars>
                      <FormGroup className="mt-3 mx-4">
                        <button
                          className="btn btn-primary artical-button "
                          type="submit"
                          disabled={
                            this.state.loader ||
                            parseInt(this.state.fields["accept_compliance"]) !==
                              1
                          }
                        >
                          {this.state.loader && (
                            <Spinner
                              size="sm"
                              color="#887d7d"
                              className="mr-1"
                            />
                          )}
                          REGISTER
                        </button>
                      </FormGroup>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        <EmailVarificationModal
          show={this.props.match.params.code ? true : false}
          code={
            this.props.match.params.code ? this.props.match.params.code : null
          }
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: (data) => {
      dispatch(doLogin(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);