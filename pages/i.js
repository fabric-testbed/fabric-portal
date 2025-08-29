// pages/index.js
import React, { Suspense, lazy } from "react";
import { getWhoAmI, getCurrentUser } from "../services/peopleService";
import { getActiveMaintenanceNotice } from "../services/announcementService";
import checkGlobalRoles from "../utils/checkGlobalRoles";
import portalData from "../services/portalData.json";

import Header from "../components/Header";
import Banner from "../components/common/Banner";
import Footer from "../components/Footer";
import Skeleton from "../components/common/Skeleton.jsx";
import SessionTimeoutModal from "../components/Modals/SessionTimeoutModal";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

// Dynamic imports for pages/components
const Home = lazy(() => import("../pages/Home"));
// const Resources = lazy(() => import("../pages/Resources"));
// ... add other lazy imports similarly ...

class IndexPage extends React.Component {
  state = {
    userStatus: "",
    userName: "",
    userEmail: "",
    activeNotices: [],
    showSessionTimeoutModal1: false,
    showSessionTimeoutModal2: false,
    searchQuery: "",
    globalRoles: {
      isProjectLead: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: true,
    },
  };

  checkNotExpired = (start, end) => {
    const startUTC = start.substring(0, 19);
    const stillStartUTC = moment.utc(startUTC).toDate();
    const endUTC = end.substring(0, 19);
    const stillEndUTC = moment.utc(endUTC).toDate();
    return stillEndUTC > new Date() && stillStartUTC < new Date();
  };

  async componentDidMount() {
    try {
      const { data: res } = await getActiveMaintenanceNotice();
      this.setState({
        activeNotices: res.results.filter((notice) =>
          this.checkNotExpired(notice.start_date, notice.end_date)
        ),
      });
    } catch (err) {
      toast.error("Failed to load maintenance notice.");
    }

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
            this.setState({ globalRoles: checkGlobalRoles(res.results[0]) });
            localStorage.setItem("bastionLogin", res.results[0].bastion_login);

            const sessionTimeoutInterval1 = setInterval(
              () => this.setState({ showSessionTimeoutModal1: true }),
              portalData["5minBeforeCookieExpires"]
            );

            const sessionTimeoutInterval2 = setInterval(
              () =>
                this.setState({
                  showSessionTimeoutModal1: false,
                  showSessionTimeoutModal2: true,
                }),
              portalData["1minBeforeCookieExpires"]
            );

            localStorage.setItem(
              "sessionTimeoutInterval1",
              sessionTimeoutInterval1
            );
            localStorage.setItem(
              "sessionTimeoutInterval2",
              sessionTimeoutInterval2
            );
          } catch (err) {
            console.log("Failed to get current user's information.");
          }
        }
      } catch (err) {
        const errors = err.response?.data?.errors;
        if (errors?.[0]?.details.includes("Login required")) {
          localStorage.setItem("userStatus", "unauthorized");
          localStorage.removeItem("userID");
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
        }
        if (errors?.[0]?.details.includes("Enrollment required")) {
          localStorage.setItem("userStatus", "inactive");
        }
      }
    }

    this.setState({
      userStatus: localStorage.getItem("userStatus"),
      userName: localStorage.getItem("userName"),
      userEmail: localStorage.getItem("userEmail"),
    });
  }

  handleQueryChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  render() {
    const {
      userName,
      userEmail,
      userStatus,
      searchQuery,
      globalRoles,
      showSessionTimeoutModal1,
      showSessionTimeoutModal2,
      activeNotices,
    } = this.state;

    return (
      <div className="App">
        <Header
          userName={userName}
          userEmail={userEmail}
          userStatus={userStatus}
          globalRoles={globalRoles}
          searchQuery={searchQuery}
          onQueryChange={this.handleQueryChange}
        />
        {activeNotices.length > 0 &&
          activeNotices.map((notice, index) => (
            <Banner notice={notice} key={`notice-banner-${index}`} />
          ))}

        {showSessionTimeoutModal1 && (
          <SessionTimeoutModal modalId={1} timeLeft={300000} />
        )}
        {showSessionTimeoutModal2 && (
          <SessionTimeoutModal modalId={2} timeLeft={60000} />
        )}

        <Suspense fallback={<Skeleton />}>
          <Home
            userStatus={userStatus}
            globalRoles={globalRoles}
            searchQuery={searchQuery}
            onQueryChange={this.handleQueryChange}
          />
        </Suspense>

        <Footer />
        <ToastContainer />
      </div>
    );
  }
}

export default IndexPage;
