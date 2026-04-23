import React, { useState } from 'react';
import { X } from 'lucide-react';
import { default as portalData } from "../../../services/portalData.json";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CommunityTags = ({ communities, canUpdate, onCommunityUpdate }) => {
  const [domain_options] = useState(portalData.communityOptions);
  const [subdomains_mapping] = useState(portalData.communityMapping);
  const [subdomain_options, setSubdomainOptions] = useState([]);
  const [selected_domain, setSelectedDomain] = useState("");
  const [selected_subdomain, setSelectedSubdomain] = useState("");

  const handleDomainChange = (e) => {
    let newSubdomainOptions = [];
    if (Object.keys(subdomains_mapping).includes(e.target.value)) {
      newSubdomainOptions = subdomains_mapping[e.target.value];
    }
    setSelectedDomain(e.target.value);
    setSubdomainOptions(newSubdomainOptions);
  };

  const handleSubdomainChange = (e) => {
    setSelectedSubdomain(e.target.value);
  };

  const handleCommunityAdd = () => {
    const newCommunity = selected_subdomain ? `${selected_domain}:${selected_subdomain}` : selected_domain;
    onCommunityUpdate("add", newCommunity);
    setSelectedDomain("");
    setSelectedSubdomain("");
  };

  return (
    <div className="mt-2 mb-3">
      <h5>Community</h5>
      <Form>
      {
        canUpdate &&
          <Row>
            <Col xs={4}>
              <Form.Group controlId="communityAgencySelect">
                <Form.Label>Science Domain</Form.Label>
                <Form.Select
                  aria-label="Community agency select"
                  id="communityAgencySelect"
                  value={selected_domain}
                  onChange={handleDomainChange}
                >
                  <option value="">Choose...</option>
                  {
                    domain_options.map((domain, index) =>
                      <option value={domain} key={`community-domain-${index}`}>{domain}</option>
                    )
                  }
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={7}>
              <Form.Group controlId="subdomainSelect">
                <Form.Label>Science Domain</Form.Label>
                <Form.Select
                  aria-label="Community subdomain select"
                  id="directorateSelect"
                  value={selected_subdomain}
                  onChange={handleSubdomainChange}
                  disabled={subdomain_options.length === 0}
                >
                  <option value="">Choose...</option>
                  {
                    subdomain_options.length > 0 &&
                    subdomain_options.map((directorate, index) =>
                      <option value={directorate} key={`community-directorate-${index}`}>{directorate}</option>
                    )
                  }
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={1} className="d-flex align-items-end">
              <Button variant="outline-success" type="button" onClick={handleCommunityAdd}>
                Add
              </Button>
            </Col>
          </Row>
      }
      <div className="mt-2">
          <ul className="input-tag__tags">
            {
              communities.length > 0 &&
              communities.map((community, index) =>
              <li
                key={`community-to-add-${index}`}
                className="me-2"
              >
                {community}
                {
                  canUpdate && <X size={14} className="ms-2 cursor-pointer" onClick={() => onCommunityUpdate("remove", community)} />
                }
            </li>)
            }
          </ul>
      </div>
      {
        communities.length === 0 && !canUpdate &&
        <div
          className="alert alert-primary mb-2"
          role="alert"
        >
          This project has no community tag added yet.
        </div>
      }
    </Form>
    </div>
  );
};

export default CommunityTags;
