export default function parseSlice(slice, sliceType) {
  // type: "new" or "api"
  let abqm;
  if (sliceType === "new") {
    // portal generates slice model json
    abqm = slice;
  } else {
    abqm = JSON.parse(slice);
  }

  if (abqm.nodes === undefined && abqm.links === undefined) {
    return;
  }

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
      sites.push({ id: parseInt(node.id) + 9999999999999, name: node.Site });
    }
  })
  
  // create site nodes - the highest level parent node.
  sites.forEach(site => {
    const siteNode = { id: parseInt(site.id), label: site.name, type: "roundrectangle", properties: { class: "Composite Node", name: site.name } };
    elements.push(siteNode);
  })
  
  // Parsed nodes array into dictionary with key of id.
  const objNodes = {}
  nodes.forEach(node => {
    objNodes[parseInt(node.id)] = node
  })
  
  const getSiteIdbyName = name => {
    let siteId = null;
    for (let i = 0; i < sites.length; i++) {
      if (siteId) {
        break;
      }
  
      if (sites[i].name === name && !siteId) {
        siteId = parseInt(sites[i].id);
      }
    }
    return siteId;
  }
  
  const generateDataElement = (data, id) => {
    const properties = {};
    const originalNode = objNodes[id];
    data.id = parseInt(originalNode.id);
    // data.label = originalNode.id + '.' + originalNode.Type;
    data.label = originalNode.Name;
    data.type = "roundrectangle";
    properties.name = originalNode.Name;
    properties.class = originalNode.Class;
    properties.type = originalNode.Type;

    if (originalNode.Class === "Component") {
      properties.model = originalNode.Model;
      properties.detail = originalNode.Details;
    }

    data.properties = properties;

    if (originalNode.Class !== "NetworkService") {
      if (sliceType === "new") {
        data.capacities = originalNode.Capacities ? originalNode.Capacities : null;
      } else {
        data.capacities = originalNode.Capacities ? JSON.parse(originalNode.Capacities) : null;
      }
    }

    // add parent site node if it's network node.
    if (originalNode.Site) { data.parent = getSiteIdbyName(originalNode.Site); }
  }

  const generateConnectionPoint = (data, link, type) => {
    // type: "normal" - OVS has CP
    // "reverse" - CP has OVS
    const properties = {};
    let originalNode = {};
    if (type === "normal") {
      originalNode = objNodes[link.target];
      data.parent = findParentNode(link.source);
    } else if (type === "reverse") {
      originalNode = objNodes[link.source];
      data.parent = findParentNode(link.target);
    }
    data.id = parseInt(originalNode.id);
    data.label = "";
    data.type = "roundrectangle";
    properties.name = originalNode.Name;
    properties.class = originalNode.Class;
    properties.type = originalNode.Type;
    data.properties = properties;
    if (sliceType === "new") { 
      data.capacities = originalNode.Capacities ? originalNode.Capacities : null;
    } else {
      data.capacities = originalNode.Capacities ? JSON.parse(originalNode.Capacities) : null;
    }
  }
  
  const findParentNode = (id) => {
    let parentId = -1;
    for (let i = 0; i < links.length; i++) {
      // EXCEPTION status: OVS has SmartNIC (usually SmartNIC has OVS)
      if (links[i].label === "has" && ["SmartNIC", "SharedNIC"].includes(objNodes[links[i].target].Type) && 
      objNodes[links[i].source].Type === "OVS" && links[i].source === id) {
        parentId = parseInt(objNodes[links[i].target].id);
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
        id: parseInt(node.id),
        label: "NetworkService",
        type: "roundrectangle",
        properties: { class: "NetworkService", name: node.Name, type: node.Type }
    }
    elements.push(data);
    } else if (node.Class === "NetworkService" && node.Type !== "OVS") {
      data = {
        id: parseInt(node.id),
        label: node.Type,
        type: "roundrectangle",
        properties: { class: "NetworkService", name: node.Name, type: node.Type },
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
      // 2 main categories for "has"
      // 1. VM node has NIC/ GPU/ NVME... / or vice versa
      if (["SmartNIC", "SharedNIC", "GPU", "NVME"].includes(objNodes[link.target].Type) && 
        objNodes[link.source].Type === "VM") {
        if (!parentNodeIds.includes(link.source)) {
          // Store VM info, will 
          parentNodeIds.push(link.source);
        }
        data.parent = link.source;
        generateDataElement(data, link.target);
        elements.push(data);
      } else if (["SmartNIC", "SharedNIC", "GPU", "NVME"].includes(objNodes[link.source].Type) && 
      objNodes[link.target].Type === "VM") {
        // EXCEPTION: NIC/ GPU/ NVME has VM
        if (!parentNodeIds.includes(link.target)) {
          parentNodeIds.push(link.target);
        }
        data.parent = link.target;
        generateDataElement(data, link.source);
        elements.push(data);
      }

      // 2. NIC has OVS... / or vise versa
      // No need to generate element for OVS. Done.
    }

    // 'connects' => edge
    if (link.label === "connects") {
      // if NetworkService to CP, then add CP node inside NS's parent, don't add edge.
      if ((objNodes[link.source].Class === "NetworkService"
        && objNodes[link.target].Class === "ConnectionPoint"
        && objNodes[link.source].Type === "OVS")) {
          generateConnectionPoint(data, link, "normal");
          elements.push(data);
      } else if ((objNodes[link.target].Class === "NetworkService"
      && objNodes[link.source].Class === "ConnectionPoint"
      && objNodes[link.target].Type === "OVS")) {
        // EXCEPTION: Connection Point (source) has OVS (target)
        generateConnectionPoint(data, link, "reverse");
        elements.push(data);
      }else if (objNodes[link.source].Class === "NetworkService"
        && (objNodes[link.target].Type === "ServicePort" || objNodes[link.target].Type === "DedicatedPort" ) 
        && (["L2Bridge", "L2STS", "L2PTP","FABNetv4", "FABNetv6"].includes(objNodes[link.source].Type))){
          const cp_data = {
            parent: parseInt(link.source),
            id: parseInt(link.target),
            label: "",
            type: "roundrectangle",
            properties: { class: "ConnectionPoint", name: objNodes[link.target].Name, type: objNodes[link.target].Type },
          };
          elements.push(cp_data);
        } else if (objNodes[link.target].Class === "NetworkService"
        && (objNodes[link.source].Type === "ServicePort" || objNodes[link.source].Type === "DedicatedPort")
        && (["L2Bridge", "L2STS", "L2PTP","FABNetv4", "FABNetv6"].includes(objNodes[link.target].Type))){
          data = {
            parent: parseInt(link.target),
            id: parseInt(link.source),
            label: "",
            type: "roundrectangle",
            properties: { class: "ConnectionPoint", name: objNodes[link.target].Name, type: objNodes[link.target].Type },
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
      if (el.properties.class === "NetworkService") {
        cyElements.push({ data: el, classes: `graphNetworkService` })
      } else  {
        cyElements.push({ data: el, classes: `graph${el.properties.type}` })
      }
    } else {
      cyElements.push({ data: el })
    }
  })

  return cyElements;
}