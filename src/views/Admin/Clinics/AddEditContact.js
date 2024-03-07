import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Form,
  Label,
  FormFeedback,
  FormGroup,
  Input,
  CardBody,
  Col,
} from "reactstrap";
import common from "../../../services/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";

class AddEditContact extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    roles: common.getContactRoles(),
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.contactIndex !== this.props.contactIndex) {
      this.setState({ fields: this.props.contactFields });
    }
  };
  handleChange = (e) => {
    if(this.props.checkContactDetailAdded){
      this.props.checkContactDetailAdded(true);
    }
    let fields = this.state.fields;
    let { name, value } = e.target;
    fields[name] = value;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (this.props.contactIndex !== "") {
        this.props.addContact(
          this.state.fields,
          this.props.contactIndex,
          this.props.i + 1
        );
      } else {
        this.props.addContact(this.state.fields);
      }
      this.setState({ fields: {} });
      this.props.checkContactDetailAdded(false);
    }
  };
  handleValidation = () => {   
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["contact_fname"]) {
      formIsValid = false;
      errors["contact_fname"] = "First Name can not be empty.";
    }
    if (
      fields["contact_email"] &&
      !common.isValidEmail(fields["contact_email"])
    ) {
      formIsValid = false;
      errors["contact_email"] = "Please enter valid Email  Address.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  handleReset = (e) => {
    e.preventDefault();
    this.setState({ fields: {},errors: {} }, () => {
      if (this.props.contactIndex !== "") {
        this.props.handleReset("contactIndex", "contactFields");
      }
    });
    this.props.checkContactDetailAdded(false);
  };
  render() {
    const { fields,errors } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Card>
          <CardHeader>
            <strong>
              {this.props.contactIndex ? "Update " : "Add New"} Contact
            </strong>
          </CardHeader>
          <CardBody>
            <FormGroup row>
              <Col md={2}>
                <Label>Prefix</Label>
                <Input
                  type="text"
                  className="ml10"
                  name="contact_prefix"
                  value={
                    fields["contact_prefix"] ? fields["contact_prefix"] : ""
                  }
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
              <Col md={3}>
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="contact_fname"
                  value={fields["contact_fname"] ? fields["contact_fname"] : ""}
                  onChange={(e) => this.handleChange(e)}
                  invalid={this.state.errors["contact_fname"] ? true : false}
                />
                {this.state.errors["contact_fname"] && (
                  <FormFeedback>
                    {this.state.errors["contact_fname"]}
                  </FormFeedback>
                )}
              </Col>
              <Col md={2}>
                <Label>MI Name</Label>
                <Input
                  type="text"
                  className="ml10"
                  name="contact_mname"
                  value={fields["contact_mname"] ? fields["contact_mname"] : ""}
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
              <Col md={3}>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  className="ml10"
                  name="contact_lname"
                  value={fields["contact_lname"] ? fields["contact_lname"] : ""}
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
              <Col md={2}>
                <Label>Suffix</Label>
                <Input
                  type="text"
                  className="ml10"
                  name="contact_suffix"
                  value={
                    fields["contact_suffix"] ? fields["contact_suffix"] : ""
                  }
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="text"
                name="contact_email"
                value={fields["contact_email"] ? fields["contact_email"] : ""}
                onChange={(e) => this.handleChange(e)}
                invalid={this.state.errors["contact_email"] ? true : false}
                bsSize="lg"
              />
              {this.state.errors["contact_email"] && (
                <FormFeedback>
                  {this.state.errors["contact_email"]}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup row>
              <Col sm={6}>
                <Label>Phone</Label>

                <NumberFormat
                  format="(###) ###-####"
                  className="form-control-lg form-control"
                  name="contact_phone"
                  value={fields["contact_phone"] ? fields["contact_phone"] : ""}
                  onChange={(e) => this.handleChange(e)}
                />
                {this.state.errors["contact_phone"] && (
                  <small className="fa-0.8x text-danger">
                    {this.state.errors["contact_phone"]}
                  </small>
                )}
              </Col>
              <Col sm={6}>
                <Label>Phone Ext.</Label>
                <Input
                  type="number"
                  name="contact_phone_ext"
                  value={
                    fields["contact_phone_ext"]
                      ? fields["contact_phone_ext"]
                      : ""
                  }
                  onChange={(e) => this.handleChange(e)}
                  invalid={
                    this.state.errors["contact_phone_ext"] ? true : false
                  }
                  bsSize="lg"
                />
                {errors["contact_phone_ext"] && (
                            <FormFeedback>{errors["contact_phone_ext"]}</FormFeedback>
                          )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={6}>
                <Label>Role</Label>
                <Input
                  type="select"
                  bsSize="lg"
                  name="contact_role"
                  onChange={(e) => this.handleChange(e)}
                  value={fields["contact_role"] ? fields["contact_role"] : ""}
                  className="input-bg"
                >
                  <option value="">
                    {this.state.roles.length === 0 ? "Loading..." : "-Select-"}
                  </option>
                  {this.state.roles.map((role, i) => (
                    <option value={i} key={`key-role-${i + 1}`}>
                      {role}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col sm={6}>
                {" "}
                <Label>Fax</Label>
                <NumberFormat
                  format="(###) ###-####"
                  className="form-control-lg form-control"
                  name="contact_fax"
                  value={fields["contact_fax"] ? fields["contact_fax"] : ""}
                  onChange={(e) => this.handleChange(e)}
                  invalid={
                    this.state.errors["contact_fax"] ? true : false
                  }
                />
                 {this.state.errors["contact_fax"] && (
                  <small className="fa-0.8x text-danger">
                    {this.state.errors["contact_fax"]}
                  </small>
                )}
              </Col>
            </FormGroup>
          </CardBody>
          <CardFooter className="text-right">
            <Button
              type="button"
              color="danger"
              className="mr-2"
              size="sm"
              onClick={this.handleReset}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              size="sm"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Save
            </Button>
          </CardFooter>
        </Card>
      </Form>
    );
  }
}

export default AddEditContact;
