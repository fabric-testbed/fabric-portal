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

export default function parseSites(data, acronymToShortName) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const links = abqm_elements.links;
  const parsedSites = [];
  const siteNames = [];
  const siteAcronyms = [];
  const siteColorMapping = {};

  nodes.forEach(node => {
    if (node.Class === "CompositeNode") {
      const site = {};
      site.id = node.id;
      site.nodeId = node.NodeID;
      site.name = node.Name;
      site.location = node.Location;
      site.ptp = node.Flags && JSON.parse(node.Flags).ptp;
      // site.location = JSON.parse(node.Location)["postal"];
      /************ retrieve site status in site node. ************/
      const maintenance = JSON.parse(node.MaintenanceInfo);
      if (Object.keys(maintenance).length === 1) {
        // the site is active or the maintenance is at site level
        site.status = maintenance[node.Name];
        site.workers = [];
      } else {
        const workers = [];
        let status = "PreMaint";
        // the site is in partial maintenance state
        // 1 or more workers are in maintenance
        for (const [key, value] of Object.entries(maintenance)) {
          if (key !== node.Name) {
            workers.push({ [key]: value });
          }
          // if all workers are in PreMaint state, then PreMaint as the site state
          // if a Maint worker exists, mark the site as in Maint too
          if (value.state === "Maint") {
            status = "PartMaint";
          }
        // the maintenance is at worker level
        site.status = {
          state: status,
          deadline: null,
          expected_end: null
        }
        site.workers = workers;
        }
      }

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
        site[type] = []; // models for a type of component
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
              site[type].push({
                "model": component.Model,
                "unit": component.capacities.unit || 0, 
                "allocatedUnit": component.allocatedCapacities.unit || 0
              })
            } 
          }
        }
      })

      for (const type of componentTypes) {
        site[`free${type}`] = site[`total${type}`] - site[`allocated${type}`];
      }

      parsedSites.push(site);
      
      try {
        siteColorMapping[site.name] = getSiteColor(site.status.state);
      } catch(err) {
        console.log(`This site cannot be parsed correctly: ${site}`);
      }

      siteNames.push(acronymToShortName[site.name]);
      siteAcronyms.push(site.name);
    }
  })


  const parsedObj = {
    "parsedSites": parsedSites.sort(),
    "siteNames": siteNames,
    "siteColorMapping": siteColorMapping,
    "siteAcronyms": siteAcronyms
  };

  return parsedObj;
}
