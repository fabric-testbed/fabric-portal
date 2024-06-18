import React from "react";
import SiteDetailTable  from "./SiteDetailTable.jsx";
import { sitesNameMapping }  from "../../data/sites";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";
import { getResources } from "../../services/resourceService.js";
import { toast } from "react-toastify";
import siteParserLevel2 from "../../services/parser/siteLevel2Parser";
import withRouter from "../common/withRouter.jsx";
import * as Accordion from '@radix-ui/react-accordion';
// import { ChevronDownIcon } from '@radix-ui/react-icons';

class SiteDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
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
      data: this.props.location.state.data,
      hosts: []
    }
  }

  async componentDidMount() {
    try {
      const { data: res2 } = await getResources(2);
      const siteName = this.props.location.pathname.split("s/")[1];
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      this.setState({ hosts: parsedObj2.hosts });
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
    const { data, hosts, statusMapping } = this.state;
    return (
      data.status &&
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
               `${statusMapping[data.status.state].state} (${statusMapping[data.status.state].explanation})` : 
               statusMapping[data.status.state].state
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
     <div className="my-5">
       <h3>Site Resource Summary</h3>
       <SiteDetailTable
         data={data}
         status={data.status}
         hostCount={hosts.length}
        />
        <div className="d-flex flex-row align-items-center mt-5">
          <h3>
            Host Resources 
          </h3>
          <span className="badge badge-primary ml-3 mb-2">{hosts && `${hosts.length} hosts`}</span>
        </div>
       <Accordion.Root className="AccordionRoot" type="single" defaultValue="item-1" collapsible>
       {
          hosts && hosts.map((host, index) =>
          <Accordion.Item
          key={`site-detial-host-${index}`} 
          className="AccordionItem"
          value={`host-${index}`}
          >
          <Accordion.Trigger>{host.Name}</Accordion.Trigger>
          <Accordion.Content><SiteDetailTable data={host} status={data.status} /></Accordion.Content>
        </Accordion.Item>
          )
       }
         </Accordion.Root>
     </div>
    </div>
    )
  }
}

export default withRouter(SiteDetailPage);