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
      // Check for a cached session in cookies first
      const cachedStatus = getSessionItem("userStatus");
      if (cachedStatus) {
        setUserStatus(cachedStatus);
        setUserName(getSessionItem("userName") || "");
        setUserEmail(getSessionItem("userEmail") || "");
        setUserId(getSessionItem("userID") || "");
        // If active, refresh full user data in the background
        if (cachedStatus === "active") {
          try {
            const uuid = getSessionItem("userID");
            if (uuid) {
              const { data: res } = await getCurrentUser(uuid);
              const currentUser = res.results[0];
              setUser(currentUser);
              setUserName(currentUser.name || "");
              setUserEmail(currentUser.email || "");
              setUserId(currentUser.uuid || "");
              setGlobalRoles(checkGlobalRoles(currentUser));
            }
          } catch (err) {
            if (err.response?.status === 401) {
              // Session expired — clear cached state and mark as unauthorized
              clearSession();
              setUserStatus("unauthorized");
              setUserName("");
              setUserEmail("");
              setUserId("");
              setIsLoading(false);
              return;
            }
            // Non-401 error (API temporarily down etc.) — keep cached state
          }
        }
        setIsLoading(false);
        return;
      }

      // No cached session — call whoAmI via native fetch (bypasses httpService
      // interceptors so a 401 here never triggers a global redirect to login)
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
        // Network error — treat as unauthenticated
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
      } else if (whoAmIErrorDetails.includes("Login required")) {
        setSessionItem("userStatus", "unauthorized");
        setUserStatus("unauthorized");
        removeSessionItem("userID");
        removeSessionItem("userName");
        removeSessionItem("userEmail");
      } else if (whoAmIErrorDetails.includes("Enrollment required")) {
        setSessionItem("userStatus", "inactive");
        setUserStatus("inactive");
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
