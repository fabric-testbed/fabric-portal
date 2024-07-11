import React from "react";
import withRouter from "../components/common/withRouter.jsx";
import SideNav from "../components/common/SideNav";
import Slices from "../components/Experiment/Slices";
import Projects from "../components/Experiment/Projects";
import Tokens from "../components/Experiment/Tokens";
import Keys from "../components/Experiment/Keys";
import ArtifactManager from "../components/Experiment/ArtifactManager";

class Experiments extends React.Component {
  state = {
    SideNavItems: [
      { name: "PROJECTS & SLICES", active: true },
      { name: "MY SLICES", active: false },
      { name: "MANAGE TOKENS", active: false },
      { name: "MANAGE SSH KEYS", active: false },
      { name: "Artifact Manager", active: false },
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
        { name: "Artifact Manager", active: hash === "#artifacts" },
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
        { name: "Artifact Manager", active: newIndex === 4 },
      ]
    });
    this.props.navigate(`/experiments${indexToHash[newIndex]}`);
  };
  
  render() {
    const TagName = this.state.componentNames[this.state.activeIndex];
    const { globalRoles } = this.props;
    return (
      <div className="container">
        <div className="row">
          <SideNav
            items={this.state.SideNavItems}
            handleChange={this.handleChange}
          />
          <TagName
            user={this.state.user}
            people={this.state.people}
            globalRoles={globalRoles}
            styleProp={"col-9"}
            parent={"Experiments"}
            handleChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Experiments);
