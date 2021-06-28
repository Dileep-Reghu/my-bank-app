import { useRef, useState, useReducer } from "react";
import { signUpAPI } from "../../constants/index";
import useHttp from "../../hooks/use-http";
import classes from "./SignUpForm.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faKey,
  faAddressCard,
  faCalendar,
  faIdCard,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

import firebaseDb from "../../firebase";


const alertWarningReducer = (state, action) => {
  return { message: action.message, showWarning: action.show };
};

const SignUpForm = (props) => {
  const colWidth = 3;
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const userNameRef = useRef();
  const addressRef = useRef();
  const idCardRef = useRef();
  const mobileRef = useRef();

  const [dobDate, setDOBDate] = useState(new Date());
  const [gender, setGender] = useState("M");
  const [accountType, setAccountType] = useState(null);
  const initialAlertState = { message: "", showWarning: false };
  const [alertWarning, dispatchAlertWarning] = useReducer(
    alertWarningReducer,
    initialAlertState
  );

  const { isLoading, error, sendRequest: signUpUser } = useHttp();

  const options = [
    { value: "SA", label: "Savings" },
    { value: "CA", label: "Current" },
    { value: "RD", label: "Recurring Deposit" },
    { value: "FD", label: "Fixed Deposit" },
  ];

  const createUser = (obj) => {
    firebaseDb.child("users").push(obj, (err) => {
      if (err) {
        console.log(err);
      } else {
        props.userCreationCallBack(true);
      }
    });
  };
  const signUpUserCallback = (response) => {
    console.log(response);
    createUser({
      userId: response.localId,
      userName: userNameRef.current.value,
      accountType: accountType.value,
      userDOB: dobDate.toUTCString(),
      userGender: gender,
      userPhone: mobileRef.current.value,
      userAddress: addressRef.current.value,
      userIdCardNumber: idCardRef.current.value,
    });
  };

  const genderOnChangeValue = (event) => {
    console.log(event.target.value);
    setGender(event.target.value);
  };

  const dobOnChangeValue = (date) => {
    console.log(date);
    setDOBDate(date);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    //console.log(dobDate.toUTCString());
    if (accountType == null) {
      dispatchAlertWarning({
        message: "Please select account type.",
        show: true,
      });
      return;
    }
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;
    if (enteredPassword.length < 6) {
      dispatchAlertWarning({
        message: "Password length should be 6 or greater.",
        show: true,
      });
      return;
    }
    if (enteredPassword !== enteredConfirmPassword) {
      dispatchAlertWarning({
        message: "Password entered and confirmed are not same.",
        show: true,
      });
      return;
    }
    //if all conditions satisfied - set show warning false
    dispatchAlertWarning({ message: "", show: false });

    const reqConf = {
      url: signUpAPI,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      },
    };

    signUpUser(reqConf, signUpUserCallback);
  };

  return (
    <section className={classes.auth}>
      {error && !alertWarning.showWarning && (
        <h6 className={classes.error}>Registration Failed!</h6>
      )}
      {alertWarning.showWarning && (
        <h6 className={classes.warning}>{alertWarning.message}</h6>
      )}
      <Form onSubmit={submitHandler}>
        <Container id="account">
          {/** ACCOUNT TYPE*/}
          <Row className={classes["row-align"]}>
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="accountType"
                >
                  Account Type <span className={classes.span}>*</span>
                </label>
              </div>
            </Col>
            <Col md={4}>
              <Select
                id="accountType"
                required
                className={classes.select}
                defaultValue={accountType}
                onChange={setAccountType}
                options={options}
              />
            </Col>
          </Row>
          {/** USER NAME*/}
          <Row className={classes["row-align"]}>
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="username"
                >
                  Full Name <span className={classes.span}>*</span>
                </label>
              </div>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faUser} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="username"
                  required
                  placeholder=""
                  aria-label="Username"
                  aria-describedby="account username"
                  ref={userNameRef}
                />
              </InputGroup>
            </Col>
          </Row>
          {/** EMAIL*/}
          <Row className={classes["row-align"]}>
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="email"
                >
                  Email <span className={classes.span}>*</span>
                </label>
              </div>
            </Col>
            <Col>
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
            </Col>
          </Row>
          {/** PASSWORD*/}
          <Row className={classes["row-align"]}>
            {/** PASSWORD*/}
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="password"
                >
                  Password <span className={classes.span}>*</span>
                </label>
              </div>
            </Col>
            <Col>
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
            </Col>
            {/** CONFIRM PASSWORD*/}
            <Col md={1}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="confirmPassword"
                >
                  Confirm
                </label>
              </div>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faKey} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="password"
                  id="confirmPassword"
                  required
                  placeholder=""
                  aria-label="Confirm"
                  aria-describedby="account confirmpassword"
                  ref={confirmPasswordRef}
                />
              </InputGroup>
            </Col>
          </Row>
          {/** GENDER and ID CARD NUMBER*/}
          <Row className={classes["row-align"]}>
            {/** ID CARD NUMBER*/}
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="idCard"
                >
                  ID Card Number
                </label>
              </div>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faIdCard} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="idCard"
                  placeholder=""
                  aria-label="idCard"
                  aria-describedby="account idCard"
                  ref={idCardRef}
                />
              </InputGroup>
            </Col>

            <Col md={1}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="gender"
                >
                  Gender
                </label>
              </div>
            </Col>
            <Col>
              <InputGroup className={classes["radio"]}>
                <Form.Check
                  inline
                  label="Male"
                  name="group1"
                  type="radio"
                  id="gender"
                  value="M"
                  checked={gender === "M"}
                  onChange={genderOnChangeValue}
                />
                <Form.Check
                  inline
                  label="Female"
                  name="group1"
                  type="radio"
                  id="gender"
                  value="F"
                  checked={gender === "F"}
                  onChange={genderOnChangeValue}
                />
              </InputGroup>
            </Col>
          </Row>
          {/** DOB  & MOBILE*/}
          <Row className={classes["row-align"]}>
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="dob"
                >
                  Date of Birth <span className={classes.span}>*</span>
                </label>
              </div>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faCalendar} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    autoOk
                    variant="inline"
                    openTo="year"
                    views={["year", "month", "date"]}
                    format="dd/MM/yyyy"
                    disableFuture={true}
                    value={dobDate}
                    onChange={dobOnChangeValue}
                    className={classes["picker"]}
                  />
                </MuiPickersUtilsProvider>
              </InputGroup>
            </Col>
            {/**MOBILE*/}
            <Col md={1}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="mobile"
                >
                  Mobile
                </label>
              </div>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faMobileAlt} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="mobile"
                  placeholder=""
                  aria-label="mobile"
                  aria-describedby="account mobile"
                  ref={mobileRef}
                />
              </InputGroup>
            </Col>
          </Row>
          {/** ADDRESS*/}
          <Row className={classes["row-align"]}>
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="address"
                >
                  Address
                </label>
              </div>
            </Col>
            <Col>
              <InputGroup className={classes["textarea"]}>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faAddressCard} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  as="textarea"
                  aria-label="account address"
                  ref={addressRef}
                />
              </InputGroup>
            </Col>
          </Row>
        </Container>
        <div className={classes.actions}>
          {isLoading ? <LoadingSpinner /> : <button>Submit</button>}
        </div>
      </Form>
    </section>
  );
};

export default SignUpForm;
