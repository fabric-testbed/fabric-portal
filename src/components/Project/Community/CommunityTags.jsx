import React from 'react';
import { default as portalData } from "../../../services/portalData.json";

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
        {
          canUpdate &&         <div className="form-row">
          <div className="form-group slice-builder-form-group col-md-4">
            <label htmlFor="inputCommunityAgency" className="slice-builder-label">
              Science Domain
            </label>
            <select
              className="form-control form-control-sm"
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
            </select>
          </div>
          <div className="form-group slice-builder-form-group col-md-7">
            <label htmlFor="inputComponent" className="slice-builder-label">Subdomain</label>
            <select
              className="form-control form-control-sm"
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
            </select>
          </div>
          <div className="form-group slice-builder-form-group col-md-1">
            <button
              className="btn btn-sm btn-outline-success mt-4"
              type="button"
              onClick={this.handleCommunityAdd}
            >
              Add
            </button>
          </div>
        </div>
        }
        <div className="ml-1">
            <ul className="input-tag__tags">
              {
                communities.length > 0 &&
                communities.map((community, index) => 
                <li
                  key={`community-to-add-${index}`}
                  className="mr-2 my-2"
                >
                  {community}
                  {
                    canUpdate &&          <i
                    className="fa fa-times ml-2"
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
      </div>
    )
  }
}

export default Community;