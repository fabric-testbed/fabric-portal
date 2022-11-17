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
    const ids = data.map(obj => parseInt(obj.id));
    const new_id = Math.max(...ids) + 1;
    return new_id;
  }
}

const addComponent = (node, component, graphID, vm_node_id, component_node_id, component_link_id) => {
  const nodes_to_add = [];
  const links_to_add = [];

  // For GPU/ NVME/ Storage, only 1 node and 1 link to add.
  // For NIC, add 1 node and 1 link first.
  const component_node = {
    // "labels": ":Component:GraphNode",
    "Class": "Component",
    "Name": component.name,
    "Capacities": JSON.stringify({"unit": 1}),
    "Type": component.type,
    "Model": component.model,
    "Details": modelDetails[component.model],
    "StitchNode": "false",
    "id": component_node_id,
    "NodeID": uuidv4(),
    "GraphID": graphID,
  }

  // For Storage component, add local name
  if(component.type === "Storage") {
    component_node.Labels = JSON.stringify({"local_name": component.name});
  }

  const link = {
    "label": "has",
    "Class": "has",
    "id": component_link_id,
    "source": vm_node_id,
    "target": component_node_id,
  }

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
      // "labels": ":GraphNode:NetworkService",
      "Name": `${node.site}-${node.name}-${component.name}-ovs`,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": component_node_id + 1,
      "Type": "OVS",
      "Layer": "L2",
      "StitchNode": "false",
      "GraphID": graphID,
      "layout": JSON.stringify({
        "parentID": component_node_id,
        "hasLinkIdAsTarget": component_link_id + 1,
      })
    }

    const cp_node =   {
      // "labels": ":ConnectionPoint:GraphNode",
      "Labels": JSON.stringify({"local_name": "p1"}),
      "Class": "ConnectionPoint",
      "Type": "SharedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p1`,
      "Capacities": JSON.stringify({"unit": 1}),
      "id": component_node_id + 2,
      "NodeID": uuidv4(),
      "StitchNode": "false",
      "GraphID": graphID,
      "layout": JSON.stringify({
        "connectFrom": component_node_id + 1,
        "connectLinkIdAsTarget": component_link_id + 2
      })
    }

    nodes_to_add.push(cp_node);
    nodes_to_add.push(ovs_node);

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

    const component_relevant_node_ids = [];
    const component_relevant_link_ids = [];
    component_relevant_node_ids.push(component_node_id, component_node_id + 1, component_node_id + 2);
    component_relevant_link_ids.push(component_link_id, component_link_id + 1, component_link_id + 2);

    component_node.layout =  JSON.stringify({
      "parentID": vm_node_id,
      "relevantNodeIDs": component_relevant_node_ids,
      "relevantLinkIDs": component_relevant_link_ids,
    })
  }

  if (component.type === "SmartNIC") {
    // Add OVS Network Service Node
    // Add NIC has OVS link
    // Add 2 Connection Points and OVS has CP link
    const ovs_node = {
      // "labels": ":GraphNode:NetworkService",
      "Name": `${node.site}-${node.name}-${component.name}-ovs`,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": component_node_id + 1,
      "Type": "OVS",
      "Layer": "L2",
      "StitchNode": "false",
      "GraphID": graphID,
      "layout": JSON.stringify({
        "parentID": component_node_id,
        "hasLinkIdAsTarget": component_link_id + 1,
      })
    }

    const cp_node_1 =   {
      // "labels": ":ConnectionPoint:GraphNode",
      "Labels": JSON.stringify({"local_name": "p1"}),
      "Class": "ConnectionPoint",
      "Type": "DedicatedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p1`,
      "Capacities": JSON.stringify({"unit": 1}),
      "id": component_node_id + 2,
      "NodeID": uuidv4(),
      "StitchNode": "false",
      "GraphID": graphID,
      "layout": JSON.stringify({
        "connectFrom": component_node_id + 1,
        "connectLinkIdAsTarget": component_link_id + 2
      })
    }

    const cp_node_2 =   {
      // "labels": ":ConnectionPoint:GraphNode",
      "Labels": JSON.stringify({"local_name": "p2"}),
      "Class": "ConnectionPoint",
      "Type": "DedicatedPort",
      "Name":  `${node.site}-${node.name}-${component.name}-p2`,
      "Capacities": JSON.stringify({"unit": 1}),
      "id": component_node_id + 3,
      "NodeID": uuidv4(),
      "StitchNode": "false",
      "GraphID": graphID,
      "layout": JSON.stringify({
        "connectFrom": component_node_id + 1,
        "connectLinkIdAsTarget": component_link_id + 3
      })
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
      "id": component_link_id + 3,
      "source": component_node_id + 1,
      "target": component_node_id + 3,
    }

    links_to_add.push(ovs_link);
    links_to_add.push(cp_link_1);
    links_to_add.push(cp_link_2);

    const component_relevant_node_ids = [];
    const component_relevant_link_ids = [];
    component_relevant_node_ids.push(component_node_id, component_node_id + 1, component_node_id + 2, component_node_id + 3);
    component_relevant_link_ids.push(component_link_id, component_link_id + 1, component_link_id + 2, component_link_id + 3);

    component_node.layout =  JSON.stringify({
      "parentID": vm_node_id,
      "relevantNodeIDs": component_relevant_node_ids,
      "relevantLinkIDs": component_relevant_link_ids,
    })
  }

  if (["NVME", "GPU", "Storage"].includes(component.type)){
    component_node.layout =  JSON.stringify({
      "parentID": vm_node_id,
      "relevantNodeIDs": [component_node_id],
      "relevantLinkIDs": [component_link_id],
    })
  }

  nodes_to_add.push(component_node);
  
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
  // const vm_node_id = generateID(nodes);
  const vm_node_id = generateID(nodes);

  const capacitiesObj = {
    "core": node.capacities.core,
    "disk": node.capacities.disk,
    "ram": node.capacities.ram,
  }

  const vm_node = {
    // "labels": ":GraphNode:NetworkNode",
    "Class": "NetworkNode",
    "Name": node.name,
    "Site": node.site,
    "Capacities": JSON.stringify(capacitiesObj),
    "ImageRef": node.image,
    "Type": "VM",
    "id": vm_node_id,
    "NodeID": uuidv4(),
    "GraphID": graphID,
    "StitchNode": "false",
  }

  if (components.length > 0) {
    let component_node_id = vm_node_id + 1;
    let component_link_id = generateID(links);
  
    for(const component of components) {
      const [compo_nodes, compo_links] = addComponent(node, component, graphID, vm_node_id, component_node_id, component_link_id);
      for (const node of compo_nodes) {
        clonedNodes.push(node);
      }
      for (const link of compo_links) {
        clonedLinks.push(link);
      }
  
      component_node_id += compo_nodes.length;
      component_link_id += compo_links.length;
    }
  }

  clonedNodes.push(vm_node);

  // return sliceNodes and sliceLinks.
  return { newSliceNodes: clonedNodes, newSliceLinks: clonedLinks }
}

