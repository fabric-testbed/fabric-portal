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

  componentDidMount(){
    const user =  {
      "affiliation": "University of North Carolina at Chapel Hill",
      "bastion_login": "yaxueguo_0026542073",
      "cilogon_email": "yaxueguo@renci.org",
      "cilogon_family_name": "Guo",
      "cilogon_given_name": "Yaxue",
      "cilogon_id": "http://cilogon.org/serverT/users/26542073",
      "cilogon_name": "Yaxue Guo",
      "email": "yaxueguo@renci.org",
      "email_addresses": [
        "yaxueguo@renci.org"
      ],
      "eppn": "yaxue@unc.edu",
      "fabric_id": "FABRIC1000004",
      "name": "Yaxue Guo",
      "preferences": {
        "show_email": true,
        "show_eppn": false,
        "show_profile": true,
        "show_publications": true,
        "show_roles": true,
        "show_sshkeys": false
      },
      "profile": {
        "bio": "I'm the front-end developer of FABRIC project.",
        "job": "Front-end Developer",
        "other_identities": [],
        "personal_pages": [],
        "preferences": {
          "show_bio": true,
          "show_cv": true,
          "show_job": true,
          "show_other_identities": true,
          "show_personal_pages": true,
          "show_pronouns": false,
          "show_website": true
        },
        "pronouns": "She/her",
        "website": "https://github.com/yaxue1123"
      },
      "publications": [],
      "registered_on": "2021-07-14 13:39:13.541644+00:00",
      "roles": [
        {
          "description": "FABRIC Staff No Permissions",
          "name": "04b14c17-e66a-4405-98fc-d737717e2160-pm"
        },
        {
          "description": "Yaxue's Project",
          "name": "06e8d02a-b27f-4437-829e-8378d20e5a08-pc"
        },
        {
          "description": "Yaxue's Project",
          "name": "06e8d02a-b27f-4437-829e-8378d20e5a08-po"
        },
        {
          "description": "FABRIC Staff",
          "name": "990d8a8b-7e50-4d13-a3be-0f133ffa8653-pm"
        },
        {
          "description": "Laura's UI/Teaching Project",
          "name": "d66ce3fa-041f-4d08-a8ca-c886c30c468a-pm"
        },
        {
          "description": "Active Users of FABRIC - initially set by enrollment workflow",
          "name": "fabric-active-users"
        },
        {
          "description": "Jupyterhub access - based on project participation",
          "name": "Jupyterhub"
        },
        {
          "description": "Portal Administrators for FABRIC",
          "name": "portal-admins"
        },
        {
          "description": "Project Leads for FABRIC",
          "name": "project-leads"
        }
      ],
      "sshkeys": [
        {
          "comment": "yaxue-test-sliver-key",
          "created_on": "2022-06-08 15:28:51.592639+00:00",
          "description": "yaxue-test-sliver-key",
          "expires_on": "2024-06-07 15:28:51.592639+00:00",
          "fabric_key_type": "sliver",
          "fingerprint": "MD5:67:ac:e4:f7:4e:f2:62:86:e3:b8:c1:a5:15:68:b2:2e",
          "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBFkGY7pH/am+gMVDYK5RKP/+jCXUhlWWVZ3UCZcEK1WmIEpPXf8I8vk5tyNsNFKk9dkBpaHqrFQd6QgOwxzwiMM=",
          "ssh_key_type": "ecdsa-sha2-nistp256",
          "uuid": "e53083f8-b4b9-4c06-a282-ce0a080cd2a4"
        },
        {
          "comment": "yaxue-key-sliver",
          "created_on": "2022-09-20 17:03:08.780276+00:00",
          "description": "yaxue-key-sliver",
          "expires_on": "2024-09-19 17:03:08.780304+00:00",
          "fabric_key_type": "sliver",
          "fingerprint": "MD5:02:8b:3d:7d:68:93:9a:ef:78:b9:3f:01:fe:2f:5a:e1",
          "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBETrjGgRMKqvwE5UFqnJZ88SR2IweNGjHJ73HovkZlaGtT9PHIq3sqmqMUmKI56lN5/WyFcWkqkCQW1d8lhg97E=",
          "ssh_key_type": "ecdsa-sha2-nistp256",
          "uuid": "92484012-92b3-4a68-89c6-e6b0e5ccd8b5"
        }
      ],
      "uuid": "6744e0c2-745b-4f41-9746-deb039fb00a0"
    }
    const keys = [
      {
        "comment": "test-key-2",
        "created_on": "2022-03-07 16:44:24.561642+00:00",
        "description": "test-key-2",
        "expires_on": "2022-09-03 16:44:24.561642+00:00",
        "fabric_key_type": "bastion",
        "fingerprint": "MD5:12:8f:d1:3b:fd:99:dd:ae:82:4e:63:ad:9a:a8:13:dc",
        "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOqO1UeayVE0i5CWtc6zKPaJGZodLggJZX8wZL6OMxevsWYZSGjFhWwlhbb4cl6yNTm73Pq6nUpvVeA/DDHFKRc=",
        "ssh_key_type": "ecdsa-sha2-nistp256",
        "uuid": "67b9eb36-0136-49e2-8cb1-5fbb73db1a1c"
      },
      {
        "comment": "Yaxue-key",
        "created_on": "2022-06-08 15:21:55.141489+00:00",
        "description": "Yaxue-key",
        "expires_on": "2024-06-07 15:21:55.141489+00:00",
        "fabric_key_type": "sliver",
        "fingerprint": "MD5:6a:6a:28:c7:35:0d:0c:ed:26:49:57:cd:fc:c6:be:85",
        "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBA5KiJ3EY/hkI6aZUlA54xaXXfVbBQx9Ibz5+5T75mGFiTokMYwc7xYODyfZZk8MgfAS4p65YTuhlkUVypuwTLw=",
        "ssh_key_type": "ecdsa-sha2-nistp256",
        "uuid": "343dabb8-99e9-49a7-8ed7-539126d363e9"
      },
      {
        "comment": "yaxue-test-sliver-key",
        "created_on": "2022-06-08 15:28:26.357921+00:00",
        "description": "yaxue-test-sliver-key",
        "expires_on": "2024-06-07 15:28:26.357921+00:00",
        "fabric_key_type": "sliver",
        "fingerprint": "MD5:67:ac:e4:f7:4e:f2:62:86:e3:b8:c1:a5:15:68:b2:2e",
        "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBFkGY7pH/am+gMVDYK5RKP/+jCXUhlWWVZ3UCZcEK1WmIEpPXf8I8vk5tyNsNFKk9dkBpaHqrFQd6QgOwxzwiMM=",
        "ssh_key_type": "ecdsa-sha2-nistp256",
        "uuid": "82356417-3d63-4b88-be2e-c3d3ecbdb5cb"
      }
    ]

    this.setState({ user, keys });
  }

  // async componentDidMount(){
  //   try {
  //     const { data: res1 } = await getCurrentUser();
  //     const user = res1.results[0];
  //     const { data: res2 } = await getActiveKeys();
  //     const keys = res2.results;
  //     this.setState({ user, keys });
  //   } catch (err) { 
  //     toast.error("Failed to load user information. Please re-login.");
  //   }
  // }

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
