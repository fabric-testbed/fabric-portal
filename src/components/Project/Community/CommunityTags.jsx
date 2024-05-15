import React from 'react';

class Community extends React.Component {
  state = {
    domain_options: ["Networks", "Computer systems organization", "Information systems",
    "Security and privacy", "Human-centered computing", "Applied computing", "Hardware", "Software", "Theory of computation",
    "Mathematics of computing", "Computing methodologies", "HPC", "RNE", "Other"],
    subdomains_mapping: {
      "Networks": [
        "Network architectures",
        "Network protocols",
        "Network algorithms",
        "Network performance evaluation",
        "Network services",
        "Datacenter networks",
        "Mobile networks",
        "Overlay and other logical network structures",
        "Wireless access networks",
        "Public Internet",
        "Wired access networks",
        "Packet-switching networks",
        "Network security"
      ], 
      "Computer systems organization": [
        "Dependable and fault-tolerant systems and networks",
        "Real-time systems",
        "Embedded and cyber-physical systems",
        "Architectures",
        "Cloud Computing",
        "Peer-to-peer architectures"
      ], 
      "Information systems": [
        "Data management systems",
        "Information storage systems",
        "World Wide Web",
        "Information retrieval"
      ],
      "Security and privacy": [
        "Cryptography",
        "Security services",
        "Intrusion/anomaly detection and malware mitigation",
        "Systems security",
        "Network security"
      ], 
      "Applied computing" : [
        "Arts and humanities",
        "Computer forensics",
        "Education",
        "Electronic commerce",
        "Enterprise computing",
        "Life and medical sciences",
        "Physical sciences and engineering"
      ],
      "Hardware": [
        "Quantum technologies",
        "Integrated Circuits - Reconfigurable logic and FPGAs",
        "Sensor devices and platforms",
        "Networking hardware"
      ], 
      "Theory of computation": [
        "Design and analysis of algorithms",
        "Theory and algorithms for application domains",
        "Semantics and reasoning",
        "Formal languages and automata theory",
        "Models of computation"
      ],
      "Computing methodologies": [
        "Artificial Intelligence",
        "Machine Learning",
        "Parallel computing methodologies",
        "Modeling and simulation",
        "Distributed computing methodologies",
        "Computer graphics/Graphics systems and interfaces/Graphics processors"
      ]    
    },
    subdomain_options: [],
    selected_domain: "",
    selected_subdomain: ""
  }

  handleDomainChange = (e) => {
    let subdomain_options = [];
    console.log("community tag domain selected" + e.target.value);
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
    const { communities } = this.props;
    return (
      <div className="border-top mt-2">
        <h5 className="mt-2">Community</h5>
        <div className="form-row">
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
          <div>
            <ul className="input-tag__tags">
              {
                communities.length > 0 &&
                communities.map((community, index) => 
                <li
                  key={`community-to-add-${index}`}
                  className="mr-2 my-2"
                >
                  {community}
                <i
                  className="fa fa-times ml-2"
                  onClick={() => {
                    this.props.onCommunityUpdate("remove", community);
                  }}
                ></i>
              </li>)
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Community;