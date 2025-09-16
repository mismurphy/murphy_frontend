import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated, loading, validateToken, logout } = useAuthContext();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      setChecking(true);
      await validateToken();
      setChecking(false);
    };
    check();
  }, []);
// location.pathname, validateToken
  if (loading || checking) return <div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;


  return <Outlet />;
}






// import { useState, useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import Protected from "./Protected";

// export default function ProtectedRoute() {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const valid = await Protected();
//       setIsAuthenticated(valid);
//     };
//     checkAuth();
//   }, []);

//   if (isAuthenticated === null) {
//     return <div>Loading...</div>; // or a spinner
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuthContext } from "../context/AuthContext";

// export default function ProtectedRoute() {
//   const { isAuthenticated, loading } = useAuthContext();


//   if (loading) return <div>Loading...</div>; 

//    console.log("Authenticated", isAuthenticated)
//   if (!isAuthenticated) return <Navigate to="/login" replace />;

//   return <Outlet />; 
// }

