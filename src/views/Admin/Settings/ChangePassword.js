import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label
} from "reactstrap";
import account from "../../../services/account";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      submitted: false
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });
    const params = {
      current_password: this.state.fields["current_password"]
        ? this.state.fields["current_password"]
        : "",
      new_password: this.state.fields["new_password"]
        ? this.state.fields["new_password"]
        : "",
      confirm_password: this.state.fields["confirm_password"]
        ? this.state.fields["confirm_password"]
        : ""
    };

    account.changePassword(params).then(response => {
      this.setState({ submitted: false }, () => {
        let errors = {};
        let fields = {};
        if (response.data.success) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
          this.setState({ fields });
        } else if (response.data.error) {
          if (response.data.error.current_password) {
            errors["current_password"] =
              response.data.error.current_password[0];
          }
          if (response.data.error.new_password) {
            errors["new_password"] = response.data.error.new_password[0];
          }
          if (response.data.error.confirm_password) {
            errors["confirm_password"] =
              response.data.error.confirm_password[0];
          }
        }
        this.setState({ errors });
      });
    });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <CardHeader>Change Password</CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="name">Current Password</Label>
                <Input
                  type="password"
                  name="current_password"
                  id="current_password"
                  value={
                    this.state.fields["current_password"]
                      ? this.state.fields["current_password"]
                      : ""
                  }
                  onChange={event =>
                    this.handleChange("current_password", event)
                  }
                  invalid={this.state.errors["current_password"] ? true : false}
                />
                {this.state.errors["current_password"] && (
                  <FormFeedback>
                    {this.state.errors["current_password"]}
                  </FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="new_password">New Password</Label>
                <Input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={
                    this.state.fields["new_password"]
                      ? this.state.fields["new_password"]
                      : ""
                  }
                  onChange={event => this.handleChange("new_password", event)}
                  invalid={this.state.errors["new_password"] ? true : false}
                />
                {this.state.errors["new_password"] && (
                  <FormFeedback>
                    {this.state.errors["new_password"]}
                  </FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="confirm_password">Confirm Password</Label>
                <Input
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
                  invalid={this.state.errors["confirm_password"] ? true : false}
                />
                {this.state.errors["confirm_password"] && (
                  <FormFeedback>
                    {this.state.errors["confirm_password"]}
                  </FormFeedback>
                )}
              </FormGroup>
            </CardBody>
            <CardFooter className="text-right">
              <Button
                type="submit"
                className="btn btn-success"
                disabled={this.state.submitted}
              >
                {this.state.submitted && (
                  <FontAwesomeIcon
                    icon="spinner"
                    className="mr-1"
                    spin={true}
                  />
                )}
                Save
              </Button>
            </CardFooter>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl
  };
};
export default connect(mapStateToProps)(ChangePassword);
