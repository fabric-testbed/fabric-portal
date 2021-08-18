export default function parseSlice(abqm) {
  
  const nodes = abqm.nodes;

  const links = abqm.links;
  
  // Max graph depth - 4 or 5? whether to show NetworkService node.
  // Site -> NetworkNode(VM) -> Component(NIC) -> NetworkService (OVS) -> ConnectionPoint
  
  // links
  // class 'has' -> parent node
  // class 'connects' -> edge node + edge
  const elements = [];
  const parentNodeIds = [];
  
  // Filter site info.
  const sites = [];
  const sitesName = [];
  
  nodes.forEach(node => {
    if (node.Class === "NetworkNode" && !sitesName.includes(node.Site)) {
      sitesName.push(node.Site);
      sites.push({ id: node.id + 999, name: node.Site });
    }
  })
  
  // *************************************************
  // *************************************************
  // *************************************************
  // create site nodes - the highest level parent node.
  sites.forEach(site => {
    const siteNode = { id: site.id, label: site.name, type: "roundrectangle", properties: { class: "Composite Node" } };
    elements.push(siteNode);
  })
  
  /************ Parsed nodes array into dictionary with key of id. ************/
  const objNodes = {}
  nodes.forEach(node => {
    objNodes[node.id] = node
  })
  
  const getSiteIdbyName = name => {
    let siteId = null;
    for (let i = 0; i < sites.length; i++) {
      if (siteId) {
        break;
      }
  
      if (sites[i].name === name && !siteId) {
        siteId = sites[i].id;
      }
    }
    return siteId;
  }
  
  const generateDataElement = (data, id) => {
    const properties = {};
    const originalNode = objNodes[id];
    data.id = originalNode.id;
    data.label = originalNode.id + '.' + originalNode.Type;
    data.type = "roundrectangle";
    properties.name = originalNode.Name;
    properties.class = originalNode.Class;
    properties.type = originalNode.Type;
    properties.model = originalNode.Model;
    properties.detail = originalNode.Details;
    data.properties = properties;
    data.capacities = originalNode.Capacities ? JSON.parse(originalNode.Capacities) : null;
    // add parent site node if it's network node.
    if (originalNode.Site) { data.parent = getSiteIdbyName(originalNode.Site); }
  }
  
  const findParentNode = (id) => {
    let parentId = -1;
    for (let i = 0; i < links.length; i++) {
      if (links[i].Class === "has" && links[i].target === id) {
        parentId = links[i].source;
        break;
      }
    }
    return parentId;
  }
  
// *************************************************
// *************************************************
// *************************************************
// Create NetworkService with type "L2Bridge", which has parent site
nodes.forEach(node => {
  if (node.Class === "NetworkService" && node.Type === "L2Bridge") {
    const data = {
      parent: getSiteIdbyName(node.Site),
      id: node.id,
      label: `${node.id}.ns`,
      type: "roundrectangle",
      properties: { class: "Network Service" },
    };

    elements.push(data);
  }
})
  
  // *************************************************
  // *************************************************
  // *************************************************
  // Create all 'Link' nodes.
  // nodes.forEach(node => {
  //   if (node.Class === "Link") {
  //     const data = {
  //       id: node.id,
  //       label: `${node.id}.Link`,
  //       type: "roundrectangle",
  //       properties: { class: "has" },
  //       capacities: { bandwidth: 100 },
  //       classes: "graphLink"
  //     };
  //     elements.push(data);
  //   }
  // })
  
  // *************************************************
  // *************************************************
  // *************************************************
  /************ retrieve node relationship data from all links. ************/
  const toConnectWithSameTarget = {};
  
  links.forEach(link => {
    let data = {};
    // "has" => parent/ child nodes.
    if (link.Class === "has") {
      if (!parentNodeIds.includes(link.source)) {
        parentNodeIds.push(link.source);
      }
      data.parent = link.source;
  
      if (objNodes[link.target].Class !== "NetworkService") {
        generateDataElement(data, link.target);
        elements.push(data)
      }
    }
  
    // 'connects' => edge
    // TODO: edge as node object??? 
    if (link.Class === "connects") {
      // if NetworkService to CP, then add CP node inside NS's parent, don't add edge.
      if (objNodes[link.source].Class === "NetworkService"
        && objNodes[link.target].Class === "ConnectionPoint"
        && objNodes[link.source].Type === "OVS") {
        data = {
          parent: findParentNode(link.source),
          id: link.target,
          label: `${link.target}.cp`,
          type: "roundrectangle",
          properties: { class: "Connection Point" },
        };
        elements.push(data);
      } else if (objNodes[link.source].Class === "NetworkService"
      && objNodes[link.target].Type === "ServicePort"
      && objNodes[link.source].Type === "L2Bridge"){
        data = {
          parent: link.source,
          id: link.target,
          label: `${link.target}`,
          type: "roundrectangle",
          properties: { class: "Service Port" },
        };
        elements.push(data);
      } else if (objNodes[link.target].Class === "Link"){
        // bypass link as node object, connect connection point directly.
        // connect two link.source with the same link.target together.
        !toConnectWithSameTarget[link.target] ? 
          toConnectWithSameTarget[link.target] = [link.source] :
          toConnectWithSameTarget[link.target].push(link.source);
      } else {
        data.source = link.source;
        data.target = link.target;
        elements.push(data);
      }
    }
  })

  for (const linkID in toConnectWithSameTarget) {
    let data = {};
    data.source = toConnectWithSameTarget[linkID][0];
    data.target = toConnectWithSameTarget[linkID][1];
    elements.push(data)
  }

  
  // *************************************************
  // *************************************************
  // *************************************************
  // add all parent nodes.
  parentNodeIds.forEach(parentId => {
    const data = {};
    generateDataElement(data, parentId);
  
    elements.push(data);
  })
  
  // wrapping each cy element in separate "data" obj that Cytoscape accepts
  const cyElements = [];
  elements.forEach(el => {
    cyElements.push({ data: el, classes: `graph${el.type}` })
  })
  // console.log(cyElements)

  return cyElements;
}