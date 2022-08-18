const slices = [
  {
    "graph_id": "4d6bded1-4151-4fa5-bb22-b2a102b9f60b",
    "lease_end_time": "2022-05-10 00:01:02 +0000",
    "slice_id": "1",
    "name": "testSlice1",
    "state": "Configuring"
  },
  {
    "graph_id": "3fdc5d0d-f50a-4d77-b59b-e6b58b4a9d24",
    "lease_end_time": "2022-06-21 15:40:59 +0000",
    "slice_id": "2",
    "name": "testSlice2",
    "state": "Closing"
  },
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
