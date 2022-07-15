
export default function checkGlobalRoles(user) {
  const globalRoles = {
    isProjectLead: false,
    isFacilityOperator: false,
    isActiveUser: false,
    isJupterhubUser: false,
  };
  
  for (const role of user){
    if(role.name === "project-leads") {
      globalRoles.isProjectLead = true;
    }
    
    if(role.name === "facility-operators") {
      globalRoles.isFacilityOperator = true;
    }

    if(role.name === "fabric-active-users") {
      globalRoles.isActiveUser = true;
    }

    if(role.name === "Jupyterhub") {
      globalRoles.isJupterhubUser = true;
    }
  }

  return globalRoles;
}