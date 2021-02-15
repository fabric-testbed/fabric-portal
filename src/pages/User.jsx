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
    people: {
      "email": "yaxueguo@renci.org",
      "name": "Yaxue Guo",
      "oidc_claim_sub": "http://cilogon.org/serverT/users/26542073",
      "projects": [
        {
          "created_by": "00000000-0000-0000-0000-000000000000",
          "created_time": "2020-12-07 20:29:56",
          "description": "INSERT_PROJECT_DESCRIPTION",
          "facility": "FABRIC",
          "name": "Test Project",
          "uuid": "abf0014e-72f5-44ab-ac63-5ec5a5debbb8"
        },
        {
          "created_by": "c3ce756d-c5b6-4501-b369-1478e4f47b6a",
          "created_time": "2021-01-29 14:35:45",
          "description": "Test Project by Account 2 (PL)",
          "facility": "FABRIC",
          "name": "Test Project by Account 2 (PL)",
          "uuid": "f519a2b3-14f4-4fc9-90af-8bd625bb6894"
        }
      ],
      "roles": [
        "facility-operators",
        "abf0014e-72f5-44ab-ac63-5ec5a5debbb8-pm",
        "f519a2b3-14f4-4fc9-90af-8bd625bb6894-po",
        "f519a2b3-14f4-4fc9-90af-8bd625bb6894-pm"
      ],
      "uuid": "602928fd-1e4b-43f4-aa9b-d31c9fe9d7a0"
    },
    activeIndex: 0,
    componentNames: [AccountInfo, MyRoles, MessageCenter],
  };

  async componentDidMount(){
    const { data: user } = await getWhoAmI();
    localStorage.setItem("userID", user.uuid);
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
