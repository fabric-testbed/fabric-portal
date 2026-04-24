"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

import ProjectTags from "@/components/SliceViewer/ProjectTags";
import SideNodes from "@/components/SliceViewer/SideNodes";
import SideLinks from "@/components/SliceViewer/SideLinks";
import Graph from "@/components/SliceViewer/Graph";
import NewSliceDetailForm from "@/components/SliceViewer/NewSliceDetailForm";
import SpinnerWithText from "@/components/common/SpinnerWithText";
import CalendarDateTime from "@/components/common/CalendarDateTime.jsx";
import SliverKeyMultiSelect from "@/components/SliceViewer/SliverKeyMultiSelect";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { LogIn, HelpCircle, RefreshCw } from "lucide-react";

import sliceParser from "@/services/parser/sliceParser.js";
import builder from "@/lib/slices/sliceBuilder.js";
import editor from "@/lib/slices/sliceEditor.js";
import validator from "@/lib/slices/sliceValidator.js";

import { sitesNameMapping } from "@/assets/data/sites";
import sitesParser from "@/services/parser/sitesParser";

import { getResources } from "@/services/resourceService.js";
import { createSlice } from "@/services/sliceService.js";
import { getProjectById } from "@/services/projectService.js";

import { autoCreateTokens } from "@/utils/manageTokens";
import { getActiveKeys } from "@/services/sshKeyService";

import portalData from "@/services/portalData.json";


