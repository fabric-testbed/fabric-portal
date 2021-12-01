const slices = [
  {
    "graph_id": "8",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "8",
    "slice_name": "slice 8",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "1",
    "lease_end": "2021-11-30 19:15:53",
    "slice_id": "1",
    "slice_name": "Example Slice: l2ptp",
    "slice_state": "Closing"
  },
];

const sliceProperties = {
  "8": require('./slices/slice8.json'),
  "1": require('./slices/slice1.json'),
}

export function getSlices() {
  return slices;
}

export function getSliceById(uuid) {
  return sliceProperties[uuid];
}