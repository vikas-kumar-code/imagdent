import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Badge
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Plan extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  };

  render() {
    const plan = this.props.plan;
    return (
      <tr key={plan.id}>
        <td>{plan.id}</td>
        <td>{plan.name}</td>
        <td>
          {plan.duration} Month{parseInt(plan.duration) > 1 ? "s" : ""}
        </td>
        <td>
          <FontAwesomeIcon icon="dollar-sign" className="mr-1" />
          {plan.price}
        </td>
        <td>
          <Dropdown
            isOpen={this.state.showMenu}
            size="sm"
            color="primary"
            toggle={this.toggleMenu}
          >
            <DropdownToggle caret>Action</DropdownToggle>
            <DropdownMenu right>
              <DropdownItem data-id={plan.id} onClick={this.props.toggleModal}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => this.props.deletePlan(plan.id)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    );
  }
}

export default Plan;
