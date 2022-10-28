import React from "react";
import Joi from "joi-browser";
import Form from "../common/Form/Form";
import SpinnerWithText from "../common/SpinnerWithText";
import AccountInfo from "./AccountInfo";
import { getCurrentUser, updatePeopleProfile, updatePeoplePreference } from "../../services/peopleService.js";
import { toast } from "react-toastify";

class MyProfile extends Form {
  state = {
    data: {
      bio: "",
      pronouns: "",
      job: "",
      website: "",
      allOptions: [
        "show_email",
        "show_eppn",
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
      "show_eppn",
      "show_roles",
      "show_sshkeys",
      "show_bio",
      "show_pronouns",
      "show_job",
      "show_website"
    ],
    user: {},
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

  async componentDidMount () {
    try {
      const { data: res } = await getCurrentUser();
      const user = res.results[0];
      const profile = {
        bio: user.profile.bio,
        pronouns: user.profile.pronouns,
        job: user.profile.job,
        website: user.profile.website,
        allOptions: [
          "show_email",
          "show_eppn",
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
      await updatePeoplePreference(user.uuid, parsedPreferences[0]);
      await updatePeopleProfile(user.uuid, data, parsedPreferences[1]);
      const { data: res } = await getCurrentUser();
      const updatedUser = res.results[0];
      const profile = {
        bio: updatedUser.profile.bio,
        pronouns: updatedUser.profile.pronouns,
        job: updatedUser.profile.job,
        website: updatedUser.profile.website,
        allOptions: [
          "show_email",
          "show_eppn",
          "show_roles",
          "show_sshkeys",
          "show_bio",
          "show_pronouns",
          "show_job",
          "show_website"
        ],
        selectedOptions: Object.keys(updatedUser.profile.preferences).filter(key => 
          updatedUser.profile.preferences[key] && this.state.allOptions.includes(key)).concat(
            Object.keys(user.preferences).filter(key =>
              user.preferences[key] && this.state.allOptions.includes(key))
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
    const { showSpinner, user } = this.state;
    
    return (
      <div className="col-9">
        <h1>My Profile</h1>
        {
          showSpinner ? <SpinnerWithText text={"Updating profile..."} /> :
          <form onSubmit={this.handleSubmit}>
            {this.renderTextarea("bio", "Bio", true)}
            {this.renderInput("pronouns", "Pronouns", true)}
            {this.renderInput("job", "Job Title", true)}
            {this.renderInput("website", "Website", true)}
            {this.renderInputCheckBoxes("preferences", "Privacy Preferences", true)}
            {this.renderButton("Save")}
          </form>
        }
        <AccountInfo user={user} />
      </div>
    );
  }
}

export default MyProfile;