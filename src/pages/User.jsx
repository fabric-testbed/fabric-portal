import React from "react";
import SideNav from "../components/common/SideNav";
import AccountInfo from "../components/UserProfile/AccountInfo";
import MyRoles from "../components/UserProfile/MyRoles";
import MessageCenter from "../components/UserProfile/MessageCenter";
import { toast } from "react-toastify";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser } from "../services/prPeopleService.js";

class User extends React.Component {
  state = {
    SideNavItems: [
      { name: "ACCOUNT INFORMATION", active: true },
      { name: "MY ROLES", active: false },
      // { name: "MESSAGE CENTER", active: false },
    ],
    user: {
      "email": "yaxueguo@renci.org",
      "eppn": "yaxue@unc.edu",
      "name": "Yaxue Guo",
      "oidc_claim_sub": "http://cilogon.org/serverT/users/26542073",
      "prefs": {
        "interests": {},
        "permissions": {},
        "settings": {}
      },
      "uuid": "69ba1670-391d-4163-a67b-fae0e19b5ce6"
    },
    people: {
      "email": "yaxueguo@renci.org",
      "name": "Yaxue Guo",
      "oidc_claim_sub": "http://cilogon.org/serverT/users/26542073",
      "projects": [
        {
          "created_by": "69ba1670-391d-4163-a67b-fae0e19b5ce6",
          "created_time": "2021-03-30 17:32:17",
          "description": "Test Project",
          "facility": "FABRIC",
          "name": "Test Project",
          "uuid": "4ed2ed9f-08eb-4ffa-a250-d9801f6ff844"
        },
        {
          "created_by": "69ba1670-391d-4163-a67b-fae0e19b5ce6",
          "created_time": "2021-03-30 17:33:53",
          "description": "This is Yaxue's Project.",
          "facility": "FABRIC",
          "name": "Yaxue's Project",
          "uuid": "e13fae59-865e-4067-960d-b1160d481b1c"
        }
      ],
      "roles": [
        "project-leads",
        "facility-operators",
        "fabric-active-users",
        "4ed2ed9f-08eb-4ffa-a250-d9801f6ff844-pc",
        "4ed2ed9f-08eb-4ffa-a250-d9801f6ff844-po",
        "4ed2ed9f-08eb-4ffa-a250-d9801f6ff844-pm",
        "e13fae59-865e-4067-960d-b1160d481b1c-pc",
        "e13fae59-865e-4067-960d-b1160d481b1c-po",
        "e13fae59-865e-4067-960d-b1160d481b1c-pm"
      ],
      "uuid": "69ba1670-391d-4163-a67b-fae0e19b5ce6"
    },
    activeIndex: 0,
    componentNames: [AccountInfo, MyRoles, MessageCenter],
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
          <TagName user={this.state.user} people={this.state.people}/>
        </div>
      </div>
    );
  }
}

export default User;
