import React, { Component } from 'react';
import moment from 'moment';
import withRouter from "../components/common/withRouter.jsx";
import Graph from '../components/SliceViewer/Graph';
import SliceViewerErrorBoundary from "../components/SliceViewer/SliceViewerErrorBoundary.jsx";
import TerminalFormModal from '../components/SliceViewer/TerminalFormModal';
import DetailForm from '../components/SliceViewer/DetailForm';
import ErrorMessageAccordion from '../components/SliceViewer/ErrorMessageAccordion';
import DeleteModal from "../components/common/DeleteModal";
import SpinnerWithText from "../components/common/SpinnerWithText";
import CountdownTimer from "../components/common/CountdownTimer";
import { Link } from "react-router-dom";
import { autoCreateTokens } from "../utils/manageTokens";
import { getSliceById, deleteSlice, extendSlice, installEphemeralKey } from "../services/sliceService.js";
import sliceParser from "../services/parser/sliceParser.js";
import sliceErrorParser from "../services/parser/sliceErrorParser.js";
import { generateKeyPairs } from "../services/sshKeyService.js";
import { toast } from "react-toastify";
import { default as portalData } from "../services/portalData.json";
import sleep from "../utils/sleep";
import { saveAs } from "file-saver";

class SliceViewer extends Component { 
  state = {
    elements: [],
    slice: {
      "graph_id": "",
      "lease_end_time": "",
      "slice_id": "",
      "model": "",
      "name": "Slice Viewer",
      "state": "StableOK"
    },
    errors: [],
    selectedData: null,
    positionAddNode: { x: 100, y: 600 },
    leaseStartTime: "",
    leaseEndTime: "",
    hasProject: true,
    showSpinner: false,
    spinnerText: "",
    ephemeralKey: {}
  }

  // async componentDidMount() {
  //   this.setState({ showSpinner: true, spinnerText: "Loading slice..." });
  //   try {
  //       // call credential manager to generate tokens
  //       autoCreateTokens(this.props.match.params.project_id).then(async () => {
  //         const { data: res } = await getSliceById(this.props.match.params.slice_id);
  //         this.setState({ 
  //           elements: sliceParser(res.data[0]["model"]),
  //           slice: res.data[0],
  //           leaseStartTime: res.data[0].lease_start_time,
  //           leaseEndTime: res.data[0].lease_end_time,
  //           errors: sliceErrorParser(res.data[0]["model"]),
  //           showSpinner: false,
  //           spinnerText: ""
  //         });
  //       });
  //    } catch (err) {
  //     toast.error("User's credential is expired. Please re-login.");
  //   }
  // }

