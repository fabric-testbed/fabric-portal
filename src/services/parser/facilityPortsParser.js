export default function parseSites(data, descriptions) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const facility_ports = nodes.filter(n => n.Type === "FacilityPort");
  const facilities = nodes.filter(n => n.Type === "Facility");
  const parsedFacilityPorts = [];
  let site = "";
  for (const fp of facility_ports) {
    for (const f of facilities) {
      if (f["NodeID"].concat("-int") === fp["NodeID"]) {
        site = f.Site;
      }
    }
    parsedFacilityPorts.push({
      "id": fp["id"],
      "name": fp["Name"],
      "vlan_range": JSON.parse(fp["Labels"]).vlan_range,
      "vlan": JSON.parse(fp["Labels"]).vlan,
      "allocated_vlan_range": fp["LabelAllocations"] ? JSON.parse(fp["LabelAllocations"]).vlan : [],
      "site": site ? site : fp["Name"].split('-')[0],
      "description": descriptions[fp["Name"].replace(/-int$/, '')] ? descriptions[fp["Name"].replace(/-int$/, '')].description : ""
    });
  }

  return parsedFacilityPorts;
}