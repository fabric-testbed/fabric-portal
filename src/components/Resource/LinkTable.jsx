import React from 'react';

const columns = [
  { label: "In Now", path: "in_now_value"},
  { label: "Out Now", path: "out_now_value"},
  { label: "In Hour Avg.", path: "in_hr_avg_value"},
  { label: "Out Hour Avg.", path: "out_hr_avg_value"},
  { label: "In Hour Max", path: "in_hr_max_value"},
  { label: "Out Hour Max", path: "out_hr_max_value"},
  { label: "In Day Avg", path: "in_day_avg_value"},
  { label: "Out Day Avg", path: "out_day_avg_value"},
  { label: "In Day Max", path: "in_day_max_value"},
  { label: "Out Day Max", path: "out_day_max_value"}
]

const LinkTable = props => {
  const { links, totalCount } = props;
  return (
    <div className="mb-3">
      <div className="fw-bold font-monospace d-flex align-items-center">
        Links ({totalCount})
      </div>
      <table className="table table-hover table-bordered site-detail-table">
       <thead>
          <tr>
            <th scope="col">From</th>
            <th scope="col">To</th>
            {
              columns.map((row, index) => 
              <th scope="col" key={`link-table-col-${index}`}>{ row.label }</th>
            )
            }
            <th scope="col">Capacity (Gb)</th>
          </tr>
          {
            links.map((link, index) => 
              <tr key={`link-table-row-${index}`}>
                <td scope="col">{link.metric.src_rack}</td>
                <td scope="col">{link.metric.dst_rack}</td>
                {
                  columns.map((row, index) => 
                  <td scope="col" key={`link-table-col-${index}`}>{ link.metric.values[row.path] }</td>
                )
                }
                <td scope="col">{link.metric.max / 1000000000 || "N/A"}</td>
              </tr>
            )
          }
       
        </thead>
      </table>
    </div>
  )
}

export default LinkTable;
