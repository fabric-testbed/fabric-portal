import React, { Component } from "react";
import BackgroundImage from "../../imgs/network-bg.svg";
import Table from "../../components/common/Table";
import publications from "../../services/staticPublications";
import _ from "lodash";

class PublicationTracker extends Component {
  state = {
    sortColumn: {
      path: "year",
      order: "desc"
    },
    searchQuery: ""
  }

  columns = [
    {
      content: (publication) => (
        <div>
           {
              publication.link ?
              <a href={publication.link} target="_blank" rel="noreferrer">{publication.title}</a> :
                publication.title
            }
        </div>
      ),
      path:"title",
      label: "Title",
    },
    {  
      content: (publication) => (
      <div>
         {
            <span className="mr-3">{publication.year}</span>
         }
      </div>
      ), 
      path: "year",
      label: "Year" 
    },
    { path: "authors", label: "Researchers" },
    {
      content: (publication) => (
        <div>
           {
              publication.project_name ?
              <a href={`https://portal.fabric-testbed.net/experiments/public-projects/${publication.project_uuid}`} target="_blank" rel="noreferrer">{publication.project_name}</a> :
              ""
           }
        </div>
      ),
      path:"project_name",
      label: "FABRIC Project",
    }
  ];

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleChange = (query) => {
    this.setState({ searchQuery: query });
  }

  getPageData = () => {
    const {
      sortColumn,
      searchQuery,
    } = this.state;

    const allPublications = publications;
    // filter -> sort -> paginate
    let filtered = allPublications;
    if (searchQuery) {
      filtered = allPublications.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
        || p.authors.toLowerCase().includes(searchQuery.toLowerCase())
        || p.project_name.toLowerCase().includes(searchQuery.toLowerCase())
        || p.year.includes(searchQuery.toLowerCase())
      );
    }

    let sorted = [];

    if (Array.isArray(sortColumn.path)) {
      sorted = _.orderBy(filtered, [sortColumn.path[0]], [sortColumn.order]);
    } else {
      sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    }

    return { totalCount: filtered.length, data: sorted };
  };

  render() {
    const { sortColumn, searchQuery } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="container static-page pb-4">
        <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
        <h1 className="mb-4">FABRIC User Publications</h1>
        <div className="d-flex flex-row w-100 mt-3">
          <input
            type="text"
            name="query"
            className="form-control form-control form-control-sm align-self-end"
            placeholder={""}
            value={searchQuery}
            onChange={(e) => this.handleChange(e.currentTarget.value)}
          />
          <button className="btn btn-sm btn-secondary">
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="d-flex flex-row justify-content-end w-100 my-2">
          <span className="text-monospace">Displaying <b>{totalCount}</b> publications.</span>
        </div>
        <Table
          columns={this.columns}
          data={data}
          sortColumn={sortColumn}
          onSort={this.handleSort}
          size={"md"}
          style={"table-striped table-md"}
          tHeadStyle={"bg-primary-light"}
        />
      </div>
    );
  }
}

export default PublicationTracker;
