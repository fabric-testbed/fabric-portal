import React, { Suspense, lazy } from 'react';
import "./styles/App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { getWhoAmI } from "./services/peopleService.js";
import { getCurrentUser } from "./services/peopleService.js";
import { getActiveMaintenanceNotice } from "./services/announcementService.js";
import checkGlobalRoles from "./utils/checkGlobalRoles"; 
import { default as portalData } from "./services/portalData.json";

// Regular components imported normally
import Header from "./components/Header";
import Banner from "./components/common/Banner";
import Footer from "./components/Footer";
import Skeleton from './components/common/Skeleton.jsx';
import SessionTimeoutModal from "./components/Modals/SessionTimeoutModal";
import { toast, ToastContainer } from "react-toastify";
import moment from 'moment';

// Route components imported with lazy loading
const Home = lazy(() => import("./pages/Home"));
const Resources = lazy(() => import("./pages/Resources"));
const MeasurementMetrics = lazy(() => import("./pages/static/MeasurementMetrics.jsx"));
const ProjectForm = lazy(() => import("./pages/ProjectForm"));
const Signup = lazy(() => import("./pages/static/Signup"));
const AUP = lazy(() => import("./pages/static/AUP"));
const CookiePolicy = lazy(() => import("./pages/static/CookiePolicy"));
const PrivacyPolicy = lazy(() => import("./pages/static/PrivacyPolicy"));
const Experiments = lazy(() => import("./pages/Experiments"));
const PublicExperiments = lazy(() => import("./pages/PublicExperiments.jsx"));
const PublicProjectProfile = lazy(() => import("./components/Project/Public/PublicProjectProfile.jsx"));
const SliceViewer = lazy(() => import("./pages/SliceViewer"));
const SliceEditor = lazy(() => import("./pages/SliceEditor"));
const NewSliceForm = lazy(() => import("./pages/NewSliceForm"));
const CheckCookie = lazy(() => import("./pages/CheckCookie"));
const User = lazy(() => import("./pages/User"));
const PublicUserProfile = lazy(() => import("./components/UserProfile/PublicUserProfile.jsx"));
const SiteDetailPage = lazy(() => import("./components/Resource/SiteDetailPage.jsx"));
const NotFound = lazy(() => import("./pages/static/NotFound"));
const JupyterHubAccess = lazy(() => import("./pages/static/JupyterHubAccess"));
const LoginRequired = lazy(() => import("./pages/static/LoginRequired"));
const Help = lazy(() => import("./pages/static/Help"));
const AboutFABRIC = lazy(() => import("./pages/static/AboutFABRIC.jsx"));
// const SAC = lazy(() => import("./pages/static/SAC.jsx")); 
const Leadership = lazy(() => import("./pages/static/Leadership"));
const FundingOpportunities = lazy(() => import("./pages/static/FundingOpportunities"));
const NewsletterSignup = lazy(() => import("./pages/static/NewsletterSignup"));
const Testbeds = lazy(() => import("./pages/static/Testbeds.jsx"));
const Publications = lazy(() => import("./pages/static/Publications.jsx"));
const PublicationTracker = lazy(() => import("./pages/PublicationTracker.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const Branding = lazy(() => import("./pages/static/Branding.jsx"));
const ProtectedRoutes = lazy(() => import("./components/common/ProtectedRoutes"));

class App extends React.Component {
  state = {
    userStatus: "",
    userName: "",
    userEmail: "",
    activeNotices: [],
    showSessionTimeoutModal1: false,
    showSessionTimeoutModal2: false,
    searchQuery: "",
    globalRoles: {
      isProjectAdmin: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: true
    },
  };

  checkNotExpired = (start, end) => {
    const startUTC = start.substring(0, 19);
    const stillStartUTC = moment.utc(startUTC).toDate();
    const endUTC = end.substring(0, 19);
    const stillEndUTC = moment.utc(endUTC).toDate();
    return stillEndUTC > new Date() && stillStartUTC < new Date();
  }

  async componentDidMount() {
    // Check active maitenance notice(s)
    try {
      const { data: res } = await getActiveMaintenanceNotice();
      this.setState({ 
        activeNotices: res.results.filter(notice => this.checkNotExpired(notice.start_date, notice.end_date)) 
      });
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
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userEmail", user.email);
          try {
            const { data: res } = await getCurrentUser();
            this.setState({globalRoles: checkGlobalRoles(res.results[0])});
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
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
        }
  
        if (errors && errors[0].details.includes("Enrollment required")) {
          localStorage.setItem("userStatus", "inactive");
        } 
      }
    }

    this.setState({ 
      userStatus: localStorage.getItem("userStatus"),
      userName: localStorage.getItem("userName"),
      userEmail: localStorage.getItem("userEmail")
    });
  }

  handleQueryChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  }

  render() {
    const { userName, userEmail, userStatus, searchQuery, globalRoles,
      showSessionTimeoutModal1, showSessionTimeoutModal2 } = this.state;
    return (
      <div className="App">
        <Router>
          <Header
            userName={userName}
            userEmail={userEmail}
            userStatus={userStatus}
            globalRoles={globalRoles}
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
          <Suspense fallback={<Skeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Home />} />
              <Route path="/logout" element={<Home />} />
              <Route path="/login-required" element={<LoginRequired />} />
              <Route path="/aup" element={<AUP />} />
              <Route path="/jupyter-no-access" element={<JupyterHubAccess />} />
              <Route path="/sites/:id" element={<SiteDetailPage />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/about/about-fabric" element={<AboutFABRIC />} />
              <Route path="/about/leadership" element={<Leadership />} />
              <Route path="/community/funding-opportunities" element={<FundingOpportunities />} />
              <Route path="/community/newsletter-signup" element={<NewsletterSignup />} />
              <Route path="/community/testbeds-and-facilities" element={<Testbeds />} />
              <Route path="/community/publications" element={<Publications />} />
              <Route path="/community/fabric-user-publications" element={<PublicationTracker />} />
              <Route path="/branding" element={<Branding />} />
              <Route path="/signup/:id" element={<Signup />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/overview" element={<Resources />} />/
              <Route path="/resources/tools" element={<MeasurementMetrics />} />
              <Route path="/help" element={<Help />} />
              <Route path="/check-cookie" element={<CheckCookie />} />
              <Route path="/slice-editor" element={<SliceEditor />} />
              <Route path="/experiments/experiments-public" element={<PublicExperiments/>} />
              <Route path="/experiments/public-projects/:id" element={<PublicProjectProfile />} />
              {/* <Route path="/slices/:slice_id/:project_id" element={<SliceViewer />} />
              <Route path="/new-slice/:project_id" element={<NewSliceForm />} /> */}
              <Route element={<ProtectedRoutes />}>
                  <Route path="/slices/:slice_id/:project_id" element={<SliceViewer />} />
                  <Route path="/new-slice/:project_id" element={<NewSliceForm />} />
                  <Route path="/projects/:id" element={<ProjectForm />} />
                  <Route path="/experiments" element={<Experiments  userStatus={userStatus} globalRoles={globalRoles} />} />
                  <Route path="/users/:id" element={<PublicUserProfile userStatus={userStatus}/>} />
                  <Route path="/user" element={<User userStatus={userStatus}/>} />
                  <Route
                    path="/search-results"
                    element={
                      <SearchResults searchQuery={searchQuery} onQueryChange={this.handleQueryChange}/>
                    }
                  />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <ToastContainer />
        </Router>
      </div>
    );
  }
}

export default App;
