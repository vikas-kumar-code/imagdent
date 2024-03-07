import React, { Component } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button
} from "reactstrap";
import { Link } from "react-router-dom"


class Page extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  };

  render() {
    const record = this.props.content;
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>{record.url}</td>
        {/* <td>
          <Dropdown
            isOpen={this.state.showMenu}
            size="sm"
            color="primary"
            toggle={this.toggleMenu}
          >
            <DropdownToggle caret>Action</DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag="a" href={`/admin/edit-page/${content.id}`}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => this.props.deletePage(content.id)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td> */}
        <td className="text-center"><Link to={`/admin/edit-page/${record.id}`} className="btn btn-primary btn-sm">Edit</Link></td>
        <td className="text-center"><Button type="button" className="btn btn-danger btn-sm" onClick={() => this.props.deletePage(record.id)}>Delete</Button></td>
      </tr>
    );
  }
}

export default Page;
