"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SideNav from "@/components/common/SideNav";
import SpinnerFullPage from "@/components/common/SpinnerFullPage";
import SpinnerWithText from "@/components/common/SpinnerWithText";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UserPageProvider, useUserPage } from "./UserContext";
import { useAuth } from "@/lib/auth/AuthContext";
import LoginRequired from "@/app/login-required/page";

const navItems = [
  { name: "MY PROFILE", path: "/user/profile" },
  { name: "MY ROLES & PROJECTS", path: "/user/roles" },
  { name: "MY SSH KEYS", path: "/user/ssh-keys" },
  { name: "MY SLICES", path: "/user/slices" },
  { name: "MY ARTIFACTS", path: "/user/artifacts" },
];

function UserPageLayout({ children, sideNavItems, handleChange }) {
  const { showFullPageSpinner } = useUserPage();
  return (
    <Container>
      <SpinnerFullPage text="Refreshing user roles..." showSpinner={showFullPageSpinner} />
      <Row>
        <Col xs={3}>
          <SideNav items={sideNavItems} handleChange={handleChange} />
        </Col>
        <Col xs={9}>{children}</Col>
      </Row>
    </Container>
  );
}

function UserLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userStatus, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (userStatus === "unauthorized" || userStatus === "inactive") {
      if (!pathname.startsWith("/user/public-profile")) {
        router.push("/login-required");
      }
    }
  }, [userStatus, isLoading, pathname, router]);

  // Public profile pages don't use the authenticated sidebar layout
  if (pathname.startsWith("/user/public-profile")) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <SpinnerWithText text="Loading..." />
      </div>
    );
  }

  if (userStatus !== "active") {
    return <LoginRequired />;
  }

  const sideNavItems = navItems.map((item) => ({
    name: item.name,
    active: pathname === item.path || pathname.startsWith(item.path + "/"),
  }));

  const handleChange = (newIndex) => {
    router.push(navItems[newIndex].path);
  };

  return (
    <UserPageProvider>
      <UserPageLayout sideNavItems={sideNavItems} handleChange={handleChange}>
        {children}
      </UserPageLayout>
    </UserPageProvider>
  );
}

export default function UserLayout({ children }) {
  return <UserLayoutInner>{children}</UserLayoutInner>;
}
