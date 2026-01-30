"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getWhoAmI, getCurrentUser } from "@/services/peopleService";
import { getActiveMaintenanceNotice } from "@/services/announcementService";
import checkGlobalRoles from "@/lib/permissions/checkGlobalRoles";
import portalData from "@/services/portalData.json";
import Header from "@/components/Header";
import Banner from "@/components/common/Banner";
import SessionTimeoutModal from "@/components/Modals/SessionTimeoutModal";

export default function InitialLoader({ children, loaderData }) {
  const [activeNotices, setActiveNotices] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [globalRoles, setGlobalRoles] = useState({
    isProjectLead: false,
    isFacilityOperator: false,
    isActiveUser: false,
    isJupterhubUser: true,
  });
  const [showSessionTimeoutModal1, setShowSessionTimeoutModal1] = useState(false);
  const [showSessionTimeoutModal2, setShowSessionTimeoutModal2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const checkNotExpired = (start, end) => {
    const startUTC = start?.substring(0, 19);
    const stillStartUTC = new Date(startUTC);
    const endUTC = end?.substring(0, 19);
    const stillEndUTC = new Date(endUTC);
    return stillEndUTC > new Date() && stillStartUTC < new Date();
  };

  useEffect(() => {
    async function init() {
      // --- fetch active maintenance notices ---
      try {
        const { data: res } = await getActiveMaintenanceNotice();
        setActiveNotices(res.results.filter(n => checkNotExpired(n.start_date, n.end_date)));
      } catch {
        toast.error("Failed to load maintenance notice.");
      }

      // --- fetch user info if not in localStorage ---
      if (!localStorage.getItem("userStatus")) {
        try {
          const { data } = await getWhoAmI();
          const user = data.results[0];
          if (user?.enrolled) {
            localStorage.setItem("userID", user.uuid);
            localStorage.setItem("userStatus", "active");
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);

            try {
              const { data: res } = await getCurrentUser();
              setGlobalRoles(checkGlobalRoles(res.results[0]));
              localStorage.setItem("bastionLogin", res.results[0].bastion_login);

              // Session timeout intervals
              const interval1 = setInterval(() => setShowSessionTimeoutModal1(true), portalData["5minBeforeCookieExpires"]);
              const interval2 = setInterval(() => {
                setShowSessionTimeoutModal1(false);
                setShowSessionTimeoutModal2(true);
              }, portalData["1minBeforeCookieExpires"]);

              localStorage.setItem("sessionTimeoutInterval1", interval1);
              localStorage.setItem("sessionTimeoutInterval2", interval2);

            } catch (err) {
              console.log("Failed to get current user information");
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

      // --- hydrate state from localStorage ---
      setUserStatus(localStorage.getItem("userStatus"));
      setUserName(localStorage.getItem("userName"));
      setUserEmail(localStorage.getItem("userEmail"));
    }

    init();
  }, []);

  const handleQueryChange = (e) => setSearchQuery(e.target.value);

  return (
    <div className="App">
      <Header
        userName={userName}
        userEmail={userEmail}
        userStatus={userStatus}
        globalRoles={globalRoles}
        searchQuery={searchQuery}
        onQueryChange={handleQueryChange}
      />

      {activeNotices.map((notice, idx) => (
        <Banner notice={notice} key={`notice-banner-${idx}`} />
      ))}

      {showSessionTimeoutModal1 && <SessionTimeoutModal modalId={1} timeLeft={300000} />}
      {showSessionTimeoutModal2 && <SessionTimeoutModal modalId={2} timeLeft={60000} />}
      {/* <Home
          userStatus={userStatus}
          globalRoles={globalRoles}
          searchQuery={searchQuery}
          onQueryChange={handleQueryChange}
      /> */}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { loaderData })
          : child
      )}
    </div>
  );
}
