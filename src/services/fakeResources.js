export const resources = [
  {
    id: 1,
    name: "Starlight",
    status: "Up",
    totalVM: 10,
    freeVM: 2,
    totalGPU: 5,
    freeGPU: 2,
  },
  {
    id: 2,
    name: "Seattle",
    status: "Up",
    totalVM: 20,
    freeVM: 8,
    totalGPU: 15,
    freeGPU: 10,
  },
  {
    id: 3,
    name: "Dallas",
    status: "Up",
    totalVM: 8,
    freeVM: 1,
    totalGPU: 19,
    freeGPU: 9,
  },
];

export function getResources() {
  return resources;
}

export function getResource(id) {
  return resources.find((r) => r.id === id);
}
