const componentTypePrefixes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA"];

export default function siteParserLevel2(data, siteName, acronymToShortName) {
  const hosts = (data.hosts || []).map(host => {
    const parsed = { ...host };

    // Core / Disk / RAM
    parsed.totalCore = host.cores_capacity || 0;
    parsed.allocatedCore = host.cores_allocated || 0;
    parsed.freeCore = host.cores_available || 0;
    parsed.totalDisk = host.disk_capacity || 0;
    parsed.allocatedDisk = host.disk_allocated || 0;
    parsed.freeDisk = host.disk_available || 0;
    parsed.totalRAM = host.ram_capacity || 0;
    parsed.allocatedRAM = host.ram_allocated || 0;
    parsed.freeRAM = host.ram_available || 0;

    for (const type of componentTypePrefixes) {
      parsed[`total${type}`] = 0;
      parsed[`allocated${type}`] = 0;
      parsed[`free${type}`] = 0;
      parsed[type] = [];
    }
    parsed.totalSwitch = 0;
    parsed.allocatedSwitch = 0;
    parsed.freeSwitch = 0;
    parsed.Switch = [];

    const components = host.components || {};
    for (const [model, counts] of Object.entries(components)) {
      for (const type of componentTypePrefixes) {
        if (model.startsWith(type)) {
          parsed[`total${type}`] += counts.capacity || 0;
          parsed[`allocated${type}`] += counts.allocated || 0;
          parsed[type].push({
            model,
            unit: counts.capacity || 0,
            allocatedUnit: counts.allocated || 0
          });
          break;
        }
      }
    }

    for (const type of componentTypePrefixes) {
      parsed[`free${type}`] = parsed[`total${type}`] - parsed[`allocated${type}`];
    }

    // Normalize Name (uppercase) and Site fields for callers
    if (!parsed.Name) parsed.Name = host.name || host.Name || "";
    if (!parsed.Site) parsed.Site = host.site || siteName;

    return parsed;
  });

  hosts.sort((a, b) => {
    const nameA = (a.Name || a.name || "").toUpperCase();
    const nameB = (b.Name || b.name || "").toUpperCase();
    if (nameA > nameB) return 1;
    if (nameA < nameB) return -1;
    return 0;
  });

  return {
    parsedSite: {},
    hosts
  };
}
