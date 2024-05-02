import React from 'react';
import { getFundingAgencies, getFundingDirectorates } from "../../../services/projectService";
import { toast } from "react-toastify";

class Funding extends React.Component {
  state = {
    funding_agency_options: [],
    funding_directorate_options: [],
    project_funding: [],
    funding_agency: "",
    funding_directorate: "",
    award_number: "",
    award_amount: ""
  }

  async componentDidMount() {
    try {
      const { data: res1 } = await getFundingAgencies();
      const { data: res2 } = await getFundingDirectorates();
      this.setState({
        funding_agency_options: res1.results,
        funding_directorate_options: res2.results
      })
    } catch (err) {
      toast.error("Failed to load funding agency and directorate options. Please reload this page.");
    }
  }

  handleAgencyChange = (e) => {
    this.setState({ funding_agency: e.target.value });
  }

  handleDirectorateChange = (e) => {
    this.setState({ funding_directorate: e.target.value });
  }

  handleAwardNumberChange = (e) => {
    this.setState({ award_number: e.target.value });
  }

  handleAwardAmountChange = (e) => {
    this.setState({ award_amount: e.target.value });
  }

  handleFundingAdd = () => {
    const fundings = this.state.project_funding;
    const { funding_agency, funding_directorate, award_number, award_amount } = this.state;
    fundings.push({ funding_agency, funding_directorate, award_number, award_amount});
    console.log("handle funding add: " + fundings);
    this.setState({
      project_funding: fundings,
      funding_agency: "",
      funding_directorate: "",
      award_number: "",
      award_amount: ""
    })
  }

  render() {
    const { funding_agency, funding_directorate, award_number, 
      award_amount, funding_agency_options, funding_directorate_options } = this.state;
    return (
      <div className="form-row">
      <div className="form-group slice-builder-form-group col-md-3">
        <label htmlFor="inputFundingAgency" className="slice-builder-label">
          Funding Agency
        </label>
        <select
          className="form-control form-control-sm"
          id="fundingAgencySelect"
          value={funding_agency}
          onChange={this.handleAgencyChange}
        >
          <option value="">Choose...</option>
          { 
            funding_agency_options.map((agency, index) => 
              <option value={agency} key={`funding-agency-${index}`}>{agency}</option>
            )
          }
        </select>
      </div>
      <div className="form-group slice-builder-form-group col-md-3">
        <label htmlFor="inputComponent" className="slice-builder-label">NSF Directorate</label>
        <select
          className="form-control form-control-sm"
          id="directorateSelect"
          value={funding_directorate}
          onChange={this.handleDirectorateChange}
        >
          <option value="">Choose...</option>
          { 
            funding_directorate_options.map((directorate, index) => 
              <option value={directorate} key={`funding-directorate-${index}`}>{directorate}</option>
            )
          }
        </select>
      </div>
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
          <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
    )
  }
}

export default Funding;