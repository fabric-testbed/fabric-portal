const getSite = (cp) => {
  if (cp.properties && cp.properties.site) {
    return cp.properties.site;
  }

  return "";
}

const isPositiveInteger = (input) => {
  const num = Number(input);
  return Number.isInteger(num) && num > 0;
}

const validateSlice = (sliceName, selectedKeyIDs, sliceNodes) => {
  const validationResult = {
    isValid: false,
    message: "",
  };

  if (sliceName === "") {
    validationResult.isValid = false;
    validationResult.message = "Please input slice name.";
    return validationResult;
  }

  if (selectedKeyIDs.length === 0) {
    validationResult.isValid = false;
    validationResult.message = "Please select a sliver key.";
    return validationResult;
  }

  if (sliceNodes.length === 0) {
    validationResult.isValid = false;
    validationResult.message = "Please add nodes, components and network services.";
    return validationResult;
  }

    // all validation above are passed.
    validationResult.isValid = true;
    validationResult.message = "";
  
    return validationResult;
}

const validateVMNodeComponents = (selectedSite, nodeName, nodes, core, ram, disk, nodeComponents, BootScript) => {
  const validationResult = {
    isValid: false,
    message: "",
  };

  // Site is required.
  if (selectedSite === "") {
    validationResult.isValid = false;
    validationResult.message = "Please select a site or choose the random option.";
    return validationResult;
  }

  // Node name must be unique in the graph.
  if (nodeName.length < 2) {
    validationResult.isValid = false;
    validationResult.message = "Please enter a node name at least 2 characters.";
    return validationResult;
  } else {
    // check id node name is unique.
    const vm_nodes = nodes.filter(node => node.Class === "NetworkNode" && node.Type === "VM");
    if (vm_nodes.length > 0) {
      for (const vm of vm_nodes) {
        if (nodeName === vm.Name) {
          validationResult.isValid = false;
          validationResult.message = "Node name should be unique in the slice.";
          return validationResult;
        }
      }
    } 
  }

  // core/ ram/ disk must be positive integers
  // Orchestrator will do the rest check and find the nearest available matching.
  if (!isPositiveInteger(core) || !isPositiveInteger(ram) || !isPositiveInteger(disk)) {
    validationResult.isValid = false;
    validationResult.message = "Please enter positive integer for core/ ram/ disk.";
    return validationResult;
  }

  // Boot script should be no more than 1024 characters.
  if (BootScript.length > 1024) {
    validationResult.isValid = false;
    validationResult.message = "The max length supported for Boot Script is 1024 characters.";
    return validationResult;
  }

  // all validation above are passed.
  validationResult.isValid = true;
  validationResult.message = "";

  return validationResult;
}

const validateFPNode = (selectedSite, bandwidth, vlan, vlanRange) => {
  const validationResult = {
    isValid: false,
    message: "",
  };

  // Site is required.
  if (selectedSite === "") {
    validationResult.isValid = false;
    validationResult.message = "Please select a site or choose the random option.";
    return validationResult;
  }

  // bandwidth validation.
  if (bandwidth < 0 || bandwidth > 100) {
    validationResult.isValid = false;
    validationResult.message = "Please input bandwidth between 0 - 100.";
    return validationResult;
  }

  // vlan validation (if vlan range is provided)
  if (!vlan) {
    validationResult.isValid = false;
    validationResult.message = "VLAN cannot be empty.";
    return validationResult;
  } else {
    if (vlanRange !== "####-####") {
      // for vlan range has min and max, e.g. 3300-3309
      if (vlanRange.includes('-')) {
        const min = parseInt(vlanRange.substring(0, vlanRange.indexOf('-')));
        const max = parseInt(vlanRange.substring(vlanRange.indexOf('-') + 1));
        if (vlan < min || vlan > max) {
          validationResult.isValid = false;
          validationResult.message = `Please input VLAN between the range of ${vlanRange}`;
          return validationResult;
        }
      } else {
        // There is only 1 VLAN value available. e.g. 1000
        const availableVlan = parseInt(vlanRange);
        if (vlan !== availableVlan) {
          validationResult.isValid = false;
          validationResult.message = `Please input VLAN value as ${vlanRange}`;
          return validationResult;
        }
      }
    }
  }
}

