export default function parseSites(data) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const facility_ports = nodes.filter(n => n.Type === "FacilityPort");
  const facilities = nodes.filter(n => n.Type === "Facility");
  const parsedFacilityPorts = [];
  for (const fp of facility_ports) {
    let site = "";
    for (const f of facilities) {
      if (f["NodeID"].concat("-int") === fp["NodeID"]) {
        site = f.Site;
      }
    }
    parsedFacilityPorts.push({
      "id": fp["id"],
      "name": fp["Name"],
      "vlan_range": JSON.parse(fp["Labels"]).vlan_range,
      "allocated_vlan_range": fp["LabelAllocations"] ? JSON.parse(fp["LabelAllocations"]).vlan : [],
      "site": site ? site : fp["Name"].split('-')[0]
    });
  }

  return parsedFacilityPorts;
}