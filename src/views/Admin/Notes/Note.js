import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "../../../services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import moment from "moment";
import common from "../../../services/common";

class Document extends Component {
  state = {
    submitted: false,
    noteTypes: ["Internal", "External"],
  };

  handleView = (note) => {
    return (
      <span
        data-id={note.id}
        onClick={this.props.showNote}
        style={{ cursor: "pointer", color: "#20a8d8" }}
      >
        {note.notes.substring(0, 10)}
      </span>
    );
  };
  removeNote = (e) => {
    if (window.confirm("Are you sure to delete this note?")) {
      this.props.removeNote(e, "notes");
    }
  };
  render() {
    const record = this.props.note;
    return (
      <tr key={this.props.key}>
        <td>{this.props.index + 1}</td>
        <td>{this.handleView(record)}</td>
        <td>{this.state.noteTypes[record.note_type]}</td>
        {this.props.addedOn && (
          <td>{moment(record.added_on).format("MMMM DD, YYYY")}</td>
        )}
        {this.props.enableEdit && (
          <td align="center">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={(e) =>
                this.props.fillNote(e, "notes", "noteIndex", "noteFields")
              }
              data-index={this.props.index}
              disabled={this.state.submitted}
            >
              Edit
            </button>
          </td>
        )}

        {this.props.enableDelete && (
          <td align="center">
            <button
              className="btn btn-danger btn-sm"
              type="button"
              onClick={this.removeNote}
              data-index={this.props.index}
            >
              Delete
            </button>
          </td>
        )}
      </tr>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    apiUrl: state.apiUrl,
    token: state.token,
    //documentTypes: state.documentTypes
  };
};
export default connect(mapStateToProps)(Document);
