
const removeNode = (node, nodes, links) => {
  let updated_nodes = [];
  let updated_links = [];

  let to_remove_node_ids = [];
  let to_remove_link_ids = [];

  if(node.properties.class === "NetworkService") {
    // remove the NS node + its child CP nodes + the "has" link between
    // remove the "connect" links between its CP nodes and NIC nodes
    to_remove_node_ids.push(parseInt(node.id));

    for (const link of links) {
      if (link.Class === "has" && parseInt(link.source) === parseInt(node.id)) {
        to_remove_node_ids.push(parseInt(link.target));
        to_remove_link_ids.push(parseInt(link.id));
        for (const link2 of links) {
          if (link2.Class === "connects" && 
              (parseInt(link2.source) === parseInt(link.target) 
                || parseInt(link2.target) === parseInt(link.target))
             ) {
            to_remove_link_ids.push(parseInt(link2.id));
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