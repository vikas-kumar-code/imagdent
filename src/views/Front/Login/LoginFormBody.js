import React, { Component } from "react";
import { doLogin } from "../../../store/actions";
import { connect } from "react-redux";
import {
  Col,
  Row,
  FormGroup,
  Spinner,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import { Link } from "react-router-dom";


class LoginFormBody extends Component {
  render() {
    return (
        <form
        className="login-form"
        method="post"
        onSubmit={this.props.handleSubmit}
      >
        <FormGroup>
          <Label for="username">Username Or Email</Label>
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
            onChange={event => this.props.handleChange("username", event)}
            invalid={this.props.errors["username"] ? true : false}
          />
          {this.props.errors["username"] && (
            <FormFeedback>
              {this.props.errors["username"]}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            className="input-bg"
            type="text" style={{webkitTextSecurity: "disc"}}
            name="password"
            id="password"
            value={
              this.props.fields["password"]
                ? this.props.fields["password"]
                : ""
            }
            onChange={event => this.props.handleChange("password", event)}
            invalid={this.props.errors["password"] ? true : false}
          />
          {this.props.errors["password"] && (
            <FormFeedback>
              {this.props.errors["password"]}
            </FormFeedback>
          )}
        </FormGroup>
        <Row>
          <Col md={6}>
            <button
              className="btn btn-primary artical-button"
              type="submit"
              disabled={this.props.loader}
            >
              {this.props.loader && (
                <Spinner
                  size="sm"
                  color="#887d7d"
                  className="mr-1"
                />
              )}
              Log in
            </button>
          </Col>
          <Col md={6} className="pt-2">
            <Link to="/forgot-password" className="forgot_password">Forgot Password?</Link>
          </Col>
        </Row>
      </form>
    );
  }
}

export default LoginFormBody;
