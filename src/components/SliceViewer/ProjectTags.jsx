import React, { Component } from 'react';
import SpinnerWithText from "../../components/common/SpinnerWithText";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";

export default class SideLinks extends Component { 
  state = {
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

  render() {
    const { tagKeyValuePairs } = this.state;
    const { project, tags, showSpinner } = this.props;
    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    ); 
    return(
      <div>
        {
        showSpinner ? <SpinnerWithText text={"Loading project permissions..."} /> :
        <table className="table table-sm">
          <tbody>
            <tr>
              <td><b>Project</b></td>
              <td><Link to={`/projects/${project.uuid}`}>{project.name}</Link></td>
            </tr>
            <tr>
              <td>
                <a
                  href={`${portalData.learnArticles.guideToProjectPermissions}#project-permissions`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Permissions</b><i className="fa fa-question-circle ms-1"></i>
                </a>
              </td>
              <td>
              {
                tags.length === 0 ? <span>
                  This project has no <a
                    href={`${portalData.learnArticles.guideToProjectPermissions}#project-permissions`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-question-circle me-2"></i>
                    permission tags 
                  </a>. Please use only SharedNICs and L2Bridge for this slice.
                </span> : 
                tags.map(tag =>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 100, hide: 300 }}
                      overlay={renderTooltip("pl-tooltip", tagKeyValuePairs[tag])}
                      key={`project-tag-${tag}`}
                    >
                      <span className="badge bg-primary me-2 project-tag">{tag}</span>
                    </OverlayTrigger>
                )
              }
              </td>
            </tr>
          </tbody>
        </table>
        }
    </div>
    )
  }
}