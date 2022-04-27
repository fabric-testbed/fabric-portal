import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

const modelDetails = {
  "RTX6000": "NVIDIA Corporation TU102GL [Quadro RTX 6000/8000] (rev a1)",
  "Tesla T4": "NVIDIA Corporation TU104GL [Tesla T4] (rev a1)",
  "ConnectX-6": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps",
  "ConnectX-5": "Mellanox ConnectX-5 Dual Port 10/25GbE",
  "P4510": "Dell Express Flash NVMe P4510 1TB SFF",
}


const generateID = (data) => {
  // data: "nodes" or "links"
  // find largest id of current nodes/links, then + 1
  if (data.length === 0) {
    return 1;
  } else {
    const ids = data.map(obj => obj.id);
    return Math.max(...ids);
  }
}

const addComponent = (node, component, graphID, vm_node_id, component_node_id, component_link_id) => {
  const nodes_to_add = [];
  const links_to_add = [];

  // For GPU and NVME, only 1 node and 1 link to add.
  // For NIC, add 1 node and 1 link first.
  const component_node = {
    "labels": ":Component:GraphNode",
    "Class": "Component",
    "Name": component.name,
    "Capacities": JSON.stringify({"unit": 1}),
    "Type": component.type,
    "Model": component.model,
    "Details": modelDetails[component.model],
    "id": component_node_id,
    "NodeID": uuidv4(),
    "GraphID": graphID
  }

  const link = {
    "label": "has",
    "Class": "has",
    "id": component_link_id,
    "source": vm_node_id,
    "target": component_node_id,
  }

  nodes_to_add.push(component_node);
  links_to_add.push(link);

  // SharedNIC has 1 connection points
  // SmartNIC has 2 connection points
  // NIC -> OVS -> CP(s)
  // 2 or 3 extra nodes to add; 2 or 3 extra links to add.
  if (component.type === "SharedNIC") {
    // Add OVS Network Service Node
    // Add NIC has OVS link
    // Add 1 Connection Points and OVS has CP link
    const ovs_node = {
      "labels": ":GraphNode:NetworkService",
      "Name": `${node.site}-${node.name}-${component.name}-ovs`,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": component_node_id + 1,
      "Type": "OVS",
      "Layer": "L2",
      "GraphID": graphID
    }

    const cp_node =   {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "SharedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p1`,
      "Capacities": JSON.stringify({"unit": 1}),
      "id": component_node_id + 2,
      "NodeID": uuidv4(),
      "GraphID": graphID
    }

    nodes_to_add.push(cp_node);
    nodes_to_add.push(ovs_node);

    // NIC has OVS
    const ovs_link = {
      "label": "has",
      "Class": "has",
      "id": component_link_id + 1,
      "source": component_node_id,
      "target": component_node_id + 1,
    }

    const cp_link = {
      "label": "connects",
      "Class": "connects",
      "id": component_link_id + 2,
      "source": component_node_id + 1,
      "target": component_node_id + 2,
    }

    links_to_add.push(ovs_link);
    links_to_add.push(cp_link);
  }

  if (component.type === "SmartNIC") {
    // Add OVS Network Service Node
    // Add NIC has OVS link
    // Add 2 Connection Points and OVS has CP link
    const ovs_node = {
      "labels": ":GraphNode:NetworkService",
      "Name": `${node.site}-${node.name}-${component.name}-ovs`,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": component_node_id + 1,
      "Type": "OVS",
      "Layer": "L2",
      "GraphID": graphID
    }

    const cp_node_1 =   {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "DedicatedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p1`,
      "Capacities": JSON.stringify({"unit": 1}),
      "id": component_node_id + 2,
      "NodeID": uuidv4(),
      "GraphID": graphID
    }

    const cp_node_2 =   {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "SharedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p2`,
      "Capacities": JSON.stringify({"unit": 1}),
      "id": component_node_id + 3,
      "NodeID": uuidv4(),
      "GraphID": graphID
    }

    nodes_to_add.push(cp_node_1);
    nodes_to_add.push(cp_node_2);
    nodes_to_add.push(ovs_node);

    // NIC has OVS
    const ovs_link = {
      "label": "has",
      "Class": "has",
      "id": component_link_id + 1,
      "source": component_node_id,
      "target": component_node_id + 1,
    }

    const cp_link_1 = {
      "label": "connects",
      "Class": "connects",
      "id": component_link_id + 2,
      "source": component_node_id + 1,
      "target": component_node_id + 2,
    }

    const cp_link_2 = {
      "label": "connects",
      "Class": "connects",
      "id": component_link_id + 2,
      "source": component_node_id + 1,
      "target": component_node_id + 3,
    }

    links_to_add.push(ovs_link);
    links_to_add.push(cp_link_1);
    links_to_add.push(cp_link_2);
  }

  return [nodes_to_add, links_to_add];
}

