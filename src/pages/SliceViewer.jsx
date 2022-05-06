import React, { Component } from 'react'
import Graph from '../components/SliceViewer/Graph';
import DetailForm from '../components/SliceViewer/DetailForm';
import _ from "lodash";
import { Link } from "react-router-dom";
import { autoCreateTokens, autoRefreshTokens } from "../utils/manageTokens";
import { getCurrentUser } from "../services/prPeopleService.js";
import { getSliceById } from "../services/orchestratorService.js";
import sliceParser from "../services/parser/sliceParser.js";
import toLocaleTime from "../utils/toLocaleTime";
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
  }

  async componentDidMount() {
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
          });
        } else {
          // the token has been stored in the browser and is ready to be used.
          try {
            const { data } = await getSliceById(this.props.match.params.id);
            this.setState({ elements: sliceParser(data["value"]["slices"][0]["slice_model"])});
            this.setState({ slice: data["value"]["slices"][0] });
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

    const { slice, elements, selectedData, hasProject } = this.state;

    return(
      <div>
        {
          hasProject &&
          <div className="mx-5 mb-4 slice-viewer-container">
            <div className="d-flex flex-row justify-content-between align-items-center mt-2">
              <h2>
                <b>{slice.slice_name}</b>
                <span className={`badge badge-${stateColors[slice.slice_state]} ml-2`}>{slice.slice_state}</span>
              </h2>
              <u>Lease End: {toLocaleTime(slice.lease_end)}</u>
              <Link to="/experiments#slices">
                <button
                  className="btn btn-sm btn-outline-primary my-3"
                >
                  <i className="fa fa-sign-in mr-2"></i>
                  Back to Slice List
                </button>
              </Link>
            </div>
            <div className="d-flex flex-row justify-content-center">
              {
                elements.length > 0 &&
                <Graph
                  className="align-self-end"
                  layout={{name: 'fcose'}}
                  defaultSize={{"width": 0.65, "height": 0.75, "zoom": 0.85}}
                  isNewSlice={false}
                  elements={elements}
                  sliceName={slice.slice_name}
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