import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Game from "./Game/Game";
import Home from "./Home/Home";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/game" component={Game} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
