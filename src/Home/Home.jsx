import React from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const propTypes = {};

const defaultProps = {};

class Component extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Blindfold Chess</h1>
        <Link to="/game">Play</Link>
      </React.Fragment>
    );
  }
}

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;

export default Component;
