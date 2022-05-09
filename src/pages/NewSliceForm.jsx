import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { toast } from "react-toastify";
import ProjectTags from "../components/SliceViewer/ProjectTags";
import SideNodes from '../components/SliceViewer/SideNodes';
import SideLinks from '../components/SliceViewer/SideLinks';
import Graph from '../components/SliceViewer/Graph';
import NewSliceDetailForm from '../components/SliceViewer/NewSliceDetailForm';
import sliceParser from "../services/parser/sliceParser.js";
import builder from "../utils/sliceBuilder.js";
import editor from "../utils/sliceEditor.js";
import SpinnerWithText from "../components/common/SpinnerWithText";
import Calendar from "../components/common/Calendar";

import { sitesNameMapping }  from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import { getResources } from "../services/resourcesService.js";
import { createSlice } from "../services/orchestratorService.js";
import { autoCreateTokens, autoRefreshTokens } from "../utils/manageTokens";
import { getActiveKeys } from "../services/sshKeyService";

class NewSliceForm extends React.Component {
  state = {
    sliceName: "",
    sshKey: "",
    leaseEndTime: "",
    errors: {},
    ancronymToName: sitesNameMapping.ancronymToName,
    graphID: "",
    sliceNodes: [],
    sliceLinks: [],
    selectedData: null,
    parsedResources: null,
    selectedCPs: [],
    showResourceSpinner: false,
    sliverKeys: [],
    projectIdToGenerateToken: {},
  }

  async componentDidMount() {
    // Show spinner in SideNodes when loading resources
    this.setState({ showResourceSpinner: true });

    try {
      const { data: resources } = await getResources();
      const { data: keys } = await getActiveKeys();
      const parsedObj = sitesParser(resources, this.state.ancronymToName);
      this.setState({ 
        parsedResources: parsedObj,
        showResourceSpinner: false,
        sliverKeys: keys.filter(k => k.fabric_key_type === "sliver"),
      });
    } catch (ex) {
      toast.error("Failed to load resource/ sliver key/ project information. Please reload this page.");
    }
    // generate a graph uuid for the new slice
    this.setState({ graphID: uuidv4() });
  }

  handleProjectChange = (uuid) => {
    this.setState({ projectIdToGenerateToken: uuid });
  }

  handleSliceNameChange = (e) => {
    this.setState({ sliceName: e.target.value });
  }

  handleKeyChange = (e) => {
    this.setState({ sshKey: e.target.value });
  }

  handleTimeChange = (value) => {
    this.setState({ leaseEndTime: value });
  }

  generateSliceJSON = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    const requestBody = JSON.stringify(sliceJSON);
    console.log("sliceJSON");
    console.log(sliceJSON);
    console.log(requestBody);

