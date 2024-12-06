import React from 'react';

class OtherIdentity extends React.Component {
  state = {
    identity_options: [
      "google_scholar",
      "orcid",
      "other"
    ],
    type: "",
    identity: "",
    is_valid: true
  }

  validateIdentityInput = (value, field) => {
    let regex = "";
    if (field === "identity") {
      switch (this.state.type) {
        case "google_scholar":
          regex = /^[a-zA-Z0-9_-]{8,16}$/;
          break;
        case "orcid":
          regex = /^(\d{4}-){3}\d{3}[\dX]$/;
          break;
        default:
          regex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
      }
      this.setState({ is_valid: regex.test(value) });
    } else if (field === "type") {
      switch (value) {
        case "google_scholar":
          regex = /^[a-zA-Z0-9_-]{8,16}$/;
          break;
        case "orcid":
          regex = /^(\d{4}-){3}\d{3}[\dX]$/;
          break;
        default:
          regex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
      }
      this.setState({ is_valid: regex.test(this.state.identity) });
    }
  }

  handleTypeChange = (e) => {
    if (this.state.identity !== "") {
      this.validateIdentityInput(e.target.value, "type");
    }
    // dropdown list choice
    this.setState({ type: e.target.value });
  }

  handleIdentityChange = (e) => {
    this.validateIdentityInput(e.target.value, "identity");
    // free-text input
    this.setState({ identity: e.target.value });
  }

  handleIdentityAdd = () => {
    const { type, identity } = this.state;
    const newIdentity = {
      type: type,
      identity: identity
    };
    this.props.onIdentityUpdate("add", newIdentity);
    this.setState({ type: "", identity: ""});
  }

  parseIdentityStr = (id) => {
    if (id.type === "google_scholar") {
      return (<a
        href={`https://scholar.google.com/citations?user=${id.identity}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="font-monospace">{`Google Scholar [ID: ${id.identity}]`} </span>
        <i className="fa fa-link ms-2"></i>
      </a>);
    } else if (id.type === "orcid"){
      return (<a
        href={`https://orcid.org/${id.identity}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="font-monospace">{`ORCID [ID: ${id.identity}]`}</span>
        <i className="fa fa-link ms-2"></i>
      </a>)
    } else {
      return <a
       href={id.identity}
       target="_blank"
       rel="noreferrer">
        <span className="font-monospace">{`Other [Link: ${id.identity}]`}</span>
        <i className="fa fa-link ms-2"></i>
      </a>;
    }
  }

  getAlertMessage = () => {
    const { type } = this.state;
    if (type === "google_scholar") {
      return "Please check your input. A Google Scholar ID consists of a string of alphanumeric characters, typically 12 characters long.";
    } else if (type === "orcid") {
      return "Please check your input. ORCID IDs consist of 16 digits grouped into four blocks separated by hyphens.";
    } else {
      return "Please input a valid website URL.";
    }
  }

  render() {
    const { identity_options, type, identity, is_valid } = this.state;
    const { other_identities } = this.props;
    return (
      <div>
        <h5 className="mt-2">Other Identities</h5>
        <div className="form-row ps-1">
          <div className="form-group slice-builder-form-group w-25 me-2">
            <label htmlFor="inputtype" className="slice-builder-label">
              Type
            </label>
            <select
              className="form-control form-control-sm"
              id="typeSelect"
              value={type}
              onChange={this.handleTypeChange}
            >
              <option value="">Choose...</option>
              { 
                identity_options.map((type, index) => 
                  <option value={type} key={`type-${index}`}>{type}</option>
                )
              }
            </select>
          </div>
          <div className="form-group slice-builder-form-group w-50 me-2">
              <label htmlFor="inputIdentity" className="slice-builder-label">Identity</label>
              <input
                type="text" className="form-control form-control-sm" id="inputIdentity"
                value={identity}
                onChange={this.handleIdentityChange}
              />
            </div>
          <div className="form-group slice-builder-form-group col-md-1">
            <button
              className="btn btn-sm btn-outline-success mt-4"
              type="button"
              onClick={this.handleIdentityAdd}
              disabled={!is_valid}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        {
          !is_valid && <div className="alert alert-danger" role="alert">
            {this.getAlertMessage()}
          </div>
        }
        <ol className="list-group mt-2">
          {
            other_identities.length > 0 && 
            other_identities.map((id, index) => 
            <li
              className="list-group-item d-flex justify-content-between align-items-center" 
              key={`identity-${index}`}
            >
              {this.parseIdentityStr(id)}
              <button
                className="btn btn-sm btn-outline-success"
                type="button"
                onClick={() => this.props.onIdentityUpdate("remove", id)}
              >
                <i className="fa fa-times"></i>
              </button>
            </li>
          )}
        </ol>
      </div>
    )
  }
}

export default OtherIdentity;