function NewSliceForm() {
  const router = useRouter();
  const params = useParams();

  const [sliceName, setSliceName] = useState("");
  const [sshKey, setSshKey] = useState("");
  const [selectedKeyIDs, setSelectedKeyIDs] = useState([]);
  const [leaseEndTime, setLeaseEndTime] = useState("");
  const [leaseStartTime, setLeaseStartTime] = useState("");
  const [showResourceSpinner, setShowResourceSpinner] = useState(false);
  const [showKeySpinner, setShowKeySpinner] = useState(false);
  const [showSliceSpinner, setShowSliceSpinner] = useState(false);
  const [showProjectSpinner, setShowProjectSpinner] = useState(false);
  const [sliverKeys, setSliverKeys] = useState([]);
  const [graphID, setGraphID] = useState("");
  const [sliceNodes, setSliceNodes] = useState([]);
  const [sliceLinks, setSliceLinks] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [parsedResources, setParsedResources] = useState(null);
  const [selectedCPs, setSelectedCPs] = useState([]);
  const [project, setProject] = useState({});
  const [projectTags, setProjectTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Show spinner in SideNodes when loading resources
      setShowResourceSpinner(true);
      setShowKeySpinner(true);
      setShowProjectSpinner(true);

      try {
        const { data: resources } = await getResources(1);
        const { data: keys } = await getActiveKeys();
        const { data: projectRes } = await getProjectById(params.project_id);
        const parsedObj = sitesParser(resources.data[0], sitesNameMapping.acronymToShortName);

        setParsedResources(parsedObj);
        setShowResourceSpinner(false);
        setSliverKeys(keys.results.filter(k => k.fabric_key_type === "sliver"));
        setProject(projectRes.results[0]);
        setProjectTags(projectRes.results[0].tags);
        setShowKeySpinner(false);
        setShowProjectSpinner(false);
      } catch (ex) {
        toast.error("Failed to load resource/ sliver key information. Please reload this page.");
      }
      // generate a graph uuid for the new slice
      setGraphID(uuidv4());
    };
    fetchData();
  }, [params.project_id]);

  const refreshSSHKey = async () => {
    setShowKeySpinner(true);

    try {
      const { data: keys } = await getActiveKeys();
      setSliverKeys(keys.results.filter(k => k.fabric_key_type === "sliver"));
      setShowKeySpinner(false);
    } catch (ex) {
      setShowKeySpinner(false);
      toast.error("Failed to refresh keys. Please try again later.");
    }
  };

  const handleSliceNameChange = (e) => {
    setSliceName(e.target.value);
  };

  const handleKeyCheck = (keyID) => {
    if (selectedKeyIDs.includes(keyID)) {
      setSelectedKeyIDs(selectedKeyIDs.filter(k => k !== keyID));
    } else {
      setSelectedKeyIDs([...selectedKeyIDs, keyID]);
    }
  };

  const handleLeaseStartChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    setLeaseStartTime(outputTime);
  };

  const handleLeaseEndChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    setLeaseEndTime(outputTime);
  };

  const generateSliceJSON = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": sliceNodes,
      "edges": sliceLinks,
    };

    const requestBody = JSON.stringify(sliceJSON);

    return requestBody;
  };

  const generateGraphElements = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": sliceNodes,
      "edges": sliceLinks,
    };

    let elements = sliceParser(sliceJSON, "new");

    return elements;
  };

  const handleSaveDraft = (toastMessage) => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": sliceNodes,
      "edges": sliceLinks,
    };

    localStorage.setItem("sliceDraft", JSON.stringify(sliceJSON));

    if (toastMessage === "withMessage") {
      // Toast a successly saved message
      toast.success("The slice draft is successfully saved in your browser.");
    }
  };

  const handleSaveJSON = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": sliceNodes,
      "edges": sliceLinks,
    };

    var jsonBlob = new Blob([ JSON.stringify(sliceJSON) ], { type: 'application/javascript;charset=utf-8' });
    if(sliceName !== "") {
      saveAs(jsonBlob, `${sliceName}.json`);
    } else {
      saveAs(jsonBlob, `new-slice.json`);
    }
  };

  const handleUseDraft = () => {
    const sliceDraft = JSON.parse(localStorage.getItem("sliceDraft"));
    setSliceNodes(sliceDraft.nodes);
    setSliceLinks(sliceDraft.links);
    setGraphID(sliceDraft.nodes.length > 0 ? sliceDraft.nodes[0].GraphID : "");
  };

  const handleJsonUpload = (sliceStr) => {
    // similar to use draft
    const sliceJSON = JSON.parse(sliceStr);
    try {
      setSliceNodes(sliceJSON.nodes);
      setSliceLinks(sliceJSON.links);
      setGraphID(sliceJSON.nodes.length > 0 ? sliceJSON.nodes[0].GraphID : "");
    } catch (err) {
      toast.error("Failed to render the slice topology. Please try with a different slice JSON file.")
    }
  };

  const handleClearGraph = () => {
    setSliceNodes([]);
    setSliceLinks([]);
    setSelectedData(null);
    setSelectedCPs([]);
  };

  const handleNodeSelect = (data) => {
    setSelectedData(data);
  };

  const handleCPAdd = (cp) => {
    const cloned_selectedCPs = _.clone(selectedCPs);
    cloned_selectedCPs.push(cp);
    setSelectedCPs(cloned_selectedCPs);
  };

  const handleCPRemove = (cp_id) => {
    const updatedSelectedCPs = [];
    for (const cp of selectedCPs) {
      if (cp.id !== cp_id)
      updatedSelectedCPs.push(cp);
    }
    setSelectedCPs(updatedSelectedCPs);
  };

  const handleNodeDelete = (el) => {
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
    setSliceNodes([]);
    setSliceLinks([]);
    setSelectedData({});
    // Use setTimeout to ensure the clearing happens before the update
    setTimeout(() => {
      setSliceNodes(updated_nodes);
      setSliceLinks(updated_links);
    }, 0);
  };

  const handleVMAdd = (site, name, core, ram, disk, image, sliceComponents, BootScript) => {
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
    setSliceNodes(newSliceNodes);
    setSliceLinks(newSliceLinks);
  };

  const handleFacilityAdd = (site, name, bandwidth, vlan) => {
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
    setSliceNodes(newSliceNodes);
    setSliceLinks(newSliceLinks);
  };

  const handleSwitchAdd = (site, name) => {
    const node = {
      "type": "Switch",
      "site": site,
      "name": name
    };
    const { newSliceNodes, newSliceLinks } = builder.addSwitch(node, graphID, sliceNodes, sliceLinks);
    setSliceNodes(newSliceNodes);
    setSliceLinks(newSliceLinks);
  };

  const handleLinkAdd = (type, name) => {
    const { newSliceNodes, newSliceLinks} = builder.addLink(type, name, selectedCPs, graphID, sliceNodes, sliceLinks);
    setSliceNodes(newSliceNodes);
    setSliceLinks(newSliceLinks);
    setSelectedCPs([]);
  };

  const handleVMUpdate = (data) => {
    // data: vm_id, new_name, new_capacities and new_boot_script
    const updated_nodes = editor.updateVM(data, sliceNodes);
    setSliceNodes(updated_nodes);
    toast.success("VM updated successfully.")
  };

  const handleFPUpdate = (data) => {
    const updated_nodes = editor.updateFP(data, sliceNodes);
    setSliceNodes(updated_nodes);
    toast.success("Facility Port updated successfully.")
  };

  const handleSingleComponentAdd = (data) => {
    const vm_id = parseInt(selectedData.id);
    const vm_node = sliceNodes.filter(node => node.id === vm_id)[0];

    const node = {
      "type": vm_node.Type,
      "site": vm_node.Site,
      "name": vm_node.Name,
    };

    // Add component data to the selected VM.
    const component_node_id = builder.generateID(sliceNodes);
    const component_link_id = builder.generateID(sliceLinks)
    const [nodes, links] = builder.addComponent(node, data, graphID, parseInt(selectedData.id), component_node_id, component_link_id);

    const clonedNodes = _.clone(sliceNodes);
    const clonedLinks = _.clone(sliceLinks);

    for (const node of nodes) {
      clonedNodes.push(node);
    }
    for (const link of links) {
      clonedLinks.push(link);
    }

    setSliceNodes(clonedNodes);
    setSliceLinks(clonedLinks);
  };

  const generatePublicKeys = () => {
    const keys = [];
    const keyNames = [];
    for (const key of sliverKeys) {
      if (selectedKeyIDs.includes(key.uuid)) {
        keys.push(`${key.ssh_key_type} ${key.public_key} ${key.comment}`)
        keyNames.push(key.comment);
      }
    }
    return { keys, keyNames };
  };

  const handleCreateSlice = async () => {
    handleSaveDraft("noMessage");
    setShowSliceSpinner(true);

    const pubKeys = generatePublicKeys();
    const requestData = {
      name: sliceName,
      sshKeys: pubKeys.keys,
      ...(leaseEndTime) && {leaseEndTime: leaseEndTime},
      ...(leaseStartTime) && {leaseStartTime: leaseStartTime},
      json: generateSliceJSON(),
      sshKeyNames: pubKeys.keyNames
    };

    // re-create token using user's choice of project
    const tokenResult = await autoCreateTokens(params.project_id);
    if (!tokenResult) {
      // autoCreateTokens already showed an error toast
      setShowSliceSpinner(false);
      return;
    }

    try {
      const { data: res } = await createSlice(requestData, tokenResult.id_token);
      toast.success("Slice creation request submitted successfully.");
      // redirect users directly to the new slice page
      const slice_id = res.data[0].slice_id;
      router.push(`/experiments/slices/${slice_id}/${params.project_id}`);
    } catch (ex) {
      toast.error("Failed to create slice.");
      setShowSliceSpinner(false);
    }
  };

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
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
          <SpinnerWithText text={"Creating Slice..."} />
        </div>
      }
      {
        !showSliceSpinner &&
        <div>
          <div className="d-flex flex-row justify-content-between mt-2">
            <div className="align-self-start d-flex flex-row">
              <h2 className="my-2">
                Slice Builder
              </h2>
              <a
                href={portalData.learnArticles.guideToSliceBuilder}
                target="_blank"
                rel="noreferrer"
                className="mt-3"
              >
                <HelpCircle size={16} className="ms-1" />
                User Guide
              </a>
            </div>
            <Link href={`/experiments/projects/${params.project_id}`} className="align-self-end">
              <button
                className="btn btn-sm btn-outline-primary my-3"
              >
                <LogIn size={14} className="me-2" />
                Back to Project
              </button>
            </Link>
          </div>
          <div>
            <div className="d-flex flex-row justify-content-center mb-4 w-100 slice-builder-row">
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
                          onVMAdd={handleVMAdd}
                          onFacilityAdd={handleFacilityAdd}
                          onSwitchAdd={handleSwitchAdd}
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
                      onLinkAdd={handleLinkAdd}
                      onCPRemove={handleCPRemove}
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
                                onChange={handleSliceNameChange}
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
                                onTimeChange={handleLeaseStartChange}
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
                                onTimeChange={handleLeaseEndChange}
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
                                  onKeyCheck={handleKeyCheck}
                               />
                            }
                            {
                              sliverKeys.length === 0 && !showKeySpinner &&
                              <div className="sm-alert alert-warning d-flex flex-row align-items-center" role="alert">
                                <span>
                                  Please generate or upload sliver key from
                                  <Link
                                    href="/experiments/ssh-keys"
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
                                  onClick={() => refreshSSHKey()}
                                >
                                  <RefreshCw size={14} className="me-2" />
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
                                onClick={() => handleCreateSlice()}
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
                  onConnectionPointSelect={handleCPAdd}
                  onNodeDelete={handleNodeDelete}
                  onVMUpdate={handleVMUpdate}
                  onSingleComponentAdd={handleSingleComponentAdd}
                  onJsonUpload={handleJsonUpload}
                />
                <Graph
                  isNewSlice={true}
                  elements={generateGraphElements()}
                  sliceName={sliceName === "" ? "new-slice" : sliceName}
                  defaultSize={{"width": 0.55, "height": 0.95, "zoom": 1}}
                  onNodeSelect={handleNodeSelect}
                  onSaveDraft={() => handleSaveDraft("withMessage")}
                  onUseDraft={handleUseDraft}
                  onClearGraph={handleClearGraph}
                  onSaveJSON={handleSaveJSON}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default NewSliceForm;
