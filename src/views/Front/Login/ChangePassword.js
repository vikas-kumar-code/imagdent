import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import http from "../../../services/http";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
  Col,
  Row,
  FormGroup,
  Spinner,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      loader: false,
      isFormValid: false
    };
  }

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["new_password"]) {
      formIsValid = false;
      errors["new_password"] = "Please enter your new password.";
    }
    if (!fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "Please confirm your new password.";
    } else if (fields["new_password"] !== fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "Password does not match.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ loader: true });
      let reqData = {
        token: this.props.match.params.token,
        new_password: this.state.fields["new_password"],
        confirm_password: this.state.fields["confirm_password"]
      };
      var that = this;
      http
        .post("/user/reset-password", reqData)
        .then(function(response) {
          that.setState({ loader: false });
          if (response.data.error) {
            if (response.data.message.password) {
              that.setState({
                errors: { new_password: response.data.message.password }
              });
            } else {
              toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              });
            }
          } else if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            that.props.history.push("/login");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  componentDidMount = () => {
    let that = this;
    if (this.props.match.params.token) {
      let reqData = {
        token: this.props.match.params.token
      };
      http
        .post("/user/check-password-reset-token", reqData)
        .then(function(response) {
          if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            //that.props.history.push("/login");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  render() {
    const { loader } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Change Password : iMagDent</title>
        </Helmet>
        <section class="login-enter-section mb-md-5">
          <div id="lp-register">
            <div className="container wrapper">
              <Row className="mt-5">
                <Col sm={7} md={7} lg={7} className="mx-auto">
                  <div className="card log-reg-area">
                    <div className="log-reg">
                      <h2 className="login-title text-center mt-5">
                        <b>Reset password</b>
                      </h2>
                      <p className="text-center reset mb-5">
                        We’ll help you reset it and get back on track.
                      </p>
                      <form
                        className="px-5 login-form"
                        method="post"
                        onSubmit={this.handleSubmit}
                      >
                        <FormGroup>
                          <Label for="username">Your new password</Label>
                          <Input
                            className="form-control-lg"
                            type="password"
                            name="new_password"
                            id="new_password"
                            value={
                              this.state.fields["new_password"]
                                ? this.state.fields["new_password"]
                                : ""
                            }
                            onChange={event =>
                              this.handleChange("new_password", event)
                            }
                            invalid={
                              this.state.errors["new_password"] ? true : false
                            }
                          />
                          {this.state.errors["new_password"] && (
                            <FormFeedback>
                              {this.state.errors["new_password"]}
                            </FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label for="confirm_password">
                            Confirm your password
                          </Label>
                          <Input
                            className="form-control-lg"
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
                              this.state.errors["confirm_password"]
                                ? true
                                : false
                            }
                          />
                          {this.state.errors["confirm_password"] && (
                            <FormFeedback>
                              {this.state.errors["confirm_password"]}
                            </FormFeedback>
                          )}
                        </FormGroup>

                        <Col md={12} className="text-center log-bt pb-5 pt-4">
                          <button
                            className="btn btn-danger btn-lg"
                            type="submit"
                            disabled={loader}
                          >
                            {loader && (
                              <Spinner
                                size="sm"
                                color="#887d7d"
                                className="mr-1 mb-1"
                              />
                            )}
                            Submit
                          </button>
                          <Link
                            to="/login"
                            className="btn btn-primary btn-lg ml-2"
                          >
                            Login
                          </Link>
                        </Col>
                      </form>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(ChangePassword);
