import React from "react";
import SpinnerWithText from "../common/SpinnerWithText";
import { getCurrentUser, updatePeopleProfile } from "../../services/peopleService.js";
import { toast } from "react-toastify";

class Preferences {
  state = {
    data: {
      bio: "",
      pronouns: "",
      job: "",
      website: ""
    },
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
      }
      this.setState({ data: profile, user });
    } catch (err) { 
      toast.error("Failed to load user information. Please re-login.");
    }
  }

  doSubmit = async () => {
    this.setState({ showSpinner: true });
    const { data, user } = this.state;
    try {
      await updatePeopleProfile(user.uuid, data);
      const { data: res } = await getCurrentUser();
      const updatedUser = res.results[0];
      const profile = {
        bio: updatedUser.profile.bio,
        pronouns: updatedUser.profile.pronouns,
        job: updatedUser.profile.job,
        website: updatedUser.profile.website,
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
            {this.renderButton("Save")}
          </form>
        }
      </div>
    );
  }
}

export default Preferences;