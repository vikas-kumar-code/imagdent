import React, { Component } from "react";
import { Badge } from "reactstrap";
import SetLocPrice from "./SetLocPrice";
import classnames from "classnames";
import common from "../../../services/common";

class Service extends Component {
  state = {
    showMenu: false,
    showLocationModal: false,
  };
  toggleMenu = (e) => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };
  toggleLocationModal = (e) => {
    let serviceId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showLocationModal: !prevState.showLocationModal,
      serviceId,
    }));
    if (this.state.showLocationModal) {
      this.props.getServices(this.props.fieldsFromSearch);
    }
  };
  render() {
    const record = this.props.service;
    return (
      <React.Fragment>
        <tr
          key={record.id}
          className={classnames({ "bg-info": record.parent_id === "0" })}
        >
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td>{record.parent !== null && record.parent.name}</td>
          <td>{record.parent !== null && record.code}</td>
          <td>
            {record.parent !== null &&
              record.status &&
              record.status === "Y" &&
              `$`}
            {record.parent !== null && `${common.numberFormat(record.price)}`}
          </td>
          {/* <td>{record.ada_code ? record.ada_code : "---"}</td>
          <td>{record.cpt_code ? record.cpt_code : "---"}</td> */}
          <td>
            {record.parent !== null &&
              record.status &&
              record.status === "Y" && <Badge color="success">Active</Badge>}
            {record.parent !== null &&
              record.status &&
              record.status === "N" && <Badge color="danger">Inactive</Badge>}
          </td>
          <td>
            {record.parent !== null && (
              <button
                type="button"
                className="btn btn-warning btn-sm"
                data-id={record.id}
                onClick={this.toggleLocationModal}
              >
                Price Settings
              </button>
            )}
          </td>
          <td>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              data-id={record.id}
              onClick={this.props.toggleModal}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => this.props.deleteService(record.id)}
            >
              Delete
            </button>
          </td>
        </tr>
        {this.state.showLocationModal && (
          <SetLocPrice
            showLocationModal={this.state.showLocationModal}
            toggleLocationModal={this.toggleLocationModal}
            serviceId={record.id}
            locations={record.locations}
            getServices={this.props.getServices}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Service;
