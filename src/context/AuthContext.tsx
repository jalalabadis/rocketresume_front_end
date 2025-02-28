// import React, { createContext, useContext, useState } from "react";
// import BASE_URL from "../config/baseUrl";
// export interface User {
//   id: string;
//   email: string;
//   name?: string;
//   role?: string;
// }

// export interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string) => Promise<void>; // Required by interface
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/users/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       console.log("Login response data:", data); // Debugging log

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       if (data.status === "Success") {
//         setIsAuthenticated(true);
//         const userData = {
//           id: data.userID,
//           email: data.email,
//           name: data.name,
//           role: data.role,
//         };
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData)); // Persist user data
//         console.log("User set in context:", userData); // Debugging log
//       } else {
//         throw new Error(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error); // Debugging log
//       throw error;
//     }
//   };

//   const signup = async (email: string, password: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/users/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setIsAuthenticated(true);
//         setUser({
//           id: data.userID,
//           email: data.email,
//           name: data.name,
//           role: data.role,
//         });
//       } else {
//         throw new Error(data.message || "Signup failed");
//       }
//     } catch (error) {
//       throw new Error("Signup request failed");
//     }
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, user, login, signup, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from "react";
import BASE_URL from "../config/baseUrl";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Session duration (1 day in milliseconds)
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem("user");
      const sessionExpiry = localStorage.getItem("sessionExpiry");

      if (storedUser && sessionExpiry) {
        const remainingTime = Number(sessionExpiry) - Date.now();

        if (remainingTime > 0) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          setLogoutTimer(setTimeout(logout, remainingTime));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("sessionExpiry");
        }
      }
    };

    checkSession();
  }, []);

  const startLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    const timer = setTimeout(logout, SESSION_DURATION);
    setLogoutTimer(timer);
    localStorage.setItem(
      "sessionExpiry",
      String(Date.now() + SESSION_DURATION)
    );
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.status === "Success") {
        const userData = {
          id: data.userID,
          email: data.email,
          name: data.name,
          role: data.role,
        };

        // Store user data and session expiry
        localStorage.setItem("user", JSON.stringify(userData));
        startLogoutTimer();

        // Update state
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      const userData = {
        id: data.userID,
        email: data.email,
        name: data.name,
        role: data.role,
      };

      // Store user data and session expiry
      localStorage.setItem("user", JSON.stringify(userData));
      startLogoutTimer();

      // Update state
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      throw new Error("Signup request failed");
    }
  };

  const logout = () => {
    // Clear all session data
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiry");
    if (logoutTimer) clearTimeout(logoutTimer);

    // Reset state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
