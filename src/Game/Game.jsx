import React from "react";
// import PropTypes from "prop-types";
import Chess from "../Chess/Stockfish/Stockfish";

const propTypes = {};

const defaultProps = {};

class Component extends React.Component {
  render() {
    const random = Math.random();
    const isWhite = random >= 0.5;
    return (
      <Chess
        whitePlayerType={isWhite ? "human" : "stockfish"}
        blackPlayerType={isWhite ? "stockfish" : "human"}
      />
    );
  }
}

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;

export default Component;
