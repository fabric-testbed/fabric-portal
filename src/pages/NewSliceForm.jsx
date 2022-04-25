import React from "react";
import { v4 as uuidv4 } from 'uuid';
import Joi from "joi-browser";
import _ from "lodash";
import Form from "../components/common/Form";
import { toast } from "react-toastify";
import { sitesNameMapping }  from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import  { getResources } from "../services/fakeResources.js";
import { createSlice } from "../services/orchestratorService.js";
import SideToolbar from '../components/SliceViewer/SideToolbar';
import Graph from '../components/SliceViewer/Graph';
import NewSliceDetailForm from '../components/SliceViewer/NewSliceDetailForm';
import sliceParser from "../services/parser/sliceParser.js";
import builder from "../utils/sliceBuilder.js";

class NewSliceForm extends Form {
  state = {
    data: {
      name: "",
      sshKey: "",
      leaseEndTime: "",
      graphml: "",
    },
    errors: {},
    ancronymToName: sitesNameMapping.ancronymToName,
    graphID: "",
    sliceNodes: [],
    sliceLinks: [],
    selectedData: null,
    parsedResources: null,
    selectedCPs: [],
  }

  componentDidMount() {
    const resources = getResources();
    const parsedObj = sitesParser(resources, this.state.ancronymToName);
    this.setState({ parsedResources: parsedObj });

    // generate a graph uuid for the new slice
    this.setState({ graphID: uuidv4() });
  }

  schema = {
    name: Joi.string().required().label("Slice Name"),
    sshKey: Joi.string().required().label("SSH Key"),
    leaseEndTime: Joi.date().min("now").label("Lease End Time"),
    graphml: Joi.string().required().label("Graphml"),
  };

  generateGraphElements = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    let elements = sliceParser(sliceJSON, "new");
    console.log("sliceJSON");
    console.log(sliceJSON);
    return elements;
  }

  handleNodeSelect = (selectedData) => {
    this.setState({ selectedData });
  }

  handleCPAdd = (cp) => {
    const cloned_selectedCPs = _.clone(this.state.selectedCPs);
    cloned_selectedCPs.push(cp);
    this.setState({ selectedCPs: cloned_selectedCPs});
  }

  handleCPRemove = (cp_id) => {
    const updatedSelectedCPs = [];
    for (const cp of this.state.selectedCPs) {
      if (cp.id !== cp_id)
      updatedSelectedCPs.push(cp);
    }
    this.setState({ selectedCPs: updatedSelectedCPs });
  }

  handleNodeAdd = (type, site, name, core, ram, disk, sliceComponents) => {
    const { graphID, sliceNodes, sliceLinks } =  this.state;

    const node = {
      "type": type,
      "site": site,
      "name": name,
      "capacities": {
        "core": core,
        "ram": ram,
        "disk": disk,
      }
    };

    if (type === "VM") {
      const { newSliceNodes, newSliceLinks} = builder.addVM(node, sliceComponents[0], graphID, sliceNodes, sliceLinks);
      this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks});
    }
  }

  handleLinkAdd = (type, name) => {
    const { selectedCPs, graphID, sliceNodes, sliceLinks } =  this.state;
    const { newSliceNodes, newSliceLinks} = builder.addLink(type, name, selectedCPs, graphID, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks, selectedCPs: [] });
  }

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
    const { selectedData, parsedResources, sliceNodes, sliceLinks, selectedCPs } = this.state;

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="new-slice-form align-self-center mt-4">
          <form onSubmit={this.handleSubmit}>
            <div className="form-row d-flex align-items-center">
              <div className="col-md-3">{this.renderInput("name", "Slice Name*", true)}</div>
              <div className="col-md-4">{this.renderInput("sshKey", "SSH Key*", true)}</div>
              <div className="col-md-3">{this.renderInput("leaseEndTime", "Lease End Time", true)}</div>
              <div className="col-md-2 pt-3 d-flex flex-row">
                <span className="ml-auto">{this.renderButton("Create Slice")}</span>
              </div>
            </div>
          </form>
        </div>
        <div className="d-flex flex-row justify-content-center mb-4">
          <SideToolbar
            className="align-self-start"
            resources={parsedResources}
            nodes={sliceNodes}
            selectedCPs={selectedCPs}
            onNodeAdd={this.handleNodeAdd}
            onLinkAdd={this.handleLinkAdd}
            onCPRemove={this.handleCPRemove}
          />
          <div className="d-flex flex-column">
            <NewSliceDetailForm
              data={selectedData}
              onConnectionPointSelect={this.handleCPAdd}
            />
            <Graph
              className="align-self-end"
              elements={this.generateGraphElements()}
              sliceName={"new-slice"}
              defaultSize={{"width": 0.5, "height": 0.75, "zoom": 0.75}}
              onNodeSelect={this.handleNodeSelect}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default NewSliceForm;