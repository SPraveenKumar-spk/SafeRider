import { createContext, useContext, useState } from "react";
import { ToastProvider } from "./ToastContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseURL = " http://127.0.0.1:5000";

  const [access_token, setToken] = useState(
    sessionStorage.getItem("access_token")
  );
  const [userRole, setRole] = useState(sessionStorage.getItem("access_role"));
  const storeToken = (access_token) => {
    sessionStorage.setItem("access_token", access_token);
    setToken(access_token);
  };

  const storeRole = (role) => {
    sessionStorage.setItem("access_role", role);
    setRole(role);
  };
  const LogoutUser = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("access_role");
    setToken(null);
  };

  const isLoggedIn = !!access_token;

  return (
    <AuthContext.Provider
      value={{
        storeRole,
        storeToken,
        LogoutUser,
        baseURL,
        userRole,
        isLoggedIn,
        access_token,
      }}
    >
      <ToastProvider>{children}</ToastProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(AuthContext);
  if (!contextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return contextValue;
};
