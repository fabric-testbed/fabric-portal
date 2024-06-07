import React from "react";
import DetailTable from "./DetailTable";
import { sitesNameMapping }  from "../../data/sites";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";
import ProgressBar from '../common/ProgressBar';
import { getResources } from "../../services/resourceService.js";
import { toast } from "react-toastify";
import siteParserLevel2 from "../../services/parser/siteLevel2Parser";
import withRouter from "../common/withRouter.jsx";


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

class SiteDetailPage extends React.Component {
  state= {
    "statusMapping": {
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
    },
    "componentTypes": ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA"],
    data: {
      status: "Active",
      name: ""
    },
    hosts: []
  }

  async componentDidMount() {
    try {
      const { data: res2 } = await getResources(2);
      const siteName = this.props.location.pathname.split("s/")[1];
      console.log(siteName)
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      this.setState({
        hosts: parsedObj2.hosts
      });

    
      // if(resourceName && resourceName !== "all" && parsedObj.siteAcronyms.includes(resourceName)) {
      //   this.setState({
      //     searchQuery: resourceName,
      //     activeDetailName: sitesNameMapping.acronymToShortName[resourceName]
      //   })
      // }
    } catch (err) {
      toast.error("Failed to load resource information. Please reload this page.");
    }
  }
  
  render () {
    const { data, hosts, statusMapping, componentTypes } = this.state;
    return (
      <div className="container">
      <div className="d-flex flex-row justify-content-between">
       <h1>Site - {data.name}</h1>
       <Link to="/resources/all">
         <button
           className="btn btn-sm btn-outline-primary my-3"
         >
           <i className="fa fa-sign-in mr-2"></i>
           Back to Resources Overview
         </button>
       </Link>
     </div>
     {
      ["Maint", "PreMaint", "PartMaint"].includes(data.status["state"]) &&
      <div className="alert alert-primary mb-2" role="alert">
        <i className="fa fa-exclamation-triangle mr-2"></i> 
        Please check the <i className="fa fa-sign-in ml-1 mr-2"></i> 
        <a href={portalData.fabricAnnouncementsForumLink} target="_blank" rel="noopener noreferrer">
         FABRIC Announcements Forum
        </a> for more detailed site maintenance information.
      </div>
     }
     <div className="mt-4">
       <h3>Basic Information</h3>
       <table className="table table-sm table-striped table-bordered mb-4">
         <tbody>
          {
            sitesNameMapping.acronymToShortName[data.name] && 
            <tr>
              <th>Name</th>
              <td>{ sitesNameMapping.acronymToShortName[data.name] }</td>
            </tr>
          }
          <tr>
            <th>Acronym</th>
            <td>{ data.name }</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>
              {
                data.status["state"] !== "Active" ? 
                `${statusMapping[data.status].state} (${statusMapping[data.status].explanation})` : 
                statusMapping[data.status].state
              }
            </td>
          </tr>
          {
            data.status["state"] === "Maint" && 
            <tr>
              <th>Expected End Time</th>
              <td>
                {
                  data.status["expected_end"] ?
                  utcToLocalTimeParser(data.status["expected_end"]) : "Unknown"
                }
              </td>
            </tr>
          }
          {
            data.status["state"] === "PreMaint" && 
            <tr>
              <th>Deadline</th>
              <td>
                {
                  data.status["deadline"] ? data.status["deadline"] : "Unknown"
                }
              </td>
            </tr>
          }
          {
            data.location && 
            <tr>
              <th>Rack Location</th>
              <td>{ JSON.parse(data.location).postal }</td>
            </tr>
          }
         </tbody>
       </table>
     </div>
     {
      data.workers && data.workers.length > 0 && <div className="mt-4">
        <h3>Workers in Maintenance</h3>
        <table className="table table-sm table-striped table-bordered mb-4">
          <tbody>
            <tr>
              <th>Worker Name</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Expected End Time</th>
            </tr>
            {
              data.workers.map((worker, index) => {
                return (
                  <tr key={`maintenance-worker-${index}`}>
                    <td>{Object.keys(worker)[0]}</td>
                    <td>{statusMapping[Object.values(worker)[0].state].state}</td>
                    <td>{Object.values(worker)[0].deadline ? utcToLocalTimeParser(Object.values(worker)[0].deadline) : "Unknown"}</td>
                    <td>{Object.values(worker)[0].expected_end ? utcToLocalTimeParser(Object.values(worker)[0].expected_end) : "Unknown"}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
     }
     <div className="mt-4">
       <h3>Resource Availabilities</h3>
       {/* <DetailTable
         name={ data.name }
         resource={ data }
         parent="sitepage"
       /> */}
       <table className="table table-hover table-bordered site-detail-table">
        <thead>
          <tr>
            <th scope="col" rowSpan={2}>Component</th>
            <th colSpan="3" className="border-bottom">Avalability</th>
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
          data.type && 
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
                          statusMapping[data.status].colorHex,
                          statusMapping[data.status].labelColorHex
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
                        statusMapping[data.status].colorHex,
                        statusMapping[data.status].labelColorHex
                      )
                    }
                  </td>
                </tr>
                )
              )
            )
          }
        </tbody>
       </table>
       {
          hosts && hosts.map((host, index) =>
            <div key={`site-detial-host-${index}`}>
              <h5 className="text-primary">{host.Name}</h5>
              <table className="table table-hover table-bordered site-detail-table">
                <thead>
                  <tr>
                    <th scope="col" rowSpan={2}>Component</th>
                    <th colSpan="3" className="border-bottom">Avalability</th>
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
                  (
                    componentTypes.map((type, index) =>  host[type] && (
                       host[type].length > 1 ?
                        <React.Fragment>
                          <tr key={`site-resource-${index}`}>
                            <th scope="col" rowSpan={host[type] && host[type].length}>{type}</th>
                            <td>
                              {host[type][0].model}
                            </td>
                            <td>
                              {host[type][0].unit}
                            </td>
                            <td>
                              {host[type][0].allocatedUnit}
                            </td>
                            <td rowSpan={host[type] && host[type].length}>
                              {
                                generateProgressBar(
                                  host[`free${type}`],
                                  host[`total${type}`],
                                  statusMapping[host.status].colorHex,
                                  statusMapping[host.status].labelColorHex
                                )
                              }
                            </td>
                          </tr>
                          {
                            host[type].slice(1).map((row, index) =>
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
                          host[type].length === 1 && 
                          <tr key={`site-resource-${index}`}>
                          <th scope="col">{type}</th>
                          <td>
                            {host[type][0].model}
                          </td>
                          <td>
                            {host[type][0].unit}
                          </td>
                          <td>
                            {host[type][0].allocatedUnit}
                          </td>
                          <td rowSpan={host[type] && host[type].length}>
                            {
                              generateProgressBar(
                                host[`free${type}`],
                                host[`total${type}`],
                                "#68b3d1",
                                "fff"
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
     </div>
   </div>
    )
  }
}

export default withRouter(SiteDetailPage);