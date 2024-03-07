import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, Card, CardHeader, CardBody } from "reactstrap";
import { connect } from "react-redux";
import Note from "./Note";
import ViewNote from "./ViewNote";

class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      noteDetail: {}
    };
  }
  toggleSubModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };

  showNote = e => {
    let noteDetail = this.props.notes.filter(
      note => note.id == e.target.dataset.id
    );

    this.setState({ noteDetail });
    this.toggleSubModal();
  };
  render() {
    const { notes } = this.props;
    return (
      <Card>
        <CardHeader>
          <strong>{this.props.title}</strong>
        </CardHeader>
        <CardBody>
          <Table responsive className="table-striped">
            <thead>
              <tr>
                {this.props.chooseDocument && (
                  <th scope="col" className="border-top-0" width={3 + "%"}>
                    <input type="checkbox" />
                  </th>
                )}
                <th scope="col" className="border-top-0" width={7 + "%"} />

                <th scope="col" className="border-top-0">
                  Note
                </th>
                <th scope="col" className="border-top-0">
                  Type
                </th>
                {this.props.addedBy && (
                  <th scope="col" className="border-top-0">
                    Added By
                  </th>
                )}
                {this.props.addedOn && (
                  <th scope="col" className="border-top-0">
                    Added On
                  </th>
                )}
                {this.props.enableEdit && (
                  <th scope="col" className="border-top-0" />
                )}
                {this.props.enableDelete && (
                  <th scope="col" className="border-top-0" />
                )}
              </tr>
            </thead>
            <tbody>
              {notes && notes.length > 0
                ? notes.map((note, index) => (
                    <Note
                      note={note}
                      removeNote={this.props.removeNote}
                      enableDelete={this.props.enableDelete}
                      enableEdit={this.props.enableEdit}
                      addedOn={this.props.addedOn}
                      addedBy={this.props.addedBy}
                      showNote={this.showNote}
                      key={`note-key-${index}`}
                      index={index}
                      fillNote={this.props.fillNote}
                    />
                  ))
                : !this.state.isloader && (
                    <tr>
                      <td key={0} colSpan="7">
                        <p className="text-center">Note not found.</p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </Table>
        </CardBody>
        {this.state.showModal && (
          <ViewNote
            showModal={this.state.showModal}
            toggleSubModal={this.toggleSubModal}
            noteDetail={this.state.noteDetail}
          />
        )}
      </Card>
    );
  }
}
const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    apiUrl: state.apiUrl,
    token: state.token
  };
};
export default connect(mapStateToProps)(Notes);
