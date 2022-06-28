import React from "react";
import { default as portalData } from "../services/portalData.json";
import { Helmet } from 'react-helmet';

export default class Help extends React.Component{

  render() {
    return (
      <div className="container" id="contactUs">
        <h1 className="mb-4">Getting help in FABRIC</h1>
        {/* <Helmet>
          <script data-jsd-embedded data-key="9779ed56-fce9-4f87-93cb-1452b94d7829" data-base-url="https://jsd-widget.atlassian.com" src="https://jsd-widget.atlassian.com/assets/embed.js"></script>
        </Helmet> */}
        <p>
        For technical assistance with your experiments, please search our <a href={portalData.knowledgeBaseLink} target="_blank" rel="noopener noreferrer">Knowledge Base</a> or
        the <a href={portalData.knowledgeBaseForumLink} target="_blank" rel="noopener noreferrer">Forums</a>. If you are unable to fix the problem on your
        own please post a question in the appropriate section of our <a href={portalData.knowledgeBaseForumLink} target="_blank" rel="noopener noreferrer">Forums</a>.
        </p>
        <p>
        If you are having problems with enrolling or logging into your FABRIC account 
        or logging into your experiment's resources via bastion hosts, please use the form on 
        this page or email us at <b>account-help@fabric-testbed.net</b>.
        </p>
      </div>
    );
  }
};

