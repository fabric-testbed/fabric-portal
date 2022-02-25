import React from "react";
import Checkbox from "../common/Checkbox";
import Pagination from "../common/Pagination";
import SearchBoxWithDropdown from "../../components/common/SearchBoxWithDropdown";
import SlicesTable from "../Slice/SlicesTable";

import { autoCreateTokens, autoRefreshTokens } from "../../utils/manageTokens";
// import { getSlices } from "../../services/orchestratorService.js";
import { getSlices } from "../../services/fakeSlices.js";
import { toast } from "react-toastify";

import paginate from "../../utils/paginate";
import _ from "lodash";

class Slices extends React.Component {
  state = {
    // slices: [],
    slices: getSlices(),
    includeDeadSlices: false,
    pageSize: 10,
    currentPage: 1,
    filterQuery: "Name",
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  // async componentDidMount() {
  //   // call credential manager to generate tokens 
  //   // if nothing found in browser storage
  //   if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
  //       autoCreateTokens().then(async () => {
  //       const { data } = await getSlices();
  //       this.setState({ slices: data["value"]["slices"] });
  //     });
  //   } else {
  //     // the token has been stored in the browser and is ready to be used.
  //     try {
  //       const { data } = await getSlices();
  //       this.setState({ slices: data["value"]["slices"] });
  //     } catch(err) {
  //       console.log("Error in getting slices: " + err);
  //       toast.error("Failed to load slices. Please re-login and try.");
  //       if (err.response.status === 401) {
  //         // 401 Error: Provided token is not valid.
  //         // refresh the token by calling credential manager refresh_token.
  //         autoRefreshTokens();
  //       }
  //     }
  //   }
  // }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleFilter = (query) => {
    this.setState({ filterQuery: query, currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleIncludeDeadSlices = () => {
    const currentChoice = this.state.includeDeadSlices;
    this.setState( { includeDeadSlices: !currentChoice });
  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      filterQuery,
      searchQuery,
      includeDeadSlices,
      slices: allSlices,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allSlices;

    const filterMap = {
      "Name": "slice_name",
      "ID": "slice_id",
      "State": "slice_state",
    }

    if (searchQuery) {
      filtered = allSlices.filter(s => s[filterMap[filterQuery]].toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (!includeDeadSlices) {
      filtered = filtered.filter((s) => 
        s.slice_state !== "Dead"
      )
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const slices = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: slices };
  };

  render() {
    const { slices, pageSize, currentPage, sortColumn, searchQuery, filterQuery } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="col-9">
        <h1>Slices</h1>
        {
          slices.length === 0 && 
          <div className="alert alert-warning mt-4" role="alert">
            <p className="mt-2">
            We couldn't find your slice. Please create slices from <a href="#">JupyterHub</a> first. Here are some guide articles you may find helpful:
            </p>
            <p>
              <ul>
                <li><a href="https://learn.fabric-testbed.net/knowledge-base/quick-start-guide/#3-start-an-your-first-experiment" target="_blank" rel="noreferrer">Start Your First Experiment</a></li>
                <li><a href="https://learn.fabric-testbed.net/knowledge-base/install-the-python-api/" target="_blank" rel="noreferrer">Install the FABRIC Python API</a></li>
                <li><a href="https://learn.fabric-testbed.net/knowledge-base/fabrictestbed-slice_manager/" target="_blank" rel="noreferrer">Slice Manager</a></li>
                <li><a href="https://learn.fabric-testbed.net/knowledge-base/slice-editor/" target="_blank" rel="noreferrer">Slice Editor</a></li>
              </ul>
            </p>
          </div>
        }
        {
          slices.length > 0 && <div>
             <div className="toolbar">
              <SearchBoxWithDropdown
                activeDropdownVal={filterQuery}
                dropdownValues={["Name", "ID", "State"]}
                value={searchQuery}
                placeholder={`Search Slices by ${filterQuery}...`}
                onDropdownChange={this.handleFilter}
                onInputChange={this.handleSearch}
                className="my-0"
              />
            </div>
            <div className="my-2 d-flex flex-row justify-content-between">
              <span>Showing {totalCount} slices.</span>
              <Checkbox
                label={"Include Dead Slices"}
                id={"checkbox-include-dead-slices"}
                isChecked={this.state.includeDeadSlices}
                onCheck={this.handleIncludeDeadSlices}
              />
            </div>
            <SlicesTable
              slices={data}
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
        }
      </div>
    );
  }
}

export default Slices;