import React from "react";
import SideNav from "../components/common/SideNav";
import Slices from "../components/Experiment/Slices";
import Projects from "../components/Experiment/Projects";
import Tokens from "../components/Experiment/Tokens";
import Keys from "../components/Experiment/Keys";

class Experiments extends React.Component {
  state = {
    SideNavItems: [
      { name: "PROJECTS & SLICES", active: true },
      { name: "MY SLICES", active: false },
      { name: "MANAGE TOKENS", active: false },
      { name: "MANAGE SSH KEYS", active: false },
    ],
    user: {},
    people: {},
    activeIndex: 0,
    componentNames: [Projects, Slices, Tokens, Keys],
  };

  async componentDidMount() {
    // url anchor: #slices, #tokens, #sshKeys
    const hash = this.props.location.hash;
    const activeMap = {
      "#projects": 0,
      "#slices": 1,
      "#tokens": 2,
      "#sshKeys": 3,
    }

    if (hash) {
      this.setState({ activeIndex: activeMap[hash] });
      this.setState({ SideNavItems: [
        { name: "PROJECTS & SLICES", active: hash === "#projects" },
        { name: "MY SLICES", active: hash === "#slices" },
        { name: "MANAGE TOKENS", active: hash === "#tokens" },
        { name: "MANAGE SSH KEYS", active: hash === "#sshKeys" },
      ]})
    }
  }

  handleChange = (newIndex) => {
    const indexToHash = {
      0: "#projects",
      1: "#slices",
      2: "#tokens",
      3: "#sshKeys",
    }
    this.setState({ activeIndex: newIndex });
    this.props.history.push(`/experiments${indexToHash[newIndex]}`);
  };
  
  render() {
    const TagName = this.state.componentNames[this.state.activeIndex];
    
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
            styleProp={"col-9"}
            handleChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default Experiments;