// async, await for adding network service
// 1. add a Network Service Node and its Connection Points
// 2. add two 'connects' links: cpID1 - NS.cp1 and NS.cp2 - cpID2
const addLink = (type, name, selectedCPs, graphID, nodes, links) => {
  // L2Bridge NS node has site property while other types don't.
  let network_service_node = {};
  const new_ns_id = generateID(nodes);
  let clonedNodes = _.clone(nodes);
  let clonedLinks = _.clone(links);

  const ns_layout = {
    connectLinkIdAsSource: [],
    connectTo: [],
  };

  if (type === "L2Bridge") {
    const siteName = selectedCPs[0].properties.name.substr(0, selectedCPs[0].properties.name.indexOf('-'));
    network_service_node = {
      // "labels": ":GraphNode:NetworkService",
      "Name": name,
      "Site": siteName,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": new_ns_id,
      "Type": type,
      "Layer": "L2",
      "StitchNode": "false",
      "GraphID": graphID,
      "layout": JSON.stringify({
        "parentID": selectedCPs[0].id,
      })
    }
  } else {
    network_service_node = {
      // "labels": ":GraphNode:NetworkService",
      "Name": name,
      "Class": "NetworkService",
      "NodeID": uuidv4(),
      "id": new_ns_id,
      "Type": type,
      "Layer": (type === "FABNetv4" || type === "FABNetv6") ? "L3" : "L2",
      "GraphID": graphID,
      "StitchNode": "false",
    }
  }

  // ##############################################################
  // TODO: Validate if selected CPs aligns with the seleced NS Type
  // ##############################################################

  // Total: 2 nodes and 3 links to add.
  // Nodes: new NS CP + new Link node
  // Links: NS 'connects' new CP + new CP connects new Link node + selected CP 'connects' New Link Node
  let new_node_id_starts = new_ns_id + 1;
  let new_link_id_starts = generateID(links);
  selectedCPs.forEach((cp, i) => {
    // Relevant to each ServicePort: 3 links and 2 nodes 
    const relevantLinkIDs = [];
    const relevantNodeIDs = [];

    relevantNodeIDs.push(new_node_id_starts, new_node_id_starts + 1);
    relevantLinkIDs.push(new_link_id_starts, new_link_id_starts + 1, new_link_id_starts + 2);

    const new_ns_cp = {
      // "labels": ":ConnectionPoint:GraphNode",
      // "Labels": JSON.stringify({"local_name": `p${i}`}),
      "Class": "ConnectionPoint",
      "Type": "ServicePort",
      "Name": `${cp.properties.name}-p${i}`,
      "NodeID": uuidv4(),
      "Capacities": JSON.stringify({"unit": 1,}),
      "id":  new_node_id_starts,
      "GraphID": graphID,
      "StitchNode": "false",
      "layout": JSON.stringify({
        "connectFrom": new_ns_id,
        "relevantNodeIDs": relevantNodeIDs,
        "relevantLinkIDs": relevantLinkIDs,
      })
    }

    ns_layout.connectTo.push(new_node_id_starts);

    const new_link_node = {
      "GraphID": graphID,
      "StitchNode": "false",
      "Class": "Link",
      "NodeID": uuidv4(),
      "Name": `${cp.properties.name}-p${i}-link`,
      "Type": "Patch",
      "Layer": "L2",
      "id":  new_node_id_starts + 1,
      "layout": JSON.stringify({
        "connectFrom": [new_node_id_starts, parseInt(cp.id)],
        "connectLinkIdAsTarget": [new_link_id_starts + 1, new_link_id_starts + 2],
      })
    }

    const ns_connects_cp = {
      "label": "connects",
      "Class": "connects",
      "id": new_link_id_starts,
      "source": new_ns_id,
      "target":  new_node_id_starts,
    }

    ns_layout.connectLinkIdAsSource.push(new_link_id_starts);

    const ns_cp_connects_new_link = {
      "label": "connects",
      "Class": "connects",
      "id": new_link_id_starts + 1,
      "source":  new_node_id_starts,
      "target":  new_node_id_starts + 1,
    }

    const nic_cp_connects_new_link = {
      "label": "connects",
      "Class": "connects",
      "id": new_link_id_starts + 2,
      "source": parseInt(cp.id),
      "target":  new_node_id_starts + 1,
    }

    new_link_id_starts += 3;
    new_node_id_starts += 2;

    clonedNodes.push(new_ns_cp, new_link_node);
    clonedLinks.push(ns_connects_cp, ns_cp_connects_new_link, nic_cp_connects_new_link);
  })

  network_service_node.layout = JSON.stringify(ns_layout);

  clonedNodes.push(network_service_node);

  return { newSliceNodes: clonedNodes, newSliceLinks: clonedLinks }
}

const builder = {
  generateID,
  addVM,
  addLink,
  addComponent,
}

export default builder;