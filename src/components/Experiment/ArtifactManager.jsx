import React from "react";
import { default as portalData } from "../../services/portalData.json";
import { default as config } from "../../config.json";

class ArtifactManager extends React.Component {
  render() {
    return (
      <div className="col-9">
        <div>
          <h1 className="mb-4">Artifact Manager</h1>
          <div className="alert alert-primary mb-2" role="alert">
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
            href={config.artifactManagerManagerAppUrl}
            className="btn btn-outline-primary my-2"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa fa-sign-in mr-2"></i>
            Open Artifact Manager
          </a>
        </div>
      </div>
    )
  }
}

export default ArtifactManager;