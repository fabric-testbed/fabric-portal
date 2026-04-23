"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import SideNav from "@/components/common/SideNav";
import ProjectListPage from "@/components/Project/Public/ProjectListPage";
import ArtifactListPage from "@/components/Artifacts/ArtifactListPage";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const hashToPath = {
  "#projects": "/experiments/projects",
  "#slices": "/experiments/slices",
  "#tokens": "/experiments/tokens",
  "#sshKeys": "/experiments/ssh-keys",
  "#artifacts": "/experiments/artifacts",
};

const publicNavItems = [
  { name: "PUBLIC PROJECTS", hash: "#public-projects" },
  { name: "PUBLIC ARTIFACTS", hash: "#public-artifacts" },
];

const publicComponents = [ProjectListPage, ArtifactListPage];

const publicHashMap = { "#public-projects": 0, "#public-artifacts": 1 };

export default function ExperimentsPage() {
  const router = useRouter();
  const { userStatus, isLoading } = useAuth();

  // Public view state
  const [activeIndex, setActiveIndex] = useState(0);
  const [sideNavItems, setSideNavItems] = useState(
    publicNavItems.map((item, i) => ({ name: item.name, active: i === 0 }))
  );

  useEffect(() => {
    if (isLoading) return;

    if (userStatus === "active") {
      // Authenticated: redirect to the right sub-page based on hash (CRA legacy behavior)
      const hash = window.location.hash;
      const path = hashToPath[hash] || "/experiments/projects";
      router.replace(path);
    } else {
      // Unauthenticated: resolve hash for public view
      const hash = window.location.hash;
      if (hash && publicHashMap[hash] !== undefined) {
        const idx = publicHashMap[hash];
        setActiveIndex(idx);
        setSideNavItems(publicNavItems.map((item, i) => ({ name: item.name, active: i === idx })));
      }
    }
  }, [userStatus, isLoading, router]);

  // While loading auth or if active (redirect in progress), render nothing
  if (isLoading || userStatus === "active") return null;

  const handleChange = (newIndex) => {
    setActiveIndex(newIndex);
    setSideNavItems(publicNavItems.map((item, i) => ({ name: item.name, active: i === newIndex })));
    const hash = newIndex === 0 ? "#public-projects" : "#public-artifacts";
    router.push(`/experiments${hash}`);
  };

  const TagName = publicComponents[activeIndex];

  return (
    <Container>
      <Row>
        <Col xs={2}>
          <SideNav items={sideNavItems} handleChange={handleChange} />
        </Col>
        <Col xs={10}>
          <TagName
            styleProp="col-9"
            parent="PublicExperiments"
            handleChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  );
}
