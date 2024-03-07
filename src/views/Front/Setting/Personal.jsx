import React, { Component } from "react";
import { setToken } from "../../../config";
import { toast } from "react-toastify";
import axios from "axios";
import { FormFeedback } from "reactstrap";
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
  AvField
} from "availity-reactstrap-validation";
export class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      firstName: "",
      email: "",
      birthday: "",
      mobile: "",
      aboutMe: "",
      occupation: "",
      birthPlace: "",
      staus: "",
      city: "",
      state: "",
      country: "",
      button_disable: false,
      button_text: "Save All Changes",
      error_msg: {
        firstName_msg: "Name can not be blank.",
        firstName_err: false,
        email_msg: "Email can not be blank.",
        email_err: false,
        mobile_msg: "Mobile can not be blank.",
        mobile_err: false,
        birthday_msg: "DOB can not be blank.",
        birthday_err: false,
        city_msg: "City can not be blank.",
        city_err: false,
        state_msg: "State can not be blank.",
        state_err: false,
        country_msg: "County can not be blank.",
        countryerr: false,
        occupation_msg: "Occupation can not be blank.",
        occupation_err: false,
        birthPlace_msg: "Occupation can not be blank.",
        birthPlace_err: false,
        aboutMe_msg: "About me can not be blank.",
        boutMe_err: false,
        gender_msg: "Gender can not be blank.",
        username_msg: "Username cannot be blank.",
        username_err: false
      }
    };
  }
  componentDidMount() {
    setToken();
    var that = this;
    axios
      .get("/user/get", {
        params: {
          id: localStorage.user_id
        }
      })
      .then(function(response) {
        if (response.data.error) {
          //that.setState({ open: true, notification_text: response.data.error, error_password: true });
        } else if (response.data.success) {
          let user = response.data.user;
          that.setState({
            userDetail: user
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, errors, values) => {
    debugger;
    this.setState({
      button_disable: true,
      button_text: "Saving.."
    });
    let reqData = {
      id: localStorage.user_id,
      name: values.firstName,
      email: values.email,
      phone: values.mobile,
      username: values.username
    };
    var that = this;
    axios
      .post("/user/add", reqData)
      .then(function(response) {
        that.setState({
          button_disable: false,
          button_text: "Save All Changes"
        });
        if (response.data.error) {
          let error = that.state.error_msg;
          let msg;
          if (response.data.message.username) {
            msg = response.data.message.username[0];
            error.username_msg = msg;
            error.username_err = true;
            that.setState({
              error_msg: error
            });
            toast.error(msg, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          if (response.data.message.email) {
            msg = response.data.message.email[0];
            error.email_msg = msg;
            error.email_err = true;
            that.setState({
              error_msg: error
            });
            toast.error(msg, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          if (response.data.message.phone) {
            msg = response.data.message.phone[0];
            error.mobile_msg = msg;
            error.mobile_err = true;
            that.setState({
              error_msg: error
            });
            toast.error(msg, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        } else if (response.data.success) {
          that.setState({
            username_msg: "Username cannot be blank.",
            username_err: false,
            email_msg: "Email can not be blank.",
            email_err: false,
            mobile_msg: "Mobile can not be blank.",
            mobile_err: false
          });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="ui-block">
        <div className="ui-block-title">
          <h6 className="title">Personal Information</h6>
        </div>
        <div className="ui-block-content personal">
          <AvForm action="" method="post" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Username</label>
                    <AvInput
                      className="form-control"
                      name="username"
                      type="text"
                      value={this.state.userDetail.username}
                      invalid={this.state.error_msg.username_err}
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.username_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Name</label>
                    <AvInput
                      className="form-control"
                      name="firstName"
                      type="text"
                      value={this.state.userDetail.name}
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.firstName_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Your Email</label>
                    <AvInput
                      className="form-control"
                      name="email"
                      type="email"
                      onChange={this.handleChange}
                      value={this.state.userDetail.email}
                      invalid={this.state.error_msg.email_err}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.email_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group date-time-picker label-floating is-focused">
                  <AvGroup>
                    <label className="control-label">Your Birthday</label>
                    <AvInput
                      type="date"
                      name="birthday"
                      onChange={this.handleChange}
                      required
                    />
                    {/* <span className="input-group-addon">
                      <i className="fa fa-calendar" />
                    </span> */}
                    <FormFeedback>
                      {this.state.error_msg.birthday_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
              <div className="col col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Your Phone Number</label>
                    <AvInput
                      className="form-control"
                      type="text"
                      maxLength="10"
                      name="mobile"
                      onChange={this.handleChange}
                      value={this.state.userDetail.phone}
                      invalid={this.state.error_msg.mobile_err}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.mobile_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-4 col-md-4 col-sm-12 col-12">
                <AvGroup>
                  <label className="control-label1 country_lable">
                    Country
                  </label>
                  <AvField
                    type="select"
                    name="country"
                    className="form-control-select select-hidden setting_contry"
                    onChange={this.handleChange}
                    required
                  >
                    <option />
                    <option value="india">India</option>
                    <option value="us">U.S</option>
                    <option value="uk">UK</option>
                    <option value="china">China</option>
                  </AvField>
                  <FormFeedback>
                    {this.state.error_msg.country_msg}
                  </FormFeedback>
                </AvGroup>
              </div>
              <div className="col col-lg-4 col-md-4 col-sm-12 col-12">
                <AvGroup>
                  <label className="control-label1 country_lable">
                    Your State
                  </label>
                  <AvField
                    name="state"
                    type="select"
                    className="form-control-select select-hidden setting_contry"
                    onChange={this.handleChange}
                    required
                  >
                    <option />
                    <option value="New Delhi">New Delhi</option>
                    <option value="UttarPradesh">UttarPradesh</option>
                    <option value="Tamil Nadu"> Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </AvField>
                  <FormFeedback>{this.state.error_msg.state_msg}</FormFeedback>
                </AvGroup>
              </div>
              <div className="col col-lg-4 col-md-4 col-sm-12 col-12">
                <AvGroup>
                  <label className="control-label1 country_lable">
                    Your City
                  </label>
                  <AvField
                    name="city"
                    type="select"
                    className="form-control-select select-hidden setting_contry"
                    onChange={this.handleChange}
                  >
                    <option />
                    <option value="New Delhi">New Delhi</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Mumbai">Mumbai</option>
                  </AvField>
                  <AvFeedback>{this.state.error_msg.city_msg}</AvFeedback>
                </AvGroup>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">
                      Write a little description about you
                    </label>
                    <AvInput
                      type="textarea"
                      className="form-control"
                      placeholder=""
                      name="aboutMe"
                      onChange={this.handleChange}
                    />
                    <span className="material-input" />
                    <AvFeedback>{this.state.error_msg.aboutMe_msg}</AvFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group label-floating is-select">
                  <AvGroup>
                    <label className="control-label country_lable">
                      Gender
                    </label>
                    <AvField
                      name="gender"
                      type="select"
                      className="form-control-select select-hidden setting_contry"
                      onChange={this.handleChange}
                      required
                    >
                      <option />
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </AvField>
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.gender_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
              <div className="col col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Occupation</label>
                    <AvInput
                      className="form-control"
                      placeholder=""
                      type="text"
                      name="occupation"
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.occupation_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group label-floating is-select">
                  <AvGroup>
                    <label className="control-label country_lable">
                      Status
                    </label>
                    <AvField
                      name="status"
                      type="select"
                      className="form-control-select select-hidden setting_contry"
                      onChange={this.handleChange}
                      required
                    >
                      <option />
                      <option value="UnMarried">UnMarried</option>
                      <option value="Married">Married</option>
                    </AvField>
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.state_msg}
                    </FormFeedback>
                  </AvGroup>
                </div>
              </div>
              <div className="col col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group label-floating">
                  <AvGroup>
                    <label className="control-label">Birth Place</label>
                    <AvInput
                      className="form-control"
                      type="text"
                      name="birthPlace"
                      onChange={this.handleChange}
                      required
                    />
                    <span className="material-input" />
                    <FormFeedback>
                      {this.state.error_msg.birthPlace_msg}
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

export default Personal;
