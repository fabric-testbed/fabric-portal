import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { default as portalData } from "../services/portalData.json";
import nsfLogo from "../imgs/nsf.png";
import trustedciBadge from "../imgs/trustedci.png";

class Footer extends React.Component {
  render() {
    return (<div className="app-footer bg-light">
      <div className="row py-4">
        <div className="col-sm-12 col-md-3">
          <ul>
            <li><b>Useful Links</b></li>
            <li>
              <Link to="/aup">Acceptable Use Policy</Link>
            </li>
            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            {/* <li><Link to="/privacy-policy">Privacy Policy</Link></li> */}
            <li><Link to="/branding">Branding Resources</Link></li>
          </ul>
        </div>
        <div className="col-sm-12 col-md-3">
          <ul>
            <li><b>Help &amp; Support</b></li>
            <li><a href={portalData.knowledgeBaseLink} target="_blank" rel="noopener noreferrer">Knowledge Base</a></li>
            <li><a href={portalData.learnArticles.faq} target="_blank" rel="noopener noreferrer">FAQ</a></li>
            <li>
              <Link to="/help">Contact Us</Link>
            </li>
            <li>
              <a href={portalData.learnArticles.portalReleaseNotes} target="_blank" rel="noopener noreferrer">
                <i>{`Portal Version: v${portalData.version}`}</i>
              </a>
            </li>
          </ul>
        </div>
        <div className="col-sm-12 col-md-4">
          <div>
            <ul>
              <li><b>Social</b></li>
              <li>
                <div className="d-flex flex-row justify-content-between w-75 footer-social-icons">
                  <a href={portalData.fabricSocialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href={portalData.fabricSocialLinks.github} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a href={portalData.fabricSocialLinks.youtube} target="_blank" rel="noopener noreferrer">
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
        <div className="col-sm-12 col-md-2">
          <img
            src={trustedciBadge}
            width="175"
            height="175"
            className="d-inline-block align-top mr-2"
            alt=""
          />
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
            <u><i>FABRIC is funded by NSF grants CNS-1935966, CNS-2029261, CNS-2029235, CNS-2029200, and CNS-2029260.</i></u>
          </div>
        </div>
      </div>
    </div>)
  }
};

export default Footer;
