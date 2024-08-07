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
  // 1. Site -> NetworkNode(VM) -> Component(NIC) -> NetworkService (OVS) -> ConnectionPoint
  // 2. Site -> Facility -> VLAN (NS) -> Facility Port

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
    const siteNode = { id: parseInt(site.id), label: site.name, type: "roundrectangle", properties: { class: "CompositeNode", name: site.name, type: "Site" } };
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
  
  const parseCapacityHints = (capacityHintsStr) => {
    // Input string example: "fabric.c2.m8.d10"
    // Output: {"core":2,"disk":10,"ram":8}
    const capacitiesObj = {
      core: 0,
      ram: 0,
      disk: 0
    };
    
    if (capacityHintsStr === "") return capacitiesObj;

    const arr = capacityHintsStr && capacityHintsStr.split(".");
    capacitiesObj.core = parseInt(arr[1].slice(1));
    capacitiesObj.ram = parseInt(arr[2].slice(1));
    capacitiesObj.disk = parseInt(arr[3].slice(1));
    return capacitiesObj;
  }

  const generateDataElement = (data, id) => {
    const properties = {};
    const originalNode = objNodes[id];
    data.id = parseInt(originalNode.id);
    if (originalNode.Type === "VLAN") {
      data.label = "VLAN";
    } else {
      data.label = originalNode.Name;
    }

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
      } else if(originalNode.Class !== "NetworkNode") {
        data.capacities = originalNode.Capacities ? JSON.parse(originalNode.Capacities) : null;
      }
    }

    if (sliceType !== "new" && originalNode.Type === "VM") {
      // parse CapacityHints for VM nodes to get actual allocated capacities.
      // example: "CapacityHints": "{"instance_type": "fabric.c2.m8.d10"}"
      const capacityHints = originalNode.CapacityHints ? JSON.parse(originalNode.CapacityHints) : null;
      const capacityHintsStr = capacityHints ? capacityHints.instance_type : "";
      data.capacities = parseCapacityHints(capacityHintsStr);
    }

    // add parent site node/ management IP address if it's VM node.
    if (originalNode.Site && originalNode.Type !== "VLAN") {
      data.parent = getSiteIdbyName(originalNode.Site);
      if (originalNode.Type === "VM") {
        data.properties.MgmtIp = originalNode.MgmtIp || "";
        data.properties.ImageRef = originalNode.ImageRef || "";
        data.BootScript = originalNode.BootScript || "";
        data.properties.sliverId = originalNode.ReservationInfo ? JSON.parse(originalNode.ReservationInfo).reservation_id : "";
      }
    }
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
    data.site = originalNode.layout ? JSON.parse(originalNode.layout).site : "";
    if (originalNode.LabelAllocations && JSON.parse(originalNode.LabelAllocations)["mac"]) {
      properties.mac = JSON.parse(originalNode.LabelAllocations)["mac"];
    } else {
      properties.mac = "";
    }
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
      // EXCEPTION status: OVS has NIC (usually NIC has OVS)
      // EXCEPTION status: P4 network service has FPGA (usually FPGA has P4)
      if (links[i].label === "has" && ["SmartNIC", "SharedNIC", "FPGA"].includes(objNodes[links[i].target].Type) && 
      ["OVS", "P4"].includes(objNodes[links[i].source].Type) && links[i].source === id) {
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

  const isEmptyVM = (id) => {
    const has_links = links.filter(link => link.label === "has");

    if (has_links.length > 0) {
      for (let i = 0; i < has_links.length; i++) {
        if (has_links[i].source === id || has_links[i].target === id) {
          return false;
        }
      }
    }

    return true;
  }

  nodes.forEach(node => {
    let data = {};
    if (node.Type === "L2Bridge") {
      // Create NetworkService with type "L2Bridge", which has parent site
      data = {
        parent: getSiteIdbyName(node.Site),
        id: parseInt(node.id),
        label: node.Name,
        type: "roundrectangle",
        properties: { class: "NetworkService", name: node.Name, type: node.Type }
      }
      elements.push(data);
    } else if (node.Class === "NetworkService" && !["OVS", "P4"].includes(node.Type) && node.Type !== "VLAN") {
      data = {
        id: parseInt(node.id),
        label: node.Name,
        type: "roundrectangle",
        properties: { class: "NetworkService", name: node.Name, type: node.Type },
      };
      elements.push(data);
    } else if (node.Type === "VM" && isEmptyVM(node.id)) {
      // For VM nodes without child components
      const data = {};
      generateDataElement(data, node.id);
      elements.push(data);
    } else if (["Facility", "Switch"].includes(node.Type)) {
      data = {
        id: parseInt(node.id),
        label: node.Name,
        type: "roundrectangle",
        properties: { class: "NetworkNode", name: node.Name, type: node.Type },
      };
      generateDataElement(data, node.id);
      elements.push(data);
    }
  })

  /************ retrieve node relationship data from all links. ************/
  const toConnectWithSameTarget = {};

  links.forEach(link => {
    let data = {};
    // "has" => parent/ child nodes.
    if (link.label === "has") {
      // Three main categories for "has"
      // 1. VM node has NIC/ GPU/ NVME/ Storage or vice versa
      if (["SmartNIC", "SharedNIC", "GPU", "NVME", "Storage", "FPGA"].includes(objNodes[link.target].Type) && 
        objNodes[link.source].Type === "VM") {
        if (!parentNodeIds.includes(link.source)) {
          parentNodeIds.push(link.source);
        }
        data.parent = link.source;
        generateDataElement(data, link.target);
        elements.push(data);
      } else if (["SmartNIC", "SharedNIC", "GPU", "NVME", "Storage", "FPGA"].includes(objNodes[link.source].Type) && 
      objNodes[link.target].Type === "VM") {
        // EXCEPTION: NIC/ GPU/ NVME/ Storage has VM
        if (!parentNodeIds.includes(link.target)) {
          parentNodeIds.push(link.target);
        }
        data.parent = link.target;
        generateDataElement(data, link.source);
        elements.push(data);
      }
      // 2. NIC has OVS... / or vise versa
      // No need to generate element for OVS. Done.

      // 3. Facility node has VLAN or vice versa.
      if (objNodes[link.target].Type === "VLAN" && objNodes[link.source].Type === "Facility") {
        if (!parentNodeIds.includes(link.source)) {
          parentNodeIds.push(link.source);
        }
        data.parent = link.source;
        generateDataElement(data, link.target);
        elements.push(data);
      } else if (objNodes[link.source].Type === "VLAN" && objNodes[link.target].Type === "Facility") {
        if (!parentNodeIds.includes(link.target)) {
          parentNodeIds.push(link.target);
        }
        data.parent = link.target;
        generateDataElement(data, link.source);
        elements.push(data);
      }
    }

    // 'connects' => edge
    if (link.label === "connects") {
      // VLAN (NetworkService) connects to Facility Port (ConnectionPoint)
      if (objNodes[link.source].Type === "VLAN"
      && objNodes[link.target].Type === "FacilityPort") {
        // Facility node has been added independently, add node for the Facility Port
        const fp_data = {
          parent: parseInt(link.source),
          id: parseInt(link.target),
          label: "",
          type: "roundrectangle",
          properties: { class: "ConnectionPoint", name: objNodes[link.target].Name, type: objNodes[link.target].Type },
          capacities: objNodes[link.target].Capacities ? JSON.parse(objNodes[link.target].Capacities) : null,
          labels: objNodes[link.target].Labels ? JSON.parse(objNodes[link.target].Labels) : null,
          site: objNodes[link.target].layout ? JSON.parse(objNodes[link.target].layout).site : ""
        };
        elements.push(fp_data);
      } else if (objNodes[link.source].Type === "FacilityPort"
      && objNodes[link.target].Type === "VLAN") {
        const fp_data = {
          parent: parseInt(link.target),
          id: parseInt(link.source),
          label: "",
          type: "roundrectangle",
          properties: { class: "ConnectionPoint", name: objNodes[link.source].Name, type: objNodes[link.source].Type },
          capacities: objNodes[link.source].Capacities ? JSON.parse(objNodes[link.source].Capacities) : null,
          labels: objNodes[link.source].Labels ? JSON.parse(objNodes[link.source].Labels) : null,
          site: objNodes[link.source].layout ? JSON.parse(objNodes[link.source].layout).site : ""
        };
        elements.push(fp_data);
      } else if ((objNodes[link.source].Class === "NetworkService"
        && objNodes[link.target].Class === "ConnectionPoint"
        && ["OVS", "P4"].includes(objNodes[link.source].Type))) {
          generateConnectionPoint(data, link, "normal");
          elements.push(data);
      } else if ((objNodes[link.target].Class === "NetworkService"
      && objNodes[link.source].Class === "ConnectionPoint"
      && ["OVS", "P4"].includes(objNodes[link.target].Type))) {
        // EXCEPTION: Connection Point (source) has OVS (target)
        generateConnectionPoint(data, link, "reverse");
        elements.push(data);
      }else if (objNodes[link.source].Class === "NetworkService"
        && (objNodes[link.target].Type === "ServicePort" || objNodes[link.target].Type === "DedicatedPort" ) 
        && (["L2Bridge", "L2STS", "L2PTP","FABNetv4", "FABNetv6","FABNetv4Ext","FABNetv6Ext"].includes(objNodes[link.source].Type))){
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
        && (["L2Bridge", "L2STS", "L2PTP","FABNetv4", "FABNetv6","FABNetv4Ext","FABNetv6Ext"].includes(objNodes[link.target].Type))){
          data = {
            parent: parseInt(link.target),
            id: parseInt(link.source),
            label: "",
            type: "roundrectangle",
            properties: { class: "ConnectionPoint", name: objNodes[link.source].Name, type: objNodes[link.source].Type },
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