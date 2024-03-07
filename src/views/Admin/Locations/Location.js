import React, { Component } from "react";
import { Input, Badge, CustomInput, FormGroup } from "reactstrap";

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    };
  }

  toggleMenu = e => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
    if (this.state.showMenu) {
      this.props.getLocations(this.props.fieldsFromSearch);
    }
  };

  render() {
    const record = this.props.location;
    const price =
      this.props.fields && this.props.fields[`${record.id}`] !== undefined
        ? this.props.fields[`${record.id}`].price
        : "";
    const status =
      this.props.fields && this.props.fields[`${record.id}`] !== undefined
        ? this.props.fields[`${record.id}`].status
        : "Y";
    return (
      <tr key={record.id}>
        {this.props.enableEditDelete && (
          <React.Fragment>
            <td>{record.id}</td>
          </React.Fragment>
        )}
        {this.props.enablePrice && (
          <React.Fragment>
            <td>
              <FormGroup>
                <CustomInput
                  type="switch"
                  id={`customSwitch${record.id}`}
                  name={`customSwitch${record.id}`}
                  onChange={event =>
                    this.props.handleChange(`${record.id}`, event, price)
                  }
                  checked={status === "Y" ? true : false}
                />
              </FormGroup>
            </td>
          </React.Fragment>
        )}
        <td>{record.publish_name}</td>
        <td>{record.street_address ? record.street_address : "---"}</td>
        {this.props.enableEditDelete && (
          <td>
            {record.status && record.status === "Y" ? (
              <Badge color="success">Active</Badge>
            ) : (
              <Badge color="danger">Inactive</Badge>
            )}
          </td>
        )}
        {this.props.enableEditDelete && (
          <React.Fragment>
            <td>
              <button
                type="button"
                className="btn btn-warning btn-sm"
                data-id={record.id}
                onClick={this.props.toggleModal}
              >
                Configure RactangleHealth
              </button>
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
                onClick={() => this.props.deleteLocation(record.id)}
              >
                Delete
              </button>
            </td>
          </React.Fragment>
        )}
        {this.props.enablePrice && (
          <React.Fragment>
            <td>
              <Input
                type="number"
                name={`${record.id}`}
                id={`${record.id}`}
                className="input-bg"
                value={price}
                step="0.01"
                onChange={event =>
                  this.props.handleChange(`${record.id}`, event, status)
                }
              />
            </td>
          </React.Fragment>
        )}
      </tr>
    );
  }
}

export default Location;
