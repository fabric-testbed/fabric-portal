import React from "react";
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  return (
    localStorage.getItem("userStatus") !== "active" ? <Outlet/> : <Navigate to='/'/>
  )
};

export default ProtectedRoutes;
