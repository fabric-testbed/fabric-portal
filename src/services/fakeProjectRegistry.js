export const projects = [
  {
    id: 1,
    name: "",
    description: "",
    tags: ["", ""],
    profile_link: "",
    project_owners: [
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
