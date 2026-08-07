"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SideNav from "../../../components/common/SideNav";
import Projects from "../../../components/Project/Public/ProjectListPage";
import Artifacts from "../../../components/Artifacts/ArtifactListPage.jsx";
import Container from 'react-bootstrap/Container';

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
      <div className="sidebar-layout">
        <div className="sidebar-col">
          <SideNav
            items={SideNavItems}
            handleChange={handleChange}
          />
        </div>
        <div className="main-col">
          <TagName
            parent={"PublicExperiments"}
            handleChange={handleChange}
          />
        </div>
      </div>
    </Container>
  );
}

export default PublicExperiments;
