import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoanPage from "./pages/LoanPage";
import AuthContext from "./store/auth-context";
import {
  signInPath,
  signUpPath,
  profilePath,
  loanPath,
} from "./constants/index";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path={signInPath}>
            <AuthPage />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path={signUpPath}>
            <SignUpPage />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path={profilePath}>
            <UserProfile />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path={loanPath}>
            <LoanPage />
          </Route>
        )}
        <Route path='*'>
            <Redirect to='/'/>
          </Route>
      </Switch>
    </Layout>
  );
}

export default App;