const validateSingleComponent = (type, name, model, addedComponents) => {
  const validationResult = {
    isValid: false,
    message: "",
  };

  if (addedComponents && addedComponents.length === 0) {
    if (type === "") {
      validationResult.isValid = false;
      // validationResult.message = "Please select a component type.";
      validationResult.message = "";
      return validationResult;
    }
  
    if (name === "") {
      validationResult.isValid = false;
      // validationResult.message = "Please enter a component name.";
      validationResult.message = "";
      return validationResult;
    }

    if (name.length < 2) {
      validationResult.isValid = false;
      validationResult.message = "The component name should be at least 2 characters.";
      validationResult.message = "";
      return validationResult;
    }

    if (model === "") {
      validationResult.isValid = false;
      // validationResult.message = "Please select a component model.";
      validationResult.message = "";
      return validationResult;
    }
  } else {
    if (name !== "") {
      for (const comp of addedComponents) {
        if (name === comp.name) {
          validationResult.isValid = false;
          validationResult.message = "Component name should be unique in the same node.";
          return validationResult;
        }
      }
    }

    if (type ==="" || name === "" || model === "") {
      validationResult.isValid = false;
      validationResult.message = "";
      return validationResult;
    }
  }

  // all validation above are passed.
  validationResult.isValid = true;
  validationResult.message = "";

  return validationResult;
}

const validateDetailForm = (type, value, id, nodes) => {
  // type: "name", "capacity"
  // value: the content of input value
  // nodes: all existing nodes in graph passed from props.

  const validationResult = {
    isValid: false,
    message: "",
  };

  if (type === "name") {
    if (value === "") {
      validationResult.isValid = false;
      validationResult.message = "Node name should not be empty.";
      return validationResult;
    }

    if (value.length < 2) {
      validationResult.isValid = false;
      validationResult.message = "Node name should be at least 2 characters.";
      return validationResult;
    }

    // check the VM name is unique in the whole slice graph.
    // check id node name is unique.
    const vm_nodes = nodes.filter(node => node.Type === "VM" && node.id !== parseInt(id));
    if (vm_nodes.length > 0) {
      for (const vm of vm_nodes) {
        if (value === vm.Name) {
          validationResult.isValid = false;
          validationResult.message = "Node name should be unique in the slice.";
          return validationResult;
        }
      }
    } 
  }

  if (type === "capacity") {
  // core/ ram/ disk must be positive integers
  // Orchestrator will do the rest check and find the nearest available matching.
  if (!isPositiveInteger(value)) {
    validationResult.isValid = false;
    validationResult.message = "Please enter positive integer for core/ ram/ disk.";
    return validationResult;
  }
  }

  // all validation above are passed.
  validationResult.isValid = true;
  validationResult.message = "";

  return validationResult;
}

const validateNetworkService = (serviceType, selectedCPs, serviceName, nodes) => {
  const validationResult = {
    isValid: false,
    message: "Please choose a service type.",
  };

  if (serviceName.length < 2) {
    validationResult.isValid = false;
    validationResult.message = "Please enter a service name at least 2 characters.";
    return validationResult;
  } else {
    // check if service name is unique
    const ns_nodes = nodes.filter(node => node.Class === "NetworkService" && node.Type !== "OVS");
    if (ns_nodes.length > 0) {
      for (const ns of ns_nodes) {
        if (serviceName === ns.Name) {
          validationResult.isValid = false;
          validationResult.message = "Service name should be unique in the slice.";
          return validationResult;
        }
      }
    } 
  }

  if (!serviceType || selectedCPs.length === 0) {
    return validationResult;
  }

  if (serviceType === "L2Bridge") {
    // expect all selected CP's site are the same.
    const site = getSite(selectedCPs[0]);
    for (const cp of selectedCPs) {
      if (getSite(cp) !== site) {
        validationResult.isValid = false;
        validationResult.message = "Please select ports from the same site for L2Bridge service.";
        return validationResult;
      }
    }
  }

  if (serviceType === "L2PTP") {
    // Only allows 2 connection points.
    if (selectedCPs.length !== 2) {
      validationResult.isValid = false;
      validationResult.message = "Please select 2 ports for L2PTP service.";
      return validationResult;
    }

    // ports must be DedicatedPort.
    if(selectedCPs[0].properties.type !== "DedicatedPort" 
    || selectedCPs[1].properties.type !== "DedicatedPort") {
      validationResult.isValid = false;
      validationResult.message = "Please select both DedicatedPort for L2PTP service.";
      return validationResult;
    }

    // 2 connection points must belong to 2 different sites.
     if (getSite(selectedCPs[0]) === getSite(selectedCPs[1])) {
      validationResult.isValid = false;
      validationResult.message = "Please select ports from 2 different sites for L2PTP service.";
      return validationResult;
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
        validationResult.isValid = false;
        validationResult.message = "Please select ports from 2 sites for L2STS service.";
        return validationResult;
      }
    })
    
    if (siteNames.length !== 2) {
      validationResult.isValid = false;
      validationResult.message = "Please select ports from 2 sites for L2STS service.";
      return validationResult;
    }
  }

  validationResult.isValid = true;
  validationResult.message = "";

  return validationResult;
}

const validator = {
  validateSlice,
  validateVMNodeComponents,
  validateFPNode,
  validateSingleComponent,
  validateNetworkService,
  validateDetailForm,
}

export default validator;