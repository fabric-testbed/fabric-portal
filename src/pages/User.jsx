import React from "react";
import SideNav from "../components/common/SideNav";
import AccountInfo from "../components/UserProfile/AccountInfo";
import MyRoles from "../components/UserProfile/MyRoles";
import MessageCenter from "../components/UserProfile/MessageCenter";

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "ACCOUNT INFORMATION", active: true },
      { name: "MY ROLES", active: false },
      { name: "MESSAGE CENTER", active: false },
    ],
    activeIndex: 0,
    componentNames: [AccountInfo, MyRoles, MessageCenter],
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
          <TagName />
        </div>
      </div>
    );
  }
}

export default User;
