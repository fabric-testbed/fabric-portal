import React, { Component } from "react";
import CopyButton from "../common/CopyButton";
import Table from "../common/Table";
import toLocaleTime from "../../utils/toLocaleTime";
import _ from "lodash";
import { Link } from "react-router-dom";
import Parser from 'html-react-parser';

class ProjectProfile extends Component {
  state = {
    basicInfoRows: [
      { label: "Description", path: "description" },
      { label: "Facility", path: "facility" },
      { label: "Modified Time", path: "modified" },
      { label: "Created At", path: "created" },
      { label: "Creator Name", path: "creator_name" },
      { label: "Creator Email", path: "creator_email" },
      { label: "Creator ID", path: "creator_id" }
    ],
    projectPersonnelColumns: [
      {
        path: "name",
        label: "Name",
        content: (user) => (
          <Link to={`/users/${user.uuid}`}>{user.name}</Link>
        )
      },
      { path: "email", label: "Email" },
      { path: "uuid", label: "ID" },
    ]
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

  render() {
    const { basicInfoRows, projectPersonnelColumns } = this.state;
    const { project } = this.props;
    return (
      <div>
        <div className="d-flex flex-row justify-content-between">
          <h1>{project.name}</h1>
          <Link to="/experiments#projects">
            <button
              className="btn btn-sm btn-outline-primary my-3"
            >
              <i className="fa fa-sign-in me-2"></i>
              Back to Project List
            </button>
          </Link>
        </div>
        <table className="table table-sm table-striped table-bordered mt-4">
          <tbody>
            <tr>
              <td>Project ID</td>
              <td>
                <span className="me-2">{ project.uuid }</span>
                <CopyButton
                  id={project.uuid}
                  text=""
                  btnStyle={"btn btn-sm btn-primary"}
                  showCopiedValue={true}
                />
              </td>
            </tr>
            {
              basicInfoRows.map((row, index) => {
                  return (
                    project[row.path] &&
                    <tr key={`project-basic-info-${index}`}>
                      <td>
                        {row.label}
                      </td>
                      <td className="project-detail-form-td">
                        {
                          ["Modified Time", "Created At"].includes(row.label) ? 
                            toLocaleTime(_.get(project, row.path)) :
                            Parser(_.get(project, row.path))
                        }
                      </td>
                    </tr>
                  );
                })
              }
          </tbody>
        </table>
        <div className="mt-4">
          <h2>Project Owners</h2>
          {
            !project.project_owners &&  <div className="alert alert-primary mb-2" role="alert">
              The <b>Project Owners</b> information is set as private.
            </div>
          }
          {
            project.project_owners && project.project_owners.length === 0 && <div className="alert alert-primary mb-2" role="alert">
              This project doesn't have Project Owner.
            </div>
          }
          {
             project.project_owners && project.project_owners.length > 0 && 
             <Table
                columns={projectPersonnelColumns}
                data={project.project_owners}
                tStyle={"table-sm"}
              />
          }
        </div>
        <div className="mt-4">
          <h2>Project Members</h2>
          {
            !project.project_members &&  <div className="alert alert-primary mb-2" role="alert">
              The <b>Project Members</b> information is set as private.
            </div>
          }
          {
            project.project_members && project.project_members.length === 0 && <div className="alert alert-primary mb-2" role="alert">
              This project doesn't have Project Member.
            </div>
          }
          {
             project.project_members && project.project_members.length > 0 && 
             <Table
                columns={projectPersonnelColumns}
                data={project.project_members}
                tStyle={"table-sm"}
              />
          }
        </div>
        <div className="mt-4">
          <h2 className="pb-2 border-bottom">Funding Information</h2>
            <p className="mb-4">
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
            </div>
            <h2 className="pb-2 border-bottom">Community</h2>
            <p>
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
      </div>
    );
  }
}

export default ProjectProfile;