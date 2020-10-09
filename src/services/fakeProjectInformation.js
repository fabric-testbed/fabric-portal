export const projects = [
  {
    id: 1,
    name: "Sample Project 1",
    description: "This is sample project 1.",
    tags: ["tag1", "tag2"],
    profile_link: "",
    project_owners: ["amy", "bob"],
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
    name: "Sample Project 2",
    description: "This is sample project 2.",
    tags: ["tag2", "tag3"],
    profile_link: "",
    project_owners: ["amy", "bob"],
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
    name: "Sample Project 3",
    description: "This is sample project 3.",
    tags: ["tag1", "tag3"],
    profile_link: "",
    project_owners: ["bob", "david"],
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
