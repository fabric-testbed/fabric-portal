import React from 'react';
import { default as portalData } from "../../../services/portalData.json";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Community extends React.Component {
  state = {
    domain_options: portalData.communityOptions,
    subdomains_mapping: portalData.communityMapping,
    subdomain_options: [],
    selected_domain: "",
    selected_subdomain: ""
  }

  handleDomainChange = (e) => {
    let subdomain_options = [];
    if (Object.keys(this.state.subdomains_mapping).includes(e.target.value)) {
      subdomain_options = this.state.subdomains_mapping[e.target.value];
    }
    this.setState({ selected_domain: e.target.value, subdomain_options: subdomain_options});
  }

  handleSubdomainChange = (e) => {
    this.setState({ selected_subdomain: e.target.value });
  }

  handleCommunityAdd = () => {
    const { selected_domain, selected_subdomain } = this.state;
    const newCommunity = selected_subdomain ? `${selected_domain}:${selected_subdomain}` : selected_domain;
    this.props.onCommunityUpdate("add", newCommunity);
    this.setState({
      selected_domain: "",
      selected_subdomain: ""
    })
  }

  render() {
    const { domain_options, subdomain_options, selected_domain, selected_subdomain } = this.state;
    const { communities, canUpdate } = this.props;
    return (
      <div>
        <h5 className="mt-2">Community</h5>
        <Form>
        {
          canUpdate &&         
          <Container>
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3" controlId="communityAgencySelect">
                  <Form.Label>Science Domain</Form.Label>
                  <Form.Select
                    aria-label="Community agency select"
                    id="communityAgencySelect"
                    value={selected_domain}
                    onChange={this.handleDomainChange}
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
                <Form.Group className="mb-3" controlId="subdomainSelect">
                  <Form.Label>Science Domain</Form.Label>
                  <Form.Select
                    aria-label="Community subdomain select"
                    id="directorateSelect"
                    value={selected_subdomain}
                    onChange={this.handleSubdomainChange}
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
              <Col xs={1}>
                <Button variant="primary" type="button" onClick={this.handleCommunityAdd}>
                Add
                </Button>
              </Col>
            </Row>
          </Container>
        }
        <div className="ms-1">
            <ul className="input-tag__tags">
              {
                communities.length > 0 &&
                communities.map((community, index) => 
                <li
                  key={`community-to-add-${index}`}
                  className="me-2 my-2"
                >
                  {community}
                  {
                    canUpdate &&          <i
                    className="fa fa-times ms-2"
                    onClick={() => {
                      this.props.onCommunityUpdate("remove", community);
                    }}
                  ></i>
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
    )
  }
}

export default Community;