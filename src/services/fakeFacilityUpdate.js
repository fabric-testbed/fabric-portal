export const updates = [
  {
    id: 1,
    title: "3 FABRIC Development Sites Operational",
    content:
      "RENC (located at UNC, Chapel Hill, NC), UKY (located at the University of Kentucky, Lexington, KY) and LBNL (Located at Lawrence Berkeley National Laboratory, Berkeley, CA) are operational with temporary links connecting them using a combination of circuits provided by Internet 2 and ESnet. They are supporting early demonstrations, testing and development activities by the FABRIC team.",
    date: "2021-03-22",
  },
  {
    id: 2,
    title: "FABRIC Beta Tester Registration is Open",
    content:
      "The FABRIC team is looking for volunteer beta testers! This role will provide early access to FABRIC and an opportunity to provide feedback to the developer. If you are interested in being considered for this role, please fill out this form by March 30th.",
    date: "2021-03-23",
    link: "https://share.hsforms.com/1VKIcNubyQ-eZYNnnivHSSQ3ry9k",
    button: "Register Form",
  },
  {
    id: 3,
    title: "FABRIC Footprint Growing",
    content:
      "<p>Today FABRIC offers its early experimenters access to a number of operational sites linked with a combination of L1 DWDM and L2 circuits. These sites include: MAX (University of Maryland), STAR (StarLight), UTAH (University of Utah), TACC (UT Austin), MICH (University of Michigan) and NCSA (UIUC). In addition 3 development sites: RENC, UKY and LBNL are maintained in a separate topology dedicated to development and testing.</p><p>By the end of Feb 2022 we expect to turn up our first DWDM core links and include into the operational topology several core sites: DALL (Dallas), SALT (Salt Lake City) and WASH (Washington DC).</p><p>This will be the last ‘iteration’ of our topology before the complete Phase I topology is turned on, which will additionally include sites at FIU, Georgia Tech, Clemson, UMKC/GPN and UCSD (estimated April-May 2022).</p>",
    date: "2022-01-31",
  },
  {
    id: 4,
    title: "FABRIC is now open with more sites and features!",
    content:
      '<p>We are pleased to announce the end of the maintenance period including Release 1.1 of our software stack. FABRIC is available to you again with a number of improvements:</p><p><ol><li>We have a larger topology with 9 sites available for experiments (we expect MASS site to be available shortly);</li><li>We fully integrated bastion hosts into the experiment workflow;</li><li>Bastion SSH key and account management have been automated and fully integrated with the portal and bastion hosts;</li><li>We added many significant enhancements and bug fixes to the Control Framework.</li></ol></p><p>In May 2022 we expect additional 4 sites at GPN, FIU, Clemson and UCSD to come on-line.</p>',
    date: "2022-03-01",
    link: "https://learn.fabric-testbed.net/forums/topic/fabric-is-now-open-with-even-more-sites-and-features/",
    button: "Learn More",
  },
  {
    id: 5,
    title: "FABRIC Software Release 1.2 now available!",
    content:
     '<p>We are pleased to announce the deployment of Release 1.2 of our software stack on FABRIC production infrastructure. This release adds a few notable new features:</p><p><ul><li>Graphical slice builder in the Portal</li><li>Facility Ports (first facility ports to Chameleon@UC, many others to follow soon)</li><li>Mirror Ports</li><li>New project-based authorization system</li></ul></p><p>Follow our announcements on FABRIC Forums.</p>',
    date: "2022-06-06",
    link: "https://learn.fabric-testbed.net/knowledge-base/fabric-testbed-release-1-2/",
    button: "Learn More",
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
