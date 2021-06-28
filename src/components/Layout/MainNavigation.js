//import logo from "./myBankLogo.png";
import logo from "../../icons/banklogo.png";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import {useHistory} from 'react-router-dom';
import classes from "./MainNavigation.module.css";
import AuthContext from "../../store/auth-context";
import { signInPath, signUpPath, profilePath, loanPath} from '../../constants/index'
const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const isLoggedIn = authCtx.isLoggedIn;
  const location = useLocation();
  console.log(location);

  const logoutHandler = () => {
    authCtx.logout();
    history.replace('/');
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <img src={logo} className="App-logo" alt="logo" />
      </Link>
      <nav>
        <ul>
          {((!isLoggedIn) && location.pathname != signInPath) && (
            <li>
              <Link to={signInPath}>Login</Link>
            </li>
          )}
          {((!isLoggedIn) && location.pathname != signUpPath) && (
            <li>
              <Link to={signUpPath}>Open account</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to={profilePath}>Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to={loanPath}>Apply Loan</Link>
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
