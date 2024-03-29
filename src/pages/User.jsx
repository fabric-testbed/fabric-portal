import React from "react";
import SideNav from "../components/common/SideNav";
import SpinnerFullPage from "../components/common/SpinnerFullPage";
import MyRoles from "../components/UserProfile/MyRoles";
import MyProfile from "../components/UserProfile/MyProfile";
import KeyTabs from "../components/SshKey/KeyTabs";
import Slices from "../components/Experiment/Slices";
import { toast } from "react-toastify";
import { getCurrentUser, getWhoAmI } from "../services/peopleService.js";
import { getActiveKeys } from "../services/sshKeyService";

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "MY PROFILE", active: true },
      { name: "MY ROLES & PROJECTS", active: false },
      { name: "MY SSH KEYS", active: false },
      { name: "MY SLICES", active: false },
    ],
    user: {},
    activeIndex: 0,
    componentNames: [MyProfile, MyRoles, KeyTabs, Slices],
    keys: [],
    showFullPageSpinner: false,
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
    this.setState({ showFullPageSpinner: true });
    try {
      await getWhoAmI();
      const { data: res } = await getCurrentUser();
      this.setState({ user: res.results[0], showFullPageSpinner: false });
      toast.success("You've successfully refreshed roles.");
    } catch (err) {
      this.setState({ showFullPageSpinner: false });
      toast.error("Failed to refresh roles. Please try again.");
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
    const { user, showFullPageSpinner } = this.state;
    const { sliverKeys, bastionKeys } = this.getKeysData();

    return (
      <div className="container">
        <div className="row">
          <SideNav
            items={this.state.SideNavItems}
            handleChange={this.handleChange}
          />
          <SpinnerFullPage text={"Refreshing user roles..."} showSpinner={showFullPageSpinner}/>
          <TagName
            user={user}
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
