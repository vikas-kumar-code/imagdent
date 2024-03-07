import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Col,
  Spinner,
  FormGroup,
  Label,
  Form,
} from "reactstrap";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import common from "../../../services/common";
import { toast } from "react-toastify";
import ccase from "../../../services/case";
import Select from "react-select";
import { connect } from "react-redux";

class EditUserClinicModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      fields: {},
      users: [],
      clinics: [],
      errors: {},
    };
  }

  componentDidMount = () => {
    this.setState({ loader: true });
    if (this.props.caseId) {
      ccase.getCaseDetails({ id: this.props.caseId }).then((response) => {
        this.setState({ loader: false }, () => {
          if (response.data.success) {
            let fields = {};
            fields["user_id"] = {
              label: common.getFullName(response.data.case.user),
              value: response.data.case.user.id,
              email: response.data.case.user.email,
            };
            fields["clinic_id"] = {
              label: response.data.case.clinic.name,
              value: response.data.case.clinic.id,
            };
            this.setState({ fields, slotLoader: true }, () => {
              let fields = this.state.fields;
              common
                .getClinicsByDoc({ user: fields["user_id"].value })
                .then((response) => {
                  if (response.data.success) {
                    let clinics = [];
                    response.data.clinics.forEach((clinic, index) => {
                      clinics[index] = { label: clinic.name, value: clinic.id };
                    });
                    this.setState({ clinics });
                  }
                });

              if (
                parseInt(this.props.userType) !== 1 &&
                parseInt(this.props.userType) !== 4
              ) {
                common.getUsers().then((response) => {
                  if (response.data.success) {
                    let users = [];
                    response.data.users.forEach((user, index) => {
                      users[index] = {
                        label: common.getFullName(user),
                        value: user.id,
                        email: user.email,
                      };
                    });
                    this.setState({
                      users,
                      dropdownPlaceholder:
                        users.length > 0 ? "Select" : "Record not found",
                    });
                  }
                });
              } else {
                common
                  .getUserByClinic({ clinic: fields["clinic_id"].value })
                  .then((response) => {
                    if (response.data.success) {
                      let users = [];
                      response.data.users.forEach((user, index) => {
                        users[index] = {
                          label: common.getFullName(user),
                          value: user.id,
                          email: user.email,
                        };
                      });
                      this.setState({ users });
                    }
                  });
              }
            });
          } else if (response.data.error) {
          }
        });
      });
    }
  };

  handleUserChange = (user) => {
    let fields = this.state.fields;
    fields["user_id"] = user;
    this.setState({ fields }, () => {
      if (user !== null) {
        common.getClinicsByDoc({ user: user.value }).then((response) => {
          if (response.data.success) {
            let clinics = [];
            response.data.clinics.forEach((clinic, index) => {
              clinics[index] = { label: clinic.name, value: clinic.id };
            });
            this.setState({ clinics, fields });
            if (
              this.state.fields["clinic_id"] != null ||
              this.state.fields["clinic_id"] != undefined
            ) {
              let data = response.data.clinics.find(
                (ele) => ele.id == this.state.fields["clinic_id"].value
              );
              if (data == undefined || data == null) {
                let fields = this.state.fields;
                fields["clinic_id"] = null;
                this.setState({ fields });
              }
            }
          }
        });
      }
    });
  };

  promiseClinicOptions = (inputValue) => {
    return new Promise((resolve) => {
      if (inputValue !== "") {
        setTimeout(() => {
          common
            .getClinicsByDoc({ user: this.props.userId, keyword: inputValue })
            .then((response) => {
              if (response.data.success) {
                let clinics = [];
                response.data.clinics.forEach((clinic, index) => {
                  clinics[index] = { label: clinic.name, value: clinic.id };
                });
                this.setState({ clinics }, () => {
                  resolve(this.filterClinic(inputValue));
                });
              }
            });
        }, 1000);
      } else {
        resolve(this.filterClinic(inputValue));
      }
    });
  };

  filterClinic = (inputValue) => {
    return this.state.clinics.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  promiseUserOptions = (inputValue) => {
    return new Promise((resolve) => {
      if (inputValue !== "") {
        setTimeout(() => {
          common.getUsers({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let users = [];
              response.data.users.forEach((user, index) => {
                users[index] = {
                  label: common.getFullName(user),
                  value: user.id,
                  email: user.email,
                };
              });
              this.setState(
                {
                  users,
                  dropdownPlaceholder:
                    users.length > 0 ? "Select" : "Record not found",
                },
                () => {
                  resolve(this.filterUser(inputValue));
                }
              );
            }
          });
        }, 1000);
      } else {
        resolve(this.filterUser(inputValue));
      }
    });
  };

  filterUser = (inputValue) => {
    return this.state.users.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  handleAsyncClinicChange = (clinic) => {
    let fields = this.state.fields;
    fields["clinic_id"] = clinic;
    this.setState({ fields }, () => {
      if (clinic !== null) {
        this.setState({ dropdownPlaceholder: "Loading..." });
        common.getUserByClinic({ clinic: clinic.value }).then((response) => {
          if (response.data.success) {
            let users = [];
            response.data.users.forEach((user, index) => {
              users[index] = {
                label: common.getFullName(user),
                value: user.id,
                email: user.email,
              };
            });
            this.setState({
              users,
              fields,
              dropdownPlaceholder:
                users.length > 0 ? "Select" : "Record not found",
            });
            if (
              this.state.fields["user_id"] != null ||
              this.state.fields["user_id"] != undefined
            ) {
              let data = response.data.users.find(
                (ele) => ele.id == this.state.fields["user_id"].value
              );
              if (data == undefined || data == null) {
                fields["user_id"] = null;
                this.setState({ fields });
              }
            }
          }
        });
      }
    });
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (
      !fields["clinic_id"] ||
      fields["clinic_id"].value === "" ||
      fields["clinic_id"] === null
    ) {
      formIsValid = false;
      errors["clinic_id"] = "Please choose clinic.";
    }
    if (
      !fields["user_id"] ||
      fields["user_id"].value === "" ||
      fields["user_id"] === null
    ) {
      formIsValid = false;
      errors["user_id"] = "Please choose any doctor.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      let fields = this.state.fields;
      fields["case_id"] = this.props.caseId;
      ccase.updateDocClinic({ fields: this.state.fields }).then((res) => {
        if (res.data.success) {
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.toggleModal();
          this.props.getCases(this.props.fieldsFromSearch);
        } else if (res.data.error) {
          if (res.data.message) {
            this.setState({ errors: res.data.message });
          }
        }
      });
    }
  };

  handleClinicChange = (clinic) => {
    let fields = this.state.fields;
    fields["clinic_id"] = clinic;
    this.setState({ fields });
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>Update Doctor</ModalHeader>
        <LoadingOverlay
          active={this.state.loader}
          spinner={<Spinner color="dark" />}
          fadeSpeed={200}
          classNamePrefix="mitiz"
        >
          <Form method="post" onSubmit={this.handleSubmit}>
            <ModalBody>
              <FormGroup row>
                <Col md={6}>
                  <Label for="user_id">Choose Doctor</Label>
                  {parseInt(this.props.userType) === 1 ||
                  parseInt(this.props.userType) === 4 ? (
                    <AsyncSelect
                      cacheOptions
                      name="user_id"
                      value={
                        this.state.fields["user_id"] &&
                        this.state.fields["user_id"]
                      }
                      defaultOptions={this.state.users ? this.state.users : []}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      loadOptions={this.promiseUserOptions}
                      onChange={this.handleUserChange}
                      isClearable={true}
                      placeholder={this.state.dropdownPlaceholder}
                    />
                  ) : (
                    <Select
                      name="user_id"
                      placeholder={this.state.dropdownPlaceholder}
                      value={
                        this.state.fields["user_id"] &&
                        this.state.fields["user_id"]
                      }
                      options={this.state.users ? this.state.users : []}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={this.handleUserChange}
                    />
                  )}
                  {this.state.errors["user_id"] && (
                    <small className="fa-1x text-danger">
                      {this.state.errors["user_id"]}
                    </small>
                  )}
                </Col>
                <Col md={6}>
                  <Label for="clinic_id">Choose Clinic</Label>
                  {parseInt(this.props.userType) === 1 ||
                  parseInt(this.props.userType) === 4 ? (
                    <AsyncSelect
                      cacheOptions
                      name="clinic_id"
                      value={
                        this.state.fields["clinic_id"] &&
                        this.state.fields["clinic_id"]
                      }
                      defaultOptions={
                        this.state.clinics ? this.state.clinics : []
                      }
                      className="basic-multi-select"
                      classNamePrefix="select"
                      loadOptions={this.promiseClinicOptions}
                      onChange={this.handleAsyncClinicChange}
                      isClearable={true}
                      placeholder={this.state.dropdownPlaceholder}
                    />
                  ) : (
                    <Select
                      name="clinic_id"
                      placeholder={this.state.dropdownPlaceholder}
                      value={
                        this.state.fields["clinic_id"] &&
                        this.state.fields["clinic_id"]
                      }
                      options={this.state.clinics ? this.state.clinics : []}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={this.handleClinicChange}
                    />
                  )}
                  {this.state.errors["clinic_id"] && (
                    <small className="fa-1x text-danger">
                      {this.state.errors["clinic_id"]}
                    </small>
                  )}
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Col md={12} className="text-right">
                <button
                  type="submit"
                  className="btn btn-danger post-comment crate-group-next"
                  disabled={this.state.submitted}
                >
                  {this.state.submitted && (
                    <FontAwesomeIcon
                      icon="spinner"
                      className="mr-1"
                      spin={true}
                    />
                  )}
                  Update
                </button>
              </Col>
            </ModalFooter>
          </Form>
        </LoadingOverlay>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
  };
};

export default connect(mapStateToProps)(EditUserClinicModal);
