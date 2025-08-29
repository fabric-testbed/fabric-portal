import React from "react";
import { default as portalData } from "../../services/portalData.json";
import { default as config } from "../../assets/config.json";
import ArtifactListPage from "../Artifacts/ArtifactListPage.jsx";
 
class ArtifactManager extends React.Component {
  render() {
    return (
      <div className="col-9">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-4">Artifact Manager</h1>
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
        </div>
        <div>
        <ArtifactListPage parent={"Experiments"} />
        </div>
      </div>
    )
  }
}

export default ArtifactManager;