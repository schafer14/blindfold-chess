import { chain, forEach } from "lodash";

import whiteKing from "./pieces/white-king.svg";
import whiteQueen from "./pieces/white-queen.svg";
import whiteRook from "./pieces/white-rook.svg";
import whiteBishop from "./pieces/white-bishop.svg";
import whiteKnight from "./pieces/white-knight.svg";
import whitePawn from "./pieces/white-pawn.svg";

import blackKing from "./pieces/black-king.svg";
import blackQueen from "./pieces/black-queen.svg";
import blackRook from "./pieces/black-rook.svg";
import blackBishop from "./pieces/black-bishop.svg";
import blackKnight from "./pieces/black-knight.svg";
import blackPawn from "./pieces/black-pawn.svg";

export const BLACK = 1;
export const WHITE = 0;
export const PIECES = {
  p: blackPawn,
  n: blackKnight,
  b: blackBishop,
  r: blackRook,
  q: blackQueen,
  k: blackKing,
  P: whitePawn,
  N: whiteKnight,
  B: whiteBishop,
  R: whiteRook,
  Q: whiteQueen,
  K: whiteKing
};

export const indexToSquare = (index, isReversed) => {
  if (isReversed) {
    const row = Math.floor(index / 8);
    const col = 7 - (index % 8);

    return { x: col * 10, y: row * 10 };
  } else {
    const row = 7 - Math.floor(index / 8);
    const col = index % 8;

    return { x: col * 10, y: row * 10 };
  }
};

export const isWhite = index => {
  const row = Math.floor(index / 8);
  const col = index % 8;

  const sum = row + col;

  return sum % 2 !== 0;
};

export const fenToPieceArray = fen => {
  const pieces = [];

  chain(fen)
    .split(" ")
    .get(0)
    .split("/")
    .forEach((row, index) => {
      const chars = row.split("");
      const rowIndex = 7 - Math.floor(index);
      let colIndex = 0;

      forEach(chars, char => {
        const square = 8 * rowIndex + colIndex;
        if (/[p|n|b|r|q|k]/i.test(char)) {
          pieces.push({ svg: PIECES[char], square: square });
          colIndex++;
        } else {
          colIndex += parseInt(char, 10);
        }
      });
    })
    .value();

  return pieces;
};
