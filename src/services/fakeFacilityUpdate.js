export const updates = [
  {
    id: 1,
    title: "Title for Update 1",
    content:
      "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth.",
    date: "2020-03-08",
  },
  {
    id: 2,
    title: "3 FABRIC Development Sites Operational",
    content:
      "RENC (located at UNC, Chapel Hill, NC), UKY (located at the University of Kentucky, Lexington, KY) and LBNL (Located at Lawrence Berkeley National Laboratory, Berkeley, CA) are operational with temporary links connecting them using a combination of circuits provided by Internet 2 and ESnet. They are supporting early demonstrations, testing and development activities by the FABRIC team.",
    date: "2021-03-22",
  },
  {
    id: 3,
    title: "FABRIC Beta Tester Registration is Open",
    content:
      "The FABRIC team is looking for volunteer beta testers! This role will provide early access to FABRIC and an opportunity to provide feedback to the developer. If you are interested in being considered for this role, please fill out this form by March 30th.",
    date: "2021-03-23",
    link: "https://share.hsforms.com/1VKIcNubyQ-eZYNnnivHSSQ3ry9k",
    button: "Register Form",
  },
  {
    id: 4,
    title: "FABRIC Footprint Growing",
    content:
      "<p>Today FABRIC offers its early experimenters access to a number of operational sites linked with a combination of L1 DWDM and L2 circuits. These sites include: MAX (University of Maryland), STAR (StarLight), UTAH (University of Utah), TACC (UT Austin), MICH (University of Michigan) and NCSA (UIUC). In addition 3 development sites: RENC, UKY and LBNL are maintained in a separate topology dedicated to development and testing.</p><p>By the end of Feb 2022 we expect to turn up our first DWDM core links and include into the operational topology several core sites: DALL (Dallas), SALT (Salt Lake City) and WASH (Washington DC).</p><p>This will be the last ‘iteration’ of our topology before the complete Phase I topology is turned on, which will additionally include sites at FIU, Georgia Tech, Clemson, UMKC/GPN and UCSD (estimated April-May 2022).</p>",
    date: "2022-01-31",
  },
];

export function getUpdates() {
  return updates;
}

export function getLatestUpdates(n) {
  // return n updates with newest date.
  return updates
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n);
}
