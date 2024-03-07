import React, { Component } from "react";
import { ListGroup, ListGroupItem, Button, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Folder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderCount: []
    };
  }
  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-lg mb-2 btn-block"
          color="success"
          onClick={this.props.toggleModal}
          outline
        >
          Compose
        </Button>
        <ListGroup className="shadow">
          <ListGroupItem className="justify-content-between pl-2">
            <h3 className="mb-0">Folders</h3>
          </ListGroupItem>
          <ListGroupItem
            action
            tag={Link}
            to={`/admin/messages`}
            className="bg-primary"
          >
            Inbox
            <Badge pill className="float-right mt-2" color="dark">
              {this.props.totalNewMessages}
            </Badge>
          </ListGroupItem>
          <ListGroupItem
            action
            tag={Link}
            to={`/admin/messages/sent`}
            className="bg-warning"
          >
            Sent
          </ListGroupItem>
          <ListGroupItem
            tag={Link}
            action
            to={`/admin/messages/trash`}
            className="bg-danger mb-2"
          >
            Trash
          </ListGroupItem>
        </ListGroup>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    totalNewMessages: state.totalNewMessages
  };
};
export default connect(mapStateToProps)(Folder);
