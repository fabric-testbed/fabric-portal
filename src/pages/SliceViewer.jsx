import React, { Component } from 'react'
import Graph from '../components/SliceViewer/Graph';
import DetailForm from '../components/SliceViewer/DetailForm';
import ErrorMessageAccordion from '../components/SliceViewer/ErrorMessageAccordion';
import DeleteModal from "../components/common/DeleteModal";
import SpinnerWithText from "../components/common/SpinnerWithText";
import CountdownTimer from "../components/common/CountdownTimer";
import { Link } from "react-router-dom";
import { autoCreateTokens, autoRefreshTokens } from "../utils/manageTokens";
import { getProjects } from "../services/projectService.js";
import { getSliceById, deleteSlice } from "../services/sliceService.js";
import sliceParser from "../services/parser/sliceParser.js";
import sliceErrorParser from "../services/parser/sliceErrorParser.js";
import sliceTimeParser from "../utils/sliceTimeParser.js";
import { toast } from "react-toastify";
import { default as portalData } from "../services/portalData.json";

export default class SliceViewer extends Component { 
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
    hasProject: true,
    showSliceSpinner: false,
  }

  async componentDidMount() {
    this.setState({ showSliceSpinner: true });
    // call PR first to check if the user has project.
    try {
      const { data: res } = await getProjects("myProjects", 0, 200);
      if (res.results.length === 0) {
        this.setState({ hasProject: false });
      } else {
        // call credential manager to generate tokens 
        // if nothing found in browser storage
        if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
          autoCreateTokens(res.results[0].uuid).then(async () => {
            const { data: res } = await getSliceById(this.props.match.params.id);
            this.setState({ 
              elements: sliceParser(res.data[0]["model"]),
              slice: res.data[0],
              errors: sliceErrorParser(res.data[0]["model"]),
              showSliceSpinner: false
            });
          });
        } else {
          // the token has been stored in the browser and is ready to be used.
          try {
            const { data: res } = await getSliceById(this.props.match.params.id);
            this.setState({ 
              elements: sliceParser(res.data[0]["model"]),
              slice: res.data[0],
              errors: sliceErrorParser(res.data[0]["model"]),
              showSliceSpinner: false
            });
          } catch (err) {
            this.setState({ showSliceSpinner: false });
            toast.error("Failed to load the slice. Please try again later.");
            if (err.response.status === 401) {
              // 401 Error: Provided token is not valid.
              // refresh the token by calling credential manager refresh_token.
              autoRefreshTokens(res.results[0].uuid);
            }
          }
        }
      }
     } catch (err) {
      toast.error("User's credential is expired. Please re-login.");
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
          "state": "Dead"
        }
      }))
    } catch (err) {
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
      "Modifying": "primary",
      "ModifyError": "warning",
      "ModifyOK": "success"
    }

    const { slice, elements, selectedData, hasProject, 
      showSliceSpinner, errors } = this.state;

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
                <h4>
                  <span className="badge badge-light font-weight-normal p-2 mt-1">Lease End Time: {sliceTimeParser(slice.lease_end_time)}</span>
                </h4>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                {
                  ["StableOK", "ModifyOK", "StableError", "ModifyError"].includes(slice.state) &&
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