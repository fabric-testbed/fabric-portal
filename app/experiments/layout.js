"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import SideNav from "@/components/common/SideNav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const navItems = [
  { name: "PROJECTS & SLICES", path: "/experiments/projects" },
  { name: "MY SLICES", path: "/experiments/slices" },
  { name: "MANAGE TOKENS", path: "/experiments/tokens" },
  { name: "MANAGE SSH KEYS", path: "/experiments/ssh-keys" },
  { name: "ARTIFACT MANAGER", path: "/experiments/artifacts" },
];

export default function ExperimentsLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userStatus, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (userStatus === "unauthorized" || userStatus === "inactive") {
      // /experiments itself uses conditional rendering — no redirect needed.
      // All other protected sub-paths redirect to /login-required.
      // Note: "" (empty) is the transient state during logout — don't redirect then,
      // as the page is already navigating to /logout.
      const isProtectedSubPath =
        pathname.startsWith("/experiments/projects") ||
        pathname.startsWith("/experiments/slices") ||
        pathname.startsWith("/experiments/tokens") ||
        pathname.startsWith("/experiments/ssh-keys") ||
        pathname.startsWith("/experiments/artifacts");
      if (isProtectedSubPath) {
        window.location.href = "/login?url=" + encodeURIComponent(window.location.origin + "/");
      }
    }
  }, [userStatus, isLoading, pathname, router]);

  // Don't show sidebar for: the /experiments root (has its own layout), sub-pages, public pages
  const isSubPage =
    pathname === "/experiments" ||
    pathname.match(/^\/experiments\/(projects|slices)\/[^/]+/) ||
    pathname.startsWith("/experiments/new-slice") ||
    pathname.startsWith("/experiments/public-experiments") ||
    pathname.startsWith("/experiments/public-projects") ||
    pathname.startsWith("/experiments/jupyter-no-access");

  if (isSubPage) {
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
      <Row>
        <Col xs={3}>
          <SideNav items={sideNavItems} handleChange={handleChange} />
        </Col>
        <Col xs={9}>{children}</Col>
      </Row>
    </Container>
  );
}
