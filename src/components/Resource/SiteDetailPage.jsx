import React from "react";
import DetailTable from "./DetailTable";
import { sitesNameMapping }  from "../../data/sites";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import { default as portalData } from "../../services/portalData.json";
import { Link, useLocation } from "react-router-dom";

const SiteDetailPage = props => {
  const statusMapping = {
    "Maint": {
      state: "Maintenance",
      color: "warning",
      explanation: "no requests would be accepted"
    },
    "PreMaint": {
      state: "Pre-Maintenance",
      color: "warning",
      explanation: "requests will be expected until the deadline"
    },
    "Active": {
      state: "Active",
      color: "primary",
      explanation: ""
    
    }
  }

  const location = useLocation();

  const data = location.state.data;

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
    ["Maint", "PreMaint"].includes(data.status["state"]) &&
    <div className="alert alert-primary mb-2" role="alert">
      <i className="fa fa-exclamation-triangle mr-2"></i> 
      Please check the <i className="fa fa-sign-in ml-1 mr-2"></i> 
      <a href={portalData.fabricAnnouncementsForumLink} target="_blank" rel="noopener noreferrer">
       FABRIC Announcements Forum
      </a> for more detailed site maintenance information.
    </div>
   }
   <div className="mt-4">
     <h2>Basic Information</h2>
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
              `${statusMapping[data.status["state"]].state} (${statusMapping[data.status["state"]].explanation})` : 
              statusMapping[data.status["state"]].state
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
                data.status["deadline"] ? 
                utcToLocalTimeParser(data.status["deadline"]) : "Unknown"
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
   <div className="mt-4">
     <h2>Resource Availabilities</h2>
     <DetailTable
       name={ data.name }
       resource={ data }
       parent="sitepage"
     />
   </div>
 </div>
  )
}

export default SiteDetailPage;