import React from "react";
import Joi from "joi-browser";
import Form from "../components/common/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { createSlice } from "../services/orchestratorService.js";

class NewSliceForm extends Form {
  state = {
    data: {
      name: "",
      sshKey: "",
      leaseEndTime: "",
      graphml: "",
    },
    errors: {},
  }

  schema = {
    name: Joi.string().required().label("Name"),
    sshKey: Joi.string().required().label("SSH Key"),
    leaseEndTime: Joi.date().min("now").label("Lease End Time"),
    graphml: Joi.string().required().label("Graphml"),
  };

  doSubmit = async () => {
    try {
      await createSlice(this.state.data);
    }
    catch (ex) {
      console.log("failed to create the slice: " + ex.response.data);
      toast.error("Failed to create the slice");
      this.props.history.push("/slices");
    }
  };

  render() {
    return (
      <div className="container">
        <h1>New Slice</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name*", true)}
          {this.renderTextarea("sshKey", "SSH Key*", true)}
          {this.renderInput("leaseEndTime", "Lease End Time (Format: %Y-%m-%d %H:%M:%S e.g. 2022-04-01 15:16:12)", true)}
          {this.renderTextarea("graphml", "Graphml*", true)}
          {this.renderButton("Create")}
        </form>
      </div>
    )
  }
}

export default NewSliceForm;