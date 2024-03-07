import React, { Component } from "react";
import { setToken } from "../../../config";
import { toast } from "react-toastify";
import axios from "axios";
import { FormFeedback } from "reactstrap";
import {
  AvForm,
  AvGroup,
  AvInput,
} from "availity-reactstrap-validation";
export class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      button_disable: false,
      button_text: "Save",
      current_password: "",
      new_password: "",
      confirm_password: "",
      error_msg: {
        current_password_err: false,
        current_password_msg: "Current Password can not be blank.",
        new_password_err: false,
        new_password_msg: "New Password Can not be blank.",
        confirm_password_err: false,
        confirm_password_msg: "Confirm Password Can not be blank."
      }
    };
  }
  componentDidMount() {
    setToken();
  }

  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, errors, values) => {
    if (errors > 0) {
      return;
    }
    if (values.new_password !== values.confirm_password) {
      let error = this.state.error_msg;
      error.confirm_password_err = true;
      error.confirm_password_msg = "Confirm Password not matched.";
      this.setState({
        error_msg: error
      });

      return;
    }
    this.setState({
      button_disable: true,
      button_text: "Saving.."
    });
    let reqData = values;
    reqData.username = localStorage.user_name;
    var that = this;
    axios
      .post("/user/change-password", reqData)
      .then(function (response) {
        debugger;
        that.setState({
          button_disable: false,
          button_text: "Save"
        });
        if (response.data.error) {
          let error = that.state.error_msg;
          let msg;
          if (response.data.error.current_password) {
            msg = response.data.error.current_password[0];
            error.current_password_msg = msg;
            error.current_password_err = true;
            that.setState({
              error_msg: error
            });
            toast.error(msg, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        } else if (response.data.success) {
          let error = {
            current_password_err: false,
            current_password_msg: "Current Password can not be blank.",
            new_password_err: false,
            new_password_msg: "New Password Can not be blank.",
            confirm_password_err: false,
            confirm_password_msg: "Confirm Password Can not be blank."
          };
          that.setState({
            error_msg: error,

          });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="ui-block">
        <div className="ui-block-title">
          <h6 className="title">Change Password</h6>
        </div>
        <div className="ui-block-content">
          <AvForm action="" method="post" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Current Password</label>
                    <AvInput
                      className="form-control"
                      name="current_password"
                      type="password"
                      value={this.state.current_password}
                      invalid={this.state.error_msg.current_password_err}
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.current_password_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">New Password</label>
                    <AvInput
                      className="form-control"
                      name="new_password"
                      type="password"
                      value={this.state.new_password}
                      invalid={this.state.error_msg.new_password_err}
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.new_password_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Confirm Password</label>
                    <AvInput
                      className="form-control"
                      name="confirm_password"
                      type="password"
                      value={this.state.confirm_password}
                      invalid={this.state.error_msg.confirm_password_err}
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.confirm_password_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12 text-center Changes-btn">
                <button
                  className="btn btn-primary btn-lg full-width"
                  disabled={this.state.button_disable}
                >
                  {this.state.button_text}
                </button>
              </div>
            </div>
          </AvForm>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
