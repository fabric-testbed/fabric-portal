export const topomap = {
  coordinates: {
    "Salt Lake City": [-111.891045, 40.760780],
    "Kansas City": [-94.5786, 39.0997],
    "New York": [-74.005974, 40.712776],
    "Atlanta": [-84.3880, 33.7490],
    "Seattle": [-122.3321, 47.6062],
    "Washington": [-77.0369, 38.9072],
    "MGHPCC": [-72.6162, 42.2043],
    "StarLight": [-87.6173, 41.8962],
    "University of Tokyo": [-139.6503, 35.6762],
    "University of Bristol": [-2.5879, 51.4545],
    "University of Amsterdam": [4.9041, 52.3676],
    "CERN": [6.1432, 46.2044],
    "FIU": [-80.1918, 25.7617],
    "UMich": [-83.7382, 42.2780],
    "UKY": [-84.5040, 38.0307],
    "RENCI": [-79.0469, 35.9049],
    "RNP&ANSP&RedCLARA": [-46.6333, -23.5505],
    // not actuall coordinates (for display purpose):
    "Clemson": [-81.5369, 34.3738],
    "CLOUDLAB": [-82.5369, 34.3738],
    "Dallas": [-96.7970, 30.7767],
    "FIU&AMPATH": [-81.1918, 27.2617],
    "San Diego": [-116.1611, 34.7157],
    "LBNL": [-122.2730, 37.8715],
    "SRI": [-121.1697, 36.4275],
    "UCSD": [-117.1611, 32.7157],
    "SDSC": [-117.1611, 32.7157],
    "Utah": [-113.9019, 40.8938],
    "CLOUDLAB&POWDER": [-113.9019, 40.9938],
    "GPN": [-94.5786, 41.0997],
    "TACC": [-97.743057, 32.267153],
    "TACC&CHAMELEON": [-97.743057, 32.267153],
    "LEARN": [-98.3987, 29.0889],
    "IU": [-86.8126, 39.1754],
    "NCSA": [-88.707458, 38.3125],
    "GaTech": [-87.0963, 33.9756],
    "PSC": [-78.5959, 40.4406],
    "MAX": [-77.5077, 36.525],
    "Rutgers": [-76.8162, 42.2043],
    "Princeton": [-74.6162, 44.2043],
    "UMass": [-72.1062, 42.4043],
    "CHAMELEON": [-88.3173, 41.8962],
    "COSMOS": [-75.9162, 42.2043],
  },
  fab_nodes: [
    // international nodes
    { markerOffset: -8, name: "University of Tokyo" },
    { markerOffset: 12, name: "University of Bristol" },
    { markerOffset: -8, name: "University of Amsterdam" },
    { markerOffset: 12, name: "CERN" },
    {  markerOffset: 12, name: "RNP&ANSP&RedCLARA"},
    // U.S. core nodes
    { markerOffset: 8, name: "New York" },
    { markerOffset: -5, name: "Seattle" },
    { markerOffset: -5, name: "Salt Lake City" },
    { markerOffset: 8, name: "Kansas City" },
    { markerOffset: 10, name: "Atlanta" },
    { markerOffset: 8, name: "San Diego" },
    { markerOffset: 8, name: "Dallas" },
    { markerOffset: -8, name: "StarLight" },
    { markerOffset: 8, name: "Washington" },
    { markerOffset: 10, name: "FIU" },
  ],
  edge_nodes: [
    // U.S. edge nodes
    { markerOffset: -3, name: "LBNL" },
    { markerOffset: 6, name: "SRI" },
    { markerOffset: 6, name: "UCSD" },
    { markerOffset: 5, name: "Utah" },
    { markerOffset: -3, name: "GPN" },
    { markerOffset: -3, name: "TACC" },
    { markerOffset: 6, name: "LEARN" },
    { markerOffset: 6, name: "IU" },
    { markerOffset: 6, name: "UKY" },
    { markerOffset: -2, name: "UMich" },
    { markerOffset: -3, name: "NCSA" },
    { markerOffset: -2, name: "GaTech" },
    { markerOffset: 5, name: "Clemson" },
    { markerOffset: 5, name: "MAX" },
    { markerOffset: 5, name: "RENCI" },
    { markerOffset: -2, name: "PSC" },
    { markerOffset: -3, name: "Rutgers" },
    { markerOffset: -2, name: "Princeton" },
    { markerOffset: -2, name: "UMass" },
  ],
  fab_lines: [
    { from: "Seattle", to: "University of Tokyo" },
    { from: "New York", to: "University of Bristol" },
    { from: "New York", to: "University of Amsterdam" },
    { from: "New York", to: "CERN" },
    { from: "RNP&ANSP&RedCLARA", to: "FIU" },
    { from: "Seattle", to: "Salt Lake City" },
    { from: "Seattle", to: "San Diego" },
    { from: "San Diego", to: "Salt Lake City" },
    { from: "San Diego", to: "Dallas" },
    { from: "Salt Lake City" , to: "Kansas City" },
    { from: "Dallas", to: "Atlanta" },
    { from: "Kansas City", to: "StarLight" },
    { from: "Kansas City", to: "Dallas" },
    { from: "StarLight", to: "Atlanta" },
    { from: "StarLight", to: "Washington" },
    { from: "StarLight", to: "New York" },
    { from: "Washington", to: "New York"},
    { from: "Washington", to: "Atlanta"},
    { from: "FIU", to: "Atlanta"},
    // core - edge
    { from: "LBNL",to: "San Diego"},
    { from: "SRI",to: "San Diego"},
    { from: "UCSD",to: "San Diego"},
    { from: "Utah", to: "Salt Lake City" },
    { from: "Kansas City", to: "GPN" },
    { from: "TACC", to: "Dallas" },
    { from: "LEARN", to: "Dallas" },
    { from: "StarLight", to: "IU" },
    { from: "StarLight", to: "UKY" },
    { from: "StarLight", to: "UMich" },
    { from: "StarLight", to: "NCSA" },
    { from: "Clemson", to: "Atlanta"},
    { from: "GaTech", to: "Atlanta"},
    { from: "PSC", to: "Washington" },
    { from: "RENCI", to: "Washington" },
    { from: "MAX", to: "Washington" },
    { from: "Rutgers", to: "New York" },
    { from: "Princeton", to: "New York" },
    { from: "UMass", to: "New York" },
  ],
  usa_lines_super: [
    { from: "StarLight", to:  "Washington" },
    { from: "Dallas", to: "StarLight" },
    { from: "San Diego", to: "Dallas" },
  ]
}