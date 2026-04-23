import React, { useState, useEffect } from "react";
import SiteDetailTable  from "./SiteDetailTable.jsx";
import Spinner from 'react-bootstrap/Spinner';
import { sitesNameMapping }  from "../../assets/data/sites";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import { default as portalData } from "../../services/portalData.json";
import Link from "next/link";
import { getResources } from "../../services/resourceService.js";
import { toast } from "react-toastify";
import sitesParser from "../../services/parser/sitesParser";
import siteParserLevel2 from "../../services/parser/siteLevel2Parser";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import CalendarDateTime from "../common/CalendarDateTime.jsx";
import moment from 'moment';
import Accordion from 'react-bootstrap/Accordion';
import { LogIn, AlertTriangle, Check } from "lucide-react";

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
};

const componentTypes = ["GPU", "NVME", "SmartNIC", "SharedNIC", "FPGA", "Switch"];

export default function SiteDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { userStatus } = useAuth();

  const [data, setData] = useState({
    status: {
      "state": "Active",
      "deadline": null,
      "expected_end": null
    }
  });
  const [hosts, setHosts] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setShowSpinner(true);
      setSpinnerMessage("Loading resources...");
      try {
        const { data: res1 } = await getResources(1);
        const { data: res2 } = await getResources(2);
        const parsedObj1 = sitesParser(res1.data[0], sitesNameMapping.acronymToShortName);
        const siteName = pathname.split("s/")[1];
        const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
        setHosts(parsedObj2.hosts.filter(host => host.Site === siteName));
        setData(parsedObj1.parsedSites.filter(s => s.name === siteName)[0]);
        setShowSpinner(false);
        setSpinnerMessage("");
      } catch (err) {
        setShowSpinner(false);
        setSpinnerMessage("");
        toast.error("Failed to load resource information. Please reload this page.");
      }
    };
    loadData();
  }, []);

  const handleStartChange = (value) => {
    const inputTime = moment(value).format();
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    setStartTime(outputTime);
  }

  const handleEndChange = (value) => {
    const inputTime = moment(value).format();
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");

    setEndTime(outputTime);
  }

  const handleRefreshTime = async () => {
    setShowSpinner(true);
    setSpinnerMessage("Loading resources...");
    try {
      const { data: res1 } = await getResources(1, startTime, endTime);
      const { data: res2 } = await getResources(2, startTime, endTime);
      const parsedObj1 = sitesParser(res1.data[0], sitesNameMapping.acronymToShortName);
      const siteName = pathname.split("s/")[1];
      const parsedObj2 = siteParserLevel2(res2.data[0], siteName, sitesNameMapping.acronymToShortName);
      setHosts(parsedObj2.hosts.filter(host => host.Site === siteName));
      setData(parsedObj1.parsedSites.filter(s => s.name === siteName)[0]);
      setShowSpinner(false);
      setSpinnerMessage("");
      toast.success("Resources have been loaded successfully.");
    } catch (err) {
      setShowSpinner(false);
      setSpinnerMessage("");
      toast.error("The resources cannot be loaded at the moment. Please try again later.");
    }
  }

  const handleResetTime = async () => {
    window.location.reload();
  }

  const checkWorkerStatus = (workerName) => {
    for (const worker of data.workers) {
      if (workerName === Object.keys(worker)[0]) {
        return { state: Object.values(worker)[0].state };
      }
    }
    return { state: "Active" };
  }

  const generateAccordionHeaderStyle = (workerName) => {
    const status = checkWorkerStatus(workerName);
    if (status.state === "Maint") return "text-danger";
    if (["PreMaint", "PartMaint"].includes(status.state)) return "text-warning";
    return "text-dark";
  }

  return (
    data.status && <div className="container">
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
         data.location && userStatus === "active" &&
         <tr>
           <th>Rack Location</th>
           <td>{ JSON.parse(data.location).postal }</td>
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
      userStatus !== "active" &&
      <div
        className="alert alert-primary mb-2 d-flex flex-row justify-content-between align-items-center"
        role="alert"
      >
        Please log in to access resources filtering by time frame.
      </div>
     }
     {
      userStatus === "active" &&
      <div className="d-flex flex-row justify-content-center align-items-center">
        <span className="me-2">From</span>
        <CalendarDateTime
          id="siteDetailCalendar1"
          name="siteDetailCalendar"
          offset={0}
          time={startTime && startTime.toString().replace(/-/g, "/")}
          onTimeChange={handleStartChange}
        />
        <span className="ms-4 me-2">To</span>
        <CalendarDateTime
          id="siteDetailCalendar2"
          name="siteDetailCalendar"
          offset={-1}
          time={endTime && endTime.toString().replace(/-/g, "/")}
          onTimeChange={handleEndChange}
        />
        <button
          className="btn btn-sm btn-success ms-4"
          onClick={handleRefreshTime}
        >
          Refresh
        </button>
        <button
          className="btn btn-sm btn-primary ms-3"
          onClick={handleResetTime}
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
            <div className="d-flex flex-row align-items-center mt-4">
              <h5>
                Host Resources
              </h5>
              <span className="badge bg-primary ms-3 mb-2">{hosts && `${hosts.length} hosts`}</span>
            </div>
            <Accordion defaultActiveKey="0">
            {
              hosts && hosts.map((host, index) =>
                <Accordion.Item
                  key={`site-detial-host-${index}`}
                  eventKey={index}
                  className="AccordionItem"
                  value={`host-${index}`}
                >
                  <Accordion.Header><span className={generateAccordionHeaderStyle(host.Name)}>{host.Name}</span></Accordion.Header>
                  <Accordion.Body>
                    <SiteDetailTable data={host} status={checkWorkerStatus(host.Name)} />
                  </Accordion.Body>
                </Accordion.Item>
              )
            }
          </Accordion>
        </div>
      }
   </div>
  </div>
  )
}
