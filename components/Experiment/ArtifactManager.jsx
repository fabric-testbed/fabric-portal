import React from "react";
import { default as portalData } from "../../services/portalData.json";
import ArtifactListPage from "../Artifacts/ArtifactListPage.jsx";
import { LogIn } from "lucide-react";
import { ARTIFACT_MANAGER_APP_URL } from "@/lib/api/config";

function ArtifactManager() {
  return (
    <div className="col-9">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-4">Artifact Manager</h1>
          <a
            href={ARTIFACT_MANAGER_APP_URL}
            className="btn btn-outline-primary my-2"
            target="_blank"
            rel="noreferrer"
          >
            <LogIn className="me-2" size={16} />
            Open Artifact Manager
          </a>
        </div>
        <div className="alert alert-primary mb-4" role="alert">
          Artifact Manager is a platform for sharing and reproducing FABRIC research artifacts. It also provides a REST API for use by various clients.&nbsp;
          An artifact consists of one or more files organized into a single directory in TGZ format (.tgz or .tar.gz).&nbsp;
          Please consult &nbsp;
          <a href={portalData.learnArticles.guideToUseArtifactManager} target="_blank" rel="noreferrer">
            this guide
          </a>&nbsp;
          for FABRIC Artifact Manager.
        </div>
      </div>
      <div>
        <ArtifactListPage parent={"Experiments"} />
      </div>
    </div>
  );
}

export default ArtifactManager;
