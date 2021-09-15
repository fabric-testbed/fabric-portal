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

  handleChange = (newIndex) => {
    this.setState({ activeIndex: newIndex });
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
