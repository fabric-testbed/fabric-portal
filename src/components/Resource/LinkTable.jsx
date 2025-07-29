import React from 'react';
import Table from "../common/Table";

const columns = [
  {
    content: (link) => (<span className="font-monospace">{link.src_rack.toUpperCase()}</span>),
    path: "src_rack",
    label: "From"
  },
  {
    content: (link) => (<span className="font-monospace">{link.dst_rack.toUpperCase()}</span>),
    path: "dst_rack",
    label: "To"
  },
  {
    content: (link) => (<span className="font-monospace">{link.in_now_value}</span>),
    path: "in_now_value",
    label: "In Now"
  },
  {
    content: (link) => (<span className="font-monospace">{link.out_now_value}</span>),
    path: "out_now_value",
    label: "Out Now"
  },
  {
    content: (link) => (<span className="font-monospace">{link.in_hr_avg_value}</span>),
    path: "in_hr_avg_value",
    label: "In Hour Avg."
  },
  {
    content: (link) => (<span className="font-monospace">{link.out_hr_avg_value}</span>),
    path: "out_hr_avg_value",
    label: "Out Hour Avg."
  },
  {
    content: (link) => (<span className="font-monospace">{link.in_hr_max_value}</span>),
    path: "in_hr_max_value",
    label: "In Hour Max"
  },
  {
    content: (link) => (<span className="font-monospace">{link.out_hr_max_value}</span>),
    path: "out_hr_max_value",
    label: "Out Hour Max"
  },
  {
    content: (link) => (<span className="font-monospace">{link.in_day_avg_value}</span>),
    path: "in_day_avg_value",
    label: "In Day Avg"
  },
  {
    content: (link) => (<span className="font-monospace">{link.out_day_avg_value}</span>),
    path: "out_day_avg_value",
    label: "Out Day Avg"
  },
  {
    content: (link) => (<span className="font-monospace">
      {link.out_day_max_value}
    </span>),
    path: "out_day_max_value",
    label: "Out Day Max"
  },
  {
    content: (link) => (<span className="font-monospace">
      {link.max / 1000000000 || "N/A"}
    </span>),
    path: "max",
    label: "Capacity (Gb)"
  },
]

const LinkTable = props => {
  const { links, totalCount, onChange, value, sortColumn, onSort } = props;
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
              placeholder={"Search by source-destination site"}
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
        caption="Unit: bits / second"
      />
    </div>
  )
}

export default LinkTable;
