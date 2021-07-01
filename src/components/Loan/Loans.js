import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../store/auth-context";
import LoanForm from "../../components/Loan/LoanForm";
import classes from "./LoanForm.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

//import firebaseDb from "../../firebase";
import firebase from "../../firebase";

const Loans = () => {
  const authCtx = useContext(AuthContext);
  const [listLoans, setListLoans] = useState({});

  useEffect(() => {
    const firebaseDb = firebase.database().ref('/loans');
    firebaseDb
      .orderByChild("userId")
      .equalTo(authCtx.userData.userId)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          setListLoans({
            ...snapshot.val(),
          });
        }
      });
  }, [authCtx.userData.userId]);

  return (
    <Container>
      <Row>
        <Col md={4}>
          <LoanForm />
        </Col>
        <Col md={8}>
          {listLoans && Object.keys(listLoans).length > 0 && (
            <div className={classes.loan}>
              <Table striped bordered >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(listLoans).map((id, index) => {
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{listLoans[id].loanType}</td>
                        <td>{listLoans[id].loanAmount}</td>
                        <td>{listLoans[id].loanTenure}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Loans;
