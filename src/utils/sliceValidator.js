const getSite = (cp) => {
  return cp.properties.name.substr(0, cp.properties.name.indexOf('-'));
}

const validateNetworkService = (serviceType, selectedCPs) => {
  const validResult = {
    isValid: false,
    message: null,
  };

  console.log("&&&&&&&&&&&")
  console.log(serviceType)
  console.log(selectedCPs)

  if (!serviceType || selectedCPs.length === 0) {
    return validResult;
  }

  // TODO: add specific error messages.
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
  validateNetworkService,
}

export default validator;