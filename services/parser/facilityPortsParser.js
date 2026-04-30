export default function parseFacilityPorts(data, descriptions) {
  const facilityPorts = data.facility_ports || [];

  return facilityPorts.map(fp => {
    // Parse vlans string: "['3110-3119', '3221-3999']" → ["3110-3119", "3221-3999"]
    let vlan_range = [];
    try {
      vlan_range = JSON.parse(fp.vlans.replace(/'/g, '"'));
    } catch {
      vlan_range = [];
    }

    const descKey = fp.name;
    return {
      name: fp.name,
      port: `${fp.name}-${fp.port}`,
      switchPath: fp.switch || "",
      vlan_range,
      vlan: vlan_range,
      allocated_vlan_range: [],
      site: fp.site,
      description: descriptions[descKey] ? descriptions[descKey].description : ""
    };
  });
}
