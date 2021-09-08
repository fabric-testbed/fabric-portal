import React from "react";
import SideNav from "../components/common/SideNav";
import Slices from "../components/Experiment/Slices";
import Tokens from "../components/Experiment/Tokens";
import Keys from "../components/Experiment/Keys";
import { toast } from "react-toastify";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser, refreshRoles } from "../services/prPeopleService.js";

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

  // async componentDidMount(){
  //   try {
  //     const { data: user } = await getWhoAmI();
  //     const { data: people } = await getCurrentUser();
  //     this.setState({ user, people });
  //   } catch (ex) {
  //     toast.error("Failed to load user information. Please reload this page.");
  //     console.log("Failed to load user information: " + ex.response.data);
  //   }
  // }

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
