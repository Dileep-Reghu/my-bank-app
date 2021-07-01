//import logo from "./myBankLogo.png";
import logo from "../../icons/banklogo.png";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import AuthContext from "../../store/auth-context";
import {
  homePath,
  signInPath,
  signUpPath,
  profilePath,
  loanPath,
} from "../../constants/index";
const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    history.replace("/");
  };

  return (
    <header className={classes.header}>
      <NavLink activeClassName={classes.inactive} to={homePath}>
        <img src={logo} className="App-logo" alt="logo" />
      </NavLink>
      <nav>
        <ul>
          <li>
            <NavLink activeClassName={classes.active} to={homePath} exact>Home</NavLink>
          </li>
          {!isLoggedIn && (
            <li>
              <NavLink activeClassName={classes.active} to={signInPath}>Login</NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink activeClassName={classes.active} to={signUpPath}>Open account</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <NavLink activeClassName={classes.active} to={profilePath}>Profile</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <NavLink activeClassName={classes.active} to={loanPath}>Apply Loan</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
