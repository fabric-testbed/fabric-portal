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
      {/* <h1 className="mb-4">Measuring and Monitoring Tools</h1>
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
                  <i className="fa fa-sign-in me-2"></i> Open Tool
                </button>
              </a>
            </div>
          </div>
        </div>
        )
      }
       */}
      <h1 className="mb-4">FABRIC Services</h1>
      <p>FABRIC enables a variety of services - hosted and instantiable - to empower users to do research that previously seemed too difficult or impossible. </p>
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>Service Category</th>
            <th>Service Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="4" className="align-middle text-center">Hosted Service</td>
            <td>FABRIC Data Webpage</td>
          </tr>
          <tr>
            <td>Jupyter Hub</td>
          </tr>
          <tr>
            <td>Metrics Data Page</td>
          </tr>
          <tr>
            <td>Ceph</td>
          </tr>
          <tr>
            <td rowspan="1" className="align-middle text-center">Instantiable Service</td>
            <td>FABcache</td>
          </tr>
        </tbody>
      </table>
      <h3 className="mt-4">Hosted Services</h3>
      <div class="card shadow-lg rounded-4 mt-3">
      <div class="card-body p-5">
        <h1 class="card-title mb-4">FABRIC Data Webpage</h1>
        
        <section class="mb-4">
          <h4>Description of Service</h4>
          <p>
            The FABRIC Data Webpage provides researchers and experimenters with access to testbed-generated datasets, analytics tools, and performance insights.
            This service addresses the challenge of centralized and accessible data sharing across diverse scientific communities, allowing for reproducibility and collaborative data analysis.
          </p>
        </section>

        <section class="mb-4">
          <h4>Instructions</h4>
          <p>
            Please follow the step-by-step guide available here: 
            <a href="#" class="link-primary">View Instructions</a>
          </p>
        </section>

        <section class="mb-4">
          <h4>Communities Served</h4>
          <p>
            Computer Networking, Distributed Systems, Machine Learning, Data Science, and Education.
          </p>
        </section>

        <section class="mb-4">
          <h4>Examples</h4>
          <ul class="list-unstyled">
            <li>
              📺 <a href="#" class="link-secondary">Webinar: Leveraging FABRIC Data in Multi-Domain Research</a>
            </li>
            <li>
              📝 <a href="#" class="link-secondary">Blog: Visualizing Large-Scale Experiment Results with FABRIC</a>
            </li>
          </ul>
        </section>

        <section class="border-top pt-3">
          <p class="mb-0">Questions? Contact us at <a href="mailto:poc@example.org" class="link-primary">poc@example.org</a></p>
        </section>
      </div>
    </div>
    <div class="card shadow-lg rounded-4 mt-4">
  <div class="card-body p-5">
    <h1 class="card-title mb-4">Jupyter Hub</h1>
    <section class="mb-4">
      <h4>Description of Service</h4>
      <p>
        Jupyter Hub provides a cloud-hosted environment for interactive computing with support for Python, R, and other languages.
        It enables researchers and students to create, share, and execute code and notebooks in a scalable, collaborative setting.
        This service addresses the challenge of providing consistent compute resources without requiring local setup or complex configuration.
      </p>
    </section>
    <section class="mb-4">
      <h4>Instructions</h4>
      <p>
        To get started with Jupyter Hub, please visit:
        <a href="#" class="link-primary">Access Instructions</a>
      </p>
    </section>
    <section class="mb-4">
      <h4>Communities Served</h4>
      <p>
        Data Science, Education, Machine Learning, Computational Research, and Reproducible Science.
      </p>
    </section>
    <section class="mb-4">
      <h4>Examples</h4>
      <ul class="list-unstyled">
        <li>
          📺 <a href="#" class="link-secondary">Webinar: Collaborative Data Analysis with Jupyter Hub</a>
        </li>
        <li>
          📝 <a href="#" class="link-secondary">Blog: Using Jupyter Hub in an Educational Environment</a>
        </li>
      </ul>
    </section>
    <section class="border-top pt-3">
      <p class="mb-0">Questions? Contact us at <a href="mailto:poc@example.org" class="link-primary">poc@example.org</a></p>
    </section>
  </div>
</div>

