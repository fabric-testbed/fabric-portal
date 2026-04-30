const getSiteColor = (state) => {
  if (state === "Active") {
    return "#5798bc";
  } else if (state === "Maint") {
    return "#e94948";
  } else if (state === "PreMaint" || state === "PartMaint") {
    return "#ff8542";
  } else {
    return "#838385";
  }
}

const componentTypePrefixes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA"];

export default function parseSites(data, acronymToShortName) {
  const sites = data.sites || [];
  const parsedSites = [];
  const siteNames = [];
  const siteAcronyms = [];
  const siteColorMapping = {};

  sites.forEach(site => {
    const parsed = {};
    parsed.name = site.name;
    parsed.location = site.address;
    parsed.coordinates = site.location;
    parsed.ptp = site.ptp_capable;
    parsed.status = { state: site.state, deadline: null, expected_end: null };
    parsed.workers = [];

    // Core / Disk / RAM capacities
    parsed.totalCore = site.cores_capacity || 0;
    parsed.allocatedCore = site.cores_allocated || 0;
    parsed.freeCore = site.cores_available || 0;
    parsed.totalDisk = site.disk_capacity || 0;
    parsed.allocatedDisk = site.disk_allocated || 0;
    parsed.freeDisk = site.disk_available || 0;
    parsed.totalRAM = site.ram_capacity || 0;
    parsed.allocatedRAM = site.ram_allocated || 0;
    parsed.freeRAM = site.ram_available || 0;

    // Initialize component type buckets
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

    // Map components dict (keyed by model name) to type buckets
    const components = site.components || {};
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

    // P4 switches
    for (const sw of (site.p4_switches || [])) {
      parsed.totalSwitch += sw.capacity || 0;
      parsed.allocatedSwitch += sw.allocated || 0;
      parsed.Switch.push({
        model: sw.name,
        unit: sw.capacity || 0,
        allocatedUnit: sw.allocated || 0
      });
    }
    parsed.freeSwitch = parsed.totalSwitch - parsed.allocatedSwitch;

    parsedSites.push(parsed);

    try {
      siteColorMapping[site.name] = getSiteColor(site.state);
    } catch (err) {
      console.log(`This site cannot be parsed correctly: ${site.name}`);
    }

    siteNames.push(acronymToShortName[site.name]);
    siteAcronyms.push(site.name);
  });

  return {
    parsedSites: parsedSites.sort(),
    siteNames,
    siteColorMapping,
    siteAcronyms
  };
}
