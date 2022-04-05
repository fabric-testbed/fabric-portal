import React from "react";
import Joi from "joi-browser";
import Form from "../components/common/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { sitesNameMapping }  from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import { getResources } from "../services/fakeResources.js";
import { createSlice } from "../services/orchestratorService.js";
import SideToolbar from '../components/SliceViewer/SideToolbar';
import Graph from '../components/SliceViewer/Graph';
import DetailForm from '../components/SliceViewer/DetailForm';


class NewSliceForm extends Form {
  state = {
    data: {
      name: "",
      sshKey: "",
      leaseEndTime: "",
      graphml: "",
    },
    errors: {},
    nameToAcronym: sitesNameMapping.nameToAcronym,
    ancronymToName: sitesNameMapping.ancronymToName,
    elements: [],
    slice: {
      "graph_id": "",
      "lease_end": "",
      "slice_id": "",
      "slice_model": "",
      "slice_name": "Slice Viewer",
      "slice_state": "StableOK"
    },
    selectedData: null,
    parsedResources: null,
  }

  componentDidMount() {
    const resources = getResources();
    const parsedObj = sitesParser(resources, this.state.ancronymToName);
    this.setState({ parsedResources: parsedObj });
    console.log(parsedObj);
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
    const { slice, elements, selectedData, parsedResources } = this.state;

    return (
      <div className="w-100 d-flex flex-column">
        <div className="w-50 align-self-center my-4">
          <h1>New Slice</h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name*", true)}
            {this.renderTextarea("sshKey", "SSH Key*", true)}
            {this.renderInput("leaseEndTime", "Lease End Time (Format: %Y-%m-%d %H:%M:%S e.g. 2022-04-01 15:16:12)", true)}
            {this.renderTextarea("graphml", "Graphml*", true)}
            {this.renderButton("Create")}
          </form>
        </div>
        <div className="d-flex flex-row justify-content-center">
          <SideToolbar
            className="align-self-start"
            resources={parsedResources}
            onNodeAdd={this.handleNodeAdd}
          />
          <Graph
            className="align-self-end"
            elements={elements}
            sliceName={slice.slice_name}
          />
        </div>
      </div>
    )
  }
}

export default NewSliceForm;