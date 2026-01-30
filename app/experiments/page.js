"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SideNav from "../../components/common/SideNav";
import Slices from "../../components/Experiment/Slices";
import Projects from "../../components/Experiment/Projects";
import Tokens from "../../components/Experiment/Tokens";
import Keys from "../../components/Experiment/Keys";
import ArtifactManager from "../../components/Experiment/ArtifactManager";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Experiments() {
  const router = useRouter();

  const componentNames = [
    Projects,
    Slices,
    Tokens,
    Keys,
    ArtifactManager,
  ];

  const hashToIndex = {
    "#projects": 0,
    "#slices": 1,
    "#tokens": 2,
    "#sshKeys": 3,
    "#artifacts": 4,
  };

  const indexToHash = {
    0: "#projects",
    1: "#slices",
    2: "#tokens",
    3: "#sshKeys",
    4: "#artifacts",
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [sideNavItems, setSideNavItems] = useState([
    { name: "PROJECTS & SLICES", active: true },
    { name: "MY SLICES", active: false },
    { name: "MANAGE TOKENS", active: false },
    { name: "MANAGE SSH KEYS", active: false },
    { name: "ARTIFACT MANAGER", active: false },
  ]);

  // Handle initial hash on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash in hashToIndex) {
      const index = hashToIndex[hash];
      setActiveIndex(index);
      updateSideNav(index);
    }
  }, []);

  const updateSideNav = (index) => {
    setSideNavItems([
      { name: "PROJECTS & SLICES", active: index === 0 },
      { name: "MY SLICES", active: index === 1 },
      { name: "MANAGE TOKENS", active: index === 2 },
      { name: "MANAGE SSH KEYS", active: index === 3 },
      { name: "ARTIFACT MANAGER", active: index === 4 },
    ]);
  };

  const handleChange = (newIndex) => {
    setActiveIndex(newIndex);
    updateSideNav(newIndex);
    router.push(`/experiments${indexToHash[newIndex]}`);
  };

  const ActiveComponent = componentNames[activeIndex];

  return (
    <Container>
      <Row>
        <Col xs={3}>
          <SideNav items={sideNavItems} handleChange={handleChange} />
        </Col>
        <Col xs={9}>
          <ActiveComponent
            parent="Experiments"
            handleChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  );
}
