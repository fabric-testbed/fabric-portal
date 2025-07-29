import { sitesNameMapping }  from "../../data/sites";

export default function getLinkData(data, from, to) {
  // filter in, out, total and max data 
  // for 1) from -> to and 2) to -> from
  const fromMap = sitesNameMapping.longNameToAcronym[from];
  const toMap = sitesNameMapping.longNameToAcronym[to];
  const fromSite = fromMap ? fromMap.toLowerCase() : from;
  const toSite = toMap ? toMap.toLowerCase() : to;
  const link1 = data.filter(l => l.metric["src_rack"] === fromSite && l.metric["dst_rack"] === toSite)[0];
  const link2 = data.filter(l => l.metric["src_rack"] === toSite && l.metric["dst_rack"] === fromSite)[0];

  return { link1, link2 }
}