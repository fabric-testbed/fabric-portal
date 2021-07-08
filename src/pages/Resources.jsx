import React, {Component} from "react";
import Topomap from "../components/Resource/Topomap";
import TestbedTable from "../components/Resource/TestbedTable";
import DetailTable from "../components/Resource/DetailTable";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import SummaryTable from "../components/Resource/SummaryTable";

import { getResources } from "../services/resourcesService.js";
import { toast } from "react-toastify";
import paginate from "../utils/paginate";
import _ from "lodash";

class Resources extends Component {
  state = {
    resources: [],
    sortColumn: { path: "name", order: "asc" },
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    activeDetailName: "StarLight",
    nameDict: {
      "RENCI" : "RENC",
      "UKY": "UKY",
      "LBNL": "LBNL",
    }
  }

  async componentDidMount(){
    try {
      const { data } = await getResources();
      this.setState({ resources: this.siteParser(data) });
    } catch (ex) {
      toast.error("Failed to load resource information. Please reload this page.");
      console.log("Failed to load resource information: " + ex.response.data);
    }
  }

  // componentDidMount() {
  //   const data = {
  //     "value": {
  //       "bqm": "{\"directed\": false, \"multigraph\": false, \"graph\": {}, \"nodes\": [{\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"CompositeNode\", \"NodeID\": \"a288a005-80c2-43f6-889b-ba6d5b272bc1\", \"Name\": \"RENC\", \"Type\": \"Server\", \"Capacities\": \"{\\\"core\\\": 96, \\\"cpu\\\": 6, \\\"disk\\\": 109600, \\\"ram\\\": 1536, \\\"unit\\\": 3}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 22}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"NetworkService\", \"NodeID\": \"4932da31-c183-4c40-8796-5bbf89994978\", \"Name\": \"RENC_ns\", \"Type\": \"MPLS\", \"id\": 23}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Component\", \"NodeID\": \"dfe35474-e54a-4360-9c5d-29ac5407ca3f\", \"Name\": \"GPU-RTX6000\", \"Type\": \"GPU\", \"Model\": \"RTX6000\", \"Capacities\": \"{\\\"unit\\\": 2}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 24}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Component\", \"NodeID\": \"4f4b26e6-e543-4b11-972e-e797440a2a70\", \"Name\": \"GPU-Tesla T4\", \"Type\": \"GPU\", \"Model\": \"Tesla T4\", \"Capacities\": \"{\\\"unit\\\": 4}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 25}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Component\", \"NodeID\": \"31dc55fe-8266-413a-8554-e6403b3669f3\", \"Name\": \"NVME-P4510\", \"Type\": \"NVME\", \"Model\": \"P4510\", \"Capacities\": \"{\\\"disk\\\": 10000, \\\"unit\\\": 10}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 26}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Component\", \"NodeID\": \"f34f1de8-c781-4949-9d5b-59d697ed6371\", \"Name\": \"SharedNIC-ConnectX-6\", \"Type\": \"SharedNIC\", \"Model\": \"ConnectX-6\", \"Capacities\": \"{\\\"unit\\\": 12}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 27}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Component\", \"NodeID\": \"e99d51c1-1f4a-45fd-a482-944e2a42ef81\", \"Name\": \"SmartNIC-ConnectX-6\", \"Type\": \"SmartNIC\", \"Model\": \"ConnectX-6\", \"Capacities\": \"{\\\"unit\\\": 2}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 28}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Component\", \"NodeID\": \"4c3c3f9e-ccbc-49b9-952e-64a8bdcf0c04\", \"Name\": \"SmartNIC-ConnectX-5\", \"Type\": \"SmartNIC\", \"Model\": \"ConnectX-5\", \"Capacities\": \"{\\\"unit\\\": 2}\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 29}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"CompositeNode\", \"NodeID\": \"05f56c03-aa4a-4fd0-85d0-fe72386341e5\", \"Name\": \"UKY\", \"Type\": \"Server\", \"Capacities\": \"\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 30}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"NetworkService\", \"NodeID\": \"b2620ebe-34c3-43dc-a7d1-c6d32b8c71d6\", \"Name\": \"UKY_ns\", \"Type\": \"MPLS\", \"id\": 31}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"CompositeNode\", \"NodeID\": \"1da65192-ed4f-40cb-bd2d-de15e143c797\", \"Name\": \"LBNL\", \"Type\": \"Server\", \"Capacities\": \"\", \"CapacityAllocations\": \"\", \"StitchNode\": \"false\", \"id\": 32}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"NetworkService\", \"NodeID\": \"df3c0051-ab9c-4273-aeb7-704feb4bc727\", \"Name\": \"LBNL_ns\", \"Type\": \"MPLS\", \"id\": 33}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"ConnectionPoint\", \"NodeID\": \"0503b974-1a5d-47e2-8987-943de1ace760\", \"Name\": \"UKY_RENC\", \"Type\": \"TrunkPort\", \"Capacities\": \"{\\\"bw\\\": 100}\", \"id\": 34}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"ConnectionPoint\", \"NodeID\": \"fd27519c-5da8-4560-9cb5-5975748a956f\", \"Name\": \"RENC_UKY\", \"Type\": \"TrunkPort\", \"Capacities\": \"{\\\"bw\\\": 100}\", \"id\": 35}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Link\", \"NodeID\": \"node_id-00-00-00-00-00-10-Wave\", \"Name\": \"l1\", \"Type\": \"L2Path\", \"Layer\": \"L2\", \"id\": 36}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"ConnectionPoint\", \"NodeID\": \"461d5887-5589-40fc-b101-328edff7a464\", \"Name\": \"UKY_LBNL\", \"Type\": \"TrunkPort\", \"Capacities\": \"{\\\"bw\\\": 100}\", \"id\": 37}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"ConnectionPoint\", \"NodeID\": \"f3d8809a-a8cb-4a32-9996-c5b19a34241f\", \"Name\": \"LBNL_UKY\", \"Type\": \"TrunkPort\", \"Capacities\": \"{\\\"bw\\\": 100, \\\"unit\\\": 1}\", \"id\": 38}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Link\", \"NodeID\": \"node_id-10-00-00-00-00-11-Wave\", \"Name\": \"l2\", \"Type\": \"L2Path\", \"Layer\": \"L2\", \"id\": 39}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"ConnectionPoint\", \"NodeID\": \"2ea94f7a-d1d5-4f1f-b689-31fc8b22b516\", \"Name\": \"RENC_LBNL\", \"Type\": \"TrunkPort\", \"Capacities\": \"{\\\"bw\\\": 100}\", \"id\": 40}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"ConnectionPoint\", \"NodeID\": \"d530c6bd-43e3-4a88-9682-e1e1f3cfe5fa\", \"Name\": \"LBNL_RENC\", \"Type\": \"TrunkPort\", \"Capacities\": \"{\\\"bw\\\": 100, \\\"unit\\\": 1}\", \"id\": 41}, {\"GraphID\": \"43b82558-cf9c-4040-ac6b-eadc722a3fbe\", \"Class\": \"Link\", \"NodeID\": \"node_id-00-00-00-00-00-11-Wave\", \"Name\": \"l3\", \"Type\": \"L2Path\", \"Layer\": \"L2\", \"id\": 42}], \"links\": [{\"Class\": \"has\", \"source\": 22, \"target\": 23}, {\"Class\": \"has\", \"source\": 22, \"target\": 24}, {\"Class\": \"has\", \"source\": 22, \"target\": 25}, {\"Class\": \"has\", \"source\": 22, \"target\": 26}, {\"Class\": \"has\", \"source\": 22, \"target\": 27}, {\"Class\": \"has\", \"source\": 22, \"target\": 28}, {\"Class\": \"has\", \"source\": 22, \"target\": 29}, {\"Class\": \"connects\", \"source\": 23, \"target\": 35}, {\"Class\": \"connects\", \"source\": 23, \"target\": 40}, {\"Class\": \"has\", \"source\": 30, \"target\": 31}, {\"Class\": \"connects\", \"source\": 31, \"target\": 34}, {\"Class\": \"connects\", \"source\": 31, \"target\": 37}, {\"Class\": \"has\", \"source\": 32, \"target\": 33}, {\"Class\": \"connects\", \"source\": 33, \"target\": 38}, {\"Class\": \"connects\", \"source\": 33, \"target\": 41}, {\"Class\": \"connects\", \"source\": 34, \"target\": 36}, {\"Class\": \"connects\", \"source\": 35, \"target\": 36}, {\"Class\": \"connects\", \"source\": 37, \"target\": 39}, {\"Class\": \"connects\", \"source\": 38, \"target\": 39}, {\"Class\": \"connects\", \"source\": 40, \"target\": 42}, {\"Class\": \"connects\", \"source\": 41, \"target\": 42}]}",
  //       "message": "",
  //       "status": "OK"
  //     }
  //   };
  //   this.setState({ resources: this.siteParser(data) });
  // }

