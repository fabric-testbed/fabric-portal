import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

const modelDetails = {
  "RTX6000": "NVIDIA Corporation TU102GL [Quadro RTX 6000/8000] (rev a1)",
  "Tesla T4": "NVIDIA Corporation TU104GL [Tesla T4] (rev a1)",
  "ConnectX-6": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps",
  "ConnectX-5": "Mellanox ConnectX-5 Dual Port 10/25GbE",
  "P4510": "Dell Express Flash NVMe P4510 1TB SFF",
}

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
    "Model": component.model,
    "Details": modelDetails[component.model],
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

  // SharedNIC has 1 connection points
  // SmartNIC has 2 connection points
  if (component.type === "SharedNIC") {
    // Add OVS Network Service Node
    // Add NIC has OVS link
    // Add 1 Connection Points and OVS has CP link
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

  if (component.type === "SmartNIC") {
    // Add OVS Network Service Node
    // Add NIC has OVS link
    // Add 2 Connection Points and OVS has CP link
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

    const cp_node_1 =   {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "DedicatedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p1`,
      "Capacities": {
        "unit": 1,
      },
      "id": nodes.length + 4,
      "NodeID": uuidv4(),
      "GraphID": graphID
    }

    const cp_node_2 =   {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "SharedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p2`,
      "Capacities": {
        "unit": 1,
      },
      "id": nodes.length + 5,
      "NodeID": uuidv4(),
      "GraphID": graphID
    }

    clonedNodes.push(cp_node_1);
    clonedNodes.push(cp_node_2);
    clonedNodes.push(ovs_node);

    // NIC has OVS
    const ovs_link = {
      "label": "has",
      "Class": "has",
      "id": links.length + 2,
      "source": nodes.length + 2,
      "target": nodes.length + 3,
    }

    const cp_link_1 = {
      "label": "connects",
      "Class": "connects",
      "id": links.length + 3,
      "source": nodes.length + 3,
      "target": nodes.length + 4,
    }


    const cp_link_2 = {
      "label": "connects",
      "Class": "connects",
      "id": links.length + 4,
      "source": nodes.length + 3,
      "target": nodes.length + 5,
    }

    clonedLinks.push(ovs_link);
    clonedLinks.push(cp_link_1);
    clonedLinks.push(cp_link_2);
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
  // 1. NS has new CP 
  // 2. selected CP connects new CP
  selectedCPs.forEach((cp, i) => {
    const new_ns_cp = {
      "labels": ":ConnectionPoint:GraphNode",
      "Class": "ConnectionPoint",
      "Type": "ServicePort",
      "Name": `${cp.properties.name}-p${i}`,
      "NodeID": uuidv4(),
      "Capacities": {
        "unit": 1,
      },
      "id": new_ns_id + i + 1,
      "GraphID": graphID
    }

    const ns_has_cp_link = {
      "label": "has",
      "Class": "has",
      "id": new_link_id_starts,
      "source": new_ns_id,
      "target": new_ns_id + i + 1,
    }

    new_link_id_starts += 1;

    const cp_connects_cp_link = {
      "label": "connects",
      "Class": "connects",
      "id": new_link_id_starts,
      "source": cp.id,
      "target": new_ns_id + i + 1,
    }

    new_link_id_starts += 1;

    clonedNodes.push(new_ns_cp);
    clonedLinks.push(ns_has_cp_link);
    clonedLinks.push(cp_connects_cp_link);
  })

  // return sliceNodes and sliceLinks.
  return { newSliceNodes: clonedNodes, newSliceLinks: clonedLinks }
}

const builder = {
  addVM,
  addSharedNIC,
  addSmartNIC,
  addLink,
}

export default builder;
