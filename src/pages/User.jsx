import React from "react";
import SideNav from "../components/common/SideNav";
import AccountInfo from "../components/UserProfile/AccountInfo";
import MyRoles from "../components/UserProfile/MyRoles";
import KeyTabs from "../components/SshKey/KeyTabs";
import { toast } from "react-toastify";

import sleep from "../utils/sleep";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser, refreshRoles } from "../services/prPeopleService.js";
import { getActiveKeys } from "../services/sshKeyService";

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "ACCOUNT INFORMATION", active: true },
      { name: "MY ROLES & PROJECTS", active: false },
      { name: "MY SSH KEYS", active: false },
    ],
    user: {},
    people: {},
    activeIndex: 0,
    componentNames: [AccountInfo, MyRoles, KeyTabs],
    keys: [],
  };

  async componentDidMount(){
    try {
      const { data } = await getWhoAmI();
      const user = data.results[0];
      const { data: people } = await getCurrentUser();
      const { data: keys } = await getActiveKeys();
      this.setState({ user, people, keys });
    } catch (ex) {
      toast.error("Failed to load user information. Please re-login.");
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
      toast.success("You've successfully refreshed roles.");
    } catch (ex) {
      toast.error("Failed to refresh roles. Please try again.");
      console.log("Failed to refresh roles " + ex.response.data);
    }
  }

  getKeysData = () => {
    const { keys } = this.state;

    let sliverKeys = keys.filter(k => k.fabric_key_type === "sliver");
    let bastionKeys = keys.filter(k => k.fabric_key_type === "bastion");

    return { sliverKeys, bastionKeys };
  };

  render() {
    const TagName = this.state.componentNames[this.state.activeIndex];
    const { user, people } = this.state;
    const { sliverKeys, bastionKeys } = this.getKeysData();

    return (
      <div className="container">
        <div className="row">
          <SideNav
            items={this.state.SideNavItems}
            handleChange={this.handleChange}
          />
          <TagName
            user={user}
            people={people}
            onRoleRefresh={this.handleRoleRefresh}
            sliverKeys={sliverKeys}
            bastionKeys={bastionKeys}
            disableKeyDelete={true}
            styleProp={"col-9"}
            parent={"UserProfile"}
          />
        </div>
      </div>
    );
  }
}

export default User;
