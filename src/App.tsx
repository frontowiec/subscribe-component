import React, { FunctionComponent } from "react";
import "./App.css";
import { Router, Link } from "@reach/router";
import { Countries } from "./components/Countries";
import { Home } from "./components/Home";

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <Link to="countries">Countries</Link>
      </nav>
      <Router>
        <Home path="/" />
        <Countries path="countries" />
      </Router>
    </div>
  );
};

export default App;
