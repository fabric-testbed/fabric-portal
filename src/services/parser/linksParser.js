import { sitesNameMapping }  from "../../data/sites";

export default function getLinkData(data, from, to) {
  const in_data = data.all_in_links.data["result"];
  const out_data = data.all_out_links.data["result"];
  // const total_data = data.all_total_links.data["result"][0];
  // filter in, out, total and max data 
  // for 1) from -> to and 2) to -> from
  const fromSite = sitesNameMapping.longNameToAcronym[from].toLowerCase();
  const toSite = sitesNameMapping.longNameToAcronym[to].toLowerCase();
  const link1 = {};
  const link2 = {};
  for (const link of in_data) {
    if (link.metric.src_rack === fromSite 
      && link.metric.dst_rack === toSite) {
        link1.max = Math.round(link.metric.max);
        link1.in = Math.round(link.value[1]);
    }

    if (link.metric.src_rack === toSite 
      && link.metric.dst_rack === fromSite) {
        link2.max = Math.round(link.metric.max);
        link2.in = Math.round(link.value[1]);
    }
  }

  for (const link of out_data) {
    if (link.metric.src_rack === fromSite 
      && link.metric.dst_rack === toSite) {
        link1.out = Math.round(link.value[1]);
    }

    if (link.metric.src_rack === toSite 
      && link.metric.dst_rack === fromSite) {
        link2.out = Math.round(link.value[1]);
    }
  }

  return { link1, link2 }
}