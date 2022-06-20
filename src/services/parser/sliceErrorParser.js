export default function parseSliceErrors(data) { 
  let abqm = JSON.parse(data["value"]["slices"][0]["slice_model"]);

  if (abqm.nodes === undefined) {
    return;
  }

  const nodes = abqm.nodes;

  const errors = [];

  for (const node of nodes) {
    if (node["ReservationInfo"]) {
      const error = JSON.parse(node["ReservationInfo"]).error_message;
      if (error !== "") {
        errors.push({
          "node_name": node.Name,
          "error_message": error
        })
      }
    }
  }
  return errors;
}