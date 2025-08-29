import _ from "lodash";

// const removeNetworkService = (parseInt(Number(el.id)), nodes, links) => {
//   let to_remove_node_ids = [];
//   let to_remove_link_ids = [];

//   // remove the NS node + its child CP nodes + the "connects" link between 
//   // remove all CPs
//   to_remove_node_ids.push(parseInt(Number(el.id)));

//   for (const link of links) {
//     if (link.Class === "connects" && link.source === parseInt(Number(el.id))) {
//       // NIC CP id: link.target
//       const cp_node = nodes.filter(node => node.id === link.target)[0];
//       for (const id of JSON.parse(cp_node.layout)["relevantNodeIDs"]) {
//         to_remove_node_ids.push(id);
//       }
//       for (const id of JSON.parse(cp_node.layout)["relevantLinkIDs"]) {
//         to_remove_link_ids.push(id);
//       }
//     }
//   }

//   return {nodes: to_remove_node_ids, links: to_remove_link_ids};
// }

const removeComponent = (data, nodes, links) => {
  let node = {};
  // data could be cytoscape el or model data
  if (data.properties) {
    node = nodes.filter(node => node.id === parseInt(Number(data.id)))[0];
  } else {
    node = data;
  }

  let to_remove_node_ids = [];
  let to_remove_link_ids = []

  if (node.Type === "SharedNIC") {
    to_remove_node_ids = JSON.parse(node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(node.layout)["relevantLinkIDs"];

    // check if NIC CP is connected with any Link node -> NS CP
    // find the NS CP node and its relevant nodes/ links
    const nic_cp_id = to_remove_node_ids[2];
    for (const link of links) {
      if (link.Class === "connects" && link.source === nic_cp_id) {
        // Link node id: link.source
        // Link node's "connectFrom"[2] is NS's id (Link <-> SP <-> NS)
        const ns_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][2];
        const ns_node = nodes.filter(node => node.id === ns_id)[0];
        for (const id of JSON.parse(ns_node.layout)["relevantNodeIDs"]) {
          to_remove_node_ids.push(id);
        }
        for (const id of JSON.parse(ns_node.layout)["relevantLinkIDs"]) {
          to_remove_link_ids.push(id);
        }
      }
    }
  } else if (node.Type === "SmartNIC") {
    to_remove_node_ids = JSON.parse(node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(node.layout)["relevantLinkIDs"];
    // check if NIC CP is connected with any Link node -> NS CP
    // find the NS CP node and its relevant nodes/ links
    const nic_cp_id_1 = to_remove_node_ids[2];
    const nic_cp_id_2 = to_remove_node_ids[3];
    for (const link of links) {
      if (link.Class === "connects" && link.source === nic_cp_id_1) {
        // Link node id: link.source
        // Link node's "connectFrom"[2] is NS's id (Link <-> SP <-> NS)
        const ns_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][2];
        const ns_node = nodes.filter(node => node.id === ns_id)[0];
        for (const id of JSON.parse(ns_node.layout)["relevantNodeIDs"]) {
          to_remove_node_ids.push(id);
        }
        for (const id of JSON.parse(ns_node.layout)["relevantLinkIDs"]) {
          to_remove_link_ids.push(id);
        }
      }

      if (link.Class === "connects" && link.source === nic_cp_id_2) {
        // Link node id: link.source
        // Link node's "connectFrom"[2] is NS's id (Link <-> SP <-> NS)
        const ns_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][2];
        const ns_node = nodes.filter(node => node.id === ns_id)[0];
        for (const id of JSON.parse(ns_node.layout)["relevantNodeIDs"]) {
          to_remove_node_ids.push(id);
        }
        for (const id of JSON.parse(ns_node.layout)["relevantLinkIDs"]) {
          to_remove_link_ids.push(id);
      }
      }
    }
  } else if (node.Class === "Component" || node.Type === "ServicePort") {
    to_remove_node_ids = JSON.parse(node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(node.layout)["relevantLinkIDs"];
  } else if (node.Class === "NetworkService" && node.Type !== "VLAN") {
    // const to_remove = removeNetworkService(parseInt(parseInt(Number(el.id))), nodes, links);
    to_remove_node_ids = JSON.parse(node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(node.layout)["relevantLinkIDs"];
  } else if (node.Type === "Facility") {
    const to_remove = removeFacility(node, nodes, links);
    to_remove_node_ids = to_remove.to_remove_node_ids;
    to_remove_link_ids = to_remove.to_remove_link_ids;
  }

  return { to_remove_node_ids, to_remove_link_ids };
}

const removeVM = (data, nodes, links) => {
  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  const vm_child_ids = [];

  to_remove_node_ids.push(parseInt(Number(data.id)));

  // check all VM's child components
  for (const link of links) {
    if (link.source === parseInt(Number(data.id)) && link.Class === "has") {
      vm_child_ids.push(link.target);
    }
  }

  for (const child_id of vm_child_ids){
    const child_node = nodes.filter(node => node.id === child_id)[0];
    const { to_remove_node_ids: to_rm_node_ids, 
      to_remove_link_ids: to_rm_link_ids } = removeComponent(child_node, nodes, links);
    to_remove_node_ids = to_remove_node_ids.concat(to_rm_node_ids);
    to_remove_link_ids = to_remove_link_ids.concat(to_rm_link_ids);
  }

  return { to_remove_node_ids: _.uniq(to_remove_node_ids),to_remove_link_ids:  _.uniq(to_remove_link_ids) };
}

const removeFacility = (node, nodes, links) => {
  let to_remove_node_ids = [];
  let to_remove_link_ids = [];
  // 1. remove Facility -> VLAN <-> FP nodes  
  to_remove_node_ids.push(node.id, node.id+ 1, node.id + 2);
  // 2. remove the has link between F -> VLAN and connect link between VLAN <-> FP
  for (const id of JSON.parse(node.layout)["relevantLinkIDs"]) {
    to_remove_link_ids.push(id);
  } 
  // 3. remove any network service connected to this Facility/ FP.
  // check if FP is connected with any Link node -> NS CP
  // find the NS CP node and its relevant nodes/ links
  for (const link of links) {
    if (link.Class === "connects" && link.source === (node.id + 2)) {
      const ns_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][2];
      const ns_node = nodes.filter(node => node.id === ns_id)[0];
      for (const id of JSON.parse(ns_node.layout)["relevantNodeIDs"]) {
        to_remove_node_ids.push(id);
      }
      for (const id of JSON.parse(ns_node.layout)["relevantLinkIDs"]) {
        to_remove_link_ids.push(id);
      }
    }
  }
  return { to_remove_node_ids, to_remove_link_ids};
}
const updateVM = (data, nodes) => {
  // data: vm_id, new_name and new_capacities
  const updated_nodes = [];
  for (const node of nodes) {
    if (parseInt(data.vm_id) === parseInt(node.id)) {
      node.Name = data.new_name;
      node.Capacities = data.new_capacities;
      node.BootScript = data.new_boot_script;
    } 
    updated_nodes.push(node);
  }

  return updated_nodes;
}

const updateFP = (data, nodes) => {
  // data: fp_id, new_name
  const updated_nodes = [];
  for (const node of nodes) {
    if (parseInt(data.fp_id) === parseInt(node.id)) {
      node.Name = data.new_name;
    } 
    updated_nodes.push(node);
  }

  return updated_nodes;
}

const editor = {
  removeVM,
  removeFacility,
  removeComponent,
  updateVM,
  updateFP
}

export default editor;