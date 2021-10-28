import React from "react";
import Checkbox from "../common/Checkbox";
import Pagination from "../common/Pagination";
import SearchBoxWithDropdown from "../../components/common/SearchBoxWithDropdown";
import SlicesTable from "../Slice/SlicesTable";

import { createIdToken, refreshToken, revokeToken } from "../../services/credentialManagerService.js";
import { getSlices } from "../../services/orchestratorService.js";
import { toast } from "react-toastify";

import paginate from "../../utils/paginate";
import _ from "lodash";

class Slices extends React.Component {
  state = {
    slices: [],
    includeDeadSlices: false,
    pageSize: 10,
    currentPage: 1,
    filterQuery: "Name",
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  revokeToken = async () => {
    try {
      await revokeToken(localStorage.getItem("refreshToken"));
    } catch(err) {
      console.log(err);
      console.log("Failed to revoke token.");
      // TO DO: what if revoke token fails?
    }
  }

  generateTokens = async () => {
    try {
      // call credential manager to generate tokens.
      // parameters: project and scope, "all" for both by default.
      const { data } = await createIdToken("all", "all");
      localStorage.setItem("idToken", data.id_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      return data;
    } catch(err) {
      console.log(err);
      toast.error("Failed to generate necessary tokens to view slices. Please try again later.");
    }
  }

  refreshTokens = async () => {
    const oldRefreshToken = localStorage.getItem("refreshToken");
    try {
      const { data } = await refreshToken("all", "all", oldRefreshToken);
      localStorage.setItem("idToken", data.id_token);
      localStorage.setItem("refreshToken", data.refresh_token);
    } catch (err) {
      console.log(err);
      toast.error("Failed to refresh necessary tokens to view slices. Please try again later.");
      // if refresh_token isn't working either
      // start over by calling create_token when user reloads the page
      // 1. call cm revoke_token with old refresh token
      this.revokeToken();
      // 2. clear id_token and refresh_token in local storage
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
    }
  }

  async componentDidMount() {
    // call credential manager to generate tokens 
    // if nothing found in browser storage
    if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
        this.generateTokens().then(async () => {
        const { data } = await getSlices();
        this.setState({ slices: data["value"]["slices"] });
      });
    } else {
      // the token has been stored in the browser and is ready to be used.
      try {
        const { data } = await getSlices();
        this.setState({ slices: data["value"]["slices"] });
      } catch(err) {
        console.log("Error in getting slices: " + err);
        toast.error("Failed to load slices. Please try again later.");
        if (err.response.status === 401) {
          // 401 Error: Provided token is not valid.
          // refresh the token by calling credential manager refresh_token.
          this.refreshTokens();
        }
      }
    }
  }

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
    const { pageSize, currentPage, sortColumn, searchQuery, filterQuery } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="col-9">
        <h1>Slices</h1>
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
    );
  }
}

export default Slices;