import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const Footer = () => {
  return <div className="app-footer bg-light">
    <div className="containter w-100">
      <div className="row py-4">
        <div className="col">
          <ul>
            <li><b>Useful Links</b></li>
            <li>Acceptable Use Policy</li>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <br></br>
            <li>© FABRIC {new Date().getFullYear()}</li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <li><b>Help &amp; Support</b></li>
            <li><a href="https://learn.fabric-testbed.net/" target="_blank" rel="noopener noreferrer">Knowledge Base</a></li>
            <li><a href="https://learn.fabric-testbed.net/faq/" target="_blank" rel="noopener noreferrer">Frequently Asked Questions</a></li>
            <li><a href="https://learn.fabric-testbed.net/submit-a-ticket/" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
          </ul>
        </div>
        <div className="col footer-social-icons">
          <div className="d-flex flex-row justify-content-between w-50">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
            <FontAwesomeIcon icon={faGithub} size="lg" />
            <FontAwesomeIcon icon={faYoutube} size="lg" />
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default Footer;
