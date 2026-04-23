"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getCurrentUser, getWhoAmI } from "@/services/peopleService";
import { getActiveKeys } from "@/services/sshKeyService";

const UserPageContext = createContext(null);

export function UserPageProvider({ children }) {
  const [user, setUser] = useState({});
  const [keys, setKeys] = useState([]);
  const [showFullPageSpinner, setShowFullPageSpinner] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: res1 } = await getCurrentUser();
        const { data: res2 } = await getActiveKeys();
        setUser(res1.results[0]);
        setKeys(res2.results);
      } catch (err) {
        toast.error("Failed to load user information. Please re-login.");
      }
    }
    loadUser();
  }, []);

  const handleRoleRefresh = useCallback(async () => {
    setShowFullPageSpinner(true);
    try {
      await getWhoAmI();
      const { data: res } = await getCurrentUser();
      setUser(res.results[0]);
      setShowFullPageSpinner(false);
      toast.success("You've successfully refreshed roles.");
    } catch (err) {
      setShowFullPageSpinner(false);
      toast.error("Failed to refresh roles. Please try again.");
    }
  }, []);

  const sliverKeys = keys.filter((k) => k.fabric_key_type === "sliver");
  const bastionKeys = keys.filter((k) => k.fabric_key_type === "bastion");

  return (
    <UserPageContext.Provider
      value={{
        user,
        sliverKeys,
        bastionKeys,
        showFullPageSpinner,
        onRoleRefresh: handleRoleRefresh,
      }}
    >
      {children}
    </UserPageContext.Provider>
  );
}

export function useUserPage() {
  const context = useContext(UserPageContext);
  if (!context) {
    throw new Error("useUserPage must be used within a UserPageProvider");
  }
  return context;
}
