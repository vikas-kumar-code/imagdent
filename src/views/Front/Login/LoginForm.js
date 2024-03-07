import React, { Component } from "react";
import { doLogin } from "../../../store/actions";
import { connect } from "react-redux";
import LoginFormBody from "./LoginFormBody"
import LoginFormTop from "./LoginFormTop"
import http from "../../../services/http";


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          fields: {},
          errors: {},
          remember_me: false,
          loader: false,
          error: false,
          isFormValid: false,
          httpReferer: window.document.referer ? window.document.referer : ""
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
        if (!fields["password"]) {
          formIsValid = false;
          errors["password"] = "Please enter your password.";
        }
        this.setState({ errors: errors });
        return formIsValid;
      };
    
      handleSubmit = e => {
        e.preventDefault();
        if (this.handleValidation()) {
          this.setState({ loader: true });
          this.handleLogin();
        }
      };
    
      handleLogin() {
        let reqData = {
          username: this.state.fields["username"],
          password: this.state.fields["password"]
        };
        var that = this;
        http.post("/user/login", reqData).then(function(response) {
            that.setState({ loader: false });
            if (response.data.error) {
              let errors = {};
              errors["password"] = response.data.error;
              that.setState({ errors });
            } else if (response.data.success) {
              localStorage.clear();
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("userType", response.data.user_type);
              localStorage.setItem("userName", response.data.username);
              localStorage.setItem("userId", response.data.user_id);
              localStorage.setItem("userImage", response.data.image);
              localStorage.setItem("name", response.data.name);
              localStorage.setItem("defaultLocation",response.data.default_location);
              that.props.doLogin({
                token: response.data.token,
                authenticated: true,
                userName: response.data.username,
                userId: response.data.user_id,
                userType: response.data.user_type,
                userImage: response.data.image,
                name: response.data.name,
                defaultLocation: response.data.default_location
              });
    
              if (that.state.remember_me === true) {
                localStorage.setItem("userName", that.state.username);
                localStorage.setItem("password", that.state.password);
              } else {
                /* localStorage.removeItem("userName");
                localStorage.removeItem("password"); */
              }
              that.props.history.push("/admin/dashboard");
              /* if (response.data.user_type === 1) {
                that.props.history.push("/admin/dashboard");
              } else {
                //alert(that.state.httpReferer);
                that.props.history.push("/dashboard");
              } */
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
      }
  render() {
    if(this.props.section === 'body'){
        return <LoginFormBody 
            loader={this.state.loader} 
            fields={this.state.fields} 
            errors={this.state.errors}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
        />;
    }
    else if(this.props.section === 'top'){
        return <LoginFormTop 
            loader={this.state.loader} 
            fields={this.state.fields} 
            errors={this.state.errors}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
        />;
    }
  }
}
const mapStateToProps = state => {
    return {
      userId: state.userId,
      userType: state.userType
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      doLogin: data => {
        dispatch(doLogin(data));
      }
    };
  };
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginForm);
