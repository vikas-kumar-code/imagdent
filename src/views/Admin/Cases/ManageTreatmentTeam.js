import React, { Component } from "react";
import common from "../../../services/common";
import ccase from "../../../services/case";
import {
  FormGroup,
  Label,
  Form,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import AsyncSelect from "react-select/async";

class ManageTreatmentTeam extends Component {
  constructor(props) {
    super(props);
    this.searchTimeOut = 0;
    this.state = {
      users: [],
      loader: true,
      fields: { case_id: this.props.caseId },
      errors: {},
      submitted: false,
    };
  }
  handleTeamChange = (team) => {
    let fields = this.state.fields;
    fields["team"] = team;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let frm = e.target.attributes.name.value;
    if (this.handleValidation(frm)) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
      };
      ccase.addTeam(params).then((response) => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            this.props.getCase(this.props.caseId);
            this.props.toggleModal();
            this.props.getTeam(this.props.caseId);
          }
        });
      });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["team"]) {
      formIsValid = false;
      errors["team"] = "Pleaes choose team from the list!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  componentDidMount = () => {
    common.getTreatmentTeam({ case_id: this.props.caseId }).then((response) => {
      let fields = this.state.fields;
      if (response.data.success) {
        fields["team"] = [];
        response.data.team.forEach((t, index) => {
          fields["team"][index] = {
            label: `${common.getFullName(t.user)}-${t.user.email}`,
            value: t.user.id,
          };
        });
      }
      this.setState({ fields, loader: false });
    });
  };

  promiseUserOptions = (inputValue) => {
    if(this.searchTimeOut > 0){
      clearTimeout(this.searchTimeOut);
    }
    return new Promise((resolve) => {
      if (inputValue !== "") {
        this.searchTimeOut = setTimeout(() => {
          common.getUsers({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let users = [];
              response.data.users.forEach((user, index) => {
                users[index] = {
                  label:`${common.getFullName(user)}-${user.email}`,
                  value: user.id,
                  name: common.getFullName(user),
                  email: user.email,
                };
              });
              this.setState({ users });
              this.setState(
                {
                  users,
                  // fields,
                  dropdownPlaceholder:
                    users.length > 0 ? "Select" : "Record not found",
                },
                () => {
                  resolve(this.filterUser(inputValue));
                }
              );
            }
          });
        }, 300);
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

  setDefaultUserList = () => {
    if (this.state.users.length === 0) {
      common.getUsers().then((response) => {
        if (response.data.success) {
          let users = [];
        response.data.users.forEach((user, index) => {
          users[index] = {
            label:
              common.getFullName(user) +
              " - " +
              user.email +
              " - " +
              user.role.name,
            value: user.id,
            name: common.getFullName(user),
            email: user.email,
          };
        });
          this.setState({ users });
        }
      });
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>Manage Team</ModalHeader>
        <Form name="team-frm" method="post" onSubmit={this.handleSubmit}>
          <ModalBody className="pl-4 pr-4">
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <FormGroup className="select-lg">
                <Label for="team">Choose Team</Label>
                <AsyncSelect
                  cacheOptions
                  name="team"
                  id="team"
                  isMulti={true}
                  value={
                    this.state.fields["team"] ? this.state.fields["team"] : []
                  }
                  defaultOptions={this.state.users ? this.state.users : []}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  loadOptions={this.promiseUserOptions}
                  onChange={this.handleTeamChange}
                  onFocus={this.setDefaultClinicList}
                  isClearable={true}
                  placeholder={this.state.dropdownPlaceholder}
                />
                {this.state.errors["team"] && (
                  <small className="fa-1x text-danger">
                    {this.state.errors["team"]}
                  </small>
                )}
              </FormGroup>
            </LoadingOverlay>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-dark cp mr-1"
              disabled={this.state.submitted}
              onClick={this.props.toggleModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger cbd-color cp"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Save
            </button>
          </ModalFooter>{" "}
        </Form>
      </Modal>
    );
  }
}

export default ManageTreatmentTeam;
