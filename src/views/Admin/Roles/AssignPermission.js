import React, { Component } from "react";
import role from "../../../services/role";
import { connect } from "react-redux";
import {
  Row,
  Col,
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
import Module from "./Module";

class AssignPermission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: {},
      errors: {},
      submitted: false,
      modules: [],
      permission: [],
    };
  }

  handleChange = (field, e) => {
    let fields = this.state.fields;
    if (fields[field] === undefined) {
      fields[field] = [];
    }
    if (e.target.checked) {
      fields[field].push(e.target.value);
    } else {
      let index_to_be_removed = fields[field].indexOf(e.target.value);
      fields[field].splice(index_to_be_removed, 1);
    }
    this.setState({ fields });
    if (field !== "module_name") {
      this.checkModuleName(field);
    }
  };

  checkModuleName = (field) => {
    let moduleArr = field.split("_");
    let moduleId = moduleArr[2];
    let moduleNameArr = this.state.modules.filter(
      (module) => module.id === moduleId
    );
    let moduleName = `${moduleNameArr[0].module_name}~${moduleId}`;

    let fields = this.state.fields;
    let index_to_be_removed = fields["module_name"].indexOf(moduleName);
    if (index_to_be_removed < 0) {
      fields["module_name"].push(moduleName);
    } else if (fields[field].length === 0) {
      let index_to_be_removed = fields["module_name"].indexOf(moduleName);
      fields["module_name"].splice(index_to_be_removed, 1);
    }
    this.setState({ fields });
    console.log(fields);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        fields: this.state.fields,
        id: this.props.roleId,
      };
      let that = this;
      role
        .assignPermission(params)
        .then((response) => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              this.props.togglePermissionModal();
              this.props.getRoles(this.props.fieldsFromSearch);
            } else if (response.data.error) {
              toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          });
        })
        .catch(function (error) {
          that.setState({ submitted: false });
        });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let formIsValid = true;
    return formIsValid;
  };

  getModules = () => {
    this.setState({ loader: true });
    role.getModules().then((response) => {
      if (response.data.success) {
        let modules = response.data.modules;
        role.getPermission({ role_id: this.props.roleId }).then((response) => {
          if (response.data.success) {
            let module_names = [];
            let fields = {};
            Object.keys(response.data.permission).forEach((name, i) => {
              module_names[i] = `${name}~${this.getModuleId(modules, name)}`;
              let module_action_index = `module_action_${this.getModuleId(
                modules,
                name
              )}`;
              if (fields[module_action_index] === undefined) {
                fields[module_action_index] = [];
              }
              response.data.permission[name].forEach((action, j) => {
                fields[module_action_index][j] = action;
              });
            });
            fields = { ...fields, module_name: module_names };
            this.setState({
              loader: false,
              modules,
              fields,
            });
          }
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  componentDidMount = () => {
    if (this.props.roleId) {
      this.getModules();
    }
  };

  getModuleId = (modules, module_name) => {
    let module = modules.filter((mod) => mod.module_name === module_name);
    return module[0].id;
  };
  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.togglePermissionModal}>
          Assign Permission
        </ModalHeader>
        <ModalBody className="pl-4 pr-4" style={{ minHeight: 250 }}>
          <div className="animated fadeIn">
            <Form
              name="add-edit-action-form"
              method="post"
              onSubmit={this.handleSubmit}
            >
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                {this.state.modules.map((module) => (
                  <Module
                    module={module}
                    handleChange={this.handleChange}
                    key={`module-key-${module.id}`}
                    permission={this.state.permission}
                    fields={this.state.fields}
                  />
                ))}
              </LoadingOverlay>
              <Row>
                <Col md={12} className="text-right">
                  <button
                    type="button"
                    className="btn btn-outline-dark cp mr-1"
                    disabled={this.state.submitted}
                    onClick={this.props.togglePermissionModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger cbd-color cp"
                    disabled={this.state.submitted}
                  >
                    {this.state.submitted && (
                      <FontAwesomeIcon
                        icon="spinner"
                        className="mr-1"
                        spin={true}
                      />
                    )}
                    {this.props.roleId ? "Update" : "Add"}
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  };
};
export default connect(mapStateToProps)(AssignPermission);
