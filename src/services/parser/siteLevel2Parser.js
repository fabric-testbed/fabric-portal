const getSiteColor = (status) => {
  if (status === "Active") {
    // Color: "primary" for "active" sites
    return "#5798bc";
  } else if (status === "Maint") {
    // Color: "warning" for "maintenance" sites
    return "#e94948";
  } else if (status === "PreMaint" || status === "PartMaint") {
    return "#ff8542";
  } else {
    // Color: "secondary" for "down" sites
    return "#838385";
  }
}

export default function siteParserLevel2(data, siteName, acronymToShortName) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const links = abqm_elements.links;
  console.log(nodes)
  const site = nodes.filter(n => n.Class === "CompositeNode" && n.Name === siteName);
  console.log("------Site------");
  console.log(site)
  const hosts = nodes.filter(n => n.Class === "NetworkNode");
  console.log("------Hosts------");
  console.log(hosts);

  /************ retrieve site component capacity by links. ************/ 
  const componentTypes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA"];

  // find components of each host.
  hosts.forEach((host, index) => {
    // initiate component properties to prevent undefined error.
    for (const type of componentTypes) {
      hosts[index][`total${type}`] = 0;
      hosts[index][`allocated${type}`] = 0;
      hosts[index][`free${type}`] = 0;
      hosts[index][type] = []; // models for a type of component
    }

    links.forEach(link => {
      if (link.source === host.id && link.Class === "has") {
        // calculate component units based on target component type
        const component = nodes.find(node => node.id === link.target);
        component.capacities = component.Capacities ? JSON.parse(component.Capacities) : {};
        component.allocatedCapacities = component.CapacityAllocations ? JSON.parse(component.CapacityAllocations) : {};

        for (const type of componentTypes) {
          if (component.Type === type) {
            hosts[index][`total${type}`] += component.capacities.unit || 0;
            hosts[index][`allocated${type}`] += component.allocatedCapacities.unit || 0;
            hosts[index][type].push({
              "model": component.Model,
              "unit": component.capacities.unit || 0, 
              "allocatedUnit": component.allocatedCapacities.unit || 0
            })
          } 
        }
      }
    })
  })

  for (const type of componentTypes) {
    hosts.forEach((host, index) => {
      hosts[index][`free${type}`] = hosts[index][`total${type}`] - hosts[index][`allocated${type}`];
  })
  }

  const parsedObj = {
    "parsedSite": site,
    "hosts": hosts
  };
  console.log("parsed site")
  console.log(parsedObj);

  return parsedObj;
}