const addVM = (node, components, graphID, nodes, links) => {
  let clonedNodes = _.clone(nodes);
  let clonedLinks = _.clone(links);
  // 1. add vm
  // 2. add component
  // 3. add 'has' link between vm and component
  // 4. if componnet is NIC, add NIC (has) OVS (has) Connection Points.
  // SmartNIC has 2 ports and SharedNIC has 1 port.
  const vm_node_id = nodes.length + 1;

  const capacitiesObj = {
    "core": node.capacities.core,
    "disk": node.capacities.disk,
    "ram": node.capacities.ram,
  }

  const vm_node = {
    "labels": ":GraphNode:NetworkNode",
    "Class": "NetworkNode",
    "Name": node.name,
    "Site": node.site,
    "Capacities": JSON.stringify(capacitiesObj),
    "ImageRef": node.image,
    "Type": "VM",
    "id": vm_node_id,
    "NodeID": uuidv4(),
    "GraphID": graphID
  }

  clonedNodes.push(vm_node);

  let component_node_id = nodes.length + 2;
  let component_link_id = links.length + 1;

  for(const component of components) {
    const [nodes, links] = addComponent(node, component, graphID, vm_node_id, component_node_id, component_link_id);
    for (const node of nodes) {
      clonedNodes.push(node);
    }
    for (const link of links) {
      clonedLinks.push(link);
    }

    component_node_id += nodes.length;
    component_link_id += links.length;
  }

  // return sliceNodes and sliceLinks.
  return { newSliceNodes: clonedNodes, newSliceLinks: clonedLinks }
}

// async, await for adding network service
// 1. add a Network Service Node and its Connection Points
// 2. add two 'connects' links: cpID1 - NS.cp1 and NS.cp2 - cpID2
const addLink = (type, name, selectedCPs, graphID, nodes, links) => {
  // L2Bridge NS node has site property while other types don't.
  let network_service_node = {};
  const new_ns_id = nodes.length + 1;
  let new_link_id_starts = links.length + 1;
  let clonedNodes = _.clone(nodes);
  let clonedLinks = _.clone(links);

  if (type === "L2Bridge") {
    const siteName = selectedCPs[0].properties.name.substr(0, selectedCPs[0].properties.name.indexOf('-'))
    network_service_node = {
      "labels": ":GraphNode:NetworkService",
      "Name": name,
      "Site": siteName,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": new_ns_id,
      "Type": type,
      "Layer": "L2",
      "GraphID": graphID
    }
  } else if (type === "FABNetv4" || type === "FABNetv6") {
    network_service_node = {
      "labels": ":GraphNode:NetworkService",
      "Name": name,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": new_ns_id,
      "Type": type,
      "Layer": "L3",
      "GraphID": graphID
    }
  } else {
    network_service_node = {
      "labels": ":GraphNode:NetworkService",
      "Name": name,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": new_ns_id,
      "Type": type,
      "Layer": "L2",
      "GraphID": graphID
    }
  }

  clonedNodes.push(network_service_node);

  // ######################################################
  // TODO: Validate if selected CPs aligns with the NS Type
  // ######################################################

  // add same number of CPs within the Network Service based on selected CPs.
  // add 2 links for each new CP accordingly 
  // 1. NS connects new CP 
  // 2. selected CP connects new CP
  selectedCPs.forEach((cp, i) => {
    const new_ns_cp = {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "ServicePort",
      "Name": `${cp.properties.name}-p${i}`,
      "NodeID": uuidv4(),
      "Capacities": JSON.stringify({"unit": 1,}),
      "id": new_ns_id + i + 1,
      "GraphID": graphID
    }

    const ns_connects_cp_link = {
      "label": "connects",
      "Class": "connects",
      "id": new_link_id_starts,
      "source": new_ns_id,
      "target": new_ns_id + i + 1,
    }

    new_link_id_starts += 1;

    const cp_connects_cp_link = {
      "label": "connects",
      "Class": "connects",
      "id": new_link_id_starts,
      "source": parseInt(cp.id),
      "target": new_ns_id + i + 1,
    }

    new_link_id_starts += 1;

    clonedNodes.push(new_ns_cp);
    clonedLinks.push(ns_connects_cp_link);
    clonedLinks.push(cp_connects_cp_link);
  })

  return { newSliceNodes: clonedNodes, newSliceLinks: clonedLinks }
}

const builder = {
  addVM,
  addLink,
}

export default builder;