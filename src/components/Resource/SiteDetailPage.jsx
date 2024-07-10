import React from "react";
import SiteDetailTable  from "./SiteDetailTable.jsx";
import Spinner from 'react-bootstrap/Spinner';
import { sitesNameMapping }  from "../../data/sites";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";
import { getResources } from "../../services/resourceService.js";
import { toast } from "react-toastify";
import sitesParser from "../../services/parser/sitesParser";
import siteParserLevel2 from "../../services/parser/siteLevel2Parser";
import withRouter from "../common/withRouter.jsx";
import CalendarDateTime from "../common/CalendarDateTime.jsx";
import * as Accordion from '@radix-ui/react-accordion';
import moment from 'moment';

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
      data: {
        status: {
          "state": "Active",
          "deadline": null,
          "expected_end": null
        }
      },
      hosts: [],
      startTime: "",
      endTime: "",
      showSpinner: false,
      spinnerMessage: ""
    }
  }

  async componentDidMount() {
    this.setState({ showSpinner: true, spinnerMessage: "Loading resources..." });
    try {
      const { data: res1 } = await getResources(1);
      const { data: res2 } = await getResources(2);
      const parsedObj1 = sitesParser(res1.data[0], sitesNameMapping.acronymToShortName);
      const siteName = this.props.location.pathname.split("s/")[1];
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      this.setState({ 
        hosts: parsedObj2.hosts,
        data: parsedObj1.parsedSites.filter(s => s.name === siteName)[0],
        showSpinner: false,
        spinnerMessage: ""
      });
    } catch (err) {
      this.setState({ showSpinner: false, spinnerMessage: "" });
      toast.error("Failed to load resource information. Please reload this page.");
    }
  }

  handleStartChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    this.setState({ startTime: outputTime });
  }

  handleEndChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    this.setState({ endTime: outputTime });
  }

  handleRefreshTime = async () => {
    const { startTime, endTime } = this.state;
    this.setState({ showSpinner: true, spinnerMessage: "Loading resources..." });
    try {
      const { data: res1 } = await getResources(1, startTime, endTime);
      const { data: res2 } = await getResources(2, startTime, endTime);
      const parsedObj1 = sitesParser(res1.data[0], sitesNameMapping.acronymToShortName);
      const siteName = this.props.location.pathname.split("s/")[1];
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      this.setState({ 
        hosts: parsedObj2.hosts,
        data: parsedObj1.parsedSites.filter(s => s.name === siteName)[0],
        showSpinner: false,
        spinnerMessage: ""
      });
      toast.success("Resources have been loaded successfully.");
    } catch (err) {
      this.setState({ showSpinner: false, spinnerMessage: "" });
      toast.error("The resources cannot be loaded at the moment. Please try again later.");
    }
  }
  
  handleResetTime = async () => {
    window.location.reload();
  }

  render () {
    const { data, hosts, statusMapping, startTime, endTime, showSpinner, spinnerMessage } = this.state;
      return (
        data.status && <div className="container">
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
           {
            data.ptp && 
            <tr>
            <th>PTP Support</th>
            <td>{ data.ptp ? <i className="fa fa-check text-success"></i> : <i className="fa fa-check text-danger"></i> }</td>
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
         <h3>Resource Information</h3>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <span className="mr-2">From</span>
            <CalendarDateTime
              id="siteDetailCalendar1"
              name="siteDetailCalendar"
              parent={"siteDetailPage"}
              time={startTime && startTime.toString().replace(/-/g, "/")}
              onTimeChange={this.handleStartChange}
            />
            <span className="ml-4 mr-2">To</span>
            <CalendarDateTime
              id="siteDetailCalendar2"
              name="siteDetailCalendar"
              parent={"siteDetailPage"}
              time={endTime && endTime.toString().replace(/-/g, "/")}
              onTimeChange={this.handleEndChange}
            />
            <button
              className="btn btn-sm btn-success ml-4"
              onClick={this.handleRefreshTime}
            >
              Refresh
            </button>
            <button
              className="btn btn-sm btn-primary ml-3"
              onClick={this.handleResetTime}
            >
              Reset
            </button>
          </div>
          {
            showSpinner &&
            <div class="d-flex flex-column justify-content-center align-items-center mt-5">
              <Spinner animation="border" role="status" variant="primary" />
              <span className="text-primary">{spinnerMessage}</span>
            </div>
          }
          {
            !showSpinner && <div>
              <h5 className="mt-3">Site Resource Summary</h5>
                {
                    data.name && 
                    <SiteDetailTable
                      data={data}
                      status={data.status}
                      hostCount={hosts.length}
                  />
                }
                <div className="d-flex flex-row align-items-center mt-4">
                  <h5>
                    Host Resources 
                  </h5>
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
          }
       </div>
      </div>
    )
  }
}

export default withRouter(SiteDetailPage);