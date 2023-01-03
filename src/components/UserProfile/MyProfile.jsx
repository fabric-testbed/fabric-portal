import React from "react";
import Joi from "joi-browser";
import { default as portalData } from "../../services/portalData.json";
import Form from "../common/Form/Form";
import SpinnerWithText from "../common/SpinnerWithText";
import AccountInfo from "./AccountInfo";
import { getCurrentUser, updatePeopleProfile, updatePeoplePreference } from "../../services/peopleService.js";
import { toast } from "react-toastify";

class MyProfile extends Form {
  state = {
    data: {
      name: "",
      email: "",
      bio: "",
      pronouns: "",
      job: "",
      website: "",
      allOptions: [
        "show_email",
        "show_roles",
        "show_sshkeys",
        "show_bio",
        "show_pronouns",
        "show_job",
        "show_website"
      ],
      selectedOptions: []
    },
    allOptions: [
      "show_email",
      "show_roles",
      "show_sshkeys",
      "show_bio",
      "show_pronouns",
      "show_job",
      "show_website"
    ],
    optionsDisplayMapping: {
      "show_email": "Email",
      "show_roles": "Roles",
      "show_sshkeys": "SSH Keys",
      "show_bio": "Bio",
      "show_pronouns": "Pronouns",
      "show_job": "Job Title",
      "show_website": "Website"
    },
    user: {
      email: "",
      email_addresses: []
    },
    errors: {},
    showSpinner: false,
    staticInfoRows: [
      { display: "Name", field: "cilogon_name" },
      { display: "Email", field: "email" },
      { display: "Affiliation", field: "affiliation" },
      { display: "FABRIC ID", field: "fabric_id" },
      { display: "Bastion Login", field: "bastion_login" },
      { display: "EPPN", field: "eppn" },
      { display: "UUID", field: "uuid" },
      { display: "CILogon ID", field: "cilogon_id"},
    ],
  }

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

    const profile = {
      name: user.name,
      email: user.email,
      bio: user.profile.bio,
      pronouns: user.profile.pronouns,
      job: user.profile.job,
      website: user.profile.website,
      allOptions: [
        "show_email",
        "show_roles",
        "show_sshkeys",
        "show_bio",
        "show_pronouns",
        "show_job",
        "show_website"
      ],
      selectedOptions: Object.keys(user.profile.preferences).filter(key => 
        user.profile.preferences[key] && this.state.allOptions.includes(key)).concat(
          Object.keys(user.preferences).filter(key =>
            user.preferences[key] && this.state.allOptions.includes(key))
        )
    }
    this.setState({ data: profile, user });
  }

  // async componentDidMount () {
  //   try {
  //     const { data: res } = await getCurrentUser();
  //     const user = res.results[0];
  //     const profile = {
  //       name: user.name,
  //       email: user.email,
  //       bio: user.profile.bio,
  //       pronouns: user.profile.pronouns,
  //       job: user.profile.job,
  //       website: user.profile.website,
  //       allOptions: [
  //         "show_email",
  //         "show_roles",
  //         "show_sshkeys",
  //         "show_bio",
  //         "show_pronouns",
  //         "show_job",
  //         "show_website"
  //       ],
  //       selectedOptions: Object.keys(user.profile.preferences).filter(key => 
  //         user.profile.preferences[key] && this.state.allOptions.includes(key)).concat(
  //           Object.keys(user.preferences).filter(key =>
  //             user.preferences[key] && this.state.allOptions.includes(key))
  //         )
  //     }
  //     this.setState({ data: profile, user });
  //   } catch (err) { 
  //     toast.error("Failed to load user information. Please re-login.");
  //   }
  // }

  schema = {
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Preferred Email"),
    bio: Joi.string().allow("").label("Bio"),
    pronouns: Joi.string().allow("").label("Pronouns"),
    job: Joi.string().allow("").label("Job Title"),
    website: Joi.string().allow("").label("Website"),
    allOptions: Joi.array(),
    selectedOptions: Joi.array()
  };

  parsePreferences = () => {
    // from array of ["show_bio", "show_website", ...]
    // to object { "show_bio": true, "show_website": true } 
    // true for the existing items in array, others false.
    const preferenceType1 = ["show_email", "show_eppn", "show_roles", "show_sshkeys"];
    const preferenceType2 = ["show_bio", "show_pronouns", "show_job", "show_website"];

    const preferences1 = {};
    const preferences2 = {};

    for (const option of preferenceType1) {
      preferences1[option] = this.state.data.selectedOptions.includes(option);
    }

    for (const option of preferenceType2) {
      preferences2[option] = this.state.data.selectedOptions.includes(option);
    }

    return [preferences1, preferences2];
  }

  doSubmit = async () => {
    this.setState({ showSpinner: true });
    const { data, user } = this.state;
    try {
      const parsedPreferences = this.parsePreferences();
      await updatePeoplePreference(user.uuid, data, parsedPreferences[0]);
      await updatePeopleProfile(user.uuid, data, parsedPreferences[1]);
      const { data: res } = await getCurrentUser();
      const updatedUser = res.results[0];
      const profile = {
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.profile.bio,
        pronouns: updatedUser.profile.pronouns,
        job: updatedUser.profile.job,
        website: updatedUser.profile.website,
        allOptions: [
          "show_email",
          "show_roles",
          "show_sshkeys",
          "show_bio",
          "show_pronouns",
          "show_job",
          "show_website"
        ],
        selectedOptions: Object.keys(updatedUser.profile.preferences).filter(key => 
          updatedUser.profile.preferences[key] && this.state.allOptions.includes(key)).concat(
            Object.keys(updatedUser.preferences).filter(key =>
              updatedUser.preferences[key] && this.state.allOptions.includes(key))
          )
      }
      this.setState({ data: profile, user: updatedUser, showSpinner: false });
      toast.success("You've successfully updated profile.");
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to update user profile. Please try again.");
    }
  };

  render() {
    const { showSpinner, user, optionsDisplayMapping } = this.state;
    
    return (
      <div className="col-9">
        <h1>My Profile</h1>
        {
          showSpinner ? <SpinnerWithText text={"Updating profile..."} /> :
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name", true)}
            {
              this.renderSelect("email", "Preferred Email", true,
                user.email, user.email_addresses,
                portalData.helperText.preferredEmailDescription)
            }
            {this.renderTextarea("bio", "Bio", true)}
            {this.renderInput("pronouns", "Pronouns", true)}
            {this.renderInput("job", "Job Title", true)}
            {this.renderInput("website", "Website", true)}
            {
              this.renderInputCheckBoxes("preferences", "Privacy Preferences",
                true, optionsDisplayMapping,
                portalData.helperText.privacyPreferencesDescription
              )
            }
            {this.renderButton("Save")}
          </form>
        }
        <AccountInfo user={user} />
      </div>
    );
  }
}

export default MyProfile;