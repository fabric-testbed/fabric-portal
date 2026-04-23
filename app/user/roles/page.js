"use client";

import MyRoles from "@/components/UserProfile/MyRoles";
import { useUserPage } from "../UserContext";

export default function RolesPage() {
  const { user, onRoleRefresh } = useUserPage();
  return <MyRoles user={user} onRoleRefresh={onRoleRefresh} />;
}
