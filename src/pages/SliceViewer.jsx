import React, { Component } from 'react'
import Graph from '../components/SliceViewer/Graph';
import DetailForm from '../components/SliceViewer/DetailForm';
import DeleteModal from "../components/common/DeleteModal";
import SpinnerWithText from "../components/common/SpinnerWithText";
import CountdownTimer from "../components/common/CountdownTimer";
import { Link } from "react-router-dom";
import { autoCreateTokens, autoRefreshTokens } from "../utils/manageTokens";
import { getCurrentUser } from "../services/prPeopleService.js";
import { getSliceById, deleteSlice } from "../services/orchestratorService.js";
import sliceParser from "../services/parser/sliceParser.js";
import sliceTimeParser from "../utils/sliceTimeParser.js";
import { toast } from "react-toastify";

export default class SliceViewer extends Component { 
  state = {
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
    positionAddNode: { x: 100, y: 600 },
    hasProject: true,
    showSliceSpinner: false,
  }

  async componentDidMount() {
    this.setState({ showSliceSpinner: true });
    // call PR first to check if the user has project.
    try {
      const { data: people } = await getCurrentUser();
      if (people.projects.length === 0) {
        this.setState({ hasProject: false });
      } else {
        // call credential manager to generate tokens 
        // if nothing found in browser storage
        if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
          autoCreateTokens(people.projects[0].uuid).then(async () => {
            const { data } = await getSliceById(this.props.match.params.id);
            this.setState({ elements: sliceParser(data["value"]["slices"][0]["slice_model"])});
            this.setState({ slice: data["value"]["slices"][0] });
            this.setState({ showSliceSpinner: false });
          });
        } else {
          // the token has been stored in the browser and is ready to be used.
          try {
            const { data } = await getSliceById(this.props.match.params.id);
            this.setState({ elements: sliceParser(data["value"]["slices"][0]["slice_model"])});
            this.setState({ slice: data["value"]["slices"][0] });
            this.setState({ showSliceSpinner: false });
          } catch(err) {
            console.log("Error in getting slice: " + err);
            toast.error("Failed to load the slice. Please try again later.");
            if (err.response.status === 401) {
              // 401 Error: Provided token is not valid.
              // refresh the token by calling credential manager refresh_token.
              autoRefreshTokens(people.projects[0].uuid);
            }
          }
        }
      } 
     } catch(ex) {
      toast.error("Failed to load user information. Please reload this page.");
      console.log("Failed to load user information: " + ex.response.data);
    }
  }

  handleDeleteSlice = async (id) => {
    try {
      await deleteSlice(id);
      // toast message to users when the api call is successfully done.
      toast.success("Slice deleted successfully.");
      // change slice state to Dead.
      this.setState(prevState => ({ 
        slice: {
          ...prevState.slice,
          "slice_state": "Dead"
        }
      }))
    } catch(ex) {
      console.log("failed to delete the slice: " + ex.response.data);
      toast.error("Failed to delete the slice.");
    }
  }

  handleNodeSelect = (selectedData) => {
    this.setState({ selectedData });
  }
  
  render() {
    const stateColors = {
      "Nascent": "primary-dark",
      "StableOK": "success",
      "StableError": "warning",
      "Closing": "secondary",
      "Dead": "secondary",
      "Configuring": "primary",
    }

    const { slice, elements, selectedData, hasProject, 
      showSliceSpinner } = this.state;

    let showSlice = !showSliceSpinner && hasProject;

    return(
      <div>
        {
          showSliceSpinner && 
          <div className="container d-flex align-items-center justify-content-center">
            <SpinnerWithText text={"Loading Slice..."} />
          </div>
        }
        {
          showSlice &&
          <div className="mx-5 mb-4 slice-viewer-container">
            <div className="d-flex flex-row justify-content-between align-items-center mt-2">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <h2 className="mr-4">
                  <b>{slice.slice_name}</b>
                  <span className={`badge badge-${stateColors[slice.slice_state]} ml-2`}>
                    {slice.slice_state}
                    <a
                      href="https://learn.fabric-testbed.net/knowledge-base/portal-slice-builder-user-guide/#slice-states"
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1"
                    >
                      <i className="fa fa-question-circle mx-2" />
                    </a>
                  </span>
                </h2>
                <h4>
                  <span className="badge badge-light font-weight-normal p-2 mt-1">Lease End Time: {sliceTimeParser(slice.lease_end)}</span>
                </h4>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                {
                  slice.slice_state.includes("Stable") &&
                  <DeleteModal
                    name={"Delete Slice"}
                    text={'Are you sure you want to delete this slice? This process cannot be undone but you can find deleted slices by checking the "Include Dead Slices" radio button on Experiments -> Slices page.'}
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
              slice.slice_state === "Configuring" && 
              <CountdownTimer
                text={"This slice is provisioning now."}
                interval={30}
                onDataReload={() => window.location.reload()}
              />
            }
            <div className="d-flex flex-row justify-content-center">
              {
                elements.length > 0 &&
                <Graph
                  className="align-self-end"
                  isNewSlice={false}
                  elements={elements}
                  sliceName={slice.slice_name}
                  defaultSize={{"width": 0.75, "height": 0.75, "zoom": 1}}
                  onNodeSelect={this.handleNodeSelect}
                />
              }
              {
                elements.length > 0 &&
                <DetailForm data={selectedData} />
              }
            </div>
          </div>
        }
      </div>
    )
  }
}