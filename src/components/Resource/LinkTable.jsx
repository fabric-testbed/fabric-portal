import React from 'react';
import Table from "../common/Table";

const columns = [
  { label: "From", path: "src_rack"},
  { label: "To", path: "dst_rack"},
  { label: "In Now", path: "in_now_value"},
  { label: "Out Now", path: "out_now_value"},
  { label: "In Hour Avg.", path: "in_hr_avg_value"},
  { label: "Out Hour Avg.", path: "out_hr_avg_value"},
  { label: "In Hour Max", path: "in_hr_max_value"},
  { label: "Out Hour Max", path: "out_hr_max_value"},
  { label: "In Day Avg", path: "in_day_avg_value"},
  { label: "Out Day Avg", path: "out_day_avg_value"},
  {
    content: (link) => (<span className="font-monospace text-sm-size">
      {link.out_day_max_value}
    </span>),
    path: "out_day_max_value",
    label: "Out Day Max"
  },
  {
    content: (link) => (<span className="font-monospace text-sm-size">
      {link.max / 1000000000 || "N/A"}
    </span>),
    path: "max",
    label: "Capacity (Gb)"
  },
]

const LinkTable = props => {
  const { links, totalCount, onChange, value, sortColumn, onSort } = props;
  console.log(links)
  return (
    <div className="mb-3">
      <div className="d-flex flex-row justify-content-between p-2">
        <div className="fw-bold font-monospace d-flex align-items-center">
          Links ({totalCount})
        </div>
        <div className="d-flex flex-row w-50 justify-content-end">
          <div className="d-flex flex-row w-50">
            <input
              type="text"
              name="query"
              className="form-control form-control form-control-sm align-self-end"
              placeholder={"Search by source or destination site"}
              value={value}
              onChange={(e) => onChange(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={links}
        tStyle={"table-sm"}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    </div>
  )
}

export default LinkTable;
