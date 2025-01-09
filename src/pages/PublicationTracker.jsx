import React, { Component } from "react";
import BackgroundImage from "../imgs/network-bg.svg";
import Table from "../components/common/Table";
import { getPublications } from "../services/publicationService.js";
import SpinnerWithText from "../components/common/SpinnerWithText";
import _ from "lodash";
import { toast } from "react-toastify";

class PublicationTracker extends Component {
  state = {
    sortColumn: {
      path: "year",
      order: "desc"
    },
    searchQuery: "",
    publications: [],
    showSpinner: false
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
            <span className="me-3">{publication.year}</span>
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

  async componentDidMount() {
    try {
      this.setState({ showSpinner: true });
      const { data } = await getPublications();
      this.setState({ publications: data.results, showSpinner: false});
    } catch (err) {
      toast.error("Failed to load publications. Please reload this page.");
    }
  }

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
      publications: allPublications
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allPublications.map(p => { return {...p, authors: p.authors.join(", ")}});

    if (searchQuery) {
      filtered = allPublications.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
        || p.authors.join().toLowerCase().includes(searchQuery.toLowerCase())
        || (p.project_name && p.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
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
    const { sortColumn, searchQuery, showSpinner } = this.state;
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
        {
          showSpinner && <SpinnerWithText text={"Loading user publications..."} />
        }
        {
          !showSpinner &&
          <div>
            <div className="d-flex flex-row justify-content-end w-100 my-2">
              <span className="font-monospace">Displaying <b>{totalCount}</b> publications.</span>
            </div>
            <Table
              columns={this.columns}
              data={data}
              sortColumn={sortColumn}
              onSort={this.handleSort}
              size={"md"} 
              tStyle={"table-striped table-md"}
              tHeadStyle={"table-primary"}
            />
          </div>
        }
      </div>
    );
  }
}

export default PublicationTracker;
