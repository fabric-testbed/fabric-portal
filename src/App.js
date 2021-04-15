import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";

import Signup from "./pages/static/Signup";
import AUP from "./pages/static/AUP";
import CookiePolicy from "./pages/static/CookiePolicy";
import Experiments from "./pages/Experiments";
import Guide from "./pages/Guide";
import Links from "./pages/Links";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { ToastContainer } from 'react-toastify';

import ProtectedRoute from "./components/common/ProtectedRoute";

import "./styles/App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/aup" component={AUP} />
          <Route path="/cookiepolicy" component={CookiePolicy} />
          <Route path="/signup/:id" component={Signup} />
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
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
