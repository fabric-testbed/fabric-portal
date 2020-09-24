import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import User from "./pages/User";
import Projects from "./pages/Projects";
import HeaderNav from "./components/headerNav";
import Footer from "./components/footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <HeaderNav />
        <Switch>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
