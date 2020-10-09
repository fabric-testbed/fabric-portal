export const userInfo = {
  user_id: 999,
  first_name: "Yaxue",
  last_name: "Guo",
  full_name: "Yaxue Guo",
  email: "yaxueguo@renci.org",
  affliation: "University of North Carolina at Chapel Hill",
  cilogon_id: "26542073",
  eppn: "yaxue@unc.edu",
  global_roles: ["Project Lead", "Facility Operator"],
  project_roles: [{ role: "", project_id: 123 }],
};

export function getUserInfo() {
  return userInfo;
}
