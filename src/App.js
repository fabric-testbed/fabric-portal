import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getWhoAmI } from "./services/peopleService.js";
import { getCurrentUser } from "./services/peopleService.js";
import { getActiveMaintenanceNotice } from "./services/announcementService.js";
import { default as portalData } from "./services/portalData.json";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import ProjectForm from "./pages/ProjectForm";
import Signup from "./pages/static/Signup";
import AUP from "./pages/static/AUP";
import CookiePolicy from "./pages/static/CookiePolicy";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import Experiments from "./pages/Experiments";
import SliceViewer from "./pages/SliceViewer";
import NewSliceForm from "./pages/NewSliceForm";
import User from "./pages/User";
import PublicUserProfile from "./components/UserProfile/PublicUserProfile.jsx";
import SiteDetailPage from "./components/Resource/SiteDetailPage.jsx";
import NotFound from "./pages/static/NotFound";
import Help from "./pages/static/Help";
import SearchResults from "./pages/SearchResults.jsx";
import Header from "./components/Header";
import Banner from "./components/common/Banner";
import Footer from "./components/Footer";
import SessionTimeoutModal from "./components/Modals/SessionTimeoutModal";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoutes from "./components/common/ProtectedRoutes";
import "./styles/App.scss";

class App extends React.Component {
  state = {
    userStatus: "",
    activeNotices: [],
    showSessionTimeoutModal1: false,
    showSessionTimeoutModal2: false,
    searchQuery: ""
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
      try {
        const { data } = await getWhoAmI();
        const user = data.results[0];
        if (user.enrolled) {
          localStorage.setItem("userID", user.uuid);
          localStorage.setItem("userStatus", "active");
          try {
            const { data: res } = await getCurrentUser();
            localStorage.setItem("bastionLogin", res.results[0].bastion_login);
            // after user logs in for 3hr55min, pop up first session time-out modal
            const sessionTimeoutInterval1 = setInterval(() => 
              this.setState({showSessionTimeoutModal1: true})
            , portalData["5minBeforeCookieExpires"]);
  
            // after user logs in for 3hr59min, pop up second session time-out modal
            const sessionTimeoutInterval2 = setInterval(() => {
              this.setState({
                showSessionTimeoutModal1: false,
                showSessionTimeoutModal2: true,
              })
            }, portalData["1minBeforeCookieExpires"]);
  
            localStorage.setItem("sessionTimeoutInterval1", sessionTimeoutInterval1);
            localStorage.setItem("sessionTimeoutInterval2", sessionTimeoutInterval2);
          } catch (err) {
            console.log("Failed to get current user's information.");
          }
        }
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors && errors[0].details.includes("Login required")) {
          localStorage.setItem("userStatus", "unauthorized");
          localStorage.removeItem("userID");
        }
  
        if (errors && errors[0].details.includes("Enrollment required")) {
          localStorage.setItem("userStatus", "inactive");
        } 
      }
    }

    this.setState({ userStatus: localStorage.getItem("userStatus") });
  }

  handleQueryChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  }

  render() {
    const { userStatus, searchQuery, 
      showSessionTimeoutModal1, showSessionTimeoutModal2 } = this.state;
    return (
      <div className="App">
        <Router>
          <Header
            userStatus={userStatus}
            searchQuery={searchQuery}
            onQueryChange={this.handleQueryChange}
          />
          { this.state.activeNotices.length > 0 && 
            this.state.activeNotices.map((notice, index) => 
              <Banner
                notice={notice}
                key={`notice-banner-${index}`}
              />
            )
          }
          {
            showSessionTimeoutModal1 &&
            <SessionTimeoutModal
              modalId={1}
              timeLeft={300000}
            />
          }
          {
            showSessionTimeoutModal2 &&
            <SessionTimeoutModal
              modalId={2}
              timeLeft={60000}
            />
          }
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Home />} />
            <Route path="/logout" element={<Home />} />
            <Route path="/aup" element={<AUP />} />
            <Route path="/sites/:id" element={<SiteDetailPage />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/signup/:id" element={<Signup />} />
            <Route path="/resources/:id" element={<Resources />} />
            <Route path="/help" element={<Help />} />
            <Route element={<ProtectedRoutes />}>
                <Route path="/slices/:slice_id/:project_id" element={<SliceViewer />} />
                <Route path="/new-slice/:project_id" element={<NewSliceForm />} />
                <Route path="/projects/:id" element={<ProjectForm />} />
                <Route path="/experiments" element={<Experiments />} />
                <Route path="/users/:id" element={<PublicUserProfile />} />
                <Route path="/user" element={<User />} />
                <Route
                  path="/search-results"
                  element={
                    <SearchResults searchQuery={searchQuery} onQueryChange={this.handleQueryChange}/>
                  }
                />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </Router>
      </div>
    );
  }
}

export default App;
