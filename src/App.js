import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getWhoAmI } from "./services/userInformationService.js";
import { getActiveNotices } from "./services/fakeMaintenanceNotice.js";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";
import Signup from "./pages/static/Signup";
import AUP from "./pages/static/AUP";
import CookiePolicy from "./pages/static/CookiePolicy";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import Experiments from "./pages/Experiments";
import SliceViewer from "./pages/SliceViewer";
import NewSliceForm from "./pages/NewSliceForm";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Banner from "./components/common/Banner";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./styles/App.scss";

class App extends React.Component {
  state = {
    userStatus: "",
    activeNotices: getActiveNotices(),
  };

  async componentDidMount() {
    // if no user status info is stored, call UIS getWhoAmI.
    if (!localStorage.getItem("userStatus")) {
      try {
        const { data: user } = await getWhoAmI();
        localStorage.setItem("userID", user.uuid);
        localStorage.setItem("bastionLogin", user.bastion_login);
        localStorage.setItem("userStatus", "active");
      } catch (err) {
        console.log("/whoami " + err);
        // situation 1: err.response.status === 401
        // not logged in or auth cookie expired
        // http service has set userStatus to unauthorized.

        // situation 2: logged in, but not self signup, unauthenticated
        if (err.response.status === 403) {
          localStorage.setItem("userStatus", "inactive");
        }
      }
    }

    this.setState({ userStatus: localStorage.getItem("userStatus") });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Header userStatus={this.state.userStatus} />
          { this.state.activeNotices.length > 0 && 
            this.state.activeNotices.map(notice => <Banner notice={notice}/>)
          }
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={Home} />
            <Route path="/logout" component={Home} />
            <Route path="/aup" component={AUP} />
            <Route path="/cookie-policy" component={CookiePolicy} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/signup/:id" component={Signup} />
            <Route path="/resources" component={Resources} />
            <Route path="/slices/:id" component={SliceViewer} />
            <Route path="/new-slice" component={NewSliceForm} />
            <ProtectedRoute path="/projects/:id" component={ProjectForm} />
            <ProtectedRoute path="/projects" component={Projects} />
            <ProtectedRoute path="/experiments" component={Experiments} />
            <ProtectedRoute path="/user" component={User} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
          <ToastContainer />
        </Router>
      </div>
    );
  }
}

export default App;
