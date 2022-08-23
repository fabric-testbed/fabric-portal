import React from "react";
import Joi from "joi-browser";
import Form from "../common/Form";

class MyProfile extends Form {
  state = {
    data: {
      bio: "",
      pronouns: "",
      job: "",
    },
    pronounsOptions: [
      { "_id": 1, "name": "She/her"},
      { "_id": 2, "name": "He/him"},
      { "_id": 3, "name": "They/them"},
    ],
    errors: {},
  }

  schema = {
    bio: Joi.string().allow("").label("Bio"),
    pronouns: Joi.string().allow("").label("Pronouns"),
    job: Joi.string().allow("").label("Job Title"),
  };

  mapToViewModel() {
    let profile = this.props.user.profile;
    
    return {
      bio: profile.bio,
      pronouns: profile.pronouns,
      job: profile.job,
    };
  }

  doSubmit = () => {
    const { data } = this.state;
    this.props.onProfileUpdate(data);
  };

  render() {
    const { pronounsOptions } = this.state;
    
    return (
      <div className="col-9">
        <h1>My Profile</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("bio", "Bio", true)}
          {this.renderSelect("pronouns", "Pronouns", true, "", pronounsOptions)}
          {this.renderInput("job", "Job Title", true)}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MyProfile;