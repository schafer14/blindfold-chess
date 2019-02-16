import React, { Component } from 'react';

import ChessBoard from './Chess/Board/ui'
import config from './config'

class App extends Component {
  render() {
    return (
      <div className="App">
        <ChessBoard fen={config.initialFen} />
      </div>
    );
  }
}

export default App;
