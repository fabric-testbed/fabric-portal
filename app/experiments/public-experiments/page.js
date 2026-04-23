"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SideNav from "../../../components/common/SideNav";
import Projects from "../../../components/Project/Public/ProjectListPage";
import Artifacts from "../../../components/Artifacts/ArtifactListPage.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PublicExperiments() {
  const router = useRouter();
  const pathname = usePathname();

  const [SideNavItems, setSideNavItems] = useState([
    { name: "PUBLIC PROJECTS", hash: "#public-projects", active: true },
    { name: "PUBLIC ARTIFACTS", hash: "#public-artifacts", active: false },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [componentNames] = useState([Projects, Artifacts]);

  useEffect(() => {
    const hash = window.location.hash;
    const activeMap = {
      "#public-projects": 0,
      "#public-artifacts": 1
    };

    if (hash) {
      setActiveIndex(activeMap[hash]);
      setSideNavItems([
        { name: "PUBLIC PROJECTS", active: hash === "#public-projects" },
        { name: "PUBLIC ARTIFACTS", active: hash === "#public-artifacts" }
      ]);
    }
  }, []);

  const handleChange = (newIndex) => {
    const indexToHash = {
      0: "#public-projects",
      1: "#public-artifacts"
    };
    setActiveIndex(newIndex);
    setSideNavItems([
      { name: "PUBLIC PROJECTS", active: newIndex === 0 },
      { name: "PUBLIC ARTIFACTS", active: newIndex === 1 }
    ]);
    router.push(`/experiments/public-experiments${indexToHash[newIndex]}`);
  };

  const TagName = componentNames[activeIndex];
  return (
    <Container>
      <Row>
        <Col xs={2}>
          <SideNav
            items={SideNavItems}
            handleChange={handleChange}
          />
        </Col>
        <Col xs={10}>
          <TagName
            styleProp={"col-9"}
            parent={"PublicExperiments"}
            handleChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default PublicExperiments;
