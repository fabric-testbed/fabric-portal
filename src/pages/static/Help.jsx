import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";
import { default as portalData } from "../../services/portalData.json";

export default class Help extends React.Component{
  render() {
    return (
      <div className="container" id="contactUs">
        <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
        <h1 className="mb-4">Getting Help in FABRIC</h1>
        <div className="alert alert-primary mt-3" role="alert">
          <p className="mt-2">
            If you are a new user to FABRIC, 
            please make sure that you have checked these <a href={portalData.learnArticles.gettingStarted} target="_blank" rel="noreferrer">
            Getting Started</a> articles first.
          </p>
          <p>
            <ul>
            <li><a href={portalData.learnArticles.thingsToKnowForFirstTime} target="_blank" rel="noreferrer">Things to Know When Using FABRIC for the First Time</a></li>
              <li><a href={portalData.learnArticles.guideToStartExperiment} target="_blank" rel="noreferrer">Quick Start Guide</a></li>
              <li><a href={portalData.learnArticles.guideToSliceBuilder} target="_blank" rel="noreferrer">Slice Builder User Guide</a></li>
              <li><a href={portalData.learnArticles.guideToLoginToFabricVMs} target="_blank" rel="noreferrer">Logging into FABRIC VMs</a></li>
            </ul>
          </p>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="card contact-us-card">
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
          </div>
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header">
                <h3 className="mb-0"><i className="fa fa-user"></i></h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">Account Issues</h5>
                  <p>
                    If you are having problems with enrolling or logging into your FABRIC account 
                    or logging into your experiment's resources via bastion hosts, please use our <a href={portalData.jiraLinks.accountIssue} target="_blank" rel="noopener noreferrer">FABRIC Account Help Portal</a> or email us at <b>account-help@fabric-testbed.net</b>.
                  </p>
                <a href={portalData.jiraLinks.accountIssue} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <i className="fa fa-sign-in mr-2"></i>
                  FABRIC Account Help Portal
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header">
                <h3 className="mb-0"><i className="fa fa-video-camera"></i></h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Office Hours
                  <span className="ml-1 badge badge-pill badge-success">beta</span>
                </h5>
                <p>
                Haven't found an answer to your question on the Forums or Knowledge Base? Set up time with members of the FABRIC Team during their Office Hours.
                </p>
                <a href={portalData.officeHourBookingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary mr-2">
                  <i className="fa fa-sign-in mr-2"></i>
                  Book Office Hours
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header">
                <h3 className="mb-0"><i className="fa fa-graduation-cap"></i></h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Teaching Classes on FABRIC
                </h5>
                <p>
                  To make sure you have a good experience teaching classes on FABRIC we ask that you share your plans with us. Also be sure to sign up to the <a 
                  href={portalData.educatorForumLink} target="_blank" rel="noopener noreferrer">educator forum</a> as a place to ask questions and 
                  share your experiences.
                </p>
                <a href={portalData.jiraLinks.educationProjectRequest} target="_blank" rel="noopener noreferrer" className="btn btn-primary mr-2">
                  <i className="fa fa-sign-in mr-2"></i>
                  Tell us about your class
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

