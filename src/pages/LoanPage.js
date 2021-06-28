import { Fragment } from "react";
import TitleBar from "../components/Layout/TitleBar";
import LoanForm from "../components/Loan/LoanForm";
const LoanPage = () => {
  return (
    <Fragment>
      <TitleBar title = "Apply Loan Form"/>
      <LoanForm />
    </Fragment>
  );;
};

export default LoanPage;
