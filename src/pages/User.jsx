import React from "react";
import SideNav from "../components/common/SideNav";
import AccountInfo from "../components/UserProfile/AccountInfo";
import MyRoles from "../components/UserProfile/MyRoles";
import MessageCenter from "../components/UserProfile/MessageCenter";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser } from "../services/prPeopleService.js";

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "ACCOUNT INFORMATION", active: true },
      { name: "MY ROLES", active: false },
      { name: "MESSAGE CENTER", active: false },
    ],
    user: {},
    people: {},
    activeIndex: 0,
    componentNames: [AccountInfo, MyRoles, MessageCenter],
  };

  async componentDidMount(){
    const { data: user } = await getWhoAmI();
    const { data: people } = await getCurrentUser();
    this.setState({ user, people });
  }

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
          <TagName user={this.state.user} people={this.state.people}/>
        </div>
      </div>
    );
  }
}

export default User;
