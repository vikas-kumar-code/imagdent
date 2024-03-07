import React, { Component } from "react";
import {
  Badge,Button
} from "reactstrap";
import common from "../../../../services/common";
import { connect } from "react-redux";

class Service extends Component {
  state = {
    showMenu: false,
  };
  render() {
    const record = this.props.record;
    return (
      <React.Fragment>
        <tr class="patient-data">
          <td>{record && record.name}</td>
          <td>{record && record.code}</td>
          <td>${record &&  common.numberFormat(record.price)}</td>
        </tr>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userId: state.userId,
    userType:state.userType
  };
};
export default connect(mapStateToProps)(Service);