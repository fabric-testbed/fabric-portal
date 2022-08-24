import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getWhoAmI } from "./services/peopleService.js";
import { getCurrentUser } from "./services/peopleService.js";
import { getActiveMaintenanceNotice } from "./services/announcementService.js";
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
import Help from "./pages/Help";
import Header from "./components/Header";
import Banner from "./components/common/Banner";
import Footer from "./components/Footer";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./styles/App.scss";

class App extends React.Component {
  state = {
    userStatus: "",
    activeNotices: [],
  };

  async componentDidMount() {
    // Check actice maitenance notice(s)
    try {
      const { data: res } = await getActiveMaintenanceNotice();
      this.setState({ activeNotices: res.results });
    } catch (err) {
      toast.error("Failed to load maintenance notice.")
    }

    // if no user status info is stored, call UIS getWhoAmI.
    if (!localStorage.getItem("userStatus")) {
      const { data } = await getWhoAmI();
      const user = data.results[0];
      if (user.enrolled) {
        localStorage.setItem("userID", user.uuid);
        localStorage.setItem("userStatus", "active");
        try {
          const { data: res } = await getCurrentUser();
          localStorage.setItem("bastionLogin", res.results[0].bastion_login);
        } catch (err) {
          console.log("Failed to get current user's information.");
        }
      } else {
        // situation 2: logged in, but not self signup, unauthenticated
        localStorage.setItem("userStatus", "inactive");
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
            this.state.activeNotices.map((notice, index) => 
              <Banner
                notice={notice}
                key={`notice-banner-${index}`}
              />
            )
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
            <Route path="/help" component={Help} />
            <ProtectedRoute path="/slices/:id" component={SliceViewer} />
            <ProtectedRoute path="/new-slice" component={NewSliceForm} />
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
