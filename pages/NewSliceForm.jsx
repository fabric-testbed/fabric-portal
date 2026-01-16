import React from "react";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import moment from 'moment';
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import withRouter from "../components/common/withRouter.jsx";
import ProjectTags from "../components/SliceViewer/ProjectTags";
import SideNodes from '../components/SliceViewer/SideNodes';
import SideLinks from '../components/SliceViewer/SideLinks';
import Graph from '../components/SliceViewer/Graph';
import NewSliceDetailForm from '../components/SliceViewer/NewSliceDetailForm';
import SpinnerWithText from "../components/common/SpinnerWithText";
import CalendarDateTime from "../components/common/CalendarDateTime.jsx";
import SliverKeyMultiSelect from "../components/SliceViewer/SliverKeyMultiSelect";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import sliceParser from "../services/parser/sliceParser.js";
import builder from "../lib/slices/sliceBuilder.js";
import editor from "../lib/slices/sliceEditor.js";
import validator from "../lib/slices/sliceValidator.js";
import { sitesNameMapping }  from "../assets/data/sites";
import sitesParser from "../services/parser/sitesParser";
import { getResources } from "../services/resourceService.js";
import { createSlice } from "../services/sliceService.js";
import { getProjectById } from "../services/projectService.js";
import { autoCreateTokens } from "../utils/manageTokens";
import { getActiveKeys } from "../services/sshKeyService";
import { default as portalData } from "../services/portalData.json";

class NewSliceForm extends React.Component {
  state = {
    sliceName: "",
    sshKey: "",
    selectedKeyIDs: [],
    leaseEndTime: "",
    leaseStartTime: "",
    showResourceSpinner: false,
    showKeySpinner: false,
    showSliceSpinner: false,
    showProjectSpinner: false,
    sliverKeys: [],
    graphID: "",
    sliceNodes: [],
    sliceLinks: [],
    selectedData: null,
    parsedResources: null,
    selectedCPs: [],
    project: {},
    projectTags: []
  }

  async componentDidMount() {
    // Show spinner in SideNodes when loading resources
    this.setState({
      showResourceSpinner: true,
      showKeySpinner: true,
      showProjectSpinner: true
    });

    try {
      const { data: resources } = await getResources(1);
      const { data: keys } = await getActiveKeys();
      const { data: projectRes } = await getProjectById(this.props.match.params.project_id);
      const parsedObj = sitesParser(resources.data[0], sitesNameMapping.acronymToShortName);

      this.setState({
        parsedResources: parsedObj,
        showResourceSpinner: false,
        sliverKeys: keys.results.filter(k => k.fabric_key_type === "sliver"),
        project: projectRes.results[0],
        projectTags: projectRes.results[0].tags,
        showKeySpinner: false,
        showProjectSpinner: false
      });
    } catch (ex) {
      toast.error("Failed to load resource/ sliver key information. Please reload this page.");
    }
    // generate a graph uuid for the new slice
    this.setState({ graphID: uuidv4() });
  }

  refreshSSHKey = async () => {
    this.setState({ showKeySpinner: true });

    try {
      const { data: keys } = await getActiveKeys();
      this.setState({ 
        sliverKeys: keys.results.filter(k => k.fabric_key_type === "sliver"),
        showKeySpinner: false
      });
    } catch (ex) {
      this.setState({ showKeySpinner: false });
      toast.error("Failed to refresh keys. Please try again later.");
    }
  }

  handleSliceNameChange = (e) => {
    this.setState({ sliceName: e.target.value });
  }


  handleKeyCheck = (keyID) => {
    const { selectedKeyIDs } = this.state;
    if (selectedKeyIDs.includes(keyID)) {
      this.setState({ selectedKeyIDs: selectedKeyIDs.filter(k => k !== keyID) });
    } else {
      this.setState({ selectedKeyIDs: [...selectedKeyIDs, keyID] });
    }
  }

  handleLeaseStartChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    this.setState({ leaseStartTime: outputTime });
  }

  handleLeaseEndChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    this.setState({ leaseEndTime: outputTime });
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

  handleSaveDraft = (toastMessage) => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    localStorage.setItem("sliceDraft", JSON.stringify(sliceJSON));

    if (toastMessage === "withMessage") {
      // Toast a successly saved message
      toast.success("The slice draft is successfully saved in your browser.");
    }
  }

  handleSaveJSON = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    var jsonBlob = new Blob([ JSON.stringify(sliceJSON) ], { type: 'application/javascript;charset=utf-8' });
    if(this.state.sliceName !== "") {
      saveAs(jsonBlob, `${this.state.sliceName}.json`);
    } else {
      saveAs(jsonBlob, `new-slice.json`);
    }
  }

  handleUseDraft = () => {
    const sliceDraft = JSON.parse(localStorage.getItem("sliceDraft"));
    this.setState({ 
      sliceNodes: sliceDraft.nodes,
      sliceLinks: sliceDraft.links,
      graphID: sliceDraft.nodes.length > 0 ? sliceDraft.nodes[0].GraphID : ""
    });
  }

  handleJsonUpload = (sliceStr) => {
    // similar to use draft
    const sliceJSON = JSON.parse(sliceStr);
    try {
      this.setState({ 
        sliceNodes: sliceJSON.nodes,
        sliceLinks: sliceJSON.links,
        graphID: sliceJSON.nodes.length > 0 ? sliceJSON.nodes[0].GraphID : ""
      });
    } catch (err) {
      toast.error("Failed to render the slice topology. Please try with a different slice JSON file.")
    }
  }

  handleClearGraph = () => {
    this.setState({ sliceNodes: [], sliceLinks: [], selectedData: null, selectedCPs: [] });
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

  handleNodeDelete = (el) => {
    const { sliceNodes, sliceLinks } =  this.state;
    const updated_nodes = [];
    const updated_links = [];
    const {to_remove_node_ids, to_remove_link_ids} = el.properties.type === "VM" ? editor.removeVM(el, sliceNodes, sliceLinks) :
      editor.removeComponent(el, sliceNodes, sliceLinks);

    
    for (const node of sliceNodes) {
      if (!to_remove_node_ids.includes(parseInt(node.id))){
        updated_nodes.push(node);
      }
    }

    for (const link of sliceLinks) {
      if (!to_remove_link_ids.includes(parseInt(link.id))){
        updated_links.push(link);
      }
    }

    // due to Cytoscape issue, force clean and update the state.
    this.setState({ sliceNodes: [], sliceLinks: [], selectedData: {} }, () => {
      this.setState({ sliceNodes: updated_nodes, sliceLinks: updated_links });
    });
  }

  handleVMAdd = (site, name, core, ram, disk, image, sliceComponents, BootScript) => {
    const { graphID, sliceNodes, sliceLinks } =  this.state;
    const node = {
      "type": "VM",
      "site": site,
      "name": name,
      "capacities": {
        "core": core,
        "ram": ram,
        "disk": disk,
      },
      "image": image,
      "BootScript": BootScript
    };
    const { newSliceNodes, newSliceLinks} = builder.addVM(node, sliceComponents, graphID, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks});
  }

  handleFacilityAdd = (site, name, bandwidth, vlan) => {
    const { graphID, sliceNodes, sliceLinks } =  this.state;
    const node = {
      "type": "Facility",
      "site": site,
      "name": name,
      "capacities": {
        "bw": bandwidth
      },
      "labels": {
        "vlan": vlan
      }
    };
    const { newSliceNodes, newSliceLinks } = builder.addFacility(node, graphID, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks});
  }

  handleSwitchAdd = (site, name) => {
    const { graphID, sliceNodes, sliceLinks } =  this.state;
    const node = {
      "type": "Switch",
      "site": site,
      "name": name
    };
    const { newSliceNodes, newSliceLinks } = builder.addSwitch(node, graphID, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks});
  }

  handleLinkAdd = (type, name) => {
    const { selectedCPs, graphID, sliceNodes, sliceLinks } =  this.state;
    const { newSliceNodes, newSliceLinks} = builder.addLink(type, name, selectedCPs, graphID, sliceNodes, sliceLinks);
    this.setState({ sliceNodes: newSliceNodes, sliceLinks: newSliceLinks, selectedCPs: [] });
  }

  handleVMUpdate = (data) => {
    // data: vm_id, new_name, new_capacities and new_boot_script
    const updated_nodes = editor.updateVM(data, this.state.sliceNodes);
    this.setState({ sliceNodes: updated_nodes });
    toast.success("VM updated successfully.")
  }

  handleFPUpdate = (data) => {
    const updated_nodes = editor.updateFP(data, this.state.sliceNodes);
    this.setState({ sliceNodes: updated_nodes });
    toast.success("Facility Port updated successfully.")
  }

  handleSingleComponentAdd = (data) => {
    const vm_id = parseInt(this.state.selectedData.id);
    const vm_node = this.state.sliceNodes.filter(node => node.id === vm_id)[0];

    const node = {
      "type": vm_node.Type,
      "site": vm_node.Site,
      "name": vm_node.Name,
    };

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

  generatePublicKeys = () => {
    const keys = [];
    const keyNames = [];
    const { selectedKeyIDs, sliverKeys} = this.state;
    for (const key of sliverKeys) {
      if (selectedKeyIDs.includes(key.uuid)) {
        keys.push(`${key.ssh_key_type} ${key.public_key} ${key.comment}`)
        keyNames.push(key.comment);
      }
    }
    return { keys, keyNames };
  }

  handleCreateSlice = async () => {
    this.handleSaveDraft("noMessage");

    const { sliceName, leaseEndTime, leaseStartTime } = this.state;
    const that = this;

    that.setState({ showSliceSpinner: true });

    let requestData = {};
    const pubKeys = this.generatePublicKeys();
    requestData = {
      name: sliceName,
      sshKeys: pubKeys.keys,
      ...(leaseEndTime) && {leaseEndTime: leaseEndTime},
      ...(leaseStartTime) && {leaseStartTime: leaseStartTime},
      json: this.generateSliceJSON(),
      sshKeyNames: pubKeys.keyNames
    }

    try {
      // re-create token using user's choice of project
      const project_id = this.props.match.params.project_id;
      autoCreateTokens(project_id).then(async () => {
        try {
          const { data: res } = await createSlice(requestData);
          toast.success("Slice creation request submitted successfully.");
          // redirect users directly to the new slice page
          const slice_id = res.data[0].slice_id;
          this.props.navigate(`/slices/${slice_id}/${project_id}`);
        } catch (ex) {
          toast.error("Failed to create slice.");
          that.setState({ showSliceSpinner: false });
        }
      })
    } catch (ex) {
      toast.error("Failed to generate token.");
    }
  };

  render() {
    const { sliceName, selectedKeyIDs, sliverKeys, selectedData,
      showKeySpinner, showResourceSpinner, showSliceSpinner, parsedResources,
      sliceNodes, sliceLinks, selectedCPs, project, projectTags, showProjectSpinner,
      leaseStartTime, leaseEndTime }
    = this.state;
    const validationResult = validator.validateSlice(sliceName, selectedKeyIDs, sliceNodes);

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    return (
      <div className="slice-page-container">
        {
          showSliceSpinner && 
          <div className="container d-flex align-items-center justify-content-center">
            <SpinnerWithText text={"Creating Slice..."} />
          </div>
        }
        {
          !showSliceSpinner && 
          <div>
            <div className="d-flex flex-row justify-content-between mt-2">
              <div className="align-self-start d-flex flex-row">
                <h2 className="ms-5 my-2">
                  Slice Builder
                </h2>
                <a
                  href={portalData.learnArticles.guideToSliceBuilder}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3"
                >
                  <i className="fa fa-question-circle mx-2"></i>
                  User Guide
                </a>
              </div>
              <Link href={`/projects/${this.props.match.params.project_id}`} className="align-self-end me-5">
                <button
                  className="btn btn-sm btn-outline-primary my-3"
                >
                  <i className="fa fa-sign-in me-2"></i>
                  Back to Project
                </button>
              </Link>
            </div>
            <div className="d-flex flex-column align-items-center w-100">
              <div className="d-flex flex-row justify-content-center mb-4 w-100 mx-5">
                <div className="slice-builder-left">
                <div className="card">
                    <div className="card-header slice-builder-card-header py-1">
                    <a
                      href={portalData.learnArticles.guideToSliceBuilderSections["step1"]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="btn btn-link">
                        Step 1: View Project Permissions
                      </button>
                    </a>
                    </div>
                    <div>
                      <div className="card-body slice-builder-card-body">
                        <ProjectTags
                          project={project}
                          tags={projectTags}
                          showSpinner={showProjectSpinner}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header slice-builder-card-header py-1">
                      <a
                        href={portalData.learnArticles.guideToSliceBuilderSections["step2"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="btn btn-link">
                          Step 2: Add Nodes
                        </button>
                      </a>
                    </div>
                    <div>
                      <div className="card-body slice-builder-card-body">
                        {
                          showResourceSpinner && <SpinnerWithText text={"Loading site resources..."}/>
                        }
                        {
                          !showResourceSpinner && 
                          <SideNodes
                            resources={parsedResources}
                            nodes={sliceNodes}
                            onVMAdd={this.handleVMAdd}
                            onFacilityAdd={this.handleFacilityAdd}
                            onSwitchAdd={this.handleSwitchAdd}
                            projectTags={projectTags}
                          />
                        }
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header slice-builder-card-header py-1">
                      <a
                        href={portalData.learnArticles.guideToSliceBuilderSections["step3"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="btn btn-link">
                          Step 3: Add Network Service
                        </button>
                      </a>
                    </div>
                    <div>
                      <div className="card-body slice-builder-card-body">
                      <SideLinks
                        nodes={sliceNodes}
                        selectedCPs={selectedCPs}
                        onLinkAdd={this.handleLinkAdd}
                        onCPRemove={this.handleCPRemove}
                      />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header slice-builder-card-header py-1">
                      <a
                        href={portalData.learnArticles.guideToSliceBuilderSections["step4"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="btn btn-link">
                          Step 4: Create Slice
                        </button>
                      </a>
                    </div>
                    <div>
                      <div className="card-body slice-builder-card-body">
                        <div className="d-flex flex-column">
                          <form>
                            <div className="form-row">
                              <div className="form-group col-md-12">
                                <label htmlFor="inputSliceName" className="slice-form-label">
                                  <span>Slice Name</span>
                                </label>
                                <input
                                  id="inputSliceName"
                                  name="inputSliceName"
                                  className="form-control form-control-sm"
                                  onChange={this.handleSliceNameChange}
                                />
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label htmlFor="inputLeaseStartTime" className="slice-form-label">
                                  <span>Lease Start Time</span>
                                </label>
                                <CalendarDateTime
                                  id="sliceBuilderCalendar1"
                                  name="sliceBuilderCalendar"
                                  offset={0}
                                  time={leaseStartTime && leaseStartTime.toString().replace(/-/g, "/")}
                                  onTimeChange={this.handleLeaseStartChange}
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="inputLeaseEndTime" className="slice-form-label">
                                  <span>Lease End Time</span>
                                </label>
                                <CalendarDateTime
                                  id="sliceBuilderCalendar2"
                                  name="sliceBuilderCalendar"
                                  offset={1}
                                  time={leaseEndTime.toString().replace(/-/g, "/")}
                                  onTimeChange={this.handleLeaseEndChange}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="inputSSHKey" className="slice-form-label">
                                <span>SSH Keys</span>
                              </label>
                              {
                                showKeySpinner && <SpinnerWithText text={"Loading SSH Keys..."} />
                              }
                              {
                                sliverKeys.length > 0 && !showKeySpinner && 
                                 <SliverKeyMultiSelect 
                                    id="selectSshKey"
                                    name="selectSshKey"
                                    keys={sliverKeys}
                                    selectedKeyIDs={selectedKeyIDs}
                                    onKeyCheck={this.handleKeyCheck}
                                 />
                              }
                              {
                                sliverKeys.length === 0 && !showKeySpinner && 
                                <div className="sm-alert alert-warning d-flex flex-row align-items-center" role="alert">
                                  <span>
                                    Please generate or upload sliver key from
                                    <Link
                                      to="/experiments#sshKeys"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mx-1 fw-bold"
                                    >
                                      Manage SSH Keys
                                    </Link>first. Then click the refresh button.
                                  </span>
                                  <button
                                    className="btn btn-sm btn-outline-primary ms-auto"
                                    type="button"
                                    onClick={() => this.refreshSSHKey()}
                                  >
                                    <i className="fa fa-refresh me-2"></i>
                                    Refresh Keys
                                  </button>
                                </div>
                              }
                            </div>
                            <div className="form-group col-md-12 d-flex flex-row">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 100, hide: 300 }}
                                overlay={renderTooltip("slice-create-tooltip",
                                  "The slice graph will be automatically saved to Draft when creating slice.")}
                              >
                                <button
                                  className="btn btn-sm btn-success ms-auto"
                                  type="button"
                                  disabled={!validationResult.isValid}
                                  onClick={() => this.handleCreateSlice()}
                                >
                                  Create Slice
                                </button>
                            </OverlayTrigger>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slice-builder-right">
                  <NewSliceDetailForm
                    data={selectedData}
                    selectedCPs={selectedCPs}
                    nodes={sliceNodes}
                    links={sliceLinks}
                    onConnectionPointSelect={this.handleCPAdd}
                    onNodeDelete={this.handleNodeDelete}
                    onVMUpdate={this.handleVMUpdate}
                    onSingleComponentAdd={this.handleSingleComponentAdd}
                    onJsonUpload={this.handleJsonUpload}
                  />
                  <Graph
                    className="align-self-end"
                    isNewSlice={true}
                    elements={this.generateGraphElements()}
                    sliceName={sliceName === "" ? "new-slice" : sliceName}
                    defaultSize={{"width": 0.6, "height": 0.9, "zoom": 1}}
                    onNodeSelect={this.handleNodeSelect}
                    onSaveDraft={() => this.handleSaveDraft("withMessage")}
                    onUseDraft={this.handleUseDraft}
                    onClearGraph={this.handleClearGraph}
                    onSaveJSON={this.handleSaveJSON}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(NewSliceForm);