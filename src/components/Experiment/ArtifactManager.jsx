import React, { Component } from "react";
import { default as portalData } from "../../services/portalData.json";
import { default as config } from "../../config.json";
import Table from "../common/Table";
import { getArtifacts } from "../../services/artifactService.js";
import SpinnerWithText from "../common/SpinnerWithText";
import _ from "lodash";
import { toast } from "react-toastify";
 
class ArtifactManager extends React.Component {
  state = {
    sortColumn: {
      path: "title",
      order: "desc"
    },
    searchQuery: "",
    artifacts: [],
    showSpinner: false
  }

  columns = [
    {
      content: (artifact) => (
        <div>
           { artifact.title }
        </div>
      ),
      path:"title",
      label: "Title",
    },
    {  
      content: (artifact) => (
        <div>
        { artifact.description_short }
     </div>
      ), 
      path: "description_short ",
      label: "Description" 
    }
  ];

  async componentDidMount() {
    this.setState({ showSpinner: true });
    try {
      const { data: artifacts } = await getArtifacts();
      this.setState({ artifacts, showSpinner: false });
    } catch (error) {
      this.setState({ showSpinner: false });
      toast.error("Error fetching artifacts");
    }
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  }

  handleSearch = (searchQuery) => {
    this.setState({ searchQuery });
  }


  render() {
    return (
      <div className="col-9">
        <div>
          <h1 className="mb-4">Artifact Manager</h1>
          <div className="alert alert-primary mb-4" role="alert">
            Artifact Manager is a platform for sharing and reproducing FABRIC research artifacts. It also provides a REST API for use by various clients.&nbsp;
            An artifact consists of one or more files organized into a single directory in TGZ format (.tgz or .tar.gz).&nbsp;
            Please consult &nbsp;
            <a
              href={portalData.learnArticles.guideToUseArtifactManager}
              target="_blank"
              rel="noreferrer"
            >
              this guide
            </a>&nbsp;
            for FABRIC Artifact Manager.
          </div>
          <a
            href={config.artifactManagerAppUrl}
            className="btn btn-outline-primary my-2"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa fa-sign-in me-2"></i>
            Open Artifact Manager
          </a>
        </div>
        <div>

        </div>
      </div>
    )
  }
}

export default ArtifactManager;