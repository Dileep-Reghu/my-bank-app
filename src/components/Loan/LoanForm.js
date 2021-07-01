import React, { useState, useReducer, useContext } from "react";
import AuthContext from "../../store/auth-context";
import Form from "react-bootstrap/Form";
import Select from "react-select";

import classes from "./LoanForm.module.css";
import firebase from "../../firebase";

const alertWarningReducer = (state, action) => {
  return { message: action.message, showWarning: action.show };
};
const LoanForm = () => {
  const authCtx = useContext(AuthContext);
  const initialAlertState = { message: "", showWarning: false };
  const [alertWarning, dispatchAlertWarning] = useReducer(
    alertWarningReducer,
    initialAlertState
  );

  const initialValues = {
    loanType: null,
    loanTenure: "0",
    loanAmount: "0",
    loanStatus: "Draft",
  };
  const [loanDetails, setLoanDetails] = useState(initialValues);
  const options = [
    { value: "Personal", label: "Personal" },
    { value: "Home", label: "Home" },
    { value: "Car", label: "Car" },
  ];

  

  const handleSelectionChange = (event) => {
    var { label, value } = event;
    console.log(label + ":" + value);
    setLoanDetails({
      ...loanDetails,
      loanType: value,
    });
  };
  const handleInputChange = (event) => {
    var { name, value } = event.target;
    console.log(name + ":" + value);
    setLoanDetails({
      ...loanDetails,
      [name]: value,
    });
  };

  const applyLoan = (obj) => {
    const firebaseDb = firebase.database().ref('/loans');
    firebaseDb.push(obj, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Loan applied");
        setLoanDetails(initialValues);
      }
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (loanDetails.loanType == null) {
      dispatchAlertWarning({
        message: "Please select loan type.",
        show: true,
      });
      return;
    }

    if (
      loanDetails.loanAmount !== null &&
      !parseInt(loanDetails.loanAmount) > 0
    ) {
      dispatchAlertWarning({
        message: "Please enter a valid amount.",
        show: true,
      });
      return;
    }

    if (
      loanDetails.loanTenure !== null &&
      !parseInt(loanDetails.loanTenure) > 0
    ) {
      dispatchAlertWarning({
        message: "Please enter a valid tenure.",
        show: true,
      });
      return;
    }
    //if all conditions satisfied - set show warning false
    dispatchAlertWarning({ message: "", show: false });
    const loan = {
      ...loanDetails,
      userId: authCtx.userData.userId,
    };
    applyLoan(loan);
  };
  return (
    <section className={classes.loan}>
      {alertWarning.showWarning && (
        <h6 className={classes.warning}>{alertWarning.message}</h6>
      )}
      <Form className={classes.control} onSubmit={submitHandler}>
        <Form.Group controlId="grpLoanType" className={classes["row-align"]}>
          <Form.Label className={`${classes.label} ${classes.left}`}>
            Loan Type<span className={classes.span}>*</span>
          </Form.Label>

          <Select
            id="laonType"
            name="loanType"
            className={classes.select}
            defaultValue={loanDetails.loanType}
            onChange={handleSelectionChange}
            options={options}
          />
        </Form.Group>

        <Form.Group controlId="grpLoanAmount" className={classes["row-align"]}>
          <Form.Label className={`${classes.label} ${classes.left}`}>
            Amount<span className={classes.span}>*</span>
          </Form.Label>
          <Form.Control
            value={loanDetails.loanAmount}
            type="text"
            name="loanAmount"
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="grpLoanTenure" className={classes["row-align"]}>
          <Form.Label className={`${classes.label} ${classes.left}`}>
            Tenure (months)<span className={classes.span}>*</span>
          </Form.Label>
          <Form.Control
            value={loanDetails.loanTenure}
            type="text"
            name="loanTenure"
            onChange={handleInputChange}
          />
        </Form.Group>

        <div className={classes.actions}>
          <button>Apply Loan</button>
        </div>
      </Form>
    </section>
  );
};

export default LoanForm;
