import React, { useState } from "react";
const AuthContext = React.createContext({
  userData: { token: "", userId: "" },
  isLoggedIn: false,
  login: (value) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [userData, setUserData] = useState({});
  const userIsLoggedIn = !!userData.token;
  const loginHandler = (value) => {
    setUserData(value);
  };
  const logoutHandler = () => {
    setUserData({});
  };

  const contextValue = {
    userData: userData,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
