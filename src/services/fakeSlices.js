const slices = [
  {
    "graph_id": "8",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "8",
    "slice_name": "slice 8",
    "slice_state": "StableOK"
  },
];

const sliceProperties = {
  "8": require('./slices/slice8.json'),
}

export function getSlices() {
  return slices;
}

export function getSliceById(uuid) {
  return sliceProperties[uuid];
}