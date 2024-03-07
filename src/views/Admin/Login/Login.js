import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  CustomInput,
  Alert,
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Label
} from "reactstrap";
import axios from "axios";
import "../../../App.scss";
import store from "../../../store/store";
import { doLogin } from "../../../store/actions";
import http from "../../../services/http";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.username ? localStorage.username : "",
      password: localStorage.password ? localStorage.password : "",
      remember_me: false,
      button_disabled: false,
      button_text: "Login",
      fadeIn: false,
      show_error: false,
      error_text: "",
      errors: {}
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ button_disabled: true, button_text: "Logging.." });
    this.login();
  };
  login() {
    if (this.handleValidation()) {
      let data = {
        username: this.state.username,
        password: this.state.password
      };
      var that = this;
      http
        .post("/user/login", data)
        .then(function (response) {
          that.setState({ button_disabled: false, button_text: "Login" });
          if (response.data.error) {
            that.setState({
              fadeIn: true,
              show_error: true,
              error_text: response.data.error
            });
          } else if (response.data.success) {
            sessionStorage.setItem("token", response.data.token);
            axios.defaults.headers.common["X-Api-Key"] =
              "Bearer " + response.data.token;
            if (that.state.remember_me === true) {
              localStorage.setItem("username", that.state.username);
              localStorage.setItem("password", that.state.password);
            } else {
              localStorage.removeItem("username");
              localStorage.removeItem("password");
            }
            store.dispatch(
              doLogin({
                token: response.data.token,
                authenticated: true,
                userName: response.data.username,
                userId: response.data.user_id,
                name: response.data.name
              })
            );
            that.props.history.push("/admin/dashboard");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      this.setState({ button_disabled: false, button_text: "Login" });
    }
  }
  componentDidMount() {
    if (localStorage.username || localStorage.password) {
      //this.login();
    }
  }
  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Name
    if (!this.state.username) {
      formIsValid = false;
      errors["name"] = "Cannot be empty";
    }
    if (!this.state.password) {
      formIsValid = false;
      errors["password"] = "Cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleChange = e => {
    let value = e.target.value;
    if (e.target.name === "username") {
      this.setState({ username: value });
    } else if (e.target.name === "password") {
      this.setState({ password: value });
    } else if (e.target.name === "remember_me") {
      this.setState({ remember_me: e.target.checked });
    }
  };
  render() {
    if (localStorage.token || localStorage.token) {
      return <Redirect to="/admin/dashboard" />;
    }
    return (
      <div className="app flex-row align-items-center admin">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4 text-left">
                  <CardBody>
                    <Form onSubmit={event => this.handleSubmit(event)}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <Alert
                        color="danger"
                        className="hidden"
                        isOpen={this.state.show_error}
                        fade={this.state.fadeIn}
                      >
                        {this.state.error_text}
                      </Alert>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          name="username"
                          value={this.state.username}
                          onChange={this.handleChange}
                        />
                      </InputGroup>
                      {this.state.errors["name"] ? (
                        <Label style={{ color: "red" }}>
                          {this.state.errors["name"]}
                        </Label>
                      ) : null}
                      <InputGroup className="mb-2">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          onChange={this.handleChange}
                          value={this.state.password}
                        />
                      </InputGroup>
                      {this.state.errors["password"] ? (
                        <Label style={{ color: "red" }}>
                          {this.state.errors["password"]}
                        </Label>
                      ) : null}
                      <CustomInput
                        type="checkbox"
                        name="remember_me"
                        id="remember_me"
                        label="Remember me"
                        className="mb-2"
                        checked={this.state.remember_me}
                        value={true}
                        onChange={this.handleChange}
                      />
                      <Row>
                        <Col xs={6}>
                          <Button
                            color="primary"
                            className="px-4"
                            type="submit"
                            disabled={this.state.button_disabled}
                          >
                            {this.state.button_text}
                          </Button>
                        </Col>
                        <Col xs={6} className="text-right">
                          <Button color="link" className="px-0" type="button">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
