import React, { Component } from 'react'

export default class PatientTab extends Component {
  render() {
    if (this.props.isSelected) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
    return null;
  }
}
