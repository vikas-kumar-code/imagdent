import React, { Component } from "react";
import { Badge, Button } from "reactstrap";
import common from "../../../../services/common";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

class User extends Component {
  state = {
    showMenu: false,
  };

  render() {
    const record = this.props.record;
    return (
      <React.Fragment>
        <tr>
          <td>
            <Link
              to={`/admin/cases/details/${record.id}`}
              style={{
                color: "#20a8d8",
              }}
            >
              {record.c_id}
            </Link>
          </td>
          <td>{record.location.publish_name}</td>
          <td>{common.getFullName(record.patient)}</td>
          <td>
            <a href={`mailto:${record.user.email}`}>
              {common.getFullName(record.user)}
            </a>
          </td>
          <td>{record.clinic.name}</td>
          <td>${record.total_price === null ? "00.00" : common.numberFormat(record.total_price)}</td>
          <td>{moment(record.appointment_date).format("MM-DD-YYYY")}</td>
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
