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
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class AddEditNote extends Component {
  state = {
    fields: {},
    errors: {},
    submitted: false,
    loader: false,
    noteTypes: ["Internal", "External"],
  };

  componentDidMount() {
    //console.log(this.props.noteFields);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.noteIndex !== this.props.noteIndex) {
      this.setState({ fields: this.props.noteFields });
    }
  };
  handleConfirm = (result, name, value) => {
    let fields = this.state.fields;
    if (result) {
      fields[name] = value;
      this.setState({ fields });
    } else {
      this.setState({ fields: { note_type: "", notes: "" } });
    }
  };
  handleChange = (e) => {
    this.props.checkNotesAdded(true);
    let fields = this.state.fields;
    let { name, value } = e.target;
    if (name === "note_type" && value == 1) {
      confirmAlert({
        title: "It will be visible to all users.",
        message: "Are you sure to do this?",
        buttons: [
          {
            label: "Yes",
            onClick: () => this.handleConfirm(true, name, value),
          },
          {
            label: "No",
            onClick: () => this.handleConfirm(false, name, value),
            className: "btn btn-sm",
          },
        ],
      });
    } else {
      fields[name] = value;
    }
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (this.props.noteIndex !== "") {
        this.props.addNote(this.state.fields, this.props.noteIndex);
      } else {
        this.props.addNote(this.state.fields);
      }
      this.setState({ fields: {} });
      this.props.checkNotesAdded(false);
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["note_type"]) {
      formIsValid = false;
      errors["note_type"] = "Please select note type.";
    }
    if (!fields["notes"]) {
      formIsValid = false;
      errors["notes"] = "Please enter note.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  handleReset = (e) => {
    e.preventDefault();
    this.setState({ fields: { note_type: "", notes: "" } }, () => {
      if (this.props.noteIndex !== "") {
        this.props.handleReset("noteIndex", "noteFields");
      }
    });
    this.props.checkNotesAdded(false);
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Card>
          <CardHeader>
            <strong>{this.props.noteIndex ? "Update " : "Add New"} Note</strong>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label for="note_type">Choose Type</Label>
              <Input
                type="select"
                name="note_type"
                id="note_type"
                onChange={(e) => this.handleChange(e)}
                value={
                  this.state.fields["note_type"]
                    ? this.state.fields["note_type"]
                    : ""
                }
                invalid={this.state.errors["note_type"] ? true : false}
                className="input-bg"
              >
                <option value="">-Select-</option>
                {this.state.noteTypes.map((type, i) => (
                  <option value={i} key={`key-note-type-${i}`}>
                    {type}
                  </option>
                ))}
              </Input>
              {this.state.errors["note_type"] && (
                <FormFeedback>{this.state.errors["note_type"]}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="notes">Note</Label>
              <Input
                type="textarea"
                name="notes"
                id="notes"
                value={
                  this.state.fields["notes"] ? this.state.fields["notes"] : ""
                }
                onChange={(e) => this.handleChange(e)}
                invalid={this.state.errors["notes"] ? true : false}
                rows={5}
              />
              {this.state.errors["notes"] && (
                <FormFeedback>{this.state.errors["notes"]}</FormFeedback>
              )}
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

export default AddEditNote;