    return requestBody;
  }

  generateGraphElements = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    let elements = sliceParser(sliceJSON, "new");
    return elements;
  }

  handleSaveDraft = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    localStorage.setItem("sliceDraft", JSON.stringify(sliceJSON));

    // Toast a successly saved message
    toast.success("The slice draft is successfully saved in your browser.");
  }

  handleUseDraft = () => {
    const sliceDraft = JSON.parse(localStorage.getItem("sliceDraft"));
    this.setState({ sliceNodes: sliceDraft.nodes, sliceLinks: sliceDraft.links });
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

  handleNodeDelete = (data) => {
    const { sliceNodes, sliceLinks } =  this.state;
    const { newSliceNodes, newSliceLinks } = editor.removeNode(data, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks});
  }

  handleNodeAdd = (type, site, name, core, ram, disk, image, sliceComponents) => {
    const { graphID, sliceNodes, sliceLinks } =  this.state;

    const node = {
      "type": type,
      "site": site,
      "name": name,
      "capacities": {
        "core": core,
        "ram": ram,
        "disk": disk,
      },
      "image": image
    };

    if (type === "VM") {
      const { newSliceNodes, newSliceLinks} = builder.addVM(node, sliceComponents, graphID, sliceNodes, sliceLinks);
      this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks});
    }
  }

  handleLinkAdd = (type, name) => {
    const { selectedCPs, graphID, sliceNodes, sliceLinks } =  this.state;
    const { newSliceNodes, newSliceLinks} = builder.addLink(type, name, selectedCPs, graphID, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks, selectedCPs: [] });
  }

  handleVMUpdate = (data) => {
    // data: vm_id, new_name and new_capacities
    const updated_nodes = editor.updateVM(data, this.state.sliceNodes);
    this.setState({ sliceNodes: updated_nodes });
    toast.success("VM updated successfully.")
  }

  handleSingleComponentAdd = (data) => {
    const vm_id = parseInt(this.state.selectedData.id);
    const vm_node = this.state.sliceNodes.filter(node => node.id === vm_id)[0];

    const node = {
      "type": vm_node.Type,
      "site": vm_node.Site,
      "name": vm_node.Name,
    };

    // data example: {type: 'SmartNIC', name: 'nic1', model: 'ConnectX-6'}
    // Add component data to the selected VM.
    const component_node_id = builder.generateID(this.state.sliceNodes);
    const component_link_id = builder.generateID(this.state.sliceLinks)
    const [nodes, links] = builder.addComponent(node, data, this.state.graphID, parseInt(this.state.selectedData.id), component_node_id, component_link_id);

    const clonedNodes = _.clone(this.state.sliceNodes);
    const clonedLinks = _.clone(this.state.sliceLinks);

    for (const node of nodes) {
      clonedNodes.push(node);
    }
    for (const link of links) {
      clonedLinks.push(link);
    }

    this.setState({ sliceNodes: clonedNodes, sliceLinks: clonedLinks });
  }

  handleCreateSlice = async () => {
    const requestData = {
      name: this.state.sliceName,
      sshKey: this.state.sshKey,
      leaseEndTime: this.state.leaseEndTime,
      json: this.generateSliceJSON()
    }

    try {
      // re-create token using user's choice of project
      autoCreateTokens(this.state.projectIdToGenerateToken).then(async () => {
        const { data: slice } = await createSlice(requestData);
        console.log("new generated slice: ");
        console.log(slice);
      })
    } catch (err) {
      console.log("failed to create the slice: " + err.response.data);
      toast.error("Failed to create the slice");
    }
  };

  render() {
    const { sshKey, sliverKeys, selectedData,
      parsedResources, sliceNodes, sliceLinks, selectedCPs, showResourceSpinner } 
    = this.state;

    return (
    <div>
      <div className="d-flex flex-row justify-content-between mt-2">
        <h2 className="ml-5 my-2 align-self-start">New Slice</h2>
        <Link to="/experiments#slices" className="align-self-end mr-5">
          <button
            className="btn btn-sm btn-outline-primary my-3"
          >
            <i className="fa fa-sign-in mr-2"></i>
            Back to Slice List
          </button>
        </Link>
      </div>
      <div className="d-flex flex-column align-items-center w-100">
        <div className="d-flex flex-row justify-content-center w-100 mx-5">
          <div className="d-flex flex-column w-35 ml-5">
            <div className="card new-slice-upper-card">
              <div className="card-header py-1">
                <button className="btn btn-link">
                  Step 1: Select Project 
                </button>
              </div>
              <div>
                <div className="card-body">
                  <ProjectTags onProjectChange={this.handleProjectChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column w-65 mr-5">
            <div className="card new-slice-upper-card">
              <div className="card-header py-1">
                <button className="btn btn-link">
                  Step 2: Input Slice Information
                </button>
              </div>
              <div>
                <div className="card-body">
                  <div className="d-flex flex-column">
                    <form className="w-100">
                      <div className="form-group col-md-12">
                        <label htmlFor="inputSliceName" className="slice-form-label">Slice Name</label>
                        <input  className="form-control form-control-sm" onChange={this.handleSliceNameChange}/>
                      </div>
                      <div className="form-group col-md-12">
                        <label htmlFor="inputSSHKey" className="slice-form-label">SSH Key</label>
                        {
                          sliverKeys.length > 0 && 
                            <select
                              className="form-control form-control-sm"
                              value={sshKey}
                              onChange={this.handleKeyChange}
                            >
                              <option value="">Choose...</option>
                              {
                                sliverKeys.map(key => 
                                  <option value={key.public_key} key={`sliverkey-${key.comment}`}>{key.comment}</option>
                                )
                              }
                            </select>
                        }
                        {
                          sliverKeys.length === 0 && 
                          <div className="sm-alert alert-warning" role="alert">
                            Please generate or upload a sliver key from Experiments - Manage SSH Keys page first.
                          </div>
                        }
                      </div>
                      <div className="form-group col-md-12">
                        <label htmlFor="inputLeaseEndTime" className="slice-form-label">Lease End Time</label>
                        <Calendar className="date-time-picker-control" onTimeChange={this.handleTimeChange} />
                      </div>
                      <div className="form-group col-md-12 d-flex flex-row">
                        <button
                          className="btn btn-sm btn-success ml-auto"
                          type="button"
                          onClick={() => this.handleCreateSlice()}
                        >
                          Create Slice
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-center mb-4 w-100 mx-5">
          <div className="d-flex flex-column w-35 ml-5">
            <div className="card">
              <div className="card-header py-1">
                <button className="btn btn-link">
                  Step 3: Add Nodes and Components
                </button>
              </div>
              <div>
                <div className="card-body">
                  {
                    showResourceSpinner && <SpinnerWithText text={"Loading site resources..."}/>
                  }
                  {
                    !showResourceSpinner && 
                    <SideNodes
                      resources={parsedResources}
                      nodes={sliceNodes}
                      onNodeAdd={this.handleNodeAdd}
                    />
                  }
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header py-1">
                <button className="btn btn-link">
                  Step 4: Add Network Service
                </button>
              </div>
              <div>
                <div className="card-body">
                <SideLinks
                  nodes={sliceNodes}
                  selectedCPs={selectedCPs}
                  onLinkAdd={this.handleLinkAdd}
                  onCPRemove={this.handleCPRemove}
                />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column w-65 mr-5">
            <NewSliceDetailForm
              data={selectedData}
              selectedCPs={selectedCPs}
              nodes={sliceNodes}
              links={sliceLinks}
              onConnectionPointSelect={this.handleCPAdd}
              onNodeDelete={this.handleNodeDelete}
              onVMUpdate={this.handleVMUpdate}
              onSingleComponentAdd={this.handleSingleComponentAdd}
            />
            <Graph
              className="align-self-end"
              isNewSlice={true}
              elements={this.generateGraphElements()}
              layout={{name: 'fcose'}}
              sliceName={"new-slice"}
              defaultSize={{"width": 0.55, "height": 0.75, "zoom": 1}}
              onNodeSelect={this.handleNodeSelect}
              onSaveDraft={this.handleSaveDraft}
              onUseDraft={this.handleUseDraft}
            />
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default NewSliceForm;