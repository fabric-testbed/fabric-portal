"use client"; 
import React from "react";
import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
// import { faGithub } from '@fortawesome/free-brands-svg-icons';
// import { faYoutube } from '@fortawesome/free-brands-svg-icons';
// import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { default as portalData } from "../services/portalData.json";

class Footer extends React.Component {
  render() {
    return (
      <Container className="app-footer bg-light">
        <Row>
          <Col>
            <ul>
              <li><b>Useful Links</b></li>
              <li>
                <Link href="/useful-links/aup">Acceptable Use Policy</Link>
              </li>
              <li><Link href="/useful-links/cookie-policy">Cookie Policy</Link></li>
              <li><Link href="/useful-links/branding">Branding Resources</Link></li>
            </ul>
          </Col>
          <Col>
            <ul>
              <li><b>Help &amp; Support</b></li>
              <li><a href={portalData.knowledgeBaseLink} target="_blank" rel="noopener noreferrer">Knowledge Base</a></li>
              <li><a href={portalData.learnArticles.faq} target="_blank" rel="noopener noreferrer">FAQ</a></li>
              <li>
                <Link href="/help">Contact Us</Link>
              </li>
              <li>
                <a href={portalData.learnArticles.portalReleaseNotes} target="_blank" rel="noopener noreferrer">
                  <i>{`Portal Version: v${portalData.version}`}</i>
                </a>
              </li>
          </ul>
          </Col>
          <Col>
            <div>
              <ul>
                <li><b>Social</b></li>
                <li>
                  <div className="d-flex flex-row justify-content-between w-75 footer-social-icons">
                    {/* <a href={portalData.fabricSocialLinks.twitter} target="_blank" rel="noopener noreferrer">
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
                    </a> */}
                  </div>
                </li>
              </ul>
            </div>
          </Col>
          <Col>
            <img
              src="/imgs/trustedci.png"
              width="175"
              height="175"
              className="d-inline-block align-top me-2"
              alt=""
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <ul>
              <li><u><b>© FABRIC {new Date().getFullYear()}</b></u></li>
            </ul>
          </Col>
          <Col className="d-flex flex-column align-items-center">
            <div className="d-flex align-items-center my-4">
              <img
                src="/imgs/nsf.png"
                width="45"
                height="45"
                className="d-inline-block align-top me-2"
                alt=""
              />
              <u className="text-sm-size">FABRIC is funded by NSF grants CNS-1935966, CNS-2029176, CNS-2029200, CNS-2029235, CNS-2029260, CNS-2029261 and CNS-2330891.</u>
            </div>
          </Col>
        </Row>
      </Container>
      )
  }
};

export default Footer;
