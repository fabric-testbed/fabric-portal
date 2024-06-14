import React, { useState } from 'react';
import ProgressBar from '../common/ProgressBar';

const generateProgressBar = (total, free, color, labelColor) => {
  return (
    <ProgressBar
      now={total > 0 ? Math.round(free * 100/ total) : 0}
      label={`${free}/${total}`}
      color={color}
      labelColor={labelColor}
    />
  )
}

const SiteDetailTable = props => {
  const { data, status } = props;
  const state = status.state ? status.state : "Active";

  const statusMapping = {
    "Maint": {
      state: "Maintenance",
      colorName: "danger",
      colorHex: "#b00020",
      labelColorHex: "#fff"
    },
    "PreMaint": {
      state: "Pre-Maintenance",
      colorName: "warning",
      colorHex: "#ffb670",
      labelColorHex: "#212529"
    },
    "PartMaint": {
      state: "Partial Maintenance",
      colorName: "warning",
      colorHex: "#ffb670",
      labelColorHex: "#212529"
    },
    "Active": {
      state: "Active",
      colorName: "primary",
      colorHex: "#68b3d1",
      labelColorHex: "#212529"
    }
  }

  const componentTypes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA"];

  return (
    <div>
      <table className="table table-hover table-bordered site-detail-table">
       <thead>
          <tr>
            <th scope="col">Resources</th>
            <th scope="col">Core</th>
            <th scope="col">Disk (GB)</th>
            <th scope="col">RAM (GB)</th>
          </tr>
          <tr>
            <td><b>Available/ Total</b></td>
            <td>{ generateProgressBar(data[`freeCore`],data[`totalCore`],"#68b3d1","fff")}</td>
            <td>{ generateProgressBar(data[`freeDisk`],data[`totalDisk`],"#68b3d1","fff")}</td>
            <td>{ generateProgressBar(data[`freeRAM`],data[`totalRAM`],"#68b3d1","fff")}</td>
          </tr>
        </thead>
        <thead>
          <tr>
            <th scope="col" rowSpan={2}>Component</th>
            <th colSpan="3" className="border-bottom">Availability</th>
            <th scope="col" rowSpan={2}>Available / Total</th>
          </tr>
          <tr>
            <td><b>Model</b></td>
            <td><b>Total Units</b></td>
            <td><b>Allocated Units</b></td>
          </tr>
        </thead>
        <tbody>
         {
          data && 
            (
              componentTypes.map((type, index) =>  (
              data[type] && data[type].length > 1 ?
                <React.Fragment>
                  <tr key={`site-resource-${index}`}>
                    <th scope="col" rowSpan={data[type] && data[type].length}>{type}</th>
                    <td>
                      {data[type][0].model}
                    </td>
                    <td>
                      {data[type][0].unit}
                    </td>
                    <td>
                      {data[type][0].allocatedUnit}
                    </td>
                    <td rowSpan={data[type] && data[type].length}>
                      {
                        generateProgressBar(
                          data[`free${type}`],
                          data[`total${type}`],
                          statusMapping[state].colorHex,
                          statusMapping[state].labelColorHex
                        )
                      }
                    </td>
                  </tr>
                  {
                    data[type].slice(1).map((row, index) =>
                    <tr key={`site-resource-${index}`}>
                      <td>
                        {row.model}
                      </td>
                      <td>
                        {row.unit}
                      </td>
                      <td>
                        {row.allocatedUnit}
                      </td>
                    </tr>)
                  }
                </React.Fragment>
                :
                (
                  data[type].length === 1 && 
                  <tr key={`site-resource-${index}`}>
                    <th scope="col">{type}</th>
                    <td>
                      {data[type][0].model}
                    </td>
                    <td>
                      {data[type][0].unit}
                    </td>
                    <td>
                      {data[type][0].allocatedUnit}
                    </td>
                    <td rowSpan={data[type] && data[type].length}>
                      {
                        generateProgressBar(
                          data[`free${type}`],
                          data[`total${type}`],
                          statusMapping[state].colorHex,
                          statusMapping[state].labelColorHex
                        )
                      }
                    </td>
                  </tr>
                )
                )
              )
            )
          }
        </tbody>
       </table>
    </div>
  )
}

export default SiteDetailTable;
