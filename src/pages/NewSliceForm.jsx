import React from "react";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { toast } from "react-toastify";
import SideNodes from '../components/SliceViewer/SideNodes';
import SideLinks from '../components/SliceViewer/SideLinks';
import Graph from '../components/SliceViewer/Graph';
import NewSliceDetailForm from '../components/SliceViewer/NewSliceDetailForm';
import sliceParser from "../services/parser/sliceParser.js";
import builder from "../utils/sliceBuilder.js";
import editor from "../utils/sliceEditor.js";
import Spinner from 'react-bootstrap/Spinner';

import { sitesNameMapping }  from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import { getResources } from "../services/resourcesService.js";
import { createSlice } from "../services/orchestratorService.js";
import { autoCreateTokens, autoRefreshTokens } from "../utils/manageTokens";
import { getCurrentUser } from "../services/prPeopleService.js";

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
  }

  async componentDidMount() {
    // Show spinner in SideNodes when loading resources
    this.setState({ showResourceSpinner: true });

    try {
      const { data } = await getResources();
      const parsedObj = sitesParser(data, this.state.ancronymToName);
      this.setState({ parsedResources: parsedObj, showResourceSpinner: false });
      // generate a graph uuid for the new slice
      this.setState({ graphID: uuidv4() });
    } catch (ex) {
      toast.error("Failed to load resource information. Please reload this page.");
    }
  }

  handleSliceNameChange = (e) => {
    this.setState({ sliceName: e.target.value });
  }

  handleKeyChange = (e) => {
    this.setState({ sshKey: e.target.value });
  }

  handleTimeChange = (e) => {
    this.setState({ leaseEndTime: e.target.value });
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
    console.log("sliceJSON");
    console.log(sliceJSON);
    console.log(JSON.stringify(sliceJSON));
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
      json: this.generateGraphElements()
    }
    // call PR first to check if the user has project.
    try {
      const { data: people } = await getCurrentUser();
      if (people.projects.length === 0) {
        this.setState({ hasProject: false, showSpinner: false });
      } else {
      // call credential manager to generate tokens 
      // if nothing found in browser storage
      if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
        autoCreateTokens(people.projects[0].uuid).then(async () => {
        const { data } = await createSlice(requestData);
        this.setState({ slices: data["value"]["slices"], showSpinner: false });
      });
      } else {
        // the token has been stored in the browser and is ready to be used.
          try {
            const { data } = await createSlice(requestData);
            this.setState({ slices: data["value"]["slices"], showSpinner: false, });
          } catch(err) {
            console.log("failed to create the slice: " + err.response.data);
            toast.error("Failed to create the slice");
            this.props.history.push("/slices");
            if (err.response.status === 401) {
              // 401 Error: Provided token is not valid.
              // refresh the token by calling credential manager refresh_token.
              autoRefreshTokens(people.projects[0].uuid);
            }
          }
        }
      }
    } catch (ex) {
      toast.error("Failed to load user information. Please reload this page.");
      console.log("Failed to load user information: " + ex.response.data);
    }
  };

  render() {
    const { selectedData, parsedResources, sliceNodes, sliceLinks, selectedCPs, showResourceSpinner } = this.state;

    return (
      <div className="d-flex flex-column align-items-center w-100">
        <div className="d-flex flex-row justify-content-center mt-2 w-100">
          <form className="w-100 mx-5">
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="inputSliceName" className="slice-form-label">Slice Name</label>
                <input className="form-control" onChange={this.handleSliceNameChange}/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputSSHKey" className="slice-form-label">SSH Key</label>
                <input className="form-control" onChange={this.handleKeyChange}/>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="inputLeaseEndTime" className="slice-form-label">Lease End Time</label>
                <input className="form-control" onChange={this.handleTimeChange}/>
              </div>
              <div className="form-group col-md-2 d-flex flex-row">
                <button
                  className="btn btn-success mt-4 ml-auto"
                  type="button"
                  onClick={() => this.handleCreateSlice()}
                >
                  Create Slice
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="d-flex flex-row justify-content-center mb-4 w-100 mx-5">
          <div className="d-flex flex-column w-40 ml-5">
            <div className="card">
              <div className="card-header py-1">
                <button className="btn btn-link">
                  Step 1: Add Nodes and Components
                </button>
              </div>
              <div>
                <div className="card-body">
                  {
                    showResourceSpinner && 
                    <div className="d-flex flex-row justify-content-center my-5">
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        variant="primary"
                      />
                      <span className="text-primary ml-2"><b>Loading site information...</b></span>
                    </div>
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
                  Step 2: Add Network Service
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
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success mb-2"
                type="button"
                onClick={() => this.handleSaveDraft()}
              >
                Save Draft
              </button>
              <button
                className="btn btn-sm btn-success mb-2 ml-2"
                type="button"
                onClick={() => this.handleUseDraft()}
              >
                Use Draft
              </button>
            </div>
          </div>
          <div className="d-flex flex-column w-60 mr-5">
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
              defaultSize={{"width": 0.6, "height": 0.75, "zoom": 1}}
              onNodeSelect={this.handleNodeSelect}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default NewSliceForm;