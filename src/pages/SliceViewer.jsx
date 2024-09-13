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

  async componentDidMount() {
    this.setState({ showSpinner: true, spinnerText: "Loading slice..." });
    try {
        // call credential manager to generate tokens
        autoCreateTokens(this.props.match.params.project_id).then(async () => {
          const { data: res } = await getSliceById(this.props.match.params.slice_id);
          this.setState({ 
            elements: sliceParser(res.data[0]["model"]),
            slice: res.data[0],
            leaseStartTime: res.data[0].lease_start_time,
            leaseEndTime: res.data[0].lease_end_time,
            errors: sliceErrorParser(res.data[0]["model"]),
            showSpinner: false,
            spinnerText: ""
          });
        });
     } catch (err) {
      toast.error("User's credential is expired. Please re-login.");
    }
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