import React, { createContext, useState, useEffect } from "react";

import { isAuth, getLoggedUsername, getLoggedEmail, isAdministrator, logout, login } from "../services/auth";

const Context = createContext();

function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(isAuth());
  const [, setUserName] = useState("");
  const [, setUserEmail] = useState("");

  const [, setAdminFlag] = useState(false);

  const isAuthenticated = () => {
    return authenticated;
  };

  const isAdmin = () => {
    const admin = isAdministrator();
    if(admin === "true"){
      setAdminFlag(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    setUserName("");
    setUserEmail("");
    setAdminFlag(false);
    setAuthenticated(false);
  };

  const handleLogin = (auth) => {
    login(auth);
    setUserName(auth.username);
    setUserEmail(auth.email);
    setAuthenticated(true);
    if (auth.isAdmin) {
      setAdminFlag(true);
    }
    console.log(auth);

  };

  const getUser = () => {
    return getLoggedUsername();
  }

  const getEmail = () => {
    return getLoggedEmail();
  }

  /* Verifica se o usuário já está logado */
  useEffect(() => {
    setAuthenticated(isAuth());
    console.log("Infos: ", getEmail(), getUser(), isAdmin());
  }, []);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        isAdmin,
        handleLogin,
        handleLogout,
        setAdminFlag,
        getUser,
        getEmail,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
