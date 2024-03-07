import React, { Component } from "react";
import { Badge, Button } from "reactstrap";
import common from "../../../services/common";
import { connect } from "react-redux";
import moment from "moment";

class Payment extends Component {
  state = {
    showMenu: false,
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };

  render() {
    const record = this.props.user;
    return (
      <tr key={record.id}>
        <td>{record.invoice_id}</td>
        <td>{record.location.publish_name}</td>
        <td>{record.user !== null ? common.getFullName(record.user) : "--"}</td>
        <td>
          {record.case.patient.first_name} {record.case.patient.last_name}
        </td>
        <td>{common.modeArr[record.mode]}</td>
        <td>${record.amount}</td>
        <td>
          {parseInt(record.status) === 0 ? (
            <Badge color="danger">Un-paid</Badge>
          ) : (
            <Badge color="success">Paid</Badge>
          )}
        </td>
        <td>
          {record.received_on !== null
            ? moment(record.received_on).format("MMMM DD, YYYY")
            : "--"}
        </td>
      </tr>
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
export default connect(mapStateToProps)(Payment);
