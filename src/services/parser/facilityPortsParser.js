export default function parseSites(data) {
  let abqm_elements = JSON.parse(data.model);
  const nodes = abqm_elements.nodes;
  const facility_ports = nodes.filter(n => n.Type === "FacilityPort");
  const parsedFacilityPorts = [];
  for (const fp of facility_ports) {
    parsedFacilityPorts.push({
      "name": fp["Name"],
      "vlan_range": JSON.parse(fp["Labels"]).vlan_range,
      "allocated_vlan_range": fp["LabelAllocations"] ? JSON.parse(fp["LabelAllocations"]).vlan : []
    })
  }
  return parsedFacilityPorts;
}