  siteParser = (data) => {
    let abqm_elements = JSON.parse(data.value.bqm);
    const nodes = abqm_elements.nodes;
    const parsedSites = [];
    /************ retrieve site data from all nodes. ************/ 
    nodes.forEach(node => {
      if (node.Class === "CompositeNode") {
        const site = {};
        site.id = node.id;
        site.nodeId = node.NodeID;
        site.name = node.Name;
        // total capacities:
        site.capacities = node.Capacities ? JSON.parse(node.Capacities) : {};
        site.totalCPU = site.capacities.cpu ? site.capacities.cpu : 0;
        site.totalCore = site.capacities.core ? site.capacities.core : 0;
        site.totalDisk = site.capacities.disk ? site.capacities.disk : 0;
        site.totalRAM = site.capacities.ram ? site.capacities.ram : 0;
        site.totalUnit = site.capacities.unit ? site.capacities.unit: 0;
        // allocated capacities:
        site.allocatedCapacities = node.CapacityAllocations ? JSON.parse(node.CapacityAllocations) : {};
        site.allocatedCPU = site.allocatedCapacities.cpu ? site.allocatedCapacities.cpu : 0;
        site.allocatedCore = site.allocatedCapacities.core ? site.allocatedCapacities.core : 0;
        site.allocatedDisk = site.allocatedCapacities.disk ? site.allocatedCapacities.disk : 0;
        site.allocatedRAM = site.allocatedCapacities.ram ? site.allocatedCapacities.ram : 0;
        site.allocatedUnit = site.allocatedCapacities.unit ? site.allocatedCapacities.unit: 0;
        // free capacities
        site.freeCPU = site.totalCPU - site.allocatedCPU;
        site.freeCore = site.totalCore - site.allocatedCore;
        site.freeDisk = site.totalDisk - site.allocatedDisk;
        site.freeRAM = site.totalRAM - site.allocatedRAM;
        site.freeUnit = site.totalUnit - site.allocatedUnit;
        
        parsedSites.push(site);
      }
    })

    return parsedSites;
  }

