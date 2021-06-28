import { Fragment } from "react";
import SignUpForm from "../components/Auth/SignUpForm";
import TitleBar from "../components/Layout/TitleBar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { signInPath} from '../constants/index';
const SignUpPage = () => {
  const [show, setShow] = useState(false);
  const history = useHistory();
  const handleClose = ()=> {
    history.replace(signInPath);
  }

  const handleUserCreation= (value)=> {
    setShow(value);
  }
  return (
    <Fragment>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Online Banking</Modal.Title>
        </Modal.Header>
        <Modal.Body>Account created successfully!!\n Please login to your account!</Modal.Body>
        <Modal.Footer>
         <Button variant="primary" onClick={handleClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
      <TitleBar title = "Account Opening Form"/>
      <SignUpForm userCreationCallBack={handleUserCreation}/>

    </Fragment>
  );
};
export default SignUpPage;
