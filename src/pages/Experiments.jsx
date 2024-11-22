import React from "react";
import withRouter from "../components/common/withRouter.jsx";
import SideNav from "../components/common/SideNav";
import Slices from "../components/Experiment/Slices";
import Projects from "../components/Experiment/Projects";
import Tokens from "../components/Experiment/Tokens";
import Keys from "../components/Experiment/Keys";
import ArtifactManager from "../components/Experiment/ArtifactManager";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Experiments extends React.Component {
  state = {
    SideNavItems: [
      { name: "PROJECTS & SLICES", hash: "#projects", active: true },
      { name: "MY SLICES", hash: "#slices", active: false },
      { name: "MANAGE TOKENS", hash: "tokens", active: false },
      { name: "MANAGE SSH KEYS", hash: "sshKeys", active: false },
      { name: "ARTIFACT MANAGER", hash: "artifacts", active: false },
    ],
    user: {},
    people: {},
    activeIndex: 0,
    componentNames: [Projects, Slices, Tokens, Keys, ArtifactManager],
  };

  async componentDidMount() {
    // url anchor: #slices, #tokens, #sshKeys
    const hash = this.props.location.hash;
    const activeMap = {
      "#projects": 0,
      "#slices": 1,
      "#tokens": 2,
      "#sshKeys": 3,
      "#artifacts": 4
    }

    if (hash) {
      this.setState({ activeIndex: activeMap[hash] });
      this.setState({ SideNavItems: [
        { name: "PROJECTS & SLICES", active: hash === "#projects" },
        { name: "MY SLICES", active: hash === "#slices" },
        { name: "MANAGE TOKENS", active: hash === "#tokens" },
        { name: "MANAGE SSH KEYS", active: hash === "#sshKeys" },
        { name: "ARTIFACT MANAGER", active: hash === "#artifacts" },
      ]})
    }
  }

  handleChange = (newIndex) => {
    const indexToHash = {
      0: "#projects",
      1: "#slices",
      2: "#tokens",
      3: "#sshKeys",
      4: "#artifacts"
    }
    this.setState({ activeIndex: newIndex,
      SideNavItems: [
        { name: "PROJECTS & SLICES", active: newIndex === 0 },
        { name: "MY SLICES", active: newIndex === 1 },
        { name: "MANAGE TOKENS", active: newIndex === 2 },
        { name: "MANAGE SSH KEYS", active: newIndex === 3 },
        { name: "ARTIFACT MANAGER", active: newIndex === 4 },
      ]
    });
    this.props.navigate(`/experiments${indexToHash[newIndex]}`);
  };
  
  render() {
    const TagName = this.state.componentNames[this.state.activeIndex];
    const { globalRoles } = this.props;
    return (
      <Container>
        <Row>
          <Col xs={3}>
            <SideNav
              items={this.state.SideNavItems}
              handleChange={this.handleChange}
            />
          </Col>
          <Col xs={9}>
            <TagName
              user={this.state.user}
              people={this.state.people}
              globalRoles={globalRoles}
              styleProp={"col-9"}
              parent={"Experiments"}
              handleChange={this.handleChange}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Experiments);
