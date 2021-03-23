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
