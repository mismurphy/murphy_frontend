import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/token-validation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(response.ok);
      if (!response.ok) localStorage.removeItem("authToken");
    } catch (err) {
      console.error("Token validation failed:", err);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};




// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem("authToken");
//       if (token) {
//         try {
//           const response = await fetch("http://localhost:5000/api/auth/token-validation", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               authorization: `Bearer ${token}`,
//             },
//           });
//           if (response.ok) {
//             const storedUser = localStorage.getItem("user");
//             if (storedUser) setUser(JSON.parse(storedUser));
//           } else {
//             localStorage.removeItem("user");
//             localStorage.removeItem("authToken");
//           }
//         } catch {
//           localStorage.removeItem("user");
//           localStorage.removeItem("authToken");
//         }
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = (userData, token) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("authToken", token);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuthContext must be used within AuthProvider");
//   return context;
// };
