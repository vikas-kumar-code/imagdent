import React, { Component } from "react";
import { Badge, Button } from "reactstrap";
import common from "../../../../services/common";
import moment from "moment";
import { connect } from "react-redux";

class User extends Component {
  state = {
    showMenu: false,
  };
  render() {
    const record = this.props.record;
    return (
      <React.Fragment>
        <tr>
          <td>{common.getFullName(record)}</td>
          <td>{record.username}</td>
          <td>{record.email}</td>
          <td>{record.phone !== null ? record.phone : "--"}</td>
          <td>{moment(record.added_on).format("MM-DD-YYYY")}</td>
        </tr>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userId: state.userId,
    userType: state.userType,
  };
};
export default connect(mapStateToProps)(User);
