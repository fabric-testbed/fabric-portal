import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import Experiments from "./pages/Experiments";
import Guide from "./pages/Guide";
import Links from "./pages/Links";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import HeaderNav from "./components/headerNav";
import Footer from "./components/footer";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <HeaderNav />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/resources" component={Resources} />
          <Route path="/projects" component={Projects} />
          <Route path="/experiments" component={Experiments} exact />
          <Route path="/guide" component={Guide} exact />
          <Route path="/links" component={Links} exact />
          <Route path="/user" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
