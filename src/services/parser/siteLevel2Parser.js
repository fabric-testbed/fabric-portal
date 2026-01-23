export default function siteParserLevel2(data, siteName, acronymToShortName) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const links = abqm_elements.links || abqm_elements.edges || [];
  const site = nodes.filter(n => n.Class === "CompositeNode" && n.Name === siteName);
  const hosts = nodes.filter(n => n.Class === "NetworkNode");

  const hostCapacityTypes = {
    "CPU": "cpu",
    "Core": "core",
    "Disk": "disk",
    "RAM": "ram",
    "Unit": "unit",
  }

  const componentTypes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA", "Switch"];

  // Component and Model level.
  hosts.forEach((host, index) => {
    // Host level.
    host.capacities = host.Capacities ? JSON.parse(host.Capacities) : {};
    host.allocatedCapacities = host.CapacityAllocations ? JSON.parse(host.CapacityAllocations) : {};

    for (const property in hostCapacityTypes) {
      host[`total${property}`] = host.capacities[hostCapacityTypes[property]] || 0;
      host[`allocated${property}`] = host.allocatedCapacities[hostCapacityTypes[property]] || 0;
      host[`free${property}`] = host[`total${property}`] - host[`allocated${property}`];
    }

    // find components of each host.
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

  hosts.sort((a, b) => {
    const nameA = a.Name.toUpperCase();
    const nameB = b.Name.toUpperCase();
    if(nameA > nameB) { return 1; }
    if(nameA < nameB) { return -1; }
    return 0;
  });

  const parsedObj = {
    "parsedSite": site,
    "hosts": hosts
  };

  return parsedObj;
}