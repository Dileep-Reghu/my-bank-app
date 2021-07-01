import classes from "./ProfileForm.module.css";
import { useRef, useState, useReducer, useEffect, useMemo } from "react";
import { updateAPI } from "../../constants/index";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import Select from "react-select";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faAddressCard,
  faCalendar,
  faIdCard,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

import firebase from "../../firebase";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";

const alertWarningReducer = (state, action) => {
  return { message: action.message, showWarning: action.show };
};

const ProfileForm = (props) => {
  const colWidth = 3;
  const authCtx = useContext(AuthContext);
  const isEditing = props.isEditing;

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const initialAlertState = { message: "", showWarning: false };
  const [alertWarning, dispatchAlertWarning] = useReducer(
    alertWarningReducer,
    initialAlertState
  );

  const { isLoading, error, sendRequest: updateUserPassword } = useHttp();

  const options = useMemo(() => {
    return [
      { value: "SA", label: "Savings" },
      { value: "CA", label: "Current" },
      { value: "RD", label: "Recurring Deposit" },
      { value: "FD", label: "Fixed Deposit" },
    ];
  }, []);

  const initialValues = {
    accountType: "",
    userAddress: "",
    userDOB: "",
    userGender: "",
    userId: "",
    userIdCardNumber: "",
    userName: "",
    userPhone: "",
    key: "",
  };

  const [userData, setUserData] = useState(initialValues);

  useEffect(() => {
    const firebaseDb = firebase.database().ref('/users');
    firebaseDb
      .orderByChild("userId")
      .equalTo(authCtx.userData.userId)
      .on("value", (snapshot) => {
        var snap = snapshot.val();
        var key = Object.keys(snap);
        var custdata = snap[key];
        var uId = snap[key].userId;
        if (authCtx.userData.userId === uId) {
          const atIndex = custdata.accountType
            ? options.findIndex((x) => x.value === custdata.accountType)
            : -1;
          setUserData({
            ...custdata,
            accountType: atIndex >= 0 && options[atIndex],
            userDOB: new Date(custdata.userDOB).toString(),
            key: key,
          });
        }
      });
  }, [authCtx.userData.userId, options, isEditing]);

  const handleSelectionChange = (event) => {
    setUserData({
      ...userData,
      accountType: {...event},
    });
  };

  const handleInputChange = (event) => {
    var { name, value } = event.target;
    console.log(name + ":" + value);
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const genderOnChangeValue = (event) => {
    setUserData({
      ...userData,
      userGender: event.target.value,
    });
  };

  const dobOnChangeValue = (date) => {
    setUserData({
      ...userData,
      userDOB: date,
    });
  };

  const createUser = (obj) => {
    const firebaseDb = firebase.database().ref('/users');
    firebaseDb.push(obj, (err) => {
      if (err) {
        console.log(err);
      } else {
        cancelClickHandler();
      }
    });
  };

  const updateUser = (obj) => {
    const firebaseDb = firebase.database().ref(`/users`);
    firebaseDb.child(`${userData.key}`).set(obj, (err) => {
      if (err) {
        console.log(err);
      } else {
        props.updateEditStatus(false);
      }
    });
  };

  const addUpdateUser = () => {
    const userObj = {
      userId: authCtx.userData.userId,
      userName: userData.userName,
      accountType: userData.accountType.value,
      userDOB: new Date(userData.userDOB).toUTCString(),
      userGender: userData.userGender,
      userPhone: userData.userPhone,
      userAddress: userData.userAddress,
      userIdCardNumber: userData.userIdCardNumber,
    }
    if (userData.key === "") {
      createUser({
        ...userObj,
      });
    }else{
      updateUser({
        ...userObj,
      })
    }
  }

  const updateUserPasswordCallback = (response) => {
    addUpdateUser();
  };

  const profileSubmitHandler = (event) => {
    event.preventDefault();
    if (userData.accountType == null) {
      dispatchAlertWarning({
        message: "Please select account type.",
        show: true,
      });
      return;
    }

    const enteredPassword = passwordRef.current.value;
    let isPassordUpdateReq = false;
    if (enteredPassword.length > 0) {
      if (enteredPassword.length < 6) {
        dispatchAlertWarning({
          message: "Password length should be 6 or greater.",
          show: true,
        });
        return;
      }
      const enteredConfirmPassword = confirmPasswordRef.current.value;
      if (enteredPassword !== enteredConfirmPassword) {
        dispatchAlertWarning({
          message: "Password entered and confirmed are not same.",
          show: true,
        });
        return;
      }
      isPassordUpdateReq = true;
    }
    //if all conditions satisfied - set show warning false
    dispatchAlertWarning({ message: "", show: false });

    if (isPassordUpdateReq) {
      const reqConf = {
        url: updateAPI,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          idToken: authCtx.userData.token,
          password: enteredPassword,
          returnSecureToken: true,
        },
      };
      updateUserPassword(reqConf, updateUserPasswordCallback);
    } else {
      addUpdateUser();
    }
  };

  const cancelClickHandler = () => {
    dispatchAlertWarning({ message: "", show: false });
    props.updateEditStatus(false);
  };

  return (
    <section>
    <Form onSubmit={profileSubmitHandler}>
      {error && !alertWarning.showWarning && (
        <h6 className={classes.error}>Password updation failed!</h6>
      )}
      {alertWarning.showWarning && (
        <h6 className={classes.warning}>{alertWarning.message}</h6>
      )}
      <Container id="account">
        {/** ACCOUNT TYPE*/}
        <Row className={classes["row-align"]}>
          <Col md={colWidth}>
            <div className={classes.control}>
              <label
                className={`${classes.label} ${classes.left}`}
                htmlFor="accountType"
              >
                Account Type{" "}
                {isEditing && <span className={classes.span}>*</span>}
              </label>
            </div>
          </Col>
          <Col md={4}>
            {isEditing && (
              <Select
                id="accountType"
                className={classes.select}
                defaultValue={userData.accountType}
                onChange={handleSelectionChange}
                options={options}
              />
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {userData.accountType !== "" && userData.accountType.label}
                </label>
              </div>
            )}
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
                Full Name {isEditing && <span className={classes.span}>*</span>}
              </label>
            </div>
          </Col>
          <Col>
            {isEditing && (
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
                  defaultValue={userData.userName}
                  name="userName"
                  onChange={handleInputChange}
                />
              </InputGroup>
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {userData.userName}
                </label>
              </div>
            )}
          </Col>
        </Row>
        {/** PASSWORD*/}
        {isEditing && (
          <Row className={classes["row-align"]}>
            {/** PASSWORD*/}
            <Col md={colWidth}>
              <div className={classes.control}>
                <label
                  className={`${classes.label} ${classes.left}`}
                  htmlFor="password"
                >
                  Password
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
                  placeholder=""
                  aria-label="Confirm"
                  aria-describedby="account confirmpassword"
                  ref={confirmPasswordRef}
                />
              </InputGroup>
            </Col>
          </Row>
        )}
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
            {isEditing && (
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
                  defaultValue={userData.userIdCardNumber}
                  name="userIdCardNumber"
                  onChange={handleInputChange}
                />
              </InputGroup>
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {userData.userIdCardNumber}
                </label>
              </div>
            )}
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
            {isEditing && (
              <InputGroup className={classes["radio"]}>
                <Form.Check
                  inline
                  label="Male"
                  name="group1"
                  type="radio"
                  id="gender1"
                  value="M"
                  checked={userData.userGender === "M"}
                  onChange={genderOnChangeValue}
                />
                <Form.Check
                  inline
                  label="Female"
                  name="group1"
                  type="radio"
                  id="gender2"
                  value="F"
                  checked={userData.userGender === "F"}
                  onChange={genderOnChangeValue}
                />
              </InputGroup>
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {userData.userGender &&
                    (userData.userGender === "M" ? "Male" : "Female")}
                </label>
              </div>
            )}
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
                Date of Birth{" "}
                {isEditing && <span className={classes.span}>*</span>}
              </label>
            </div>
          </Col>
          <Col md={4}>
            {isEditing && (
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
                    value={userData.userDOB}
                    onChange={dobOnChangeValue}
                    className={classes["picker"]}
                  />
                </MuiPickersUtilsProvider>
              </InputGroup>
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {new Date(userData.userDOB).toLocaleDateString()}
                </label>
              </div>
            )}
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
            {isEditing && (
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
                  defaultValue={userData.userPhone}
                  name="userPhone"
                  onChange={handleInputChange}
                />
              </InputGroup>
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {userData.userPhone}
                </label>
              </div>
            )}
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
            {isEditing && (
              <InputGroup className={classes["textarea"]}>
                <InputGroup.Prepend>
                  <InputGroup.Text className={classes["icon-align"]}>
                    <FontAwesomeIcon icon={faAddressCard} size="1x" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  as="textarea"
                  aria-label="account address"
                  defaultValue={userData.userAddress}
                  name="userAddress"
                  onChange={handleInputChange}
                />
              </InputGroup>
            )}
            {!isEditing && (
              <div className={classes.control}>
                <label className={`${classes.labelnormal} ${classes.left}`}>
                  {userData.userAddress}
                </label>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      {isEditing && (
        <div className={classes.actions}>
          {isLoading ? <LoadingSpinner /> : <button>Save</button>}
          {
            <Button
              className={classes.leftmargin}
              variant="outline-danger"
              onClick={cancelClickHandler}
            >
              Cancel
            </Button>
          }
        </div>
      )}
    </Form>
    </section>
  );
};

export default ProfileForm;
