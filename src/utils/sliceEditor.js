
const removeNode = (node, nodes, links) => {
  console.log(node)

  const updated_nodes = [];
  const updated_links = [];

  const to_remove_node_ids = [];
  const to_remove_link_ids = [];

  if(node.properties.class === "NetworkService") {
    // remove the NS node + its child CP nodes + the "has" link between
    // remove the "connect" links between its CP nodes and NIC nodes
    to_remove_node_ids.push(node.id);

    for (const link of links) {
      if (link.Class === "has" && link.source === node.id) {
        to_remove_node_ids.push(link.target);
        to_remove_link_ids.push(link.id);
        for (const link2 in links) {
          if (link2.Class === "connect" && 
              (link2.source === link.target || link2.target === link.target)
             ) {
            to_remove_link_ids.push(link2.id);
          }
        }
      }
    }
  }

  console.log(to_remove_node_ids)
  console.log(to_remove_link_ids)


  return [updated_nodes, updated_links];
}

const editor = {
  removeNode,
}

export default editor;