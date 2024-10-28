import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";
import InfrastructureMetrics from '../../imgs/toolLinks/InfrastructureMetrics.png';
import PublicMetrics from '../../imgs/toolLinks/PublicMetrics.png';
import OpticalData from '../../imgs/toolLinks/OpticalData.png';
import LatencyMonitor from '../../imgs/toolLinks/LatencyMonitor.png';
import Parser from 'html-react-parser';

const MeasurementMetrics = ()=> {
  const toolsData = [
    {
      "title": "Public Metrics",
      "image": PublicMetrics,
      "content": "This site contains basic metrics concerning FABRIC network. These metrics are available to anyone. Anyone is allowed anonymous access to Grafana.",
      "link": "https://public-metrics.fabric-testbed.net/"
    },
    {
      "title": "Infrastructure Metrics",
      "image": InfrastructureMetrics,
      "content": "This site contains enhanced metrics concerning FABRIC site usage and availability. These metrics are available to any FABRIC user. Logon is available as an anonymous Grafana user to anyone with a FABRIC account.",
      "link": "https://infrastructure-metrics.fabric-testbed.net/"
    },
    {
      "title": "Optical Data",
      "image": OpticalData,
      "content": "This is a space where ESnet shares public Grafana dashboards of targeted data sets. It complements the data found at the <a href='https://my.es.net/'target='_blank' rel='noreferrer'>my.es.net portal</a>. The data comes primarily from ESnet's Stardust system and provides a flexible way to show interesting views of the data.",
      "link": "https://public.stardust.es.net/dashboards/f/fdhq1z6q5smwwb/?orgId=2"
    },
    {
      "title": "FABRIC Latency Monitor",
      "image": LatencyMonitor,
      "content": "Use FABRIC’s OWL (One Way Latency) Service to view graphs of the current (and past) one way latency measurements between pairs of FABRIC racks.   OWL’s highly precise latency measurements are calculated using FABRIC’s GPS-based timestamp capabilities.",
      "link": "https://public-metrics.fabric-testbed.net/latency/"

    }
  ]
  return (
    <div className="container static-page pb-5">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">Measuring and Monitoring Tools</h1>
      {
        toolsData.map((tool, index) =>
        <div className="tool-link-block mb-5" key={`tool-link-${index}`}>
          <h3 className="text-primary">
            {tool.title}
          </h3>
          <div className="row mt-3" key={`tool-link-${index}`}>
            <div className="col-12 col-md-6">
              <img src={tool.image} alt={`tool-link-${tool.title}`}/>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column">
              <p>{Parser(tool.content)}</p>
              <a href={tool.link} target="_blank" rel="noreferrer">
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  <i className="fa fa-sign-in mr-2"></i> Open Tool
                </button>
              </a>
            </div>
          </div>
        </div>
        )
      }
    </div>
  )
}

export default MeasurementMetrics;
