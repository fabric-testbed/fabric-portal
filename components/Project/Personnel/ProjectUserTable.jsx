import React, { useState, useMemo, useCallback } from "react";
import Table from "../../common/Table";
import Pagination from "../../common/Pagination";
import _ from "lodash";
import paginate from "../../../utils/paginate";
import Link from "next/link";

const ProjectUserTable = ({ canUpdate, users, personnelType, inputText, operation, onUpdateUsers, onCheckUser }) => {
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedUserIDs, setCheckedUserIDs] = useState([]);

  const handleCheckUser = useCallback((userID) => {
    setCheckedUserIDs(prev => {
      if (!prev.includes(userID)) {
        return [...prev, userID];
      } else {
        return prev.filter(id => id !== userID);
      }
    });
  }, []);

  const columns = useMemo(() => {
    if (canUpdate) {
      return [
        {
          path: "",
          label: "",
          content: (user) => (
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id={`tableCheck${user.uuid}`}
                checked={user.isChecked}
                onClick={() => handleCheckUser(user.uuid)}
              />
            </div>
          )
        },
        {
          path: "name",
          label: "Name",
          content: (user) => (
            <Link href={`/user/public-profile/${user.uuid}`}>{user.name}</Link>
          )
        },
        { path: "email", label: "Email" },
        { path: "uuid", label: "ID" },
      ];
    } else {
      return [
        {
          path: "name",
          label: "Name",
          content: (user) => (
            <Link href={`/user/public-profile/${user.uuid}`}>{user.name}</Link>
          )
        },
        { path: "email", label: "Email" },
        { path: "uuid", label: "ID" },
      ];
    }
  }, [canUpdate, handleCheckUser]);

  const handleSort = (newSortColumn) => {
    setSortColumn(newSortColumn);
  };

  const handlePageChange = (page, pagesCount) => {
    if (page === -1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (page === -2 && currentPage < pagesCount) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(page);
    }
  };

  const reloadPageData = () => {
    const lowercaseQuery = searchQuery.toLowerCase();
    let filtered = users.filter(user => user.email ?
      (user.name.toLowerCase().includes(lowercaseQuery) || user.email.toLowerCase().includes(lowercaseQuery))
      :
      user.name.toLowerCase().includes(lowercaseQuery)
    );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const checked = sorted.map(user => ({ ...user, isChecked: checkedUserIDs.includes(user.uuid) }));

    const data = paginate(checked, currentPage, pageSize);

    return { totalCount: filtered.length, data: data };
  };

  const handleInputChange = (e) => {
    if (searchQuery !== "" && e.target.value === "") {
      setCurrentPage(1);
      setSearchQuery("");
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const raiseInputKeyDown = (e) => {
    const query = e.target.value;
    if ((e.key === "Enter") && query) {
     handleSearch();
    }
  };

  const { totalCount, data } = reloadPageData();

  return (
    <div>
      <div className="w-100 input-group my-1">
        <input
          type="text"
          name="query"
          className="form-control"
          placeholder={inputText}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={raiseInputKeyDown}
        />
      </div>
      <div className="d-flex justify-content-between">
        {checkedUserIDs.length > 0 &&
          <div>{`${checkedUserIDs.length} row(s) selected.`}</div>
        }
        <div>{`${totalCount} result(s)`}.</div>
      </div>
      <Table
        columns={columns}
        data={data}
        sortColumn={sortColumn}
        onSort={handleSort}
        style={canUpdate ? "table-sm" : "table-md"}
        onCheck={onCheckUser}
      />
      <Pagination
        itemsCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {
        canUpdate && <button
          onClick={() => onUpdateUsers(personnelType, checkedUserIDs, operation)}
          className={operation === "add" ? "btn btn-sm btn-outline-primary" : "btn btn-sm btn-outline-danger"}
          disabled={checkedUserIDs.length === 0}
        >
          {operation === "add" && `Add to ${personnelType}`}
          {operation === "remove" && `Remove from ${personnelType}`}
        </button>
      }
    </div>
  );
};

export default ProjectUserTable;
