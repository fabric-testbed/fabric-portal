"use client";

import { usePathname, useRouter } from "next/navigation";
import SideNav from "@/components/common/SideNav";
import SpinnerFullPage from "@/components/common/SpinnerFullPage";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UserPageProvider, useUserPage } from "./UserContext";

const navItems = [
  { name: "MY PROFILE", path: "/user/profile" },
  { name: "MY ROLES & PROJECTS", path: "/user/roles" },
  { name: "MY SSH KEYS", path: "/user/ssh-keys" },
  { name: "MY SLICES", path: "/user/slices" },
  { name: "MY ARTIFACTS", path: "/user/artifacts" },
];

function UserLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showFullPageSpinner } = useUserPage();

  // Public profile pages don't use the authenticated sidebar layout
  if (pathname.startsWith("/user/public-profile")) {
    return <>{children}</>;
  }

  const sideNavItems = navItems.map((item) => ({
    name: item.name,
    active: pathname === item.path || pathname.startsWith(item.path + "/"),
  }));

  const handleChange = (newIndex) => {
    router.push(navItems[newIndex].path);
  };

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

export default function UserLayout({ children }) {
  return (
    <UserPageProvider>
      <UserLayoutInner>{children}</UserLayoutInner>
    </UserPageProvider>
  );
}
