import React from "react";
import { v4 as uuidv4 } from 'uuid';
import Joi from "joi-browser";
import _ from "lodash";
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
import sliceParser from "../services/parser/sliceParser.js";

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
    graphID: "",
    sliceNodes: [],
    sliceLinks: [],
    selectedData: null,
    parsedResources: null,
  }

  componentDidMount() {
    const resources = getResources();
    const parsedObj = sitesParser(resources, this.state.ancronymToName);
    this.setState({ parsedResources: parsedObj });

    // generate a graph uuid for the new slice
    this.setState({ graphID: uuidv4() });
  }

  schema = {
    name: Joi.string().required().label("Name"),
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

    console.log("sliceJSON");
    console.log(sliceJSON)

    let elements = sliceParser(sliceJSON, "new");
    return elements;
  }

  handleNodeAdd = (type, site, name, core, disk, ram, component, componentName) => {
    if (type === "vm") {
      // 1. add vm
      // 2. add component
      // 3. add 'has' link between vm and component
      // 4. if componnet is NIC, add connection points and 'has' links automatically.
      const vm_node = {
        "labels": ":GraphNode:NetworkNode",
        "Class": "NetworkNode",
        "Name": name,
        "Site": site,
        "Capacities": {
          "core": core,
          "disk": disk,
          "ram": ram,
        },
        "Type": "VM",
        "id": this.state.sliceNodes.length + 1,
        "NodeID": uuidv4(),
        "GraphID": this.state.graphID
      }

      const component_node = {
        "labels": ":Component:GraphNode",
        "Class": "Component",
        "Name": componentName,
        "Capacities": {
          "unit": 1,
        },
        "Type": component,
        "id": this.state.sliceNodes.length + 2,
        "NodeID": uuidv4(),
        "GraphID": this.state.graphID
      }

      const link = {
        "label": "has",
        "Class": "has",
        "id": this.state.sliceLinks.length + 1,
        "source": this.state.sliceNodes.length + 1,
        "target": this.state.sliceNodes.length + 2,
      }

      let clonedNodes = _.clone(this.state.sliceNodes);
      clonedNodes.push(vm_node);
      clonedNodes.push(component_node);
      let clonedLinks = _.clone(this.state.sliceLinks);
      clonedLinks.push(link);

      if (component === "NIC") {
        const cp_node =   {
          "labels": ":ConnectionPoint:GraphNode",
          "Class": "ConnectionPoint",
          "Type": "SharedPort",
          "Name":  `${componentName}-p1`,
          "Capacities": {
            "unit": 1,
          },
          "id": this.state.sliceNodes.length + 3,
          "NodeID": uuidv4(),
          "GraphID": this.state.graphID
        }
        clonedNodes.push(cp_node);

        const cp_link = {
          "label": "has",
          "Class": "has",
          "id": this.state.sliceLinks.length + 2,
          "source": this.state.sliceNodes.length + 2,
          "target": this.state.sliceNodes.length + 3,
        }

        clonedLinks.push(cp_link);
      }
      this.setState({ sliceNodes: clonedNodes, sliceLinks: clonedLinks });
    }

    console.log(this.generateGraphElements())
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
    const { slice, elements, selectedData, parsedResources } = this.state;

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="new-slice-form align-self-center mt-4">
          <form onSubmit={this.handleSubmit}>
            <div class="form-row d-flex align-items-center">
              <div class="col-md-3">{this.renderInput("name", "Name*", true)}</div>
              <div class="col-md-4">{this.renderInput("sshKey", "SSH Key*", true)}</div>
              <div class="col-md-3">{this.renderInput("leaseEndTime", "Lease End Time", true)}</div>
              <div class="col-md-2 pt-3 d-flex flex-row">
                <span className="ml-auto">{this.renderButton("Create Slice")}</span>
              </div>
            </div>
          </form>
        </div>
        <div className="d-flex flex-row justify-content-center mb-4">
          <SideToolbar
            className="align-self-start"
            resources={parsedResources}
            onNodeAdd={this.handleNodeAdd}
          />
          <Graph
            className="align-self-end"
            elements={this.generateGraphElements()}
            sliceName={"new-slice"}
            defaultSize={{"width": 0.5, "height": 0.6}}
          />
        </div>
      </div>
    )
  }
}

export default NewSliceForm;