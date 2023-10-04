import React, { Component } from "react";
import ProjectUserTable from "./ProjectUserTable";
import _ from "lodash";
import paginate from "../../utils/paginate";
import { default as portalData } from "../../services/portalData.json";

class ProjectTokenHolders extends Component {
  state = {
    pageSize: 10,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
    } = this.state;

    const { token_holders } = this.props;

    // filter -> sort -> paginate
    let filtered = token_holders;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const data = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: data };
  };

  render() {
    const { token_holders, urlSuffix, isTokenHolder, 
      isFO, personnelType, project_members } = this.props;

    return (
      <div>
        <h4>Token Holders with Long-lived Token Access</h4>
        {
          isFO &&
          <div className="card mt-3">
            <div className="card-header" id="headingTwo">
              <h6 className="mb-0">
                Add Token Holders
              </h6>
            </div>
            <div className="card-body">
              <ProjectUserTable
                users={project_members.filter(user => !token_holders.find(holder => holder.uuid === user.uuid))}
                personnelType={personnelType}
                canUpdate={isFO}
                onUpdateUsers={this.props.onUpdateTokenHolders}
                inputText={"Filter Project Members..."}
                operation="add"
              />
            </div>
          </div>
        }
          <div className="card mt-3">
            <div className="card-header" id="headingTwo">
              <h6 className="mb-0">
                {isFO ? `Manage Token Holders` : `View Token Holders`}
              </h6>
            </div>
            <div className="card-body">
            {
              token_holders && token_holders.length > 0 ?
              <ProjectUserTable
                users={token_holders}
                personnelType={personnelType}
                canUpdate={isFO}
                onUpdateUsers={this.props.onUpdateTokenHolders}
                inputText={`Filter ${personnelType}...`}
                operation="remove"
              /> :
              <div className="alert alert-primary" role="alert">
                {`This project has no ${personnelType}.`}
              </div>
            }
            </div>
          </div>

        {
          token_holders.length === 0 && !isFO && 
          <div className="alert alert-primary" role="alert">
            {`This project has no ${personnelType}.`}
          </div>
        }
        {
          !isTokenHolder && !isFO && <button
            className="btn btn-sm btn-outline-success mr-2 my-3"
            onClick={() => window.open(
              `${portalData.jiraLinks.longlivedTokenRequest}?${urlSuffix}`,
              "_blank")
            }
          >
            <i className="fa fa-sign-in mr-2"></i>
            Request Long-lived Token Access
          </button>
        }
      </div>
    );
  }
}

export default ProjectTokenHolders;