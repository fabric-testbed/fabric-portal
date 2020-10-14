export const projects = [
  {
    id: 1,
    name: "Project 1",
    description:
      "This is sample project 1. Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.",
    tags: ["tag1", "tag2"],
    project_owners: ["amy", "bob"],
    project_link: "https://fabric-testbed.net/",
    project_creator: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
    ],
    project_lead: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
    ],
    project_members: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
      {
        user_id: 2,
        name: "amy",
        link: "",
      },
    ],
  },
  {
    id: 2,
    name: "Project 2",
    description:
      "This is sample project 2. Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.",
    tags: ["tag2", "tag3"],
    project_owners: ["amy", "bob"],
    project_link: "https://fabric-testbed.net/",
    project_creator: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
    ],
    project_lead: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
    ],
    project_members: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
      {
        user_id: 2,
        name: "amy",
        link: "",
      },
    ],
  },
  {
    id: 3,
    name: "Project 3",
    description:
      "This is sample project 3. Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.",
    tags: ["tag1", "tag3"],
    project_owners: ["bob", "david"],
    project_link: "https://fabric-testbed.net/",
    project_creator: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
    ],
    project_lead: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
    ],
    project_members: [
      {
        user_id: 1,
        name: "bob",
        link: "",
      },
      {
        user_id: 2,
        name: "amy",
        link: "",
      },
    ],
  },
];

export function getProjects() {
  return projects;
}

export function getProject(id) {
  return projects.find((p) => p.id === id);
}