  getResourcesSum = (resources) => {
    const selectedLabels = [
      "totalCore",
      "freeCore",
      "totalCPU",
      "freeCPU",
      "totalDisk",
      "freeDisk",
      "totalRAM",
      "freeRAM",
      "totalUnit",
      "freeUnit",
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

  getResourceByName = (resources, name) => {
    const resource = resources.find(resource => resource.name === name);
    return resource ? resource : null;
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleActiveDetailChange = (name) => {
    this.setState({ activeDetailName: name });
  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      resources: allResources,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allResources;
    if (searchQuery) {
      filtered = allResources.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    let sorted = [];

    if (Array.isArray(sortColumn.path)) {
      sorted = _.orderBy(filtered, [sortColumn.path[0]], [sortColumn.order]);
    } else {
      sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    }

    const resources = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: resources };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, roles, activeDetailName } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="container">
        <h1>Resources</h1>
        <div className="row my-2">
          <TestbedTable sum={this.getResourcesSum(this.state.resources)} />
        </div>
        <div className="row my-2">
          <div className="col-9">
            <Topomap onChange={this.handleActiveDetailChange} />
          </div>
          <div className="col-3">
            <DetailTable
              name={activeDetailName}
              resource={this.getResourceByName(this.state.resources, this.state.nameDict[activeDetailName])}
            />
          </div>
        </div>
        <div className="row my-2">
          <div className="col-12">
            <SearchBox
              value={searchQuery}
              placeholder={"Search resources..."}
              onChange={this.handleSearch}
              className="my-0"
            />
            <p>Showing resource availability of <b>{totalCount}</b> sites.</p> 
            <SummaryTable
              resources={data}
              sortColumn={sortColumn}
              onSort={this.handleSort}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default Resources;