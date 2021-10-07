export default function parseSlice(response) {
  console.log(response);
  const abqm = JSON.parse(response.value.slice_model);
  console.log(abqm);
  const nodes = abqm.nodes;
  const links = abqm.links;
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
      sites.push({ id: node.id + 999999, name: node.Site });
    }
  })
  
  // create site nodes - the highest level parent node.
  sites.forEach(site => {
    const siteNode = { id: site.id, label: site.name, type: "roundrectangle", properties: { class: "Composite Node" } };
    elements.push(siteNode);
  })
  
  // Parsed nodes array into dictionary with key of id.
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
    // data.label = originalNode.id + '.' + originalNode.Type;
    data.label = originalNode.Type;
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
      // EXCEPTION status: OVS has SmartNIC (usually SmartNIC has OVS)
      if (links[i].label === "has" && objNodes[links[i].target].Type === "SmartNIC" && 
      objNodes[links[i].source].Type === "OVS" && links[i].source === id) {
        parentId = objNodes[links[i].target].id;
        break;
      }

      // Normal status:
      if (links[i].label === "has" && links[i].target === id) {
        parentId = links[i].source;
        break;
      }
    }
    return parentId;
  }

  nodes.forEach(node => {
    let data = {};
    if (node.Class === "NetworkService" && node.Type === "L2Bridge") {
      // Create NetworkService with type "L2Bridge", which has parent site
      data = {
        parent: getSiteIdbyName(node.Site),
        id: node.id,
        // label: `${node.id}.ns`,
        label: "Network Service",
        type: "roundrectangle",
        properties: { class: "Network Service" }
    }
    elements.push(data);
    } else if (node.Class === "NetworkService" && node.Type === "L2STS") {
      // Create NetworkService with type "L2STS", site to site, no parent
      data = {
        id: node.id,
        // label: `${node.id}.L2STS`,
        label: "L2STS",
        type: "roundrectangle",
        properties: { class: "Network Service" },
      };
      elements.push(data);
    }
  })


  /************ retrieve node relationship data from all links. ************/
  const toConnectWithSameTarget = {};

  links.forEach(link => {
    let data = {};
    // "has" => parent/ child nodes.
    if (link.label === "has") {
      // EXCEPTION status: OVS has SmartNIC (usually SmartNIC has OVS)
      if (objNodes[link.target].Type === "SmartNIC" && 
        objNodes[link.source].Type === "OVS") {
        if (!parentNodeIds.includes(link.target)) {
          parentNodeIds.push(link.target);
        }
        data.parent = link.target;
        if (objNodes[link.target].Class !== "NetworkService") {
          generateDataElement(data, link.target);
          elements.push(data)
        }
      } else {
        if (!parentNodeIds.includes(link.source)) {
          parentNodeIds.push(link.source);
        }
        data.parent = link.source;
        if (objNodes[link.target].Class !== "NetworkService") {
          generateDataElement(data, link.target);
          elements.push(data)
        }
      }
    }

    // 'connects' => edge
    if (link.label === "connects") {
      // if NetworkService to CP, then add CP node inside NS's parent, don't add edge.
      if (objNodes[link.source].Class === "NetworkService"
        && objNodes[link.target].Class === "ConnectionPoint"
        && objNodes[link.source].Type === "OVS") {
        data = {
          parent: findParentNode(link.source),
          id: link.target,
          // label: `${link.target}.cp`,
          label: "",
          type: "roundrectangle",
          properties: { class: "Connection Point" },
        };
        elements.push(data);
      } else if (objNodes[link.source].Class === "NetworkService"
        && objNodes[link.target].Type === "ServicePort"
        && (["L2Bridge", "L2STS"].includes(objNodes[link.source].Type))){
          data = {
            parent: link.source,
            id: link.target,
            // label: `${link.target}.sp`,
            label: "",
            type: "roundrectangle",
            properties: { class: "Service Port" },
          };
          elements.push(data);
        } else if (objNodes[link.target].Class === "NetworkService"
        && objNodes[link.source].Type === "ServicePort"
        && (["L2Bridge", "L2STS"].includes(objNodes[link.target].Type))){
          data = {
            parent: link.target,
            id: link.source,
            // label: `${link.target}.sp`,
            label: "",
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
        } else if (objNodes[link.source].Class === "Link"){
          // bypass link as node object, connect connection point directly.
          // connect two link.target with the same link.source together.
          !toConnectWithSameTarget[link.source] ? 
            toConnectWithSameTarget[link.source] = [link.target] :
            toConnectWithSameTarget[link.source].push(link.target);
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

  // add all parent nodes.
  parentNodeIds.forEach(parentId => {
    const data = {};
    generateDataElement(data, parentId);

    elements.push(data);
  })
    
  // wrapping each cy element in separate "data" obj that Cytoscape accepts
  const cyElements = [];
  elements.forEach(el => {
    if (el.properties) {
      cyElements.push({ data: el, classes: `graph${el.properties.type}` })
    } else {
      cyElements.push({ data: el })
    }
  })

  return cyElements;
}