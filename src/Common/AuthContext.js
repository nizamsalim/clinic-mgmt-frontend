import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return JSON.parse(token);
    }
    localStorage.setItem("token", JSON.stringify(1000));
    return 1000;
  });

  const generateToken = () => {
    let newToken = `T-${token}`;
    setToken(token + 1);
    localStorage.setItem("token", JSON.stringify(token + 1));
    return newToken;
  };

  const login = (username, userRole, authToken) => {
    setUser({ username, userRole });
    const data = JSON.stringify({ username, userRole });
    localStorage.setItem("user", data);
    localStorage.setItem("auth_token", authToken);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, generateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
