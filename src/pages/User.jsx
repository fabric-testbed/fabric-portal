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

  // async componentDidMount(){
  //   const { data: user } = await getWhoAmI();
  //   localStorage.setItem("userID", user.uuid);
  //   const { data: people } = await getCurrentUser();
  //   this.setState({ user, people });
  // }

  componentDidMount(){
    const user = {
      "email": "yaxueguo@renci.org",
      "eppn": "yaxue@unc.edu",
      "name": "Yaxue Guo",
      "oidc_claim_sub": "http://cilogon.org/serverT/users/26542073",
      "prefs": {
        "interests": {},
        "permissions": {},
        "settings": {}
      },
      "uuid": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6"
    };
    localStorage.setItem("userID", user.uuid);
    const people = {
      "email": "yaxueguo@renci.org",
      "name": "Yaxue Guo",
      "oidc_claim_sub": "http://cilogon.org/serverT/users/26542073",
      "projects": [
        {
          "created_by": "33fd7d09-879d-412d-835e-135d4978532c",
          "created_time": "2020-12-11 13:25:28.769233-05:00",
          "description": "Alpha desc",
          "facility": "FABRIC",
          "name": "Alpha",
          "uuid": "d5f779c5-385e-488f-a329-2fb66b4a70aa"
        },
        {
          "created_by": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6",
          "created_time": "2020-12-16 21:38:08.994363-05:00",
          "description": "A New Project",
          "facility": "FABRIC",
          "name": "A New Project",
          "uuid": "fef93fb1-96ed-41e6-b6a6-30c4a844f3a8"
        },
        {
          "created_by": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6",
          "created_time": "2020-12-17 21:19:48.032360-05:00",
          "description": "FABRIC Project - Modified Description...",
          "facility": "1",
          "name": "FABRIC Project",
          "uuid": "a355f97e-2ccf-4d53-9821-6c3099193e97"
        },
        {
          "created_by": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6",
          "created_time": "2020-12-17 22:41:57.051491-05:00",
          "description": "Hello world",
          "facility": "FABRIC",
          "name": "Hello world",
          "uuid": "641f8fe3-37be-4f6d-8e0e-f70736049e7f"
        },
        {
          "created_by": "00000000-0000-0000-0000-000000000000",
          "created_time": "2020-12-11 13:22:34.186175-05:00",
          "description": "Test project desc",
          "facility": "FABRIC",
          "name": "Test Project",
          "uuid": "abf0014e-72f5-44ab-ac63-5ec5a5debbb8"
        },
        {
          "created_by": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6",
          "created_time": "2020-12-11 15:03:38.113893-05:00",
          "description": "This is Test Project 2.",
          "facility": "FABRIC",
          "name": "Test Project 2",
          "uuid": "07db1ac8-d59c-45ab-a4cc-d6a768540e32"
        },
        {
          "created_by": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6",
          "created_time": "2020-12-11 15:08:21.513063-05:00",
          "description": "Test Project 3",
          "facility": "FABRIC",
          "name": "Test Project 3",
          "uuid": "176e89b4-c54b-4d3c-9be4-7d8c02c98d48"
        }
      ],
      "roles": [
        "project-leads",
        "abf0014e-72f5-44ab-ac63-5ec5a5debbb8-pm",
        "a355f97e-2ccf-4d53-9821-6c3099193e97-po",
        "a355f97e-2ccf-4d53-9821-6c3099193e97-pm",
        "641f8fe3-37be-4f6d-8e0e-f70736049e7f-po",
        "641f8fe3-37be-4f6d-8e0e-f70736049e7f-pm"
      ],
      "uuid": "27baf30f-9fbb-431b-b1de-8c4a4a6703d6"
    }
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
