import React from "react";
import SideNav from "../components/common/SideNav";
import Slices from "../components/Experiment/Slices";
import Tokens from "../components/Experiment/Tokens";
import Keys from "../components/Experiment/Keys";

class Experiments extends React.Component {
  state = {
    SideNavItems: [
      { name: "MY SLICES", active: true },
      { name: "MANAGE TOKENS", active: false },
      { name: "MANAGE SSH KEYS", active: false },
    ],
    user: {},
    people: {},
    activeIndex: 0,
    componentNames: [Slices, Tokens, Keys],
  };

  async componentDidMount() {
    // url anchor: #slices, #tokens, #sshKeys
    const hash = this.props.location.hash;
    const activeMap = {
      "#slices": 0,
      "#tokens": 1,
      "#sshKeys": 2,
    }

    if (hash) {
      this.setState({ activeIndex: activeMap[hash] });
      this.setState({ SideNavItems: [
        { name: "MY SLICES", active: hash === "#slices" },
        { name: "MANAGE TOKENS", active: hash === "#tokens" },
        { name: "MANAGE SSH KEYS", active: hash === "#sshKeys" },
      ]})
    }
  }

  handleChange = (newIndex) => {
    const indexToHash = {
      0: "#slices",
      1: "#tokens",
      // 2: "#sshKeys",
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
          />
        </div>
      </div>
    );
  }
}

export default Experiments;