<div class="card shadow-lg rounded-4 mt-4">
  <div class="card-body p-5">
    <h1 class="card-title mb-4">Metrics Data Page</h1>

    <section class="mb-4">
      <h4>Description of Service</h4>
      <p>
        The Metrics Data Page aggregates and displays real-time and historical performance data across infrastructure components.
        It provides visual dashboards, time-series analytics, and alerting capabilities to help users and administrators monitor resource usage, detect issues, and ensure system reliability.
        This service addresses the challenge of maintaining operational visibility in distributed environments.
      </p>
    </section>

    <section class="mb-4">
      <h4>Instructions</h4>
      <p>
        Access usage metrics and learn how to interpret performance data here:
        <a href="#" class="link-primary">Metrics Instructions</a>
      </p>
    </section>

    <section class="mb-4">
      <h4>Communities Served</h4>
      <p>
        System Administrators, Network Engineers, DevOps Teams, Performance Analysts, and Infrastructure Researchers.
      </p>
    </section>

    <section class="mb-4">
      <h4>Examples</h4>
      <ul class="list-unstyled">
        <li>
          📺 <a href="#" class="link-secondary">Webinar: Monitoring FABRIC with Metrics Data Page</a>
        </li>
        <li>
          📝 <a href="#" class="link-secondary">Blog: Interpreting System Performance Trends</a>
        </li>
      </ul>
    </section>

    <section class="border-top pt-3">
      <p class="mb-0">Questions? Contact us at <a href="mailto:poc@example.org" class="link-primary">poc@example.org</a></p>
    </section>
  </div>
</div>
<div class="card shadow-lg rounded-4 mt-4">
  <div class="card-body p-5">
    <h1 class="card-title mb-4">Ceph</h1>

    <section class="mb-4">
      <h4>Description of Service</h4>
      <p>
        Ceph is a distributed storage system that provides scalable and fault-tolerant object, block, and file storage capabilities. 
        It enables reliable data access across a wide range of workloads and infrastructure environments. 
        This service addresses the need for high-availability, high-performance storage that can support both experimental and production demands without single points of failure.
      </p>
    </section>

    <section class="mb-4">
      <h4>Instructions</h4>
      <p>
        Learn how to access and manage storage with Ceph:
        <a href="#" class="link-primary">Ceph Instructions</a>
      </p>
    </section>

    <section class="mb-4">
      <h4>Communities Served</h4>
      <p>
        Data Infrastructure, High-Performance Computing, Cloud Platforms, Research Computing, and Storage Engineering.
      </p>
    </section>

    <section class="mb-4">
      <h4>Examples</h4>
      <ul class="list-unstyled">
        <li>
          📺 <a href="#" class="link-secondary">Webinar: Managing Resilient Storage with Ceph</a>
        </li>
        <li>
          📝 <a href="#" class="link-secondary">Blog: Using Ceph to Support Large-Scale Data Projects</a>
        </li>
      </ul>
    </section>

    <section class="border-top pt-3">
      <p class="mb-0">Questions? Contact us at <a href="mailto:poc@example.org" class="link-primary">poc@example.org</a></p>
    </section>
  </div>
</div>

<h3 className="mt-4">Instantiable Services</h3>
      <div class="card shadow-lg rounded-4 mb-5 mt-4">
  <div class="card-body p-5 mt-4">
    <h1 class="card-title mb-4">FABcache</h1>
    <section class="mb-4">
      <h4>Description of FABcache Service</h4>
      <p>
        FABcache is an instantiable caching service that enables researchers to deploy edge or in-network caches to test data delivery strategies. 
        It supports evaluation of performance optimization, bandwidth conservation, and reduced latency in distributed data scenarios.
        This service addresses the challenge of testing dynamic content distribution in customizable topologies.
      </p>
    </section>

    <section class="mb-4">
      <h4>Instructions</h4>
      <p>
        To instantiate FABcache and configure it for your experiment, follow the guide here:
        <a href="#" class="link-primary">FABcache Instructions</a>
      </p>
    </section>

    <section class="mb-4">
      <h4>Communities Served</h4>
      <p>
        Edge Computing, Content Delivery, Network Research, Data Engineering, and Educational Labs.
      </p>
    </section>

    <section class="mb-4">
      <h4>Examples</h4>
      <ul class="list-unstyled">
        <li>
          📺 <a href="#" class="link-secondary">Webinar: Deploying Instantiable Services with FABcache</a>
        </li>
        <li>
          📝 <a href="#" class="link-secondary">Blog: Reducing Latency with In-Network Caching on FABRIC</a>
        </li>
      </ul>
    </section>

    <section class="border-top pt-3">
      <p class="mb-0">Questions? Contact us at <a href="mailto:poc@example.org" class="link-primary">poc@example.org</a></p>
    </section>
  </div>
</div>
<div class="text-center mt-5 mb-4">
  <p class="fs-5">
    Have a service that you would like featured on this page? <a href="mailto:info@fabric-testbed.net" class="link-primary">Contact info@fabric-testbed.net</a>.
  </p>
</div>

    </div>
  )
}

export default MeasurementMetrics;
