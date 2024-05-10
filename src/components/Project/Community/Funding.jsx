import React from 'react';
import { getFundingAgencies, getFundingDirectorates } from "../../../services/projectService";
import { toast } from "react-toastify";

class Funding extends React.Component {
  state = {
    funding_agency_options: [],
    funding_directorate_options: [],
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
    const { funding_agency, funding_directorate, award_number, award_amount } = this.state;
    const newFunding = {
      "funding_agency": funding_agency, 
      "funding_directorate": funding_directorate,
      "award_number": award_number,
      "award_amount": award_amount
    };
    this.props.onFundingUpdate("add", newFunding);
    this.setState({
      funding_agency: "",
      funding_directorate: "",
      award_number: "",
      award_amount: ""
    })
  }

  render() {
    const { funding_agency, funding_directorate, award_number, 
      award_amount, funding_agency_options, funding_directorate_options } = this.state;
    const { fundings } = this.props;
    return (
      <div className="form-row">
      <div className="form-group slice-builder-form-group col-md-2">
        <label htmlFor="inputFundingAgency" className="slice-builder-label">
          Funding Agency*
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
          Add
        </button>
      </div>
      <div>
        <ul className="input-tag__tags">
          {
            fundings.length > 0 &&
            fundings.map((funding, index) => 
            <li
              key={`funding-to-add-${index}`}
              className="mr-2 my-2"
            >
              {`${funding.funding_agency} | ${funding.funding_directorate ? funding.funding_directorate : ""} |
               ${funding.award_number ? funding.award_number : ""} | $${funding.award_amount ? funding.award_amount : ""}`}
            <i
              className="fa fa-times ml-2"
              onClick={() => {
                this.props.handleUpdateFunding("remove", funding);
              }}
            ></i>
          </li>)
          }
        </ul>
      </div>
    </div>
    )
  }
}

export default Funding;