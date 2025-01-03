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
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "MY PROFILE", hash: "#profile", active: true },
      { name: "MY ROLES & PROJECTS", hash: "#roles", active: false },
      { name: "MY SSH KEYS", hash: "#sshKeys", active: false },
      { name: "MY SLICES", hash: "#slices", active: false },
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
    const indexToHash = {
      0: "#profile",
      1: "#roles",
      2: "#sshKeys",
      3: "#slices",
    }
    this.setState({ activeIndex: newIndex,
      SideNavItems: [
        { name: "MY PROFILE", active: newIndex === 0  },
        { name: "MY ROLES & PROJECTS", active: newIndex === 1 },
        { name: "MY SSH KEYS", active: newIndex === 2 },
        { name: "MY SLICES", active: newIndex === 3 }
      ]
    });
    this.props.navigate(`/user${indexToHash[newIndex]}`);
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
      <Container>
        <SpinnerFullPage text={"Refreshing user roles..."} showSpinner={showFullPageSpinner}/>
        <Row>
          <Col xs={3}>
            <SideNav
              items={this.state.SideNavItems}
              handleChange={this.handleChange}
            />
          </Col>
          <Col xs={9}>
            <TagName
              user={user}
              onRoleRefresh={this.handleRoleRefresh}
              sliverKeys={sliverKeys}
              bastionKeys={bastionKeys}
              disableKeyDelete={true}
              parent={"UserProfile"}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default User;
