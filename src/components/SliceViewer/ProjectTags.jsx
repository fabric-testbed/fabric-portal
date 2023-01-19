import React, { Component } from 'react';
import SpinnerWithText from "../../components/common/SpinnerWithText";
import { getProjectById } from "../../services/projectService.js";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";

export default class SideLinks extends Component { 
  state = {
    showSpinner: false,
    project: {},
    tags: [],
    tagKeyValuePairs: {
      "VM.NoLimitCPU": "allows to create VMs with more than 2 CPU cores",
      "VM.NoLimitRAM": "allows to create VMs with more than 10 GB of RAM",
      "VM.NoLimitDisk": "allows to create VMs with more than 10 GB of disk",
      "VM.NoLimit": "VM.NoLimitCPU | VM.NoLimitRAM | VM.NoLimitDisk",
      "Component.GPU": "allows to provision and attach GPU components",
      "Component.FPGA": "allows to provision and attach FPGA components",
      "Component.SmartNIC": "allows to provision and attach 25G and 100G dedicated SmartNIC components",
      "Component.Storage": "allows to create and attach rotating storage",
      "Component.NVME": "allows to provision and attach NVME components",
      "Net.NoLimitBW": "allows to provision links over 10 Gbps",
      "Net.Peering": "allows to create slices with public peering",
      "Net.PortMirroring": "allows to create slices that include port mirroring",
      "Net.AllFacilityPorts": "allows to create slices with any stitchport",
      "Slice.Multisite": "allows to create slices spanning multiple sites",
      "Slice.Measurements": "allows to provision measurement VMs",
      "Slice.NoLimitLifetime": "allows to create slices with a lifetime beyond default limit X time units without the need to renew",
      "Net.FacilityPort.RENCI-GSU": "RENCI Development",
      "Net.FacilityPort.RENCI-Chameleon": "RENCI Development",
      "Net.FacilityPort.Chameleon-StarLight": "Chameleon-StarLight Production",
      "Net.FacilityPort.ESnet-StarLight": "ESnet-StarLight Production",
      "Net.FacilityPort.Internet2-StarLight": "Internet2-StarLight Production"
    }
  }
  
  async componentDidMount() {
    try {
      this.setState({ showSpinner: true });
      const { data: res } = await getProjectById(this.props.projectId);
      this.setState({ project: res.results[0], tags: res.results[0].tags, showSpinner: false });
    } catch (err) {
      toast.error("Failed to load the project information. Please try again later.");
    }
  }

  render() {
    const { project, tags, tagKeyValuePairs, showSpinner } = this.state;
    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    ); 
    return(
      <div className="form-group">
      <label htmlFor="projectSelect" className="slice-form-label">
        Project: <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
        <a
          href={`${portalData.learnArticles.guideToProjectPermissions}#project-permissions`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa fa-question-circle mx-2"></i>
          Project Permissions
        </a>
      </label>
      {
        !showSpinner && <div>
          {

          }
          {
            tags.length === 0 && <div className="sm-alert mt-2">
              This project has no permission tags. Please use only SharedNICs and L2Bridge for this slice.
            </div>
          }
          {
            tags.length > 0 && <div className="mt-2">
              { 
                project.tags.map(tag =>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 100, hide: 300 }}
                    overlay={renderTooltip("pl-tooltip", tagKeyValuePairs[tag])}
                    key={`project-tag-${tag}`}
                  >
                    <span className="badge badge-primary mr-2 project-tag">{tag}</span>
                  </OverlayTrigger>
              )}
            </div>
          }
        </div>
      }
      {
        showSpinner && <SpinnerWithText text={"Loading project permissions..."} />
      }
    </div>
    )
  }
}