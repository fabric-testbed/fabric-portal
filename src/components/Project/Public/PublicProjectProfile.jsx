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

  render() {
    const { project } = this.state;
    return (
      <div className="public-project-profile">
        <div className="public-project-profile-upper">
          <h1><i className="fa fa-hand-o-right mr-2" aria-hidden="true"></i> {project.name}</h1>
        </div>
        <div className="card">
          <h5 className="card-header">Project Details</h5>
          <div className="card-body">
            <h5 className="card-title pb-2 border-bottom text-primary">Description</h5>
            <p className="card-text mb-4"> {Parser(project.description)} </p>
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
                          {
                            `${funding.agency} | ${funding.directorate} | ${funding.award_number} | ${funding.award_amount}`
                          }
                        </li>
                    })
                  }
                </ul>
              }
              {
                project.project_funding && project.project_funding.length === 0 && <span className="font-italic">
                  This project has no funding added yet.
                </span>
              }
            </p>
            <h5 className="card-title pb-2 border-bottom text-primary">Community</h5>
            <p className="card-text mb-4">
              {
                project.communities && project.communities.length > 0 && project.communities.map((community, index) => {
                  return <Link to={`/experiments/public-projects?community=${community}`}>
                    <span
                      className="badge badge-pill badge-primary mr-1"
                      key={`project-community-${index}`}
                    >
                      {community}
                    </span>
                </Link>
                })
              }
              {
                project.communities && project.communities.length === 0 && <span className="font-italic">
                  This project has no community tag added yet.
                </span>
              }
            </p>
          </div>
        </div>
        <Link to="/experiments/public-projects">
          <button className="btn btn-sm btn-outline-primary my-4">
            <i className="fa fa-sign-in mr-2"></i> Back to Project List
          </button>
        </Link>
      </div>
    );
  }
}

export default withRouter(PublicProjectProfile);