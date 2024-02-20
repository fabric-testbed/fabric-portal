import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";

const solicitations = [
  {
    "name": "NAIRR Pilot",
    "url": "https://idaorg.gov1.qualtrics.com/jfe/form/SV_cRMnkUFJoXs7UfI?utm_medium=email&_hsmi=293777879&_hsenc=p2ANqtz-8gCHxFAq6pzEEOUbzQtu5DjeJN1XcGeiTT8HCy-OHDwJKJtYZ24lViNDFoFe8krDf5GGJZJoJ_qJrhh6PKwRg9Ah1IzA&utm_content=293777879&utm_source=hs_email",
    "sortDate": "2024-03-08",
    "displayDate": "March 03, 2024"
  },
  {
    "name": "NSF 24-530",
    "url": "https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc",
    "sortDate": "2024-04-22",
    "displayDate": "April 04, 2024"
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
    "name": "CISE-MSI Program",
    "url": "https://www.nsf.gov/pubs/2021/nsf21533/nsf21533.htm?org=NSF",
    "sortDate": "2021-04-15",
    "displayDate": "April 15, 2021 (April 15, annually thereafter)"
  },
  {
    "name": "ICE-T",
    "url": "https://www.nsf.gov/pubs/2018/nsf18535/nsf18535.htm",
    "sortDate": "2021-02-02",
    "displayDate": "TBD"
  },
  {
    "name": "NSF 21-591",
    "url": "https://www.nsf.gov/pubs/2021/nsf21591/nsf21591.htm",
    "sortDate": "2021-09-20",
    "displayDate": "5pm September 20, 2021, Third Monday in September, Annually Thereafter"
  },
  {
    "name": "NSF 22-518",
    "url": "https://www.nsf.gov/pubs/2022/nsf22518/nsf22518.htm",
    "sortDate": "2022-02-11",
    "displayDate": "February 11. 2022; Annually Thereafter"
  },
  {
    "name": "NSF 22-517",
    "url": "https://www.nsf.gov/pubs/2022/nsf22517/nsf22517.htm",
    "sortDate": "2023-12-31",
    "displayDate": "Proposals Accepted Anytime"
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
        <thead className="bg-primary-light">
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
