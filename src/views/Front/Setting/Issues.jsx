import React, { Component } from "react";
import { setToken } from "../../../config";
import { toast } from "react-toastify";
import axios from "axios";
import {
  AvForm,
  AvCheckboxGroup,
  AvCheckbox
} from "availity-reactstrap-validation";
export class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button_disable: false,
      button_text: "Save All Changes",
      categories: [],
      category: []
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
          if (response.data.user.issues) {
            let obj = response.data.user.issues;
            let issuse = [];
            for (var i = 0; i < obj.length; i++) {
              issuse.push(obj[i].category_id);
            }
            //console.log(issuse);
            that.setState(
              {
                category: issuse
              },
              () => {
                that.getIssues();
              }
            );
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getIssues() {
    var that = this;
    axios
      .get("/category/list")
      .then(function(response) {
        if (response.data.error) {
        } else if (response.data.success) {
          if (response.data.categories.length === 0) {
            that.setState({
              resultNotFound: "Data not found"
            });
          }
          that.setState({
            categories: response.data.categories
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
    if (errors > 0) {
      return;
    }
    this.setState({
      button_disable: true,
      button_text: "Saving.."
    });
    let reqData = {
      user_id: localStorage.user_id,
      issues: values.issues
    };
    var that = this;
    axios
      .post("/user/save-issues", reqData)
      .then(function(response) {
        debugger;
        that.setState({
          button_disable: false,
          button_text: "Save All Changes"
        });
        if (response.data.error) {
          let msg = response.data.message;
          toast.error(msg, {
            position: toast.POSITION.TOP_RIGHT
          });
        } else if (response.data.success) {
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
          <h6 className="title">Issue Categories</h6>
        </div>
        <div className="ui-block-content">
          <AvForm action="" method="post" onSubmit={this.handleSubmit}>
            <AvCheckboxGroup
              name="issues"
              required
              value={this.state.category}
              className="issues"
            >
              {this.state.categories.length > 0
                ? this.state.categories.map(category => (
                    <AvCheckbox
                      label={category.name}
                      value={category.id}
                      key={category.id}
                    />
                  ))
                : null}

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
            </AvCheckboxGroup>
          </AvForm>
        </div>
      </div>
    );
  }
}

export default Issues;
