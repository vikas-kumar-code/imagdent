import React, { Component } from "react";
import { connect } from "react-redux";
import common from "../../../../services/common";

class Service extends Component {
  state = {
    showMenu: false,
  };
  calculateTotal = () => {
    let total =
      parseFloat(this.props.record.price) *
      parseInt(this.props.record.total_times);

    return total.toFixed(2);
  };
  render() {
    const record = this.props.record;

    return (
      <React.Fragment>
        <tr class="patient-data">
          <td>{record.name}</td>
          <td>${common.numberFormat(record.price)}</td>
          <td>{record.total_times}</td>
          <td>${ common.numberFormat(this.calculateTotal())}</td>
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
export default connect(mapStateToProps)(Service);
