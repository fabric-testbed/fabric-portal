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
  {
    "graph_id": "4",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "4",
    "slice_name": "slice 4",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "5",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "5",
    "slice_name": "slice 5",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "6",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "6",
    "slice_name": "slice 6",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "7",
    "lease_end": "2021-09-02 14:56:57",
    "slice_id": "7",
    "slice_name": "slice 7",
    "slice_state": "StableOK"
  },
];

const sliceProperties = {
  "1": require('./slices/slice1.json'),
  "2": require('./slices/slice2.json'),
  "3": require('./slices/slice3.json'),
  "4": require('./slices/slice4.json'),
  "5": require('./slices/slice5.json'),
  "6": require('./slices/slice6.json'),
  "7": require('./slices/slice7.json'),
}

export function getSlices() {
  return slices;
}

export function getSliceById(uuid) {
  return sliceProperties[uuid];
}