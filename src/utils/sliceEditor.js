
const removeNode = (el, nodes, links) => {
  const el_id = parseInt(el.id);
  // el: cytoscape element data
  let updated_nodes = [];
  let updated_links = [];

  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  if(el.properties.class === "NetworkService") {
    // remove the NS node + its child CP nodes + the "has" link between
    // remove the "connect" links between its CP nodes and NIC nodes
    to_remove_node_ids.push(el_id);

    for (const link of links) {
      if (link.Class === "has" && link.source === el_id) {
        to_remove_node_ids.push(link.target);
        to_remove_link_ids.push(link.id);
        for (const link2 of links) {
          if (link2.Class === "connects" && 
              (link2.source === link.target
                || link2.target === link.target)
             ) {
            to_remove_link_ids.push(link2.id);
            }
          }
        }
      }
    }

    if(el.properties.type === "SharedNIC") {
      // removes VM has SharedNIC
      // removes SharedNIC node + its child OVS node + the 'has' link between
      // remove OVS's 1 child node + the 'connects' link between
      // remove any NS CP and connect link

      // TODO: Check if this way is compatible with slices not generated in portal slice builder

      // Remove SharedNIC -> OVS -> CP, 3 nodes
      // id: SharedNIC
      // id + 1: CP
      // id + 2: OVS
      to_remove_node_ids.push(el_id, el_id + 1, el_id + 2);

      // Remove NIC has OVS + OVS connects CP, 2 links
      for (const link of links) {
        // removes VM has SharedNIC and SharedNIC has OVS
        if (link.Class === "has" &&
        (link.target === el_id || link.source === el_id)) {
          to_remove_link_ids.push(link.id);
        } 

        // OVS connects CP
        if (link.Class === "connects" && link.source === el_id + 1) {
          to_remove_link_ids.push(link.id);
        }

        // Potential link to NS CP
        // Remove the CP - NS CP link, NS CP node, and NS has NS CP link.
        if (link.Class === "connects" && link.source === el_id + 2) {
          to_remove_link_ids.push(link.id);
          to_remove_node_ids.push(link.target);
          for (const link2 of links) {
            if (link2.Class === "has" && link2.target === link.target){
              to_remove_link_ids.push(link2.id);
            }
          }
        }
      }
    }

    if (el.properties.type === "SmartNIC") {
      // removes VM has SmartNIC
      // removes SmartNIC node + its child OVS node + the 'has' link between
      // remove OVS's 2 child nodes + the 'connects' links between
      
      // TODO: Check if this way is compatible with slices not generated in portal slice builder

      // Remove SharedNIC -> OVS -> 2 CPs, 4 nodes
      // id: sharedNIC
      // id + 1: OVS
      // id + 2: CP1
      // id + 3: CP2
      to_remove_node_ids.push(el_id, el_id + 1, el_id + 2, el_id + 3);

      // Remove NIC has OVS + OVS connects 2 CPs, 3 links
      for (const link of links) {
        // removes VM has SharedNIC
        if (link.Class === "has" &&
          (link.target === el_id || link.source === el_id)) {
            to_remove_link_ids.push(link.id);
        }

        // OVS connects CP
        if (link.Class === "connects" && link.source === el_id + 1) {
          to_remove_link_ids.push(link.id);
        }

        if (link.Class === "connects" && link.source === el_id + 2) {
          to_remove_link_ids.push(link.id);
        }

        // Potential link to NS CP
        // Remove the CP - NS CP link, NS CP node, and NS has NS CP link.
        if (link.Class === "connects" && link.source === el_id + 2) {
          to_remove_link_ids.push(link.id);
          to_remove_node_ids.push(link.target);
          for (const link2 of links) {
            if (link2.Class === "has" && link2.target === link.target){
              to_remove_link_ids.push(link2.id);
            }
          }
        }

        if (link.Class === "connects" && link.source === el_id + 3) {
          to_remove_link_ids.push(link.id);
          to_remove_node_ids.push(link.target);
          for (const link2 of links) {
            if (link2.Class === "has" && link2.target === link.target){
              to_remove_link_ids.push(link2.id);
            }
          }
        }
      }
    }

  console.log(to_remove_node_ids)
  console.log(to_remove_link_ids)

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