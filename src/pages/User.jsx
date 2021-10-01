import React from "react";
import SideNav from "../components/common/SideNav";
import AccountInfo from "../components/UserProfile/AccountInfo";
import MyRoles from "../components/UserProfile/MyRoles";
// import MessageCenter from "../components/UserProfile/MessageCenter";
// import Keys from "../components/UserProfile/Keys";
import { toast } from "react-toastify";

import sleep from "../utils/sleep";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser, refreshRoles } from "../services/prPeopleService.js";

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "ACCOUNT INFORMATION", active: true },
      { name: "MY ROLES & PROJECTS", active: false },
      // { name: "MESSAGE CENTER", active: false },
      // { name: "MY SSH KEYS", active: false },
    ],
    user: {},
    people: {},
    activeIndex: 0,
    // componentNames: [AccountInfo, MyRoles, Keys],
    componentNames: [AccountInfo, MyRoles],
  };

  async componentDidMount(){
    try {
      const { data: user } = await getWhoAmI();
      const { data: people } = await getCurrentUser();
      this.setState({ user, people });
    } catch (ex) {
      toast.error("Failed to load user information. Please reload this page.");
      console.log("Failed to load user information: " + ex.response.data);
    }
  }

  handleChange = (newIndex) => {
    this.setState({ activeIndex: newIndex });
  };

  handleRoleRefresh = async () => {
    try {
      // Refresh role first, then get updated people info.
      // two async/ await calls in series.
      await refreshRoles();
      // wait 1 second for PR updates.
      await sleep(1000);
      const { data: people } = await getCurrentUser();
      this.setState({ people });
    } catch (ex) {
      toast.error("Failed to refresh roles. Please try again.");
      console.log("Failed to refresh roles " + ex.response.data);
    }
  }

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
            onRoleRefresh={this.handleRoleRefresh}
          />
        </div>
      </div>
    );
  }
}

export default User;
