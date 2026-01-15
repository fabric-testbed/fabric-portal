"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Banner from "@/components/common/Banner";
import SessionTimeoutModal from "@/components/Modals/SessionTimeoutModal";

export default function InitialLoader({ children, loaderData }) {
  // Destructure loaderData prop
  const {
    userStatus = "",
    userName = "",
    userEmail = "",
    globalRoles = {},
    activeNotices = [],
  } = loaderData || {};

  const [showSessionTimeoutModal1, setShowSessionTimeoutModal1] = useState(false);
  const [showSessionTimeoutModal2, setShowSessionTimeoutModal2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

      {/* Render children with loaderData passed down */}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { loaderData })
          : child
      )}
    </div>
  );
}