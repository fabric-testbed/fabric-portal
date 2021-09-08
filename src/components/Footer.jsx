import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import nsfLogo from "../imgs/nsf.png";

class Footer extends React.Component {
  render() {
    return (<div className="app-footer bg-light">
      <div className="row py-4">
        <div className="col-sm-12 col-md-4">
          <ul>
            <li><b>Useful Links</b></li>
            <li>
              <a href="https://fabric-testbed.net/" target="_blank" rel="noopener noreferrer">FABRIC Website</a>
            </li>
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
            <li><a href="https://learn.fabric-testbed.net/forums/forum/fabric-general-questions-and-discussion/" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
          </ul>
        </div>
        <div className="col-sm-12 col-md-4">
          <div>
            <ul>
              <li><b>Social</b></li>
              <li>
                <div className="d-flex flex-row justify-content-between w-75 footer-social-icons">
                  <a href="https://twitter.com/FABRICtestbed" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="https://github.com/fabric-testbed" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a href="http://bit.ly/FABRICYouTube" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                  <a href="mailto:info@fabric-testbed.net">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-3">
          <ul>
            <li><u><b>© FABRIC {new Date().getFullYear()}</b></u></li>
          </ul>
        </div>
        <div className="col-sm-12 col-md-9 d-flex flex-column align-items-center">
          <div className="d-flex align-items-center mb-4">
            <img
              src={nsfLogo}
              width="40"
              height="40"
              className="d-inline-block align-top mr-2"
              alt=""
            />
            <u><i>FABRIC is supported in part by a Mid-Scale RI-1 NSF award under Grant No. 1935966.</i></u>
          </div>
        </div>
      </div>
    </div>)
  }
};

export default Footer;
