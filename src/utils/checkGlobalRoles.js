
export default function checkGlobalRoles(user) {
  const globalRoles = {
    isProjectAdmin: false,
    isFacilityOperator: false,
    isActiveUser: false,
    isJupterhubUser: false,
  };

  if(!user) {
    return globalRoles;
  }
  
  for (const role of user.roles){
    if(role.name === "project-admins") {
      globalRoles.isProjectAdmin = true;
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