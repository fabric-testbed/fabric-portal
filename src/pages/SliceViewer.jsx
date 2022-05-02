import React, { Component } from 'react';
import SideToolbar from '../components/SliceViewer/SideToolbar';
import Graph from '../components/SliceViewer/Graph';
import DetailForm from '../components/SliceViewer/DetailForm';
import DeleteModal from "../components/common/DeleteModal";
import _ from "lodash";
import { Link } from "react-router-dom";
import { autoCreateTokens, autoRefreshTokens } from "../utils/manageTokens";
// import { getSliceById, deleteSlice } from "../services/orchestratorService.js";
import { getSliceById } from "../services/fakeSlices.js";
import { deleteSlice } from "../services/orchestratorService.js";
import sliceParser from "../services/parser/sliceParser.js";
import toLocaleTime from "../utils/toLocaleTime";
import { toast } from "react-toastify";

export default class SliceViewer extends Component { 
  state = {
    // elements: [],
    // slice: {
    //   "graph_id": "",
    //   "lease_end": "",
    //   "slice_id": "",
    //   "slice_model": "",
    //   "slice_name": "Slice Viewer",
    //   "slice_state": "StableOK"
    // },
    elements: sliceParser(getSliceById(this.props.match.params.id)["value"]["slices"][0]["slice_model"], "api"),
    slice: getSliceById(this.props.match.params.id)["value"]["slices"][0],
    selectedData: null,
    positionAddNode: { x: 100, y: 600 },
  }

  // async componentDidMount() {
  //   // call credential manager to generate tokens 
  //   // if nothing found in browser storage
  //   if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
  //     autoCreateTokens().then(async () => {
  //       const { data } = await getSliceById(this.props.match.params.id);
  //       this.setState({ elements: sliceParser(data["value"]["slices"][0]["slice_model"])}, "api");
  //       this.setState({ slice: data["value"]["slices"][0] });
  //     });
  //   } else {
  //     // the token has been stored in the browser and is ready to be used.
  //     try {
  //       const { data } = await getSliceById(this.props.match.params.id);
  //       this.setState({ elements: sliceParser(data["value"]["slices"][0]["slice_model"])}, "api");
  //       this.setState({ slice: data["value"]["slices"][0] });
  //     } catch(err) {
  //       console.log("Error in getting slice: " + err);
  //       toast.error("Failed to load the slice. Please try again later.");
  //       if (err.response.status === 401) {
  //         // 401 Error: Provided token is not valid.
  //         // refresh the token by calling credential manager refresh_token.
  //         autoRefreshTokens();
  //       }
  //     }
  //   }
  // }

  handleDeleteSlice = async (id) => {
    try {
      await deleteSlice(id);
      // toast message to users when the api call is successfully done.
      toast.success("Slice deleted successfully.");
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

    const { slice, elements, selectedData } = this.state;

    return(
      <div className="mx-5 mb-4 slice-viewer-container">
         <div className="d-flex flex-row justify-content-between align-items-center mt-2">
           <div className="d-flex flex-row justify-content-between align-items-center">
            <h2 className="mr-3">
              <b>{slice.slice_name}</b>
              <span className={`badge badge-${stateColors[slice.slice_state]} ml-2`}>{slice.slice_state}</span>
            </h2>
            <u>Lease End: {toLocaleTime(slice.lease_end)}</u>
           </div>
           <div className="d-flex flex-row justify-content-between align-items-center">
             {
               slice.slice_state !== "Dead" &&
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
      <div className="d-flex flex-row justify-content-center">
        {
          elements.length > 0 &&
          <Graph
            className="align-self-end"
            elements={elements}
            sliceName={slice.slice_name}
            onNodeSelect={this.handleNodeSelect}
            defaultSize={{"width": 0.65, "height": 0.75, "zoom": 0.85}}
          />
        }
        {
          elements.length > 0 &&
          <DetailForm data={selectedData} />
        }
      </div>
     </div>
    )
  }
}