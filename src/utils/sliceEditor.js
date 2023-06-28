const removeNetworkService = (el_id, nodes, links) => {
  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  // remove the NS node + its child CP nodes + the "connects" link between 
  // remove all CPs
  to_remove_node_ids.push(el_id);

  for (const link of links) {
    if (link.Class === "connects" && link.source === el_id) {
      // NIC CP id: link.target
      const cp_node = nodes.filter(node => node.id === link.target)[0];
      for (const id of JSON.parse(cp_node.layout)["relevantNodeIDs"]) {
        to_remove_node_ids.push(id);
      }
      for (const id of JSON.parse(cp_node.layout)["relevantLinkIDs"]) {
        to_remove_link_ids.push(id);
      }
    }
  }

  return {nodes: to_remove_node_ids, links: to_remove_link_ids};
}

const removeVM = (el_id, nodes, links) => {
  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  to_remove_node_ids.push(el_id);

  const vm_child_ids = [];

  for (const link of links) {
    if (link.source === el_id && link.Class === "has") {
      vm_child_ids.push(link.target);
    }
  }

  for (const child_id of vm_child_ids){
    const child_node = nodes.filter(node => node.id === child_id)[0];

    for (const id of JSON.parse(child_node.layout)["relevantNodeIDs"]) {
      to_remove_node_ids.push(id);
    }

    for (const id of JSON.parse(child_node.layout)["relevantLinkIDs"]) {
      to_remove_link_ids.push(id);
    } 
  }

  return {nodes: to_remove_node_ids, links: to_remove_link_ids};
}

const removeNode = (el, nodes, links) => {
  // el: cytoscape element data
  const el_node = nodes.filter(node => node.id === parseInt(el.id))[0];

  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  let updated_nodes = [];
  let updated_links = [];

  if (el.properties.type === "SharedNIC") {
    to_remove_node_ids = JSON.parse(el_node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(el_node.layout)["relevantLinkIDs"];
    // check if NIC CP is connected with any Link node -> NS CP
    // find the NS CP node and its relevant nodes/ links
    const nic_cp_id = to_remove_node_ids[2];
    for (const link of links) {
      if (link.Class === "connects" && link.source === nic_cp_id) {
        // Link node id: link.source
        // Link node's "connectFrom"[0] is NS CP
        const ns_cp_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][0];
        const ns_cp_node = nodes.filter(node => node.id === ns_cp_id)[0];
        for (const id of JSON.parse(ns_cp_node.layout)["relevantNodeIDs"]) {
          to_remove_node_ids.push(id);
        }
        for (const id of JSON.parse(ns_cp_node.layout)["relevantLinkIDs"]) {
          to_remove_link_ids.push(id);
        }
      }
    }
  } else if (el.properties.type === "SmartNIC") {
    to_remove_node_ids = JSON.parse(el_node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(el_node.layout)["relevantLinkIDs"];
    // check if NIC CP is connected with any Link node -> NS CP
    // find the NS CP node and its relevant nodes/ links
    const nic_cp_id_1 = to_remove_node_ids[2];
    const nic_cp_id_2 = to_remove_node_ids[3];
    for (const link of links) {
      if (link.Class === "connects" && link.source === nic_cp_id_1) {
        // Link node id: link.source
        // Link node's "connectFrom"[0] is NS CP
        const ns_cp_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][0];
        const ns_cp_node = nodes.filter(node => node.id === ns_cp_id)[0];
        for (const id of JSON.parse(ns_cp_node.layout)["relevantNodeIDs"]) {
          to_remove_node_ids.push(id);
        }
        for (const id of JSON.parse(ns_cp_node.layout)["relevantLinkIDs"]) {
          to_remove_link_ids.push(id);
        }
      }

      if (link.Class === "connects" && link.source === nic_cp_id_2) {
        // Link node id: link.source
        // Link node's "connectFrom"[0] is NS CP
        const ns_cp_id = JSON.parse(nodes.filter(node => node.id === link.target)[0].layout)["connectFrom"][0];
        const ns_cp_node = nodes.filter(node => node.id === ns_cp_id)[0];
        for (const id of JSON.parse(ns_cp_node.layout)["relevantNodeIDs"]) {
          to_remove_node_ids.push(id);
        }
        for (const id of JSON.parse(ns_cp_node.layout)["relevantLinkIDs"]) {
          to_remove_link_ids.push(id);
        }
      }
    }
  } else if (el.properties.class === "Component" || el.properties.type === "ServicePort") {
    to_remove_node_ids = JSON.parse(el_node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(el_node.layout)["relevantLinkIDs"];
  } else if (el.properties.class === "NetworkService") {
    const to_remove = removeNetworkService(parseInt(el.id), nodes, links);
    to_remove_node_ids = to_remove.nodes;
    to_remove_link_ids = to_remove.links;
  } else if (el.properties.type === "VM") {
    const to_remove = removeVM(parseInt(el.id), nodes, links);
    to_remove_node_ids = to_remove.nodes;
    to_remove_link_ids = to_remove.links;
  }

  for (const link of links) {
    if (!to_remove_link_ids.includes(parseInt(link.id))){
      updated_links.push(link);
    }
  }

  for (const node of nodes) {
    if (!to_remove_node_ids.includes(parseInt(node.id))){
      updated_nodes.push(node);
    }
  }

  return { newSliceNodes: updated_nodes, newSliceLinks: updated_links }
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
  removeNode,
  updateVM,
  updateFP
}

export default editor;