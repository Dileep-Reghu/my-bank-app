import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { signInAPI } from "../../constants/index";
import classes from "./AuthForm.module.css";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import AuthContext from "../../store/auth-context";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

import firebaseDb from "../../firebase";

const AuthForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest: signInUser } = useHttp();

  const fetchUser = (obj) => {
    firebaseDb
      .child("users")
      .orderByChild("userId")
      .equalTo(obj.userId)
      .on("value", (snapshot) => {
        var snap = snapshot.val();
        var key = Object.keys(snap);
        var custdata = snap[key];
        var uId = snap[key].userId;

        if (custdata.userId === uId) {
          console.log("Fetch User");
          console.log(custdata);
          authCtx.login({
            ...obj,userName:custdata.userName
          })
          history.replace("/");
        }
      });
  };

  const signInUserCallback = (response) => {
    console.log(response);
    fetchUser({
      token: response.idToken,
      userId: response.localId,
    });
    //authCtx.login({ token: response.idToken, userId: response.localId });
    //history.replace("/");
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    const reqConf = {
      url: signInAPI,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      },
    };

    signInUser(reqConf, signInUserCallback);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={7} className={classes["parallax-window"]}>
          <div
            className={`${classes["tm-bg-white-transparent"]} ${classes["tm-welcome-container"]}`}
          >
            <div className={`${classes["tm-welcome-left"]}`}>
              <h2 className={`${classes["tm-welcome-title"]}`}>
                Log in to your account
              </h2>
              <p className={`${classes["pb-0"]}`}>
                Online banking is quick, convenient and secure. Log on and
                manage your accounts whenever you want, wherever you are.{" "}
              </p>
            </div>
          </div>
        </Col>
        <Col>
          <section className={classes.auth}>
            {error && <h6 className="warning">Login Failed!</h6>}
            <Form onSubmit={submitHandler}>
              <div className={classes.control}>
                <label htmlFor="email">Email address</label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text className={classes["icon-align"]}>
                      <FontAwesomeIcon icon={faEnvelope} size="1x" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="email"
                    id="email"
                    required
                    placeholder=""
                    aria-label="Email"
                    aria-describedby="account email"
                    ref={emailRef}
                  />
                </InputGroup>
              </div>
              <div className={classes.control}>
                <label htmlFor="password">Password</label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text className={classes["icon-align"]}>
                      <FontAwesomeIcon icon={faKey} size="1x" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="password"
                    id="password"
                    required
                    placeholder=""
                    aria-label="Password"
                    aria-describedby="account password"
                    ref={passwordRef}
                  />
                </InputGroup>
              </div>
              <div className={classes.actions}>
                {isLoading ? <LoadingSpinner /> : <button>Login</button>}
              </div>
            </Form>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
