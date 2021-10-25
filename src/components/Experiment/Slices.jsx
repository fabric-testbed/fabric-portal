import React from "react";
import { Link } from "react-router-dom";
import Checkbox from "../common/Checkbox";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";
import SlicesTable from "../Slice/SlicesTable";

import { createIdToken, refreshToken, revokeToken } from "../../services/credentialManagerService.js";
import { getSlices } from "../../services/orchestratorService.js";
import { toast } from "react-toastify";

import paginate from "../../utils/paginate";
import _ from "lodash";

class Slices extends React.Component {
  state = {
    // slices: [],
    slices: [
      {
        "graph_id": "f851861a-f215-4b86-9d51-79288a119ab7",
        "lease_end": "2021-10-08 18:22:12",
        "slice_id": "d5d8d143-5884-40d8-8221-d06f5dd91909",
        "slice_name": "Slice 1",
        "slice_state": "Dead"
      },
      {
        "graph_id": "f50d36e9-baad-409e-a57f-77653918c4b1",
        "lease_end": "2021-10-14 20:24:48",
        "slice_id": "c550ea0c-7cff-47e3-b3d3-d0517233186b",
        "slice_name": "Slice 1",
        "slice_state": "Dead"
      },
      {
        "graph_id": "810394ef-2a85-4a1d-8a56-f165ff0dcb57",
        "lease_end": "2021-10-19 21:01:34",
        "slice_id": "726b498e-5706-4f25-8018-619b6764331a",
        "slice_name": "Slice 1",
        "slice_state": "Dead"
      },
      {
        "graph_id": "c0467056-a545-484c-8098-862f9ea3b0c4",
        "lease_end": "2021-10-09 15:12:10",
        "slice_id": "9c81d107-b6bc-4729-9758-f8597c467fc5",
        "slice_name": "Slice 2",
        "slice_state": "StableOK"
      },
      {
        "graph_id": "4fccd986-4e08-411a-b5d6-b4de33f7ab34",
        "lease_end": "2021-10-19 21:01:54",
        "slice_id": "54a1cc12-4192-48df-9dd1-75124260feab",
        "slice_name": "Slice 2",
        "slice_state": "StableOK"
      },
      {
        "graph_id": "e7579402-f815-4295-bdab-0e0fb1db1b7e",
        "lease_end": "2021-10-22 13:22:43",
        "slice_id": "265ccc14-b49d-4366-a971-f3906aa0be05",
        "slice_name": "Example Slice - Complex Recipes",
        "slice_state": "Closing"
      }
    ],
    includeDeadSlices: false,
    pageSize: 10,
    currentPage: 1,
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

  // async componentDidMount() {
  //   // call credential manager to generate tokens 
  //   // if nothing found in browser storage
  //   if (!localStorage.getItem("idToken") || !localStorage.getItem("refreshToken")) {
  //       this.generateTokens().then(async () => {
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
  //       toast.error("Failed to load slices. Please try again later.");
  //       if (err.response.status === 401) {
  //         // 401 Error: Provided token is not valid.
  //         // refresh the token by calling credential manager refresh_token.
  //         this.refreshTokens();
  //       }
  //     }
  //   }
  // }

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
        </div>
        <div className="my-2 d-flex flex-row justify-content-between">
          <span>Showing {totalCount} slices.</span>
          <Checkbox
            label={"Include Dead Slices"}
            id={"checkbox-include-dead-slices"}
            isChecked={this.state.includeDeadSlices}
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