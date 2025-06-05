import React from "react";
import withRouter from "../components/common/withRouter.jsx";
import SideNav from "../components/common/SideNav";
import Projects from "../components/Project/Public/ProjectListPage";
import Artifacts from "../components/Artifacts/ArtifactListPage.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class PublicExperiments extends React.Component {
  state = {
    SideNavItems: [
      { name: "PUBLIC PROJECTS", hash: "#public-projects", active: true },
      { name: "PUBLIC ARTIFACTS", hash: "#public-artifacts", active: false },
    ],
    activeIndex: 0,
    componentNames: [Projects, Artifacts],
  };

  async componentDidMount() {
    // url anchor: #slices, #tokens, #sshKeys
    const hash = this.props.location.hash;
    const activeMap = {
      "#public-projects": 0,
      "#public-artifacts": 1
    }

    if (hash) {
      this.setState({ activeIndex: activeMap[hash] });
      this.setState({ SideNavItems: [
        { name: "PUBLIC PROJECTS", active: hash === "#public-projects" },
        { name: "PUBLIC ARTIFACTS", active: hash === "#public-artifacts" }
      ]})
    }
  }

  handleChange = (newIndex) => {
    const indexToHash = {
      0: "#public-projects",
      1: "#public-artifacts"
    }
    this.setState({ activeIndex: newIndex,
      SideNavItems: [
        { name: "PUBLIC PROJECTS", active: newIndex === 0 },
        { name: "PUBLIC ARTIFACTS", active: newIndex === 1 }
      ]
    });
    this.props.navigate(`/experiments/experiments-public${indexToHash[newIndex]}`);
  };
  
  render() {
    const TagName = this.state.componentNames[this.state.activeIndex];
    return (
      <Container>
        <Row>
          <Col xs={2}>
            <SideNav
              items={this.state.SideNavItems}
              handleChange={this.handleChange}
            />
          </Col>
          <Col xs={10}>
            <TagName
              styleProp={"col-9"}
              parent={"PublicExperiments"}
              handleChange={this.handleChange}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(PublicExperiments);
