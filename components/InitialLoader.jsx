"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/lib/auth/AuthContext";
import useSessionTimeout from "@/lib/hooks/useSessionTimeout";
import Header from "@/components/Header";
import Banner from "@/components/common/Banner";
import SessionTimeoutModal from "@/components/Modals/SessionTimeoutModal";

export default function InitialLoader({ children, loaderData }) {
  const { userStatus, userName, userEmail, globalRoles, isLoading } = useAuth();
  const { showModal1, showModal2, startTimers } = useSessionTimeout();
  const [activeNotices, setActiveNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const checkNotExpired = (start, end) => {
    const startUTC = start?.substring(0, 19);
    const stillStartUTC = new Date(startUTC);
    const endUTC = end?.substring(0, 19);
    const stillEndUTC = new Date(endUTC);
    return stillEndUTC > new Date() && stillStartUTC < new Date();
  };

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/announcements?announcement_type=maintenance&is_active=true&offset=0&limit=3");
        if (!res.ok) return;
        const data = await res.json();
        setActiveNotices((data.results || []).filter(n => checkNotExpired(n.start_date, n.end_date)));
      } catch {
        // Non-critical — fail silently
      }
    }

    fetchNotices();
  }, []);

  // Start session timeout timers when user is active
  useEffect(() => {
    if (userStatus === "active" && !isLoading) {
      startTimers();
    }
  }, [userStatus, isLoading, startTimers]);

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

      {showModal1 && <SessionTimeoutModal modalId={1} timeLeft={300000} />}
      {showModal2 && <SessionTimeoutModal modalId={2} timeLeft={60000} />}

      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { loaderData })
          : child
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
