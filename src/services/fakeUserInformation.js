export const userInfo = {
  user_id: 999,
  first_name: "Yaxue",
  last_name: "Guo",
  full_name: "Yaxue Guo",
  email: "yaxueguo@renci.org",
  affliation: "University of North Carolina at Chapel Hill",
  cilogon_id: "http://cilogon.org/serverT/users/26542073",
  eppn: "yaxue@unc.edu",
  global_roles: { is_project_lead: true, is_facility_operator: true },
  project_roles: [
    { project_id: 1, is_project_member: true, is_project_owner: false },
    { project_id: 3, is_project_member: true, is_project_owner: true },
  ],
};

export function getUserInfo() {
  return userInfo;
}
