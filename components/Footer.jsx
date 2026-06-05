"use client";
import React from "react";
import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, Github, Youtube, Mail } from "lucide-react";
import { default as portalData } from "../services/portalData.json";

function Footer() {
  return (
    <Container className="app-footer">
      <Row>
        <Col xs={6} md={3}>
          <ul>
            <li><b>Useful Links</b></li>
            <li>
              <Link href="/useful-links/aup">Acceptable Use Policy</Link>
            </li>
            <li><Link href="/useful-links/cookie-policy">Cookie Policy</Link></li>
            <li><Link href="/useful-links/branding">Branding Resources</Link></li>
          </ul>
        </Col>
        <Col xs={6} md={3}>
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
        <Col xs={6} md={3}>
          <div>
            <ul>
              <li><b>Social</b></li>
              <li>
                <div className="d-flex flex-row gap-3 footer-social-icons">
                  <a href={portalData.fabricSocialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <X size={24} className="text-black"/>
                  </a>
                  <a href={portalData.fabricSocialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={24} className="text-black"/>
                  </a>
                  <a href={portalData.fabricSocialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube size={24} className="text-black"/>
                  </a>
                  <a href="mailto:info@fabric-testbed.net" aria-label="Email">
                    <Mail size={24} className="text-black"/>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </Col>
        <Col xs={6} md={3} className="d-flex align-items-center justify-content-center">
          <img
            src="/imgs/trustedci.png"
            className="footer-trustedci-badge"
            alt="Trusted CI"
          />
        </Col>
      </Row>
      <Row className="mt-3 align-items-center">
        <Col xs={12} md={8}>
          <div className="d-flex align-items-center footer-nsf-row">
            <img
              src="/imgs/nsf.png"
              width="40"
              height="40"
              className="d-inline-block align-top me-2 flex-shrink-0"
              alt="NSF"
            />
            <u className="text-sm-size">FABRIC is funded by NSF grants CNS-1935966, CNS-2029176, CNS-2029200, CNS-2029235, CNS-2029260, CNS-2029261 and CNS-2330891.</u>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <ul className="mb-0">
            <li><u><b>© FABRIC {new Date().getFullYear()}</b></u></li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
