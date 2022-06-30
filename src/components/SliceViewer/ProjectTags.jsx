import React, { Component } from 'react';
import SpinnerWithText from "../../components/common/SpinnerWithText";
import { getCurrentUser } from "../../services/prPeopleService.js";
import { getProject } from "../../services/projectRegistryService.js";
import { toast } from "react-toastify";

export default class SideLinks extends Component { 
  state = {
    showSpinner: false,
    user: {},
    projectIdToGenerateToken: "",
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
      "Slice.NoLimitLifetime": "allows to create slices with a lifetime beyond default limit X time units without the need to renew"
    }
  }
  
  async componentDidMount() {
    try {
      const { data } = await getCurrentUser();
      const user = data.results[0];
      this.setState({ user: user });
    } catch (ex) {
      console.log("Failed to load user information: " + ex.response.data);
      window.location.href = "/logout";
      toast.error("User's credential is expired. Please re-login.");
    }
  }

  handleProjectChange = (e) => {
    this.setState({ projectIdToGenerateToken: e.target.value }, () => {
      this.props.onProjectChange(this.state.projectIdToGenerateToken);
      this.getProjectTags();
    });
  }

  async getProjectTags() {
    this.setState({  showSpinner: true });
    try {
      const { data: project } = await getProject(this.state.projectIdToGenerateToken);
      this.setState({ tags: project.tags, showSpinner: false});
    } catch (ex) {
      toast.error("Failed to load the tags of this project. Please re-select a project.");
    }
  }

  render() {
    const { user, projectIdToGenerateToken, tags, tagKeyValuePairs, showSpinner } = this.state;

    return(
      <div className="form-group col-md-12">
      <label htmlFor="projectSelect" className="slice-form-label">Project</label>
      <select
        id="selectSliceProject"
        name="selectSliceProject"
        className="form-control form-control-sm"
        value={projectIdToGenerateToken}
        onChange={this.handleProjectChange}
      >
        <option value="">Choose...</option>
        {
          user.projects && user.projects.map(project => 
            <option value={project.uuid} key={`project-${project.name}`}>{project.name}</option>
          )
        }
      </select>
      {
        projectIdToGenerateToken === "" && 
        <div className="sm-alert mt-2">
          Please select a project that you want to create slice for.
        </div>
      }
      {
        projectIdToGenerateToken !== "" && ! showSpinner && <div>
          <label htmlFor="projectSelect" className="slice-form-label mt-2">
            Project Tags 
            <a
              href="https://learn.fabric-testbed.net/knowledge-base/fabric-user-roles-and-project-permissions/#project-permissions"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa fa-question-circle mx-2"></i>
              Project Permissions
            </a>
          </label>
          {
            tags.length === 0 && <div className="sm-alert mt-2">
              This project has no permission tags. Please use only SharedNICs and L2Bridge for this slice.
            </div>
          }
          {
            tags.length > 0 && <div>
              { 
                tags.map(tag =>
                <div key={`project-tag-${tag}`}>
                  <span className="badge badge-primary mr-2">{tag}</span>
                  <span className="text-md-size">{ tagKeyValuePairs[tag] }</span>
                </div>
              )}
            </div>
          }
        </div>
      }
      {
        showSpinner && <SpinnerWithText text={"Loading project tags..."} />
      }
    </div>
    )
  }
}