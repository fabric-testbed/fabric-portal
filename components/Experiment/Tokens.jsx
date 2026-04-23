import React from "react";
import { default as portalData } from "../../services/portalData.json";
import { LogIn } from "lucide-react";
import { CREDENTIAL_MANAGER_APP_URL } from "@/lib/api/config";

function Tokens() {
  return (
    <div className="col-9">
      <div>
        <h1 className="mb-4">Manage Token</h1>
        <div className="alert alert-primary mb-2" role="alert">
          Please consult &nbsp;
          <a href={portalData.learnArticles.guideToUseTokens} target="_blank" rel="noreferrer">
            this guide
          </a>&nbsp;
          for obtaining and using FABRIC API tokens.
        </div>
        <a
          href={CREDENTIAL_MANAGER_APP_URL}
          className="btn btn-outline-primary my-2"
          target="_blank"
          rel="noreferrer"
        >
          <LogIn className="me-2" size={16} />
          Open FABRIC Credential Manager
        </a>
      </div>
    </div>
  );
}

export default Tokens;
