const getSite = (cp) => {
  return cp.properties.name.substr(0, cp.properties.name.indexOf('-'));
}

const isPositiveInteger = (num) => {
  return Number.isInteger(num) && num > 0;
}

const validateNodeComponents = (selectedSite, nodeName, nodes, core, ram, disk, nodeComponents) => {
  const validResult = {
    isValid: false,
    message: "",
  };

  // Site is required.
  if (selectedSite === "") {
    validResult.isValid = false;
    validResult.message = "Please select a site or choose the random option.";
    return validResult;
  }

  // Node name must be unique in the graph.
  if (nodeName === "") {
    validResult.isValid = false;
    validResult.message = "Please enter a node name.";
    return validResult;
  } else {
    // check id node name is unique.
    const vm_nodes = nodes.filter(node => node.Class === "NetworkNode" && node.Type === "VM");
    if (vm_nodes.length > 0) {
      for (const vm of vm_nodes) {
        if (nodeName === vm.Name) {
          validResult.isValid = false;
          validResult.message = "Node name should be unique in the slice.";
          return validResult;
        }
      }
    } 
  }

  // core/ ram/ disk must be positive integers
  // Orchestrator will do the rest check and find the nearest available matching.
  if (!isPositiveInteger(core) || !isPositiveInteger(ram) || !isPositiveInteger(disk)) {
    validResult.isValid = false;
    validResult.message = "Please enter positive integer for core/ ram/ disk.";
    return validResult;
  }

  // ensure at least 1 component is added.
  if (nodeComponents.length === 0) {
    validResult.isValid = false;
    validResult.message = "Please add at least 1 component.";
    return validResult;
  }

  // all validation above are passed.
  validResult.isValid = true;
  validResult.message = "";

  return validResult;
}

const validateSingleComponent = (type, name, model, addedComponents) => {
  const validResult = {
    isValid: false,
    message: "",
  };

  if (type === "") {
    validResult.isValid = false;
    validResult.message = "Please select a component type.";
    return validResult;
  }

  if (name === "") {
    validResult.isValid = false;
    validResult.message = "Please enter a component name.";
    return validResult;
  } else {
    // ensure the component name is unique in the scope of its VM node.
    if (addedComponents.length > 0) {
      for (const comp of addedComponents) {
        if (name === comp.name) {
          validResult.isValid = false;
          validResult.message = "Component name should be unique in the same node.";
          return validResult;
        }
      }
     }
  }

  if (model === "") {
    validResult.isValid = false;
    validResult.message = "Please select a component model.";
    return validResult;
  }

  // all validation above are passed.
  validResult.isValid = true;
  validResult.message = "";

  return validResult;
}

const validateNetworkService = (serviceType, selectedCPs, serviceName, nodes) => {
  const validResult = {
    isValid: false,
    message: "Please choose a service type.",
  };

  if (serviceName === "") {
    validResult.isValid = false;
    validResult.message = "Please enter a service name.";
    return validResult;
  } else {
    // check if service name is unique
    const ns_nodes = nodes.filter(node => node.Class === "NetworkService" && node.Type !== "OVS");
    if (ns_nodes.length > 0) {
      for (const ns of ns_nodes) {
        if (serviceName === ns.Name) {
          validResult.isValid = false;
          validResult.message = "Service name should be unique in the slice.";
          return validResult;
        }
      }
    } 
  }

  if (!serviceType || selectedCPs.length === 0) {
    return validResult;
  }

  if (serviceType === "L2Bridge") {
    // expect all selected CP's site are the same.
    const site = getSite(selectedCPs[0]);
    for (const cp of selectedCPs) {
      if (getSite(cp) !== site) {
        validResult.isValid = false;
        validResult.message = "Please select ports from the same site for L2Bridge service.";
        return validResult;
      }
    }
  }

  if (serviceType === "L2PTP") {
    // Only allows 2 connection points.
    if (selectedCPs.length !== 2) {
      validResult.isValid = false;
      validResult.message = "Please select 2 ports for L2PTP service.";
      return validResult;
    }

    // ports must be DedicatedPort.
    if(selectedCPs[0].properties.type !== "DedicatedPort" 
    || selectedCPs[1].properties.type !== "DedicatedPort") {
      validResult.isValid = false;
      validResult.message = "Please select both DedicatedPort for L2PTP service.";
      return validResult;
    }

    // 2 connection points must belong to 2 different sites.
     if (getSite(selectedCPs[0]) === getSite(selectedCPs[1])) {
      validResult.isValid = false;
      validResult.message = "Please select ports from 2 different sites for L2PTP service.";
      return validResult;
    }
  }

  if (serviceType === "L2STS") {
    const siteNames = []
    // all CPs should belong to exact 2 sites.
    selectedCPs.forEach(cp => {
      const cp_site = getSite(cp);
      if (!siteNames.includes(cp_site)) {
        siteNames.push(cp_site);
      }

      if (siteNames.length > 2) {
        validResult.isValid = false;
        validResult.message = "Please select ports from 2 sites for L2STS service.";
        return validResult;
      }
    })
    
    if (siteNames.length !== 2) {
      validResult.isValid = false;
      validResult.message = "Please select ports from 2 sites for L2STS service.";
      return validResult;
    }
  }

  validResult.isValid = true;
  validResult.message = "";

  return validResult;
}

const validator = {
  validateNodeComponents,
  validateSingleComponent,
  validateNetworkService,
}

export default validator;