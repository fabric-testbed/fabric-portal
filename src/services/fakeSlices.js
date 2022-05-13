const slices = [
  {
    "graph_id": "09e50006-b636-4e19-a098-b206135c6e73",
    "lease_end": "2022-03-29 17:17:14",
    "slice_id": "1",
    "slice_name": "Slice-l2bridge-sriov",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "669df1ed-2f28-4a84-81a7-30f252266dfd",
    "lease_end": "2022-03-31 20:23:13",
    "slice_id": "2",
    "slice_name": "Slice-l2bridge-mixed",
    "slice_state": "Dead"
  }
];

const sliceProperties = {
  "1": require('./slices/slice1.json'),
  "2": require('./slices/slice2.json'),
}

export function getSlices() {
  return slices;
}

export function getSliceById(uuid) {
  return sliceProperties[uuid];
}
