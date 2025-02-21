import React from 'react';
import ProgressBar from '../common/ProgressBar';

// class FacilityPortTable extends Component {
//   columns = [
//     { path: }
//   ]
// }
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
            <th scope="col">In (bits)</th>
            <th scope="col">Out</th>
            <th scope="col">Total</th>
            <th scope="col">Capacity (Gb)</th>
          </tr>
          {
            links.map((link, index) => 
              <tr>
                <td>{link.metric.src_rack}</td>
                <td>{link.metric.dst_rack}</td>
                <td>{Math.round(link.value[1])}</td>
                <td>{link.metric.max / 1000000000 ? link.metric.max / 1000000000 : "N/A"}</td>
              </tr>
            )
          }
       
        </thead>
      </table>
    </div>
  )
}

export default LinkTable;
