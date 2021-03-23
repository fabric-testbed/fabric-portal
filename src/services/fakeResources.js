import _ from "lodash";

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

export function getResourcesSum() {
  const selectedLabels = [
     "totalCores",
     "freeCores",
     "totalGPUs",
     "freeGPUs",
     "totalNICs",
     "freeNICs",
     "totalNVMEs",
     "freeNVMEs",
  ]

  const sum = {
    id: 999,
    name: "FABRIC Testbed",
  };

  _.each(resources, (resource) => {
    _.each(selectedLabels, (label) => sum[label] = (sum[label] || 0) + resource[label]);
  });

  return sum;
}