"use client";
import React from "react";
import SiteDetailTable from "@/components/Resource/SiteDetailTable";
import Spinner from "react-bootstrap/Spinner";
import { sitesNameMapping } from "@/assets/data/sites";
import utcToLocalTimeParser from "@/utils/utcToLocalTimeParser";
import portalData from "@/services/portalData.json";
import Link from "next/link";
import { getResources } from "@/services/resourceService";
import { toast } from "react-toastify";
import sitesParser from "@/services/parser/sitesParser";
import siteParserLevel2 from "@/services/parser/siteLevel2Parser";
import CalendarDateTime from "@/components/common/CalendarDateTime";
import moment from "moment";
import Accordion from "react-bootstrap/Accordion";
import { LogIn, AlertTriangle, Check } from "lucide-react";
import { getSessionItem } from "@/utils/sessionCookies";
import SpinnerWithText from "@/components/common/SpinnerWithText";

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
      "componentTypes": ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA", "Switch"],
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
      startDate: null,
      endDate: null,
      showSpinner: true,
      spinnerMessage: "Loading resources..."
    }
  }

  async componentDidMount() {
    try {
      const { data: res1 } = await getResources(1, null, null, "sites");
      const { data: res2 } = await getResources(2, null, null, "hosts");
      const parsedObj1 = sitesParser(res1.data[0], sitesNameMapping.acronymToShortName);
      const siteName = this.props.siteId;
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      this.setState({
        hosts: parsedObj2.hosts.filter(host => host.Site === siteName),
        data: parsedObj1.parsedSites.filter(s => s.name === siteName)[0],
        showSpinner: false,
        spinnerMessage: ""
      });

} catch (err) {
      this.setState({ showSpinner: false, spinnerMessage: "" });
      // Silent failure — resources API requires auth in some environments
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

    this.setState({ startTime: outputTime, startDate: value });
  }

  handleEndChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    this.setState({ endTime: outputTime, endDate: value });
  }

  handleRefreshTime = async () => {
    const { startTime, endTime } = this.state;
    this.setState({ showSpinner: true, spinnerMessage: "Loading resources..." });
    try {
      const { data: res1 } = await getResources(1, startTime, endTime, "sites");
      const { data: res2 } = await getResources(2, startTime, endTime, "hosts");
      const parsedObj1 = sitesParser(res1.data[0], sitesNameMapping.acronymToShortName);
      const siteName = this.props.siteId;
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      this.setState({
        hosts: parsedObj2.hosts.filter(host => host.Site === siteName),
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

  getHostStatus = (host) => {
    // First check workers array (from MaintenanceInfo) for backward compat
    if (this.state.data.workers) {
      for (const worker of this.state.data.workers) {
        if (host.Name === Object.keys(worker)[0]) {
          return { state: Object.values(worker)[0].state };
        }
      }
    }
    // Fall back to the host's own state from the level-2 summary
    if (host.state) {
      return { state: host.state };
    }
    return { state: "Active" };
  }

  getHostStatusStyle = (host) => {
    const status = this.getHostStatus(host);
    if (status.state === "Maint") {
      return {
        textClass: "text-danger",
        borderClass: "host-maint",
        badgeLabel: "Down",
        badgeBg: "#b00020",
        badgeColor: "#fff",
        badgeBorder: "#b00020",
      };
    }
    if (["PreMaint", "PartMaint"].includes(status.state)) {
      return {
        textClass: "text-warning",
        borderClass: "host-pre-maint",
        badgeLabel: status.state === "PreMaint" ? "Pre-Maintenance" : "Partial Maintenance",
        badgeBg: "#fff3ec",
        badgeColor: "#7a3200",
        badgeBorder: "#ff8542",
      };
    }
    return null;
  }

  render () {
    const { data, hosts, statusMapping, startTime, endTime, startDate, endDate, showSpinner, spinnerMessage } = this.state;
      return (
        <div className="container">
        {!data.status && <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <SpinnerWithText text={spinnerMessage} />
        </div>}
        {data.status && <div>
        <div className="d-flex flex-row justify-content-between">
         <h1>Site - {data.name}</h1>
         <Link href="/resources/overview">
           <button
             className="btn btn-sm btn-outline-primary my-3"
           >
             <LogIn className="me-2" size={16} />
             Back to Resources Overview
           </button>
         </Link>
        </div>
       {
        ["Maint", "PreMaint", "PartMaint"].includes(data.status["state"]) &&
        <div className="alert alert-primary mb-2" role="alert">
          <AlertTriangle className="me-2" size={16} /> 
          Please check the <LogIn className="ms-1 me-2" size={16} />
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
             data.location && getSessionItem("userStatus") === "active" &&
             <tr>
               <th>Rack Location</th>
               <td>{ data.location }</td>
             </tr>
           }
           {
            data.ptp && 
            <tr>
            <th>PTP Support</th>
            <td>{ data.ptp ? <Check className="text-success" size={16} /> : <Check className="text-danger" size={16} />}</td>
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
         {
          getSessionItem("userStatus") !== "active" &&
          <div
            className="alert alert-primary mb-2 d-flex flex-row justify-content-between align-items-center"
            role="alert"
          >
            Please log in to access resources filtering by time frame.
          </div>
         }
         {
          getSessionItem("userStatus") === "active" &&
          <div className="d-flex flex-row justify-content-center align-items-center">
            <span className="me-2">From</span>
            <CalendarDateTime
              id="siteDetailCalendar1"
              name="siteDetailCalendar"
              offset={0}
              time={startDate}
              onTimeChange={this.handleStartChange}
            />
            <span className="ms-4 me-2">To</span>
            <CalendarDateTime
              id="siteDetailCalendar2"
              name="siteDetailCalendar"
              offset={-1}
              time={endDate}
              onTimeChange={this.handleEndChange}
            />
            <button
              className="btn btn-sm btn-success ms-4"
              onClick={this.handleRefreshTime}
            >
              Refresh
            </button>
            <button
              className="btn btn-sm btn-primary ms-3"
              onClick={this.handleResetTime}
            >
              Reset
            </button>
          </div>
         }
          {
            showSpinner &&
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
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
                <div className="d-flex flex-row align-items-center mt-4 mb-3">
                  <h5 className="mb-0 me-3">
                    Host Resources
                  </h5>
                  <span className="badge bg-primary" style={{ fontSize: "0.75rem" }}>{hosts && `${hosts.length} hosts`}</span>
                </div>
                <Accordion defaultActiveKey="0">
                {
                  hosts && hosts.map((host, index) => {
                    const hostStyle = this.getHostStatusStyle(host);
                    return (
                      <Accordion.Item
                        key={`site-detial-host-${index}`}
                        eventKey={index}
                        className={`AccordionItem ${hostStyle ? hostStyle.borderClass : ""}`}
                        value={`host-${index}`}
                      >
                        <Accordion.Header>
                          <span className={hostStyle ? hostStyle.textClass : "text-dark"}>{host.Name}</span>
                          {hostStyle && (
                            <span
                              className="ms-2"
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                padding: "0.1rem 0.45rem",
                                borderRadius: "0.25rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                                backgroundColor: hostStyle.badgeBg,
                                color: hostStyle.badgeColor,
                                border: `1px solid ${hostStyle.badgeBorder}`,
                              }}
                            >
                              {hostStyle.badgeLabel}
                            </span>
                          )}
                        </Accordion.Header>
                        <Accordion.Body>
                          <SiteDetailTable data={host} status={this.getHostStatus(host)} />
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })
                }
              </Accordion>
            </div>
          }
       </div>
      </div>}
      </div>
    )
  }
}

export default function SiteDetailPageWrapper({ params }) {
  const { id } = React.use(params);
  return <SiteDetailPage siteId={id} />;
}