  jsonRes = '{"directed": false, "multigraph": false, "graph": {}, "nodes": [{"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkService", "NodeID": "c2942f7a-9d2f-4d72-b63d-2963d8ab7674", "Name": "Network1", "Type": "L2Bridge", "StitchNode": "false", "Layer": "L2", "UserData": "{\"fablib_data\": {\"instantiated\": \"False\", \"mode\": \"manual\", \"subnet\": {\"subnet\": \"192.168.0.0/24\", \"allocated_ips\": []}}}", "id": 29}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkNode", "NodeID": "e0141558-386b-4802-875a-725d993797d8", "Name": "Node1", "Type": "VM", "StitchNode": "false", "Site": "RENC", "Capacities": "{\"core\": 2, \"disk\": 10, \"ram\": 8}", "ImageRef": "default_rocky_8,qcow2", "UserData": "{\"fablib_data\": {\"instantiated\": \"False\", \"run_update_commands\": \"False\", \"post_boot_commands\": [], \"post_update_commands\": []}}", "id": 31}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "Component", "NodeID": "10edf46f-07af-444b-b5ad-f6d4ab5c9d2e", "Name": "Node1-nic1", "Type": "SharedNIC", "Model": "ConnectX-6", "Details": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps", "StitchNode": "false", "UserData": "{}", "id": 32}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkService", "NodeID": "54a533b9-8a71-412f-9b64-da7749a1eae9", "Name": "Node1-Node1-nic1-l2ovs", "Type": "OVS", "StitchNode": "false", "Layer": "L2", "id": 33}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "c8ba05c5-3f80-4e3c-9d5f-d65708882e5e", "Name": "Node1-nic1-p1", "Type": "SharedPort", "Capacities": "{\"unit\": 1}", "Labels": "{\"local_name\": \"p1\"}", "StitchNode": "false", "UserData": "{\"fablib_data\": {\"mode\": \"auto\"}}", "id": 34}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "d933a684-4cbb-4fc8-89a0-52d3048a75ac", "Name": "Node1-Node1-nic1-p1", "Type": "ServicePort", "StitchNode": "false", "id": 35}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "Link", "NodeID": "c7c735e7-79db-44f3-a05e-ad6ab2bef2c4", "Name": "Node1-Node1-nic1-p1-link", "Type": "L2Path", "StitchNode": "false", "Layer": "L2", "id": 36}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkNode", "NodeID": "2e19dbb8-683f-4877-8cc1-4bd7b9218782", "Name": "P4", "Type": "Switch", "StitchNode": "false", "Site": "RENC", "Capacities": "{\"unit\": 1}", "UserData": "{\"fablib_data\": {\"instantiated\": \"False\", \"run_update_commands\": \"False\", \"post_boot_commands\": [], \"post_update_commands\": []}}", "id": 37}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkService", "NodeID": "cfb12afa-035c-4eff-a995-5ff0fd9dfdaf", "Name": "P4-ns", "Type": "P4", "StitchNode": "false", "Layer": "L2", "id": 38}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "c2f92a62-33ab-4eab-bccb-1169488f2f31", "Name": "p1", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p1\"}", "StitchNode": "false", "UserData": "{\"fablib_data\": {}}", "id": 39}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "5492183b-cc10-4199-8e6d-2a8ce095b8c1", "Name": "p2", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p2\"}", "StitchNode": "false", "UserData": "{\"fablib_data\": {}}", "id": 40}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "deab0250-a171-4e68-8f00-ad58dc9333b9", "Name": "p3", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p3\"}", "StitchNode": "false", "id": 41}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "3d76b176-d062-434b-9154-523b7af11682", "Name": "p4", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p4\"}", "StitchNode": "false", "id": 42}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "dfa186c1-9a84-487f-8f43-00e9ec1a44b4", "Name": "p5", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p5\"}", "StitchNode": "false", "id": 43}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "61b00633-e010-485c-b5b0-39989be151d8", "Name": "p6", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p6\"}", "StitchNode": "false", "id": 44}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "6a88790d-6473-4c22-a0d8-66c6545f2f65", "Name": "p7", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p7\"}", "StitchNode": "false", "id": 45}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "51c72752-a4c4-4d00-9be2-76a108bcd237", "Name": "p8", "Type": "DedicatedPort", "Capacities": "{\"bw\": 100}", "Labels": "{\"local_name\": \"p8\"}", "StitchNode": "false", "id": 46}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "890f170a-aac1-4f3b-bd40-996f4a7ade99", "Name": "P4-p1", "Type": "ServicePort", "StitchNode": "false", "id": 47}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "Link", "NodeID": "77a667cd-3a4d-4945-803f-d22a12feb8af", "Name": "P4-p1-link", "Type": "Patch", "StitchNode": "false", "Layer": "L2", "id": 48}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkNode", "NodeID": "69ddba32-6aae-4da6-9d1a-96238ed02a70", "Name": "Node2", "Type": "VM", "StitchNode": "false", "Site": "LBNL", "Capacities": "{\"core\": 2, \"disk\": 10, \"ram\": 8}", "ImageRef": "default_rocky_8,qcow2", "UserData": "{\"fablib_data\": {\"instantiated\": \"False\", \"run_update_commands\": \"False\", \"post_boot_commands\": [], \"post_update_commands\": []}}", "id": 51}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "Component", "NodeID": "13052970-d116-4087-8e8e-c2e687d928f5", "Name": "Node2-nic1", "Type": "SharedNIC", "Model": "ConnectX-6", "Details": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps", "StitchNode": "false", "UserData": "{}", "id": 52}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkService", "NodeID": "eef9d3ab-310c-4d90-a3ba-85e898010647", "Name": "Node2-Node2-nic1-l2ovs", "Type": "OVS", "StitchNode": "false", "Layer": "L2", "id": 53}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "2dd91de3-7d4c-4048-a8d8-468d1a4c1ddb", "Name": "Node2-nic1-p1", "Type": "SharedPort", "Capacities": "{\"unit\": 1}", "Labels": "{\"local_name\": \"p1\"}", "StitchNode": "false", "UserData": "{\"fablib_data\": {\"mode\": \"auto\"}}", "id": 54}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "NetworkService", "NodeID": "d0f5a99d-9507-43bb-8ea3-64a13dde67fa", "Name": "Network2", "Type": "L2STS", "StitchNode": "false", "Layer": "L2", "UserData": "{\"fablib_data\": {\"instantiated\": \"False\", \"mode\": \"manual\", \"subnet\": {\"subnet\": \"192.168.0.0/24\", \"allocated_ips\": []}}}", "id": 55}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "a88e2a5d-e11c-4c16-ae71-85f5919308d7", "Name": "P4-p2", "Type": "ServicePort", "StitchNode": "false", "id": 56}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "Link", "NodeID": "45e1eaec-7fb3-4d4d-b16f-b7627640504a", "Name": "P4-p2-link", "Type": "Patch", "StitchNode": "false", "Layer": "L2", "id": 57}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "ConnectionPoint", "NodeID": "6a86d8ab-86de-4884-9273-9f2f6577c7cc", "Name": "Node2-Node2-nic1-p1", "Type": "ServicePort", "StitchNode": "false", "id": 58}, {"GraphID": "6ecf6ef4-2444-4f42-b962-050a7751be53", "Class": "Link", "NodeID": "71c59621-0728-4e3f-a70d-804872ca2164", "Name": "Node2-Node2-nic1-p1-link", "Type": "L2Path", "StitchNode": "false", "Layer": "L2", "id": 59}], "links": [{"Class": "connects", "source": 29, "target": 35}, {"Class": "connects", "source": 29, "target": 47}, {"Class": "has", "source": 31, "target": 32}, {"Class": "has", "source": 32, "target": 33}, {"Class": "connects", "source": 33, "target": 34}, {"Class": "connects", "source": 34, "target": 36}, {"Class": "connects", "source": 35, "target": 36}, {"Class": "has", "source": 37, "target": 38}, {"Class": "connects", "source": 38, "target": 39}, {"Class": "connects", "source": 38, "target": 40}, {"Class": "connects", "source": 38, "target": 41}, {"Class": "connects", "source": 38, "target": 42}, {"Class": "connects", "source": 38, "target": 43}, {"Class": "connects", "source": 38, "target": 44}, {"Class": "connects", "source": 38, "target": 45}, {"Class": "connects", "source": 38, "target": 46}, {"Class": "connects", "source": 39, "target": 48}, {"Class": "connects", "source": 40, "target": 57}, {"Class": "connects", "source": 47, "target": 48}, {"Class": "has", "source": 51, "target": 52}, {"Class": "has", "source": 52, "target": 53}, {"Class": "connects", "source": 53, "target": 54}, {"Class": "connects", "source": 54, "target": 59}, {"Class": "connects", "source": 55, "target": 56}, {"Class": "connects", "source": 55, "target": 58}, {"Class": "connects", "source": 56, "target": 57}, {"Class": "connects", "source": 58, "target": 59}]}'

  componentDidMount() {
    this.setState({ elements: sliceParser(this.jsonRes) });
  }

  generateEphemeralKey = async () => {
    const { selectedData } = this.state;
    const sliverId = selectedData && selectedData.properties && selectedData.properties.sliverId;
    try {
      // step 1: generate ephemeral key
      const { data: res } = await generateKeyPairs("sliver", `ephemeral-key-${sliverId}`, 
      `ephemeral key to web ssh, sliver ${sliverId}`, false);
      this.setState({
        ephemeralKey: res.results[0]
      });
      // step 2: install ephemeral key to the sliver
      await installEphemeralKey(sliverId, res.results[0].public_openssh);
    } catch (err) {
      toast.error("Failed to generate and install ephemeral key. Please try again or input your key.")
    }
  }

  handleDeleteSlice = async (id) => {
    this.setState({ showSpinner: true, spinnerText: "Deleting Slice" });
    try {
      await deleteSlice(id);
      // toast message to users when the api call is successfully done.
      toast.success("Slice deleted successfully.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete the slice.");
    }
  }

  handleNodeSelect = (selectedData) => {
    this.setState({ selectedData });
  }

  clearSelectedData = () => {
    this.setState({ selectedData: null });
  }

  handleSaveJSON = () => {
    var jsonBlob = new Blob([ JSON.stringify(this.state.slice) ], { type: 'application/javascript;charset=utf-8' });
    saveAs( jsonBlob, `${this.state.sliceName}.json` );
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

  handleSliceExtend = async () => {
    this.setState({
      showSpinner: true,
      spinnerText: "Extending slice..."
    })
    try {
      const { slice, leaseEndTime } = this.state;
      await extendSlice(slice.slice_id, leaseEndTime);
      // toast message to users when the api call is successfully done.
      toast.success("Slice has been successfully renewed.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to renew the slice.");
      this.setState({
        leaseEndTime: this.state.slice.lease_end_time,
        showSpinner: false,
        spinnerText: ""
      });
    }
  }

  render() {
    const stateColors = {
      "Nascent": "primary-dark",
      "StableOK": "success",
      "StableError": "warning",
      "AllocatedOK": "success",
      "AllocatedError": "warning",
      "Closing": "secondary",
      "Dead": "secondary",
      "Configuring": "primary",
      "Modifying": "primary",
      "ModifyError": "warning",
      "ModifyOK": "success"
    }

    const { slice, elements, selectedData, hasProject, leaseStartTime,
      showSpinner, spinnerText, errors, leaseEndTime, ephemeralKey } = this.state;
    let showSlice = !showSpinner && hasProject;

    return(
      <SliceViewerErrorBoundary 
        slice={slice}
        leaseStartTime={leaseStartTime}
        leaseEndTime={leaseEndTime}
        onLeaseEndChange={this.handleLeaseEndChange}
        onSliceExtend={this.handleSliceExtend}
      >
        <div className="slice-page-container">
          <TerminalFormModal
            vmData={selectedData}
            ephemeralKey={ephemeralKey}
            onGenerateEphemeralKey={this.generateEphemeralKey}
          />
          {
            showSpinner && 
            <div className="container d-flex align-items-center justify-content-center">
              <SpinnerWithText text={spinnerText} />
            </div>
          }
          {
            showSlice &&
            <div className="mx-5 mb-4 slice-viewer-container">
              <div className="d-flex flex-row justify-content-between align-items-center mt-2">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <h2 className="mr-3">
                    <b>{slice.name}</b>
                    <span className={`badge badge-${stateColors[slice.state]} ml-2`}>
                      {slice.state}
                    </span>
                    <a
                      href={portalData.learnArticles.guideToSliceBuilderSections["states"]}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1"
                    >
                      <i className="fa fa-question-circle mx-2" />
                    </a>
                  </h2>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center">
                    {/* <Link to={`/slice-editor/${slice.slice_id}/${slice.project_id}`}>
                      <button
                        className="btn btn-sm btn-outline-primary my-3 mr-3"
                      >
                        <i className="fa fa-exchange mr-2"></i>
                        Edit Mode
                      </button>
                    </Link> */}
                  {
                    ["StableOK", "ModifyOK", "StableError", "ModifyError", "AllocatedOK", " AllocatedError"].includes(slice.state) &&
                    <DeleteModal
                      name={"Delete Slice"}
                      text={'Are you sure you want to delete this slice? This process cannot be undone but you can find deleted slices by checking the "Include Dead Slices" radio button on Experiments -> Slices page.'}
                      id={"delete-a-slice"}
                      onDelete={() => this.handleDeleteSlice(slice.slice_id)}
                    />
                  }
                  <Link to="/experiments#slices">
                    <button
                      className="btn btn-sm btn-outline-primary my-3 ml-3"
                    >
                      <i className="fa fa-sign-in mr-2"></i>
                      Back to Slice List
                    </button>
                  </Link>
                </div>
              </div>
              {
                ["Configuring", "Modifying"].includes(slice.state)  && 
                <CountdownTimer
                  text={"This slice is provisioning now."}
                  interval={30}
                  onDataReload={() => window.location.reload()}
                />
              }
              {
                (["Closing", "Dead", "StableError", "ModifyError"].includes(slice.state) 
                && errors.length > 0) && 
                <ErrorMessageAccordion
                  state={slice.state}
                  errors={errors}
                />
              }
              <div className="d-flex flex-row justify-content-center">
                {
                  elements.length > 0 &&
                  <Graph
                    className="align-self-end"
                    isNewSlice={false}
                    elements={elements}
                    sliceName={slice.name}
                    defaultSize={{"width": 0.75, "height": 0.75, "zoom": 1}}
                    onNodeSelect={this.handleNodeSelect}
                    onSaveJSON={this.handleSaveJSON}
                  />
                }
                {
                  elements.length > 0 &&
                  <DetailForm
                    slice={slice}
                    leaseStartTime={leaseStartTime}
                    leaseEndTime={leaseEndTime}
                    data={selectedData}
                    key={selectedData && selectedData.properties && 
                      `${selectedData.properties.class}-${selectedData.properties.name}`}
                    clearSelectedData={() => this.clearSelectedData()}
                    onLeaseEndChange={this.handleLeaseEndChange}
                    onSliceExtend={this.handleSliceExtend}
                  />
                }
              </div>
            </div>
          }
          </div>
      </SliceViewerErrorBoundary>
    )
  }
}

export default withRouter(SliceViewer);