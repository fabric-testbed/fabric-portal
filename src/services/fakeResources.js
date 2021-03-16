import { ZoomableGroup } from "react-simple-maps";

export const resources = [
  {
    id: 1,
    name: "RENCI",
    totalCores: 96,
    totalGPUs: 6,
    totalNICs: 7,
    totalNVMEs: 10,
    freeCores: 48,
    freeGPUs: 3,
    freeNICs: 4,
    freeNVMEs: 5,
  },
  {
    id: 2,
    name: "LBNL",
    totalCores: 96,
    totalGPUs: 6,
    totalNICs: 7,
    totalNVMEs: 10,
    freeCores: 68,
    freeGPUs: 6,
    freeNICs: 5,
    freeNVMEs: 8,
  },
  {
    id: 3,
    name: "UKY",
    totalCores: 96,
    totalGPUs: 6,
    totalNICs: 7,
    totalNVMEs: 10,
    freeCores: 20,
    freeGPUs: 2,
    freeNICs: 2,
    freeNVMEs: 3,
  },
];

export function getResources() {
  return resources;
}

export function getResource(id) {
  return resources.find((r) => r.id === id);
}
