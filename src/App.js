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
import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";

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
          {/* <Route path="/all-projects" component={AllProjects} />
          <Route path="/my-projects" component={MyProjects} /> */}
          <Route path="/experiments" component={Experiments} />
          <Route path="/guide" component={Guide} />
          <Route path="/links" component={Links} />
          <Route path="/user" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
