import React from "react";
import { default as portalData } from "../../services/portalData.json";
import { default as config } from "../../assets/config.json";

class Tokens extends React.Component {
  render() {
    return (
      <div className="col-9">
        <div>
          <h1 className="mb-4">Manage Token</h1>
          <div className="alert alert-primary mb-2" role="alert">
            Please consult &nbsp;
            <a
              href={portalData.learnArticles.guideToUseTokens}
              target="_blank"
              rel="noreferrer"
            >
              this guide
            </a>&nbsp;
            for obtaining and using FABRIC API tokens.
          </div>
          <a
            href={config.credentialManagerAppUrl}
            className="btn btn-outline-primary my-2"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa fa-sign-in me-2"></i>
            Open FABRIC Credential Manager
          </a>
        </div>
      </div>
    )
  }
}

export default Tokens;