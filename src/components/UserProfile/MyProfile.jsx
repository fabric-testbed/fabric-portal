import React from "react";
import Joi from "joi-browser";
import { default as portalData } from "../../services/portalData.json";
import Form from "../common/Form/Form";
import SpinnerWithText from "../common/SpinnerWithText";
import AccountInfo from "./AccountInfo";
import OtherIdentity from "./OtherIdentity.jsx";
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
      receive_promotional_email: "Yes",
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
    other_identities: [],
    user: {
      email: "",
      email_addresses: []
    },
    errors: {},
    showSpinner: false,
    staticInfoRows: [
      { display: "Affiliation", field: "affiliation" },
      { display: "FABRIC ID", field: "fabric_id" },
      { display: "Bastion Login", field: "bastion_login" },
      { display: "UUID", field: "uuid" },
      { display: "CILogon ID", field: "cilogon_id"},
    ]
  }

  async componentDidMount () {
    try {
      const { data: res } = await getCurrentUser();
      const user = res.results[0];
      const profile = {
        name: user.name,
        email: user.email,
        bio: user.profile.bio,
        pronouns: user.profile.pronouns,
        job: user.profile.job,
        receive_promotional_email: user.receive_promotional_email ? "Yes" : "No",
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
    } catch (err) { 
      toast.error("Failed to load user information. Please re-login.");
    }
  }

  schema = {
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Preferred Email"),
    bio: Joi.string().allow("").label("Bio"),
    pronouns: Joi.string().allow("").label("Pronouns"),
    job: Joi.string().allow("").label("Job Title"),
    website: Joi.string().allow("").label("Website"),
    receive_promotional_email: Joi.string().required().label("Receive Promotional Email"),
    allOptions: Joi.array(),
    selectedOptions: Joi.array()
  };

  parsePreferences = () => {
    // from array of ["show_bio", "show_website", ...]
    // to object { "show_bio": true, "show_website": true } 
    // true for the existing items in array, others false.
    const preferenceType1 = ["show_email","show_roles", "show_sshkeys"];
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

  handleIdentityUpdate = (operation, identity) => {
    const identities = this.state.other_identities;
    if (operation === "add") {
      identities.push(identity);
      this.setState({ other_identities: identities })
    } else if (operation === "remove") {
      const new_identities = [];
      for (const i of this.state.other_identities) {
        if (JSON.stringify(i) !== JSON.stringify(identity)) {
          new_identities.push(i);
        }
      }
      this.setState({ other_identities: new_identities })
    }
  }

  handleUpdateUser = async () => {
    this.setState({ showSpinner: true });
    const { data, user, other_identities } = this.state;
    try {
      const parsedPreferences = this.parsePreferences();
      await updatePeoplePreference(user.uuid, data, parsedPreferences[0]);
      await updatePeopleProfile(user.uuid, data, parsedPreferences[1], other_identities);
      const { data: res } = await getCurrentUser();
      const updatedUser = res.results[0];
      const profile = {
        name: updatedUser.name,
        email: updatedUser.email,
        receive_promotional_email: updatedUser.receive_promotional_email ? "Yes" : "No",
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
    const { showSpinner, user, optionsDisplayMapping, other_identities } = this.state;
    
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
            {
              this.renderSelect("receive_promotional_email", "Receive Promotional Email", 
                true, "Yes", ["Yes", "No"])
            }
          </form>
        }
        <OtherIdentity
          other_identities={other_identities}
          onIdentityUpdate={this.handleIdentityUpdate}
        />
        <button
          className="btn btn-md btn-primary mt-3"
          onClick={() => this.handleUpdateUser}
        >
          Save
        </button>
        <AccountInfo user={user} />
      </div>
    );
  }
}

export default MyProfile;