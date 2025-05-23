import React, { Component } from "react";
import { getProjectById } from "../../../services/projectService";
import { toast } from "react-toastify";
import withRouter from "../../common/withRouter.jsx";
import { Link } from "react-router-dom";
import Parser from 'html-react-parser';

class PublicProjectProfile extends Component {
  state = {
    project: {}
  }

  async componentDidMount() {
    try {
      const projectId = this.props.match.params.id;
      const { data } = await getProjectById(projectId);
      const project = data.results[0];
      this.setState({ project });
      
    } catch (err) {
      toast.error("Failed to load project.");
      if (err.response && err.response.status === 404) {
        this.props.navigate("/not-found");
      }
    }
  }

  parseFundingStr = (funding) => {
    if (funding.agency === "Other") {
      return `${funding.agency_other} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else if (funding.agency === "NSF") {
      return `${funding.agency} ${funding.directorate ? `| ${funding.directorate}` : ""} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else {
      return `${funding.agency} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    }
  }

  capitalizeFirstLetter = (str) => {
    if (!str) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    const { project } = this.state;
    return (
      <div className="public-project-profile">
        <div className="public-project-profile-upper">
          <h1>{project.name}</h1>
        </div>
        <div className="card">
          <h5 className="card-header">Project Details</h5>
          <div className="card-body">
            <h5 className="card-title pb-2 border-bottom text-primary">Description</h5>
            <p className="card-text mb-4"> {project.description ? Parser(project.description) : ""} </p>
            <h5 className="card-title pb-2 border-bottom text-primary">Funding Information</h5>
            <p className="card-text mb-4">
              {
                project.project_funding && project.project_funding.length > 0 && 
                <ul>
                  {
                    project.project_funding.map((funding, index) => {
                      return <li
                          className="my-2"
                          key={`project-funding-${index}`}
                        >
                          { this.parseFundingStr(funding) }
                        </li>
                    })
                  }
                </ul>
              }
              {
                project.project_funding && project.project_funding.length === 0 && <span className="fst-italic">
                  This project has no funding added yet.
                </span>
              }
            </p>
            <h5 className="card-title pb-2 border-bottom text-primary">Community</h5>
            <p className="card-text mb-4">
              {
                project.communities && project.communities.length > 0 && project.communities.map((community, index) => {
                  return (<span
                      className="badge bg-primary me-1"
                      key={`project-community-${index}`}
                    >
                      {community}
                    </span>)
                })
              }
              {
                project.communities && project.communities.length === 0 && <span className="fst-italic">
                  This project has no community tag added yet.
                </span>
              }
            </p>
            <h5 className="card-title pb-2 border-bottom text-primary">Project Type</h5>
            <p className="card-text mb-4">
              { this.capitalizeFirstLetter(project.project_type) }
            </p>
          </div>
        </div>
        <Link to="/experiments/public-projects">
          <button className="btn btn-sm btn-outline-primary my-4">
            <i className="fa fa-sign-in me-2"></i> Back to Project List
          </button>
        </Link>
      </div>
    );
  }
}

export default withRouter(PublicProjectProfile);