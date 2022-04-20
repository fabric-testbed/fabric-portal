import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

const addVM = (node, component, graphID, nodes, links) => {
  // 1. add vm
  // 2. add component
  // 3. add 'has' link between vm and component
  // 4. if componnet is NIC, add NIC (has) OVS (has) Connection Points.
  // SmartNIC has 2 ports and SharedNIC has 1 port.
  const vm_node = {
    "labels": ":GraphNode:NetworkNode",
    "Class": "NetworkNode",
    "Name": node.name,
    "Site": node.site,
    "Capacities": {
      "core": node.capacities.core,
      "disk": node.capacities.disk,
      "ram": node.capacities.ram,
    },
    "Type": "VM",
    "id": nodes.length + 1,
    "NodeID": uuidv4(),
    "GraphID": graphID
  }

  const component_node = {
    "labels": ":Component:GraphNode",
    "Class": "Component",
    "Name": component.name,
    "Capacities": {
      "unit": 1,
    },
    "Type": component.type,
    "id": nodes.length + 2,
    "NodeID": uuidv4(),
    "GraphID": graphID
  }

  const link = {
    "label": "has",
    "Class": "has",
    "id": links.length + 1,
    "source": nodes.length + 1,
    "target": nodes.length + 2,
  }

  let clonedNodes = _.clone(nodes);
  clonedNodes.push(vm_node);
  clonedNodes.push(component_node);
  let clonedLinks = _.clone(links);
  clonedLinks.push(link);

  // SmartNIC has 2 connection points
  // SharedNIC has 1 connection points
  if (component === "SharedNIC") {
    // Add OVS Network Service Node
    // Add NIC has OVS link
    // Add 1 or 2 Connection Points and OVS has CP link
    const ovs_node = {
      "labels": ":GraphNode:NetworkService",
      "Name": `${node.site}-${node.name}-${component.name}-ovs`,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": nodes.length + 3,
      "Type": "OVS",
      "Layer": "L2",
      "GraphID": graphID
    }

    const cp_node =   {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "SharedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p1`,
      "Capacities": {
        "unit": 1,
      },
      "id": nodes.length + 4,
      "NodeID": uuidv4(),
      "GraphID": graphID
    }
    clonedNodes.push(cp_node);
    clonedNodes.push(ovs_node);

    // NIC has OVS
    const ovs_link = {
      "label": "has",
      "Class": "has",
      "id": links.length + 2,
      "source": nodes.length + 2,
      "target": nodes.length + 3,
    }

    const cp_link = {
      "label": "connects",
      "Class": "connects",
      "id": links.length + 3,
      "source": nodes.length + 3,
      "target": nodes.length + 4,
    }

    clonedLinks.push(ovs_link);
    clonedLinks.push(cp_link);
  }

  // return sliceNodes and sliceLinks.
  return { newSliceNodes: clonedNodes, newSliceLinks: clonedLinks }
}

const addSharedNIC = () => {
  alert("sharedNIC");
}

const addSmartNIC = () => {
  alert("addSmartNIC");
}

const builder = {
  addVM,
  addSharedNIC,
  addSmartNIC,
}

export default builder;
