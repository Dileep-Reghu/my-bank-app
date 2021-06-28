import { Fragment } from "react";
import TitleBar from "../components/Layout/TitleBar";
import Loans from "../components/Loan/Loans";
const LoanPage = () => {
  return (
    <Fragment>
      <TitleBar title = "Manage Loans"/>
      <Loans />
    </Fragment>
  );;
};

export default LoanPage;
