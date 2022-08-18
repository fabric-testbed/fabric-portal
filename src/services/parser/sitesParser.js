export default function parseSites(data, ancronymToName) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const links = abqm_elements.links;
  const parsedSites = [];
  const siteNames = [];

  nodes.forEach(node => {
    if (node.Class === "CompositeNode") {
      const site = {};
      site.id = node.id;
      site.nodeId = node.NodeID;
      site.name = node.Name;

      /************ retrieve site capacity in site node. ************/ 
      const siteCapacityTypes = {
        "CPU": "cpu",
        "Core": "core",
        "Disk": "disk",
        "RAM": "ram",
        "Unit": "unit",
      }

      site.capacities = node.Capacities ? JSON.parse(node.Capacities) : {};
      site.allocatedCapacities = node.CapacityAllocations ? JSON.parse(node.CapacityAllocations) : {};

      for (const property in siteCapacityTypes) {
        site[`total${property}`] = site.capacities[siteCapacityTypes[property]] || 0;
        site[`allocated${property}`] = site.allocatedCapacities[siteCapacityTypes[property]] || 0;
        site[`free${property}`] = site[`total${property}`] - site[`allocated${property}`];
      }

      /************ retrieve site component capacity by links. ************/ 
      const componentTypes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA"];

      // initiate site component properties to prevent undefined error.
      for (const type of componentTypes) {
        site[`total${type}`] = 0;
        site[`allocated${type}`] = 0;
        site[`free${type}`] = 0;
      }

      // find site components.
      links.forEach(link => {
        if (link.source === site.id && link.Class === "has") {
          // calculate component units based on target component type
          const component = nodes.find(node => node.id === link.target);
          component.capacities = component.Capacities ? JSON.parse(component.Capacities) : {};
          component.allocatedCapacities = component.CapacityAllocations ? JSON.parse(component.CapacityAllocations) : {};

          for (const type of componentTypes) {
            if (component.Type === type) {
              site[`total${type}`] += component.capacities.unit || 0;
              site[`allocated${type}`] += component.allocatedCapacities.unit || 0;
            } 
          }
        }
      })

      for (const type of componentTypes) {
        site[`free${type}`] = site[`total${type}`] - site[`allocated${type}`];
      }

      parsedSites.push(site);
      siteNames.push(ancronymToName[site.name]);
    }
  })

  const parsedObj = {"parsedSites": parsedSites, "siteNames": siteNames};
  return parsedObj;
}
