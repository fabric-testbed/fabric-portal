import React from "react";
import DetailTable from "./DetailTable";
import { sitesNameMapping }  from "../../data/sites";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";

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

  const { state } = props.location;

  console.log(state.siteData.status)

  return (
    <div className="container">
    <div className="d-flex flex-row justify-content-between">
     <h1>Site - {state.siteData.name}</h1>
     <Link to="/resources">
       <button
         className="btn btn-sm btn-outline-primary my-3"
       >
         <i className="fa fa-sign-in mr-2"></i>
         Back to Resources Overview
       </button>
     </Link>
   </div>
   {
    ["Maint", "PreMaint"].includes(state.siteData.status["state"]) &&
    <div className="alert alert-primary mb-2" role="alert">
      <i className="fa fa-exclamation-triangle mr-2"></i> 
      Please check the <i className="fa fa-sign-in ml-1 mr-2"></i> 
      <a href={portalData.knowledgeBaseForumLink} target="_blank" rel="noopener noreferrer">
       FABRIC Announcements Forum
      </a> for more detailed site maintenance information.
    </div>
   }
   <div className="mt-4">
     <h2>Basic Information</h2>
     <table className="table table-sm table-striped table-bordered mb-4">
       <tbody>
        {
          sitesNameMapping.acronymToShortName[state.siteData.name] && 
          <tr>
            <th>Name</th>
            <td>{ sitesNameMapping.acronymToShortName[state.siteData.name] }</td>
          </tr>
        }
        <tr>
          <th>Acronym</th>
          <td>{ state.siteData.name }</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>
            {
              state.siteData.status["state"] !== "Active" ? 
              `${statusMapping[state.siteData.status["state"]].state} (${statusMapping[state.siteData.status["state"]].explanation})` : 
              statusMapping[state.siteData.status["state"]].state
            }
          </td>
        </tr>
        {
          state.siteData.status["state"] === "Maint" && 
          <tr>
            <th>Expected End Time</th>
            <td>
              {
                state.siteData.status["expected_end"] ?
                utcToLocalTimeParser(state.siteData.status["expected_end"]) : "Unknown"
              }
            </td>
          </tr>
        }
        {
          state.siteData.status["state"] === "PreMaint" && 
          <tr>
            <th>Deadline</th>
            <td>
              {
                state.siteData.status["deadline"] ? 
                utcToLocalTimeParser(state.siteData.status["deadline"]) : "Unknown"
              }
            </td>
          </tr>
        }
        {
          state.siteData.location && 
          <tr>
            <th>Rack Location</th>
            <td>{ JSON.parse(state.siteData.location).postal }</td>
          </tr>
        }
       </tbody>
     </table>
   </div>
   <div className="mt-4">
     <h2>Resource Availabilities</h2>
     <DetailTable
       name={ state.siteData.name }
       resource={ state.siteData }
       parent="sitepage"
     />
   </div>
 </div>
  )
}

export default SiteDetailPage;