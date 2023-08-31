import React from "react";

const teamMembers = [
  {
    name: "Ilya Baldin",
    org: "RENCI",
    link: "https://renci.org/"
  },
  {
    name: "Anita Nikolich",
    org: "University of Illinois Urbana Champaign",
    link: "https://illinois.edu/"
  },
  {
    name: "Jim Griffioen",
    org: "University of Kentucky",
    link: "https://www.uky.edu/"
  },
  {
    name: "Kuang-Ching Wang",
    org: "Clemson University",
    link: "https://www.clemson.edu/"
  },
  {
    name: "Inder Monga",
    org: "Lawrence Berkeley National Laboratory",
    link: "https://www.lbl.gov/"
  },
  {
    name: "Rob Gardner",
    org: "University of Chicago",
    link: "https://www.uchicago.edu/"
  }
]

const FAB = () => {
  return (
    <div className="container pb-5 static-page">
      <h1 className="mb-4">About FAB</h1>
      <p>FABRIC Across Borders (FAB) is an extension of the FABRIC testbed connecting the core North America infrastructure to four nodes in Asia, Europe, and South America. By creating the networks needed to move vast amounts of data across oceans and time zones seamlessly and securely, the project enables international collaboration to speed scientific discovery.</p>
      <h2 className="text-primary">Science Applications</h2>
      <p>FAB is driven by science needs in fields that are pushing the limits of what today’s Internet can support. It offers a testbed to explore ways to handle and share massive amounts of data generated by powerful new scientific instruments around the globe.</p>
      <p>FAB is built around use cases led by scientific partners in five areas:</p>
      <table className="table table-striped table-sm table-bordered">
        <tbody>
          <tr>
            <th>Smart Cities</th>
            <td>Sensing and Computing</td>
            <td>SAGE • University of Antwerp • University of Bristol</td>
          </tr>
          <tr>
            <th>Weather</th>
            <td>Weather and Climate Prediction</td>
            <td>University of Miami • CPTECH Center for Weather Forecast and Climatic Studies, Brazil</td>
          </tr>
          <tr>
            <th>Physics</th>
            <td>High Energy Physics</td>
            <td>Large Hadron Collider, CERN • University of Chicago</td>
          </tr>
          <tr>
            <th>Space</th>
            <td>Astronomy and cosmology</td>
            <td>Legacy Survey of Space and Time • Cosmic Microwave Background-Stage 4</td>
          </tr>
          <tr>
            <th>Computer Science</th>
            <td>Private 5G networks, censorship evasion, network competition and sharing, software-defined networking, P4 programming </td>
            <td>University of Tokyo • Clemson University • University of Kentucky • KREONET</td>
          </tr>
        </tbody>
      </table>
      <p>
        FAB will connect FABRIC to five global partners:
      </p>
      <table className="table table-striped table-sm table-bordered">
        <tbody>
          <tr>
            <th>University of Tokyo</th>
            <td>Japan</td>
          </tr>
          <tr>
            <th>CERN, the European Organization for Nuclear Research</th>
            <td>Switzerland</td>
          </tr>
          <tr>
            <th>University of Bristol</th>
            <td>U.K.</td>
          </tr>
          <tr>
            <th>University of Amsterdam</th>
            <td>The Netherlands</td>
          </tr>
          <tr>
            <th>CPTEC/INPE</th>
            <td>Brazil</td>
          </tr>
        </tbody>
      </table>
      <p>
        High-speed links will be provided by NSF’s International Research & Education Network Connections:
      </p>
      <table className="table table-striped table-sm table-bordered">
        <tbody>
          <tr>
            <th>TransPAC</th>
            <td>U.S. to Asia</td>
          </tr>
          <tr>
            <th>StarLight</th>
            <td>U.S. to Europe</td>
          </tr>
          <tr>
            <th>Networks for European, American, and African Research (NEAAR)</th>
            <td>U.S. to Europe and Africa</td>
          </tr>
          <tr>
            <th>AmLight-ExP </th>
            <td>U.S. to South America and Africa</td>
          </tr>
        </tbody>
      </table>
      <h2 className="my-4 text-primary">FAB Core Team</h2>
      <table className="table table-hover">
        <tbody>
          {
            teamMembers.map((member, index) => <tr key={`fab-core-member-${index}`}>
              <th>{member.name}</th>
              <td><a href={member.link} target="_blank" rel="noreferrer">{member.org}</a></td>
            </tr>
          )
          }
        </tbody>
      </table>
    </div>
  );
};

export default FAB;
