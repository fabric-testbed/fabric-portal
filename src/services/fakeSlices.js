// import slice1 from "./slices/slice1.json";
// import slice2 from "./slices/slice1.json";
// import slice3 from "./slices/slice1.json";

const slices = [
  {
    "graph_id": "1",
    "lease_end": "2021-09-05 11:30:25",
    "slice_id": "1",
    "slice_name": "1-site-slice",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "2",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "2",
    "slice_name": "2-site-slice",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "3",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "3",
    "slice_name": "slice 3",
    "slice_state": "StableOK"
  },
];

const sliceProperties = {
  "1": require('./slices/slice1.json'),
  "2": require('./slices/slice2.json'),
  "3": require('./slices/slice3.json'),
}

export function getSlices() {
  return slices;
}

export function getSliceById(uuid) {
  console.log("--------")
  console.log(sliceProperties[uuid])
  return sliceProperties[uuid];
}