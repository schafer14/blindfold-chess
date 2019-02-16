import React from "react";
import PropTypes from "prop-types";
import { map, range } from "lodash";
import * as utils from "./utils";
import sprite from "./pieces.svg";

const propTypes = {
  fen: PropTypes.string.isRequired,
  rotated: PropTypes.bool.isRequired,
  config: PropTypes.object,
  annotations: PropTypes.shape({
    highlights: PropTypes.arrayOf(PropTypes.number),
    arrows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.numbers))
  })
};

const defaultProps = {
  rotated: false,
  config: {
    darkSquareColor: "blue",
    lightSquareColor: "white",
    borderColor: "black",
    background: "#ccc",
    border: true
  },
  annotations: {
    highlights: [],
    arrows: []
  }
};

class Component extends React.Component {
  render() {
    const { config, rotated, fen, annotations } = this.props;
    const viewBox = config.border ? "-1 -1 82 82" : "0 0 80 80";
    const pieces = utils.fenToPieceArray(fen);

    return (
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <svg
          xmlns="http://www.w3.org/svg/2000"
          viewBox={viewBox}
          width="100%"
          height="100%"
        >
          // Draw border as solid background
          <rect
            x={-1}
            y={-1}
            width="82"
            height="82"
            fill={config.borderColor}
          />
          // Draw the squares
          {map(range(0, 64), squareIndex => {
            return (
              <rect
                key={squareIndex}
                {...utils.indexToSquare(squareIndex, rotated)}
                width="10"
                height="10"
                fill={
                  utils.isWhite(squareIndex)
                    ? config.lightSquareColor
                    : config.darkSquareColor
                }
              />
            );
          })}
          // Draw Pieces
          {map(pieces, (piece, index) => {
            return (
              <image
                {...utils.indexToSquare(piece.square, rotated)}
                key={index}
                href={piece.svg}
                width={10}
                height={10}
              />
            );
          })}
        </svg>
      </div>
    );
  }
}

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;

export default Component;
