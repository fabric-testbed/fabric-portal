
const checkIfLastChildNode = (el, updated_nodes, updated_links) => {
  // if the last VM in site, remove site element
  // if the last component in VM, remove VM element
  for (const node of updated_nodes) {

  }
}

const removeNetworkService = (el_id, links) => {
  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  // remove 3 nodes and 3 links in total.
  // remove the NS node + its child CP nodes + the "has" link between
  // remove the "connect" links among CP - LINK - NIC CP
  to_remove_node_ids.push(el_id);

  // TODO: reduce complexity
  for (const link of links) {
    if (link.Class === "connects" && link.source === el_id) {
      to_remove_node_ids.push(link.target);
      // NS connects CP
      to_remove_link_ids.push(link.id);
      for (const link2 of links) {
        if (link2.Class === "connects" && link2.source === link.target){
            to_remove_node_ids.push(link2.target);
            // NS CP connects Link
            to_remove_link_ids.push(link2.id);
            for (const link3 of links) {
              if (link3.Class === "connects" && link3.target === link2.target 
              && link3.source !== link.target) {
                // NIC CP connects Link
                to_remove_link_ids.push(link3.id);
              }
            }
          }
        }
      }
    }
    return {nodes: to_remove_node_ids, links: to_remove_link_ids};
}

const removeVM = (el_id, nodes) => {
  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  const el_node = nodes.filter(node => node.id === el_id)[0];

  to_remove_node_ids.push(el_id);

  for (const child_id of JSON.parse(el_node.layout).childNodeIDs){
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

  if (el.properties.class === "Component") {
    to_remove_node_ids = JSON.parse(el_node.layout)["relevantNodeIDs"];
    to_remove_link_ids = JSON.parse(el_node.layout)["relevantLinkIDs"];
  } else if (el.properties.class === "NetworkService") {
    alert("remove network service");
  } else if (el.properties.type === "VM") {
    const to_remove = removeVM(parseInt(el.id), nodes);
    to_remove_node_ids = to_remove.nodes;
    to_remove_link_ids = to_remove.links;
  }

  for (const node of nodes) {
    if (!to_remove_node_ids.includes(parseInt(node.id))){
      updated_nodes.push(node);
    }
  }

  for (const link of links) {
    if (!to_remove_link_ids.includes(parseInt(link.id))){
      updated_links.push(link);
    }
  }

  return { newSliceNodes: updated_nodes, newSliceLinks: updated_links }
}

const editor = {
  removeNode,
}

export default editor;