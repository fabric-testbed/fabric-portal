import React from "react";
import Joi from "joi-browser";
import Form from "../common/Form/Form";
import SpinnerWithText from "../common/SpinnerWithText";
import { getCurrentUser, updatePeopleProfile } from "../../services/peopleService.js";
import { toast } from "react-toastify";

class MyProfile extends Form {
  state = {
    data: {
      bio: "",
      pronouns: "",
      job: "",
      website: "",
      allOptions: ["show_bio", "show_pronouns", "show_job", "show_website"],
      selectedOptions: []
    },
    allOptions: ["show_bio", "show_pronouns", "show_job", "show_website"],
    user: {},
    errors: {},
    showSpinner: false,
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
        allOptions: ["show_bio", "show_pronouns", "show_job", "show_website"],
        selectedOptions: user.profile.preferences
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
    const preferences = {};
    for (const option of this.state.data.allOptions) {
      preferences[option] = this.state.data.selectedOptions.includes(option);
    }
    return preferences;
  }

  doSubmit = async () => {
    this.setState({ showSpinner: true });
    const { data, user } = this.state;
    try {
      await updatePeopleProfile(user.uuid, data, this.parsePreferences());
      const { data: res } = await getCurrentUser();
      const updatedUser = res.results[0];
      const profile = {
        bio: updatedUser.profile.bio,
        pronouns: updatedUser.profile.pronouns,
        job: updatedUser.profile.job,
        website: updatedUser.profile.website,
        preferences: updatedUser.profile.preferences
      }
      this.setState({ data: profile, user: updatedUser, showSpinner: false });
      toast.success("You've successfully updated profile.");
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to update user profile. Please try again.");
    }
  };

  render() {
    const { showSpinner } = this.state;
    
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
      </div>
    );
  }
}

export default MyProfile;