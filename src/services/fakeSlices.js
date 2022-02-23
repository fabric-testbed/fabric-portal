const slices = [
  {
    "graph_id": "a8dbf297-7ba1-431e-b356-00582590c52f",
    "lease_end": "2022-02-24 17:44:10",
    "slice_id": "060fc906-0e7c-44a3-8a0b-48c3c83ea0f6",
    "slice_name": "Slice-l2bridge-sriov",
    "slice_state": "StableOK"
  },
  {
    "graph_id": "f3716ea7-7ec2-4f60-982f-919555311fed",
    "lease_end": "2022-02-24 18:10:04",
    "slice_id": "6647deb2-fdf2-4923-b37a-7cb9c1ed13e1",
    "slice_name": "Slice-l2bridge-mixed",
    "slice_state": "Configuring"
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
