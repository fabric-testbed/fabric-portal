import React, { Component } from 'react'
import SideToolbar from '../components/SliceViewer/SideToolbar';
import Graph from '../components/SliceViewer/Graph';
import DetailForm from '../components/SliceViewer/DetailForm';
import _ from "lodash";

import { getSliceById } from "../services/fakeSlices.js";
import sliceParser from "../services/parser/sliceParser.js";

export default class SliceViewer extends Component { 
  state = {
    elements: sliceParser(getSliceById(this.props.match.params.id)),
    // [
    //   { data: { id: 2, label: 'MyVM1', parent: 12, type: "rectangle", capacities: { core: 32, ram: 512, disk: 100 } } },
    //   { data: { id: 1, parent: 2, type: "roundrectangle", properties: {class:"Component", type: "GPU", model: "Tesla T4"}, capacities: { unit: 4 } }, position: { x: 115, y: 100 }, classes: "graphGPU" },
    //   { data: { id: 3, parent: 2, type: "roundrectangle", properties: {class:"Component", type: "NVMe", model: "P4510"}, capacities: {disk: 10000, unit: 10 } }, position: { x: 250, y: 100 }, classes: "graphNVMe" },
    //   { data: { id: 4, parent: 2, type: "roundrectangle", properties: {class:"Component", type: "SharedNIC", model: "ConnectX-6", interfaces: ["16", "17"], capacities: { unit: 2 } }, capacities: { unit: 3 } }, position: { x: 385, y: 100 }, classes: "graphSmartNIC" },
    //   { data: { id: 5, label: 'MyVM3', parent: 12, type: "rectangle", capacities: { core: 20, ram: 300, disk: 50 } } },
    //   { data: { id: 6, parent: 5, type: "roundrectangle", properties: {class:"Component", type: "SmartNIC", model: "ConnectX-6"}, capacities: { unit: 2 } }, position: { x: 115, y: 375 }, classes: "graphSmartNIC" },
    //   { data: { id: 7, parent: 5, type: "roundrectangle", properties: {class:"Component", type: "NVMe", model: "P4510"}, capacities: {disk: 10000, unit: 10 } }, position: { x: 250, y: 375 }, classes: "graphNVMe" },
    //   { data: { id: 8, label: 'MyVM2', parent: 12, type: "rectangle", capacities: { core: 10, ram: 200, disk: 30 } } },
    //   { data: { id: 9, parent: 8, type: "roundrectangle", properties: {class:"Component", type: "SmartNIC", model: "ConnectX-5"}, capacities: { unit: 2 } }, position: { x: 400, y: 475 }, classes: "graphSmartNIC" },
    //   { data: { id: 10, parent: 8, type: "roundrectangle", properties:  {class:"Component", type: "NVMe", model: "P4510"}, capacities: {disk: 10000, unit: 10 } }, position: { x: 550, y: 475 }, classes: "graphNVMe" },
    //   { data: { id: 11, label: 'MyP4Switch', type: "roundrectangle", parent: 12, properties: {class:"Component", type: "Switch", model: "Model"} }, classes: "graphSwitchFabric" },
    //   { data: { id: 12, label: 'RENC', type: "roundrectangle", properties: {class: "Composite Node"} } },
    //   { data: { id: 13, label: 'MyLink', parent: 12, type: "roundrectangle", properties: {class:"has"}, capacities: { bandwidth: 100 } }, position: { x: 150, y: 225 }, classes: "graphLink", },
    //   { data: { id: 14, label: 'MyLink2', parent: 12, type: "roundrectangle", properties: {class:"has"}, capacities: { bandwidth: 50 } }, position: { x: 400, y: 200 }, classes: "graphLink"},
    //   { data: { id: 15, label: 'MyLink1', parent: 12, type: "roundrectangle", properties: {class:"has"}, capacities: { bandwidth: 60 } }, position: { x: 450, y: 360 }, classes: "graphLink"},
    //   { data: { source: 1, target: 13 } },
    //   { data: { source: 13, target: 6 }, },
    //   { data: { source: 17, target: 14 } },
    //   { data: { source: 14, target: 11 } },
    //   { data: { source: 11, target: 15 } },
    //   { data: { source: 15, target: 9 } },
    //   { data: { id: 16, parent: 2, type: "rectangle", properties: {name: "ConnectX-6 Interface 1", is_interface: true} }, position: { x: 360, y: 140 }, classes: "graphInterfaces" },
    //   { data: { id: 17, parent: 2, type: "rectangle", properties: {name: "ConnectX-6 Interface 2", is_interface: true} }, position: { x: 410, y: 140 }, classes: "graphInterfaces" },
    //   { data: { id: 18, parent: 11, type: "rectangle", properties: {name: "Switch Interface 1", is_interface: true} }, position: { x: 400, y: 305 }, classes: "graphInterfaces" },
    //   { data: { id: 19, parent: 11, type: "rectangle", properties: {name: "Switch Interface 2", is_interface: true} }, position: { x: 430, y: 305 }, classes: "graphInterfaces" },
    // ],
    selectedData: null,
    positionAddNode: { x: 100, y: 600 },
  }

  componentDidMount = () => {
    // console.log(this.state.elements)
  }

  handleNodeSelect = (selectedData) => {
    this.setState({ selectedData });
    // ------------ TODO: ----------------
    console.log(selectedData)
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
    return(
      <div className="mx-4 mb-4">
        <div className="modal fade" id="siteModal" tabIndex="-1" role="dialog" aria-labelledby="siteModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="siteModalLabel">Add New Site</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <select className="custom-select" id="inputGroupSelect01">
                  <option value="0">Choose A Site</option>
                  <option value="1">RENC</option>
                  <option value="2">UKY</option>
                  <option value="3">LBNL</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-outline-success" onClick={this.handleSiteAdd} data-dismiss="modal">Add</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="vmModal" tabIndex="-1" role="dialog" aria-labelledby="vmModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="vmModalLabel">Add New VM</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <select className="custom-select" id="inputGroupSelect02">
                  <option value="0">Add VM to Site</option>
                  <option value="1">RENC</option>
                  <option value="2">UKY</option>
                  <option value="3">LBNL</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-outline-success" onClick={this.handleVMAdd} data-dismiss="modal">Add</button>
              </div>
            </div>
          </div>
        </div>
      <div className="d-flex flex-row justify-content-center mt-4">
        <SideToolbar
          className="align-self-start"
          onNodeAdd={this.handleNodeAdd}
        />
        <Graph
          className="align-self-end" elements={this.state.elements}
          onNodeSelect={this.handleNodeSelect}
        />
      </div>
      <DetailForm
        data={this.state.selectedData}
        onNodeDelete={this.handleNodeDelete}
        onNodeUpdate={this.handleNodeUpdate}
      />
     </div>
    )
  }
}