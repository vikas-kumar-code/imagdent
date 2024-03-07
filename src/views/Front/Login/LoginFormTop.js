import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Row,
  FormGroup,
  Spinner,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

class LoginFormTop extends Component {
  accessToken = localStorage.getItem("token");
  componentDidMount() {
    console.log(this.accessToken);
  }
  render() {
    return (
      <>
        {this.accessToken === null ? (
          <div className="LoginFormTop">
            <form className="login-form" onSubmit={this.props.handleSubmit}>
              <FormGroup>
                <Input
                  className="input-bg"
                  type="text"
                  name="username"
                  id="username"
                  value={
                    this.props.fields["username"]
                      ? this.props.fields["username"]
                      : ""
                  }
                  onChange={(event) =>
                    this.props.handleChange("username", event)
                  }
                  invalid={this.props.errors["username"] ? true : false}
                  placeholder="Username Or Email"
                />
              </FormGroup>
              <FormGroup>
                <Input
                  className="input-bg"
                  type="password"
                  name="password"
                  id="password"
                  value={
                    this.props.fields["password"]
                      ? this.props.fields["password"]
                      : ""
                  }
                  onChange={(event) =>
                    this.props.handleChange("password", event)
                  }
                  invalid={this.props.errors["password"] ? true : false}
                  placeholder="Password"
                />
              </FormGroup>
              <FormGroup>
                <button
                  className="btn btn-primary artical-button"
                  type="submit"
                  disabled={this.props.loader}
                >
                  {this.props.loader && (
                    <Spinner size="sm" color="#887d7d" className="mr-1" />
                  )}
                  Log in
                </button>
              </FormGroup>
              <FormGroup>
          <Link to="/forgot-password" className="forgot_password text-warning ml-4">Forgot Password?</Link>
            </FormGroup>
            </form>
          </div>
        ) : (
          <div style={{ padding: "20px" }}></div>
        )}
      </>
    );
  }
}
export default LoginFormTop;
