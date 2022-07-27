import React from "react";
import { default as portalData } from "../services/portalData.json";

export default class Help extends React.Component{
  render() {
    return (
      <div className="container" id="contactUs">
        <h1 className="mb-4">Getting Help in FABRIC</h1>
        <div className="d-flex flex-row">
          <div className="card mr-5">
            <div className="card-header">
              <h3 className="mb-0"><i className="fa fa-cog"></i></h3>
            </div>
            <div className="card-body">
              <h5 className="card-title">Experiment Issues</h5>
              <p>
                  For technical assistance with your experiments, please search in our <a href={portalData.knowledgeBaseLink} target="_blank" rel="noopener noreferrer">Knowledge Base</a> or
                  the <a href={portalData.knowledgeBaseForumLink} target="_blank" rel="noopener noreferrer">Forums</a>. If you are unable to fix the problem on your
                  own, please post a question in the appropriate section of our <a href={portalData.knowledgeBaseForumLink} target="_blank" rel="noopener noreferrer">Forums</a>.
                  </p>
                  <a href={portalData.knowledgeBaseLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary mr-2">
                    <i className="fa fa-sign-in mr-2"></i>
                    Knowledge Base
                  </a>
                  <a href={portalData.knowledgeBaseForumLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <i className="fa fa-sign-in mr-2"></i>
                    Forums
                  </a>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0"><i className="fa fa-user"></i></h3>
            </div>
            <div className="card-body">
              <h5 className="card-title">Account Issues</h5>
              <p>
                  If you are having problems with enrolling or logging into your FABRIC account 
                  or logging into your experiment's resources via bastion hosts, please use our <a href={portalData.jiraAccountIssueLink} target="_blank" rel="noopener noreferrer">FABRIC Account Help Portal</a> or email us at <b>account-help@fabric-testbed.net</b>.
                  </p>
              <a href={portalData.jiraAccountIssueLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="fa fa-sign-in mr-2"></i>
                FABRIC Account Help Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

