import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";

import Experiments from "./pages/Experiments";
import Guide from "./pages/Guide";
import Links from "./pages/Links";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/common/ProtectedRoute";

import "./styles/App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <HeaderNav />
        <Switch>
          <Route path="/" component={Home} exact />
          <ProtectedRoute path="/resources" component={Resources} />
          <ProtectedRoute path="/projects/:id" component={ProjectForm} />
          <ProtectedRoute path="/projects" component={Projects} />
          <ProtectedRoute path="/experiments" component={Experiments} />
          <ProtectedRoute path="/guide" component={Guide} />
          <ProtectedRoute path="/links" component={Links} />
          <ProtectedRoute path="/user" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
