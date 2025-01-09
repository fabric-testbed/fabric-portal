import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";

const solicitations = [
  {
    "name": "NSF 24-530",
    "url": "https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc",
    "sortDate": "2024-10-15",
    "displayDate": "October 15, 2024"
  },
  {
    "name": "NSF 24-536",
    "url": "https://new.nsf.gov/funding/opportunities/computer-information-science-engineering-research-0",
    "sortDate": "2025-02-07",
    "displayDate": "February 7, 2025"
  },
  {
    "name": "NAIRR Pilot",
    "url": "https://idaorg.gov1.qualtrics.com/jfe/form/SV_cRMnkUFJoXs7UfI?utm_medium=email&_hsmi=293777879&_hsenc=p2ANqtz-8gCHxFAq6pzEEOUbzQtu5DjeJN1XcGeiTT8HCy-OHDwJKJtYZ24lViNDFoFe8krDf5GGJZJoJ_qJrhh6PKwRg9Ah1IzA&utm_content=293777879&utm_source=hs_email",
    "sortDate": "2024-03-08",
    "displayDate": "March 08, 2024"
  },
  {
    "name": "NSF 24-530",
    "url": "https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc",
    "sortDate": "2024-04-22",
    "displayDate": "April 22, 2024"
  },
  {
    "name": "NSF 23-589",
    "url": "https://new.nsf.gov/funding/opportunities/community-infrastructure-research-computer/nsf23-589/solicitation",
    "sortDate": "2024-09-13",
    "displayDate": "September 13, 2024"
  },
  {
    "name": "NSF 24-504",
    "url": "https://new.nsf.gov/funding/opportunities/secure-trustworthy-cyberspace-satc/nsf24-504/solicitation",
    "sortDate": "2025-01-01",
    "displayDate": "No deadline"
  },
  {
    "name": "NSF 23-576",
    "url": "https://new.nsf.gov/funding/opportunities/computer-information-science-engineering-research/nsf23-576/solicitation",
    "sortDate": "2024-09-18",
    "displayDate": "September 18, 2024"
  },
  {
    "name": "NSF 24-536",
    "url": "https://new.nsf.gov/funding/opportunities/computer-information-science-engineering-research-0/nsf24-536/solicitation",
    "sortDate": "2024-05-02",
    "displayDate": "May 02, 2024"
  }
]

const parsedSolicitations = () => {
  const now = new Date();

  const current = solicitations.filter(solicitation => { 
    const deadline = new Date(solicitation.sortDate)
    return deadline > now
  }).sort((s, t) => new Date(s.sortDate) - new Date(t.sortDate));

  const expired = solicitations.filter(solicitation => { 
    const deadline = new Date(solicitation.sortDate)
    return deadline < now
  }).sort((s, t) => new Date(s.sortDate) - new Date(t.sortDate));

  return { current, expired }
}

const FundingOpportunities = () => {
  return (
    <div className="container static-page pb-5">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">Get Involved with FABRIC</h1>
      <h2 className="text-primary mb-4">
        Funding Opportunities
      </h2>
      <p>
        Do you have a project idea that would benefit from using FABRIC?
        The FABRIC team welcomes requests for Letters of Collaboration. 
        To expedite the process, please contact us by 
        filling out the <a href="https://forms.gle/MKV5SfpdSS24XbFD7" target="_blank" rel="noopener noreferrer"><b>LoC Request Form</b></a>.
      </p>
      <table className="table table-striped mb-5">
        <thead className="table-primary">
          <tr>
            <th>Solicitation</th>
            <th>Link</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {
            parsedSolicitations().current.map((opportunity, index) => <tr key={`fab-core-member-${index}`}>
              <th>{opportunity.name}</th>
              <td><a href={opportunity.url} target="_blank" rel="noreferrer"><i className="fa fa-link"></i></a></td>
              <td>{opportunity.displayDate}</td>
            </tr>
          )
          }
        </tbody>
      </table>
      
      <h6><i>Expired Funding Opportunities</i></h6>

      <table className="table table-striped table-sm">
        <thead className="bg-secondary">
          <tr>
            <th>Solicitation</th>
            <th>Link</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {
            parsedSolicitations().expired.map((opportunity, index) => <tr key={`fab-core-member-${index}`}>
              <th>{opportunity.name}</th>
              <td><a href={opportunity.url} target="_blank" rel="noreferrer"><i className="fa fa-link"></i></a></td>
              <td>{opportunity.displayDate}</td>
            </tr>
          )
          }
        </tbody>
      </table>
    </div>
  );
};

export default FundingOpportunities;
