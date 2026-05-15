import React, { useState, createContext } from "react";

const ContextAuthentication = createContext({});

export const AuthProvider = ({ children }) => {
  const [valueForAuth, setValueForAuth] = useState(() => {
    return {
      'username': localStorage.getItem('username')
    }
  });
  return (
    <ContextAuthentication.Provider value={{ valueForAuth, setValueForAuth }}>
      {children}
    </ContextAuthentication.Provider>
  );
};

export default ContextAuthentication;
