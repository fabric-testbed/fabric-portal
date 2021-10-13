import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";
import SlicesTable from "../Slice/SlicesTable";

import { createIdToken, refreshToken, revokeToken } from "../../services/credentialManagerService.js";
import { getSlices } from "../../services/orchestratorService.js";
import { toast } from "react-toastify";

import paginate from "../../utils/paginate";
import _ from "lodash";
import { cloneWithShallow } from "joi-browser";

class Slices extends React.Component {
  state = {
    slices: [],
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  generateTokens = async () => {
    // call credential manager to generate tokens 
    const { data } = await createIdToken("all", "all");
    localStorage.setItem("idToken", data.id_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    return data;
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
        const { slices } = await getSlices();
        this.setState({ slices });
      } catch(err) {
        console.log("Error in getting slices: " + err);
        // if the token refresh won't work, the user has to logout and login back.
        toast.error("Please logout and login back to view the slices.");
      }
    }
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

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      slices: allSlices,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allSlices;
    if (searchQuery) {
      filtered = allSlices.filter((s) =>
        s.slice_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const slices = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: slices };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="col-9">
        <h1>Slices</h1>
        <div className="toolbar">
          <SearchBox
            value={searchQuery}
            placeholder={"Search slices..."}
            onChange={this.handleSearch}
            className="my-0"
          />
          <Link to="/slices/new" className="btn btn-primary">
            Create Slice
          </Link>
        </div>
        <div className="my-2">
          Showing {totalCount} slices.
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