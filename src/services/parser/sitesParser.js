export default function parseSites(data, ancronymToName) {
  let abqm_elements = JSON.parse(data.value.bqm);
  const nodes = abqm_elements.nodes;
  const parsedSites = [];
  const siteNames = [];
  /************ retrieve site data from all nodes. ************/ 
  nodes.forEach(node => {
    if (node.Class === "CompositeNode") {
      const site = {};
      site.id = node.id;
      site.nodeId = node.NodeID;
      site.name = node.Name;
      // total capacities:
      site.capacities = node.Capacities ? JSON.parse(node.Capacities) : {};
      site.totalCPU = site.capacities.cpu ? site.capacities.cpu : 0;
      site.totalCore = site.capacities.core ? site.capacities.core : 0;
      site.totalDisk = site.capacities.disk ? site.capacities.disk : 0;
      site.totalRAM = site.capacities.ram ? site.capacities.ram : 0;
      site.totalUnit = site.capacities.unit ? site.capacities.unit: 0;
      // allocated capacities:
      site.allocatedCapacities = node.CapacityAllocations ? JSON.parse(node.CapacityAllocations) : {};
      site.allocatedCPU = site.allocatedCapacities.cpu ? site.allocatedCapacities.cpu : 0;
      site.allocatedCore = site.allocatedCapacities.core ? site.allocatedCapacities.core : 0;
      site.allocatedDisk = site.allocatedCapacities.disk ? site.allocatedCapacities.disk : 0;
      site.allocatedRAM = site.allocatedCapacities.ram ? site.allocatedCapacities.ram : 0;
      site.allocatedUnit = site.allocatedCapacities.unit ? site.allocatedCapacities.unit: 0;
      // free capacities
      site.freeCPU = site.totalCPU - site.allocatedCPU;
      site.freeCore = site.totalCore - site.allocatedCore;
      site.freeDisk = site.totalDisk - site.allocatedDisk;
      site.freeRAM = site.totalRAM - site.allocatedRAM;
      site.freeUnit = site.totalUnit - site.allocatedUnit;
      
      parsedSites.push(site);
      siteNames.push(ancronymToName[site.name]);
    }
  })

  const parsedObj = {"parsedSites": parsedSites, "siteNames": siteNames};
  return parsedObj;
}