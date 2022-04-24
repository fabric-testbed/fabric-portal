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
  

  handleSiteAdd = () => {
    let eleObj = { data: { id: this.state.elements.length + 1, label: 'UKY', type: "roundrectangle", properties: {class: "Composite Node"} }, position: {x: 800, y: 250 }, classes: "graphSite"};
    let fakeEleObj = { data: { id: this.state.elements.length + 9999, parent:  this.state.elements.length + 1, type: "roundrectangle"}, position: {x: 800, y: 350 }, classes: "fakeNode"};
    let clonedElements = _.clone(this.state.elements);
    clonedElements.push(eleObj);
    clonedElements.push(fakeEleObj);

    // change next node position.
    // TODO:

    this.setState({elements: clonedElements});
  }

  handleVMAdd = () => {
    let eleObj = { data: { id: this.state.elements.length + 1, parent: 12,label: 'VM', type: "roundrectangle", properties: {class: "Composite Node"} }, position: {x: 800, y: 350 }, classes: "graphVM"};
    let fakeEleObj = { data: { id: this.state.elements.length + 9999, parent:  this.state.elements.length + 1, type: "roundrectangle"}, position: {x: 800, y: 350 }, classes: "fakeNode"};
    let clonedElements = _.clone(this.state.elements);
    clonedElements.push(eleObj);
    clonedElements.push(fakeEleObj);

    // change next node position.
    // TODO:

    this.setState({elements: clonedElements});
  }

  handleNodeAdd = (type) => {
    if (type !== "Site" && type !== "VM") {
      let eleObj = { data: { id: this.state.elements.length + 1, type: "roundrectangle", properties: {class: "Composite Node"} }, position: this.state.positionAddNode, classes: `graph${type}` };
      let clonedElements = _.clone(this.state.elements);
      clonedElements.push(eleObj);
  
      // change next node position.
      // TODO:
      const x = this.state.positionAddNode.x + 110;
      const y = this.state.positionAddNode.y;
      this.setState({positionAddNode: { x , y }});
  
      this.setState({elements: clonedElements});
    }
  }

  handleNodeDelete = (id) => {
    const originalElements = this.state.elements;
    const elementToDelete = originalElements.filter(e => e.data.id === id)[0];
    let newElements = originalElements;
    if (elementToDelete.data && elementToDelete.data.properties && elementToDelete.data.properties.interfaces) {
      // delete all interfaces at the same time.
      for (const interface_id of elementToDelete.data.properties.interfaces) {
        newElements = newElements.filter(e => e.data.id !== interface_id);
      }
    }

    // delete the node itself.
    newElements = newElements.filter(e => e.data.id !== id);

    this.setState({elements: newElements});
  }

  handleNodeUpdate = (id) => {
    console.log(id);
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
        {/* <SideToolbar
          className="align-self-start"
          onNodeAdd={this.handleNodeAdd}
        /> */}
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