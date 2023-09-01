import React from "react";

const solicitations = [
  {
    "name": "CC* 21-528",
    "url": "https://www.nsf.gov/pubs/2021/nsf21528/nsf21528.htm",
    "sortDate": "2021-10-21",
    "displayDate": "March 01, 2021; October 11, 2021"
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
    "name": "CISE Core 20-591",
    "url": "https://www.nsf.gov/pubs/2020/nsf20591/nsf20591.htm",
    "sortDate": "2020-10-28",
    "displayDate": "October 28, 2020 for Medium and OAC Core Projects, October 1, 2020 for Small projects"
  },
  {
    "name": "CC* 20-507",
    "url": "https://www.nsf.gov/pubs/2020/nsf20507/nsf20507.htm",
    "sortDate": "2020-11-18",
    "displayDate": "November 18, 2020"
  },
  {
    "name": "IRNC 20-535",
    "url": "https://www.nsf.gov/pubs/2020/nsf20535/nsf20535.htm",
    "sortDate": "2020-04-08",
    "displayDate": "April 08, 2020"
  },
  {
    "name": "CICI",
    "url": "https://www.nsf.gov/pubs/2021/nsf21512/nsf21512.htm",
    "sortDate": "2021-01-08",
    "displayDate": "January 08, 2021"
  },
  {
    "name": "NSF 21-581",
    "url": "https://www.nsf.gov/pubs/2021/nsf21581/nsf21581.htm",
    "sortDate": "2021-07-29",
    "displayDate": "5pm July 29, 2021"
  },
  {
    "name": "NSF 21-591",
    "url": "https://www.nsf.gov/pubs/2021/nsf21591/nsf21591.htm",
    "sortDate": "2021-09-20",
    "displayDate": "5pm September 20, 2021, Third Monday in September, Annually Thereafter"
  },
  {
    "name": "NSF 22-509",
    "url": "https://www.nsf.gov/pubs/2022/nsf22509/nsf22509.htm",
    "sortDate": "2022-06-23",
    "displayDate": "June 23, 2022"
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
  },
  {
    "name": "NSF 22-582",
    "url": "https://www.nsf.gov/pubs/2022/nsf22582/nsf22582.htm",
    "sortDate": "2022-06-27",
    "displayDate": "June 27, 2022"
  },
  {
    "name": "NGI Enrichers Program",
    "url": "https://enrichers.ngi.eu/",
    "sortDate": "2023-01-31",
    "displayDate": "January 31, 2023"
  },
  {
    "name": "Campus Cyberinfrastructure (CC*)",
    "url": "https://www.nsf.gov/pubs/2023/nsf23526/nsf23526.htm",
    "sortDate": "2023-09-11",
    "displayDate": "September 11, 2023"
  },
  {
    "name": "Community Infrastructure for Research in Computer and Information Science and Engineering (CIRC)",
    "url": "https://new.nsf.gov/funding/opportunities/community-infrastructure-research-computer",
    "sortDate": "2023-09-08",
    "displayDate": "September 8, 2023"
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
    <div className="container pb-5">
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
              <td><a href={opportunity.url} target="_blank" rel="noreferrer"><i class="fa fa-link"></i></a></td>
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
              <td><a href={opportunity.url} target="_blank" rel="noreferrer"><i class="fa fa-link"></i></a></td>
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
