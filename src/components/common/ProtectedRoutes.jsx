import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {
  const location = useLocation();
  if (location.pathname === "/experiments") {
    return (<Navigate to='/public-projects'/>)
  } else {
    return (
      localStorage.getItem("userStatus") === "active" ? <Outlet/> : <Navigate to='/login-required'/>
    )
  }
};

export default ProtectedRoutes;
