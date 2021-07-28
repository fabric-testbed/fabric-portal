import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

class Footer extends React.Component {
  render() {
    return (<div className="app-footer bg-light">
      <div className="row py-4">
        <div className="col-sm-12 col-md-4">
          <ul>
            <li><b>Useful Links</b></li>
            <li>
              <Link to="/aup">Acceptable Use Policy</Link>
            </li>
            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="col-sm-12 col-md-4">
          <ul>
            <li><b>Help &amp; Support</b></li>
            <li><a href="https://learn.fabric-testbed.net/" target="_blank" rel="noopener noreferrer">Knowledge Base</a></li>
            <li><a href="https://learn.fabric-testbed.net/faq/" target="_blank" rel="noopener noreferrer">FAQ</a></li>
            <li><a href="https://learn.fabric-testbed.net/submit-a-ticket/" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
          </ul>
        </div>
        <div className="col-sm-12 col-md-4">
          <ul>
            <li><b>Social</b></li>
            <li><div className="d-flex flex-row justify-content-between w-50 footer-social-icons">
              <a href="https://twitter.com/FABRICtestbed" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://github.com/fabric-testbed" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a href="http://bit.ly/FABRICYouTube" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
              <a href="mailto:info@fabric-testbed.net">
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </a>
            </div></li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ul>
            <li><u><b>© FABRIC {new Date().getFullYear()}</b></u></li>
          </ul>
        </div>
      </div>
    </div>)
  }
};

export default Footer;
