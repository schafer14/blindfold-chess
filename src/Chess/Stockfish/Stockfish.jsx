import React from "react";
import PropTypes from "prop-types";
import Chess from "chess.js";
import ChessBoard from "chessboardjsx";
import Loading from "../../UI/Loading";
import Radium from "radium";

const HUMAN = "human";
const STOCKFISH = "stockfish";

const STYLES = {
  input: {
    border: 0,
    caretColor: "red"
  }
};

const propTypes = {
  whitePlayerType: PropTypes.oneOf([HUMAN, STOCKFISH]),
  blackPlayerType: PropTypes.oneOf([HUMAN, STOCKFISH]),
  skill: PropTypes.number
};

const defaultProps = {
  whitePlayerType: HUMAN,
  blackPlayerType: STOCKFISH,
  skill: 10
};

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  state = {
    game: new Chess(),
    move: "",
    cheat: false
  };

  componentWillMount() {
    var wasmSupported =
      typeof WebAssembly === "object" &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      );
    var stockfish = new Worker(
      wasmSupported ? "stockfish.wasm.js" : "stockfish.js"
    );
    stockfish.addEventListener("message", this.parseMessage);
    stockfish.postMessage("uci");
    this.setState({ engine: stockfish });
  }

  setOptions = () => {
    const { engine } = this.state;
    engine.postMessage(`setoption name Skill Level value ${this.props.skill}`);
  };

  requestMove = ponder => {
    const { game, engine } = this.state;
    const { whitePlayerType, blackPlayerType } = this.props;
    const whiteToPlay = game.turn() === "w";

    if (game.game_over()) {
      return;
    }

    if (
      (whiteToPlay && whitePlayerType === STOCKFISH) ||
      (!whiteToPlay && blackPlayerType === STOCKFISH)
    ) {
      engine.postMessage(`position fen ${game.fen()}`);
      engine.postMessage("go movetime 5000");
    } else {
      this.inputRef.current.focus();
    }
  };

  parseMessage = ({ data: message }) => {
    const { engine, game } = this.state;

    switch (true) {
      case /^option/.test(message):
      case /^id/.test(message):
      case /^info/.test(message):
      case /^\s*$/.test(message):
        break;
      case /^uciok$/.test(message):
        this.setOptions();
        engine.postMessage("isready");
        break;
      case /^readyok$/.test(message):
        this.requestMove();
        break;
      case /^bestmove/.test(message):
        const matches = message.match(/^bestmove\s([a-z0-9]*)/);
        const move = game.move(matches[1], { sloppy: true });
        this.setState({ game: game, error: null, computerMove: move.san });
        this.requestMove();
        break;
      default:
        console.info(message);
    }
  };

  makeHumanMove = e => {
    e.preventDefault();
    const { move, game } = this.state;
    const { blackPlayerType, whitePlayerType } = this.props;
    const turn = game.turn();

    if (turn === "b" && blackPlayerType !== HUMAN) {
      return this.setState({ error: "it is not your move" });
    }
    if (turn === "w" && whitePlayerType !== HUMAN) {
      return this.setState({ error: "it is not your move" });
    }

    const humanMove = game.move(move);
    if (!humanMove) {
      return this.setState({ error: "Unable to make move" });
    }
    this.setState({ error: null, move: "", game: game, computerMove: null });
    this.requestMove();
  };

  updateMove = e => {
    this.setState({ move: e.target.value });
  };

  render() {
    const { move, error, computerMove, game, cheat, showMoves } = this.state;
    const { whitePlayerType, blackPlayerType } = this.props;

    const humanPlays =
      (game.turn() === "w" && whitePlayerType === HUMAN) ||
      (game.turn() === "b" && blackPlayerType === HUMAN);

    if (game.game_over()) {
      return (
        <div>
          Game is over. result: <pre>{game.pgn()}</pre>
        </div>
      );
    }

    return (
      <div>
        {humanPlays && <p>Your Move</p>}
        {!humanPlays && <Loading />}
        {humanPlays && (
          <form onSubmit={this.makeHumanMove}>
            <input
              ref={this.inputRef}
              style={STYLES.input}
              placeholder="Type your move . . . "
              onChange={this.updateMove}
              value={move}
            />
            <button style={{ display: "none" }} type="submit">
              Move
            </button>
          </form>
        )}
        <button
          onClick={() => {
            this.setState(state => ({
              cheat: !state.cheat
            }));
          }}
        >
          {cheat ? "Hide" : "Cheat"}
        </button>
        <button
          onClick={() => {
            this.setState(state => ({
              showMoves: !state.showMoves
            }));
          }}
        >
          {showMoves ? "Hide Moves" : "Show Moves"}
        </button>
        {cheat ? <ChessBoard position={game.fen()} /> : null}
        {showMoves ? (
          <div>
            {game
              .history({ verbose: true })
              .map((move, number) => {
                if (move.color === "w") {
                  return `${number / 2 + 1}. ${move.san}`;
                }
                return move.san;
              })
              .join(" ")}
          </div>
        ) : null}
        {computerMove ? <pre>{computerMove}</pre> : null}
        {error ? <div>{error}</div> : null}
      </div>
    );
  }
}

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;

export default Radium(Component);
