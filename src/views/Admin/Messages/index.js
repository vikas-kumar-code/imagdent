import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import message from "../../../services/message";
import Folders from "./Folders";
import Inbox from "./Inbox";
import Sent from "./Sent";
import Trash from "./Trash";
import Read from "./Read";
import { Helmet } from "react-helmet";
import { Route, Switch } from "react-router-dom";
import { updateNewMessagesCount } from "../../../store/actions";
import { connect } from "react-redux";
import Compose from "./Compose";

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderCount: [],
      error_403: false,
      showModal: false,
      recipients: []
    };
  }

  componentDidMount = () => {
    this.getNewMessagesCount();
  };

  getNewMessagesCount = () => {
    message.getNewMessagesCount().then(response => {
      if (response.data.success) {
        this.setState({ folderCount: response.data.folderCount },() => {
          this.props.updateNewMessagesCount({
            totalNewMessages: response.data.totalNewMessages.total
          });
        });
      }
    });
  };
  toggleModal = (e, users) => {
    let recipients = users !== undefined ? users : [];
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      recipients
    }));
  };
  render() {
    return (
      <div>
        <Helmet>
          <title>Messages : iMagDent</title>
        </Helmet>
        <Row>
          <Col xl={3}>
            <Folders
              folderCount={this.state.folderCount}
              toggleModal={this.toggleModal}
            />
          </Col>
          <Col xl={9}>
            <Switch>
              <Route
                key={0}
                path="/admin/messages"
                exact={true}
                render={props => (
                  <Inbox
                    {...props}
                    getNewMessagesCount={this.getNewMessagesCount}
                  />
                )}
              />
              <Route
                key={1}
                path="/admin/messages/sent"
                exact={true}
                render={props => <Sent {...props} 
                getNewMessagesCount={this.getNewMessagesCount}
                />}
              />
              <Route
                key={2}
                path="/admin/messages/trash"
                exact={true}
                render={props => <Trash {...props} />}
              />
              <Route
                key={3}
                path="/admin/messages/read/:id/:folder"
                exact={true}
                render={props => (
                  <Read {...props} toggleModal={this.toggleModal} />
                )}
              />
            </Switch>
          </Col>
        </Row>{" "}
        {this.state.showModal && (
          <Compose
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            recipients={this.state.recipients}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateNewMessagesCount: data => {
      dispatch(updateNewMessagesCount(data));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
