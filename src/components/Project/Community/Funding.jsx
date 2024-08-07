import React from 'react';
import { getFundingAgencies, getFundingDirectorates } from "../../../services/projectService";
import { toast } from "react-toastify";

class Funding extends React.Component {
  state = {
    agency_options: [],
    directorate_options: [],
    agency: "",
    directorate: "",
    award_number: "",
    award_amount: "",
    agency_other: ""
  }

  async componentDidMount() {
    try {
      const { data: res1 } = await getFundingAgencies();
      const { data: res2 } = await getFundingDirectorates();
      this.setState({
        agency_options: res1.results,
        directorate_options: res2.results
      })
    } catch (err) {
      toast.error("Failed to load funding agency and directorate options. Please reload this page.");
    }
  }

  handleAgencyChange = (e) => {
    this.setState({ agency: e.target.value });
  }

  handleAgencyOtherChange = (e) => {
    this.setState({ agency_other: e.target.value });
  }

  handleDirectorateChange = (e) => {
    this.setState({ directorate: e.target.value });
  }

  handleAwardNumberChange = (e) => {
    this.setState({ award_number: e.target.value });
  }

  handleAwardAmountChange = (e) => {
    this.setState({ award_amount: e.target.value });
  }

  handleFundingAdd = () => {
    const { agency, directorate, award_number, award_amount, agency_other } = this.state;
    const newFunding = {
      "agency": agency, 
      "directorate": directorate,
      "award_number": award_number,
      "award_amount": award_amount,
      "agency_other": agency_other
    };
    this.props.onFundingUpdate("add", newFunding);
    this.setState({
      agency: "",
      directorate: "",
      award_number: "",
      award_amount: "",
      agency_other: ""
    })
  }

  parseFundingStr = (funding) => {
    if (funding.agency === "Other") {
      return `${funding.agency_other} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else if (funding.agency === "NSF") {
      return `${funding.agency} ${funding.directorate ? `| ${funding.directorate}` : ""} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else {
      return `${funding.agency} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    }
  }

  render() {
    const { agency, directorate, award_number, 
      award_amount, agency_options, directorate_options, agency_other } = this.state;
    const { fundings, canUpdate } = this.props;
    return (
      <div className="pt-2">
        <h5 className="mt-2">Funding Information</h5>
        {
          canUpdate &&         <div className="form-row">
          <div className="form-group slice-builder-form-group col-md-2">
            <label htmlFor="inputFundingAgency" className="slice-builder-label">
              Funding Agency*
            </label>
            <select
              className="form-control form-control-sm"
              id="fundingAgencySelect"
              value={agency}
              onChange={this.handleAgencyChange}
            >
              <option value="">Choose...</option>
              { 
                agency_options.map((agency, index) => 
                  <option value={agency} key={`funding-agency-${index}`}>{agency}</option>
                )
              }
            </select>
          </div>
          {
            agency === "NSF" &&
            <div className="form-group slice-builder-form-group col-md-3">
              <label htmlFor="inputComponent" className="slice-builder-label">NSF Directorate</label>
              <select
                className="form-control form-control-sm"
                id="directorateSelect"
                value={directorate}
                onChange={this.handleDirectorateChange}
              >
                <option value="">Choose...</option>
                { 
                  directorate_options.map((directorate, index) => 
                    <option value={directorate} key={`funding-directorate-${index}`}>{directorate}</option>
                  )
                }
              </select>
            </div>
          }
          {
            agency === "Other" && <div className="form-group slice-builder-form-group col-md-3">
              <label htmlFor="inputAgencyName" className="slice-builder-label">Agency Name</label>
              <input
                type="text" className="form-control form-control-sm" id="inputAgencyName"
                value={agency_other}
                onChange={this.handleAgencyOtherChange}
              />
            </div>
          }
          <div className="form-group slice-builder-form-group col-md-3">
            <label htmlFor="inputAwardNumber" className="slice-builder-label">Award Number</label>
            <input
              type="text" className="form-control form-control-sm" id="inputAwardNumber"
              value={award_number}
              onChange={this.handleAwardNumberChange}
            />
          </div>
          <div className="form-group slice-builder-form-group col-md-3">
            <label htmlFor="inputAwardAmount" className="slice-builder-label">Amount</label>
            <input
              type="text" className="form-control form-control-sm" id="inputAwardAmount"
              value={award_amount}
              onChange={this.handleAwardAmountChange}
            />
          </div>
          <div className="form-group slice-builder-form-group col-md-1">
            <button
              className="btn btn-sm btn-outline-success mt-4"
              type="button"
              onClick={this.handleFundingAdd}
            >
              Add
            </button>
          </div>
        </div>
        }
        <div className="ml-1">
            <ul className="input-tag__tags">
              {
                fundings.length > 0 &&
                fundings.map((funding, index) => 
                <li
                  key={`funding-to-add-${index}`}
                  className="mr-2 my-2"
                >
                  { this.parseFundingStr(funding) }
                  {
                    canUpdate && 
                    <i
                      className="fa fa-times ml-2"
                      onClick={() => {this.props.onFundingUpdate("remove", funding);}}
                    ></i>
                  }
              </li>)
              }
            </ul>
        </div>
        {
          fundings.length === 0 && !canUpdate &&
          <div
            className="alert alert-primary mb-2" 
            role="alert"
          >
            This project has no funding added yet.
          </div>
        }
      </div>
    )
  }
}

export default Funding;