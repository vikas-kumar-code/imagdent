import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultFooter extends Component {
  state = {
    year: new Date()
  };
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>
          <a href="http://imagdent.com/">iMagDent</a> &copy;&nbsp;
          {this.state.year.getFullYear()}.
        </span>
        <span className="ml-auto">
          Powered by{" "}
          <a href="https://mitiztechnologies.com" target="_blank">Mitiz Technologies</a>
        </span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
