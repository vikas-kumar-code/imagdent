import React, { Component } from "react";
import { Link } from "react-router-dom";
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

class ForgotPassword extends Component {
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
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Please enter your username or email.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ loader: true });
      this.handleForgotPassword();
    }
  };

  handleForgotPassword() {
    let reqData = {
      username: this.state.fields["username"]
    };
    var that = this;
    http
      .post("/user/forgot-password", reqData)
      .then(function(response) {
        that.setState({ loader: false });
        if (response.data.error) {
          let errors = {};
          errors = { username: response.data.message };
          that.setState({ errors });
        } else if (response.data.success) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  render() {
    const { loader } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Forgot Password : iMagDent</title>
        </Helmet>
        <section class="login-enter-section mb-md-5">
          <div id="lp-register">
            <div className="container wrapper" style={{minHeight:600}}>
              <Row className="mt-5">
                <Col sm={7} md={7} lg={7} className="mx-auto">
                  <div className="card log-reg-area">
                    <div className="log-reg">
                      <h2 className="login-title text-center mt-5">
                        <b>Forgot your password?</b>
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
                          <Label for="username">
                            Email Address Or Username
                          </Label>
                          <Input
                            className="form-control-lg"
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
                            invalid={
                              this.state.errors["username"] ? true : false
                            }
                          />
                          {this.state.errors["username"] && (
                            <FormFeedback>
                              {this.state.errors["username"]}
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
                                className="mr-1"
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

export default ForgotPassword;
