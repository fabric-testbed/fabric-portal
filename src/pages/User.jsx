import React from "react";
import SideNav from "../components/common/SideNav";
import SpinnerFullPage from "../components/common/SpinnerFullPage";
import AccountInfo from "../components/UserProfile/AccountInfo";
import MyRoles from "../components/UserProfile/MyRoles";
import MyProfile from "../components/UserProfile/MyProfile";
import KeyTabs from "../components/SshKey/KeyTabs";
import { toast } from "react-toastify";
import { getCurrentUser, getWhoAmI } from "../services/peopleService.js";
import { getActiveKeys } from "../services/sshKeyService";
import { updatePeopleProfile } from "../services/peopleService";

class User extends React.Component {
  state = {
    SideNavItems: [
      // { name: "ACCOUNT INFORMATION", active: true },
      // { name: "MY ROLES & PROJECTS", active: false },
      // { name: "MY SSH KEYS", active: false },
      // { name: "MY PROFILE", active: false },
      { name: "MY PROFILE", active: true },
    ],
    user: {},
    activeIndex: 0,
    // componentNames: [AccountInfo, MyRoles, KeyTabs, MyProfile],
    componentNames: [MyProfile],
    keys: [],
    showSpinner: false
  };

  async componentDidMount(){
    try {
      const { data: res1 } = await getCurrentUser();
      const user = res1.results[0];
      const { data: res2 } = await getActiveKeys();
      const keys = res2.results;
      this.setState({ user, keys });
    } catch (err) { 
      toast.error("Failed to load user information. Please re-login.");
    }
  }

  handleChange = (newIndex) => {
    this.setState({ activeIndex: newIndex });
  };

  handleRoleRefresh = async () => {
    this.setState({ showSpinner: true });
    try {
      await getWhoAmI();
      const { data: res } = await getCurrentUser();
      this.setState({ user: res.results[0], showSpinner: false });
      toast.success("You've successfully refreshed roles.");
    } catch (err) {
      toast.error("Failed to refresh roles. Please try again.");
    }
  }

  handleProfileUpdate = async (data) => {
    this.setState({ showSpinner: true });
    try {
      await updatePeopleProfile(this.state.user.uuid, data);
      const { data: res } = await getCurrentUser();
      this.setState({ user: res.results[0], showSpinner: false });
      toast.success("You've successfully refreshed roles.");
    } catch (err) {
      toast.error("Failed to update user profile. Please try again.");
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
    const { user, showSpinner } = this.state;
    // const { sliverKeys, bastionKeys } = this.getKeysData();

    return (
      <div className="container">
        <div className="row">
          <SideNav
            items={this.state.SideNavItems}
            handleChange={this.handleChange}
          />
          {/* <SpinnerFullPage text={"Refreshing user roles..."} showSpinner={showSpinner}/> */}
          <TagName
            user={user}
            onRoleRefresh={this.handleRoleRefresh}
            // sliverKeys={sliverKeys}
            // bastionKeys={bastionKeys}
            disableKeyDelete={true}
            styleProp={"col-9"}
            parent={"UserProfile"}
            onProfileUpdate={this.handleProfileUpdate}
          />
        </div>
      </div>
    );
  }
}

export default User;
