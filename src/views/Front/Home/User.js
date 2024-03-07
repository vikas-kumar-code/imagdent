import React, { Component } from "react";
import Avtar from "../Common/Avtar";
import withFriend from "../Friends/withFriend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import common from "../../../services/common";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const user = this.props.user;
    return (
      <div className="row" key={`be-friend-key-${this.props.index}`}>
        <div className="col-lg-4 col-md-3 col-2">
          <Avtar
            image={user.image}
            size="3x"
            name={user.name !== "" ? user.name : user.username}
            width="43"
          />
        </div>
        <div className="col-lg-8 col-md-9 col-10 pl-lg-1 pr-lg-0 pl-md-4">
          <h6 className="mb-1">
            {user.name !== "" ? common.ucwords(user.name) : user.username}
          </h6>
          <button
            type="submit"
            className="btn btn-outline-danger Add-friend-btn"
            onClick={() => this.props.sendFriendRequest(user.id)}
            disabled={this.props.disableButton}
          >
            {this.props.disableButton && (
              <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
            )}
            ADD FRIEND
          </button>
        </div>
      </div>
    );
  }
}

export default withFriend(User);
