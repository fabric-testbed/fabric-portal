"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "@/services/peopleService";
import checkGlobalRoles from "@/lib/permissions/checkGlobalRoles";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
  clearSession,
} from "@/utils/sessionCookies";

const AuthContext = createContext(null);

const defaultGlobalRoles = {
  isProjectAdmin: false,
  isFacilityOperator: false,
  isActiveUser: false,
  isJupterhubUser: false,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [globalRoles, setGlobalRoles] = useState(defaultGlobalRoles);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setUserStatus("");
    setGlobalRoles(defaultGlobalRoles);
    clearSession();
  }, []);

  useEffect(() => {
    async function init() {
      // Show cached state immediately for a fast optimistic UI
      const cachedStatus = getSessionItem("userStatus");
      if (cachedStatus) {
        setUserStatus(cachedStatus);
        setUserName(getSessionItem("userName") || "");
        setUserEmail(getSessionItem("userEmail") || "");
        setUserId(getSessionItem("userID") || "");
      }

      // Always validate against whoAmI — cached cookies may be stale
      // (e.g. user didn't log in for a while and the auth cookie expired)
      let whoAmI = null;
      let whoAmIErrorDetails = "";
      try {
        const res = await fetch("/api/whoami");
        if (res.ok) {
          const body = await res.json();
          whoAmI = body.results?.[0];
        } else {
          const body = await res.json().catch(() => ({}));
          whoAmIErrorDetails = body.errors?.[0]?.details || "";
        }
      } catch {
        // Network error — fall back to cached state if available
        if (cachedStatus) {
          setIsLoading(false);
          return;
        }
      }

      if (whoAmI?.enrolled) {
        setSessionItem("userID", whoAmI.uuid);
        setSessionItem("userStatus", "active");
        setSessionItem("userName", whoAmI.name);
        setSessionItem("userEmail", whoAmI.email);

        setUserStatus("active");
        setUserName(whoAmI.name || "");
        setUserEmail(whoAmI.email || "");
        setUserId(whoAmI.uuid || "");

        try {
          const { data: res } = await getCurrentUser(whoAmI.uuid);
          const currentUser = res.results[0];
          setUser(currentUser);
          setGlobalRoles(checkGlobalRoles(currentUser));
          setSessionItem("bastionLogin", currentUser.bastion_login);
        } catch {
          console.log("Failed to get current user information");
        }
      } else if (whoAmIErrorDetails.includes("Enrollment required")) {
        clearSession();
        setSessionItem("userStatus", "inactive");
        setUserStatus("inactive");
      } else if (!whoAmI) {
        // Auth expired or unauthenticated — clear stale cached state
        clearSession();
        setUserStatus("unauthorized");
        setUserName("");
        setUserEmail("");
        setUserId("");
      }

      setIsLoading(false);
    }

    init();
  }, []);

  const value = {
    user,
    userStatus,
    globalRoles,
    isLoading,
    logout,
    userName,
    userEmail,
    userId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
