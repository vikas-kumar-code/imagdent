import React, { Component } from "react";
import { Badge, Button } from "reactstrap";
import common from "../../../../services/common";
import { connect } from "react-redux";
import moment from "moment";

class User extends Component {
  state = {
    showMenu: false,
  };
  render() {
    const record = this.props.record;
    console.log(record);
    return (
      <React.Fragment>
        <tr class="patient-data">
          <td>{common.getFullName(record)}</td>
          <td>
            {moment(record.BirthDate).format("MM-DD-YYYY")}
            {/* {moment(record.appointment_date).format("MM-DD-YYYY")} */}
          </td>
          <td>{record.Age}</td>
          <td>{record.WorkPhone !== null ? record.WorkPhone : "--"}</td>
          <td>{record.City}</td>
          <td>{record.statedetails && record.statedetails.state}</td>
          <td>{record.Sex}</td>
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
