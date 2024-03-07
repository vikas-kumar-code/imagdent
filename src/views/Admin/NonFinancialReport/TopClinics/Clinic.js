import React, { Component } from "react";
import { Badge, Button } from "reactstrap";
import common from "../../../../services/common";
import { connect } from "react-redux";

class Clinic extends Component {
  state = {
    showMenu: false,
  };
  render() {
    const record = this.props.record;
    return (
      <React.Fragment>
        <tr class="patient-data">
          <td>{record.name}</td>
          <td>
            {record.contact_email !== null && record.contact_email !== ""
              ? record.contact_email
              : record.email
              ? record.email
              : "--"}
          </td>
          <td>
            {record.contact_phone !== null && record.contact_phone !== ""
              ? record.contact_phone
              : record.phone
              ? record.phone
              : "--"}
          </td>
          <td>{record.fax !== null   && record.fax !== "" ? record.fax : "--"}</td>
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
export default connect(mapStateToProps)(Clinic);
