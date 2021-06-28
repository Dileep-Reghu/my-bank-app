import classes from "./StartingPageContent.module.css";
import { Link } from "react-router-dom";
import { signInPath, signUpPath, loanPath } from "../../constants/index";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import walletImg from "../../img/wallet.jpg";
import homeloanImg from "../../img/homeloan.jpg";
import carloanImg from "../../img/carloan.jpg";
import creditCardImg from "../../img/creditcard.jpg";

const StartingPageContent = () => {
  const authCtx = useContext(AuthContext);
  //console.log(authCtx);
  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <section id={classes.tmWelcome} className={classes["parallax-window"]}>
      {
        <Container className={`${classes["tm-brand-container-outer"]}`}>
          <Row>
            <Col>
              <div
                className={`${classes["ml-auto"]} ${classes["mr-0"]} ${classes["tm-bg-black-transparent"]}  ${classes["text-white"]}  ${classes["tm-brand-container-inner"]}`}
              >
                <div
                  className={`${classes["tm-brand-container"]} ${classes["text-center"]}`}
                >
                  <h1 className={classes["tm-brand-name"]}>Online Banking</h1>
                  <p
                    className={`${classes["tm-brand-description"]} ${classes["mb-0"]}`}
                  >
                    24 hours a day, 365 days a year
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      }

      <div
        className={`${classes["tm-bg-white-transparent"]} ${classes["tm-welcome-container"]}`}
      >
        <Container>
          <Row>
            <Col md={7}>
              <div className={`${classes["tm-welcome-left"]}`}>
                <h2 className={`${classes["tm-welcome-title"]}`}>
                  {(authCtx.userData.userName) ? "Hello "+ authCtx.userData.userName +"," : "Welcome to Online banking" }
                </h2>
                <p className="pb-0">
                  Online banking is quick, convenient and secure. Log on and
                  manage your accounts whenever you want, wherever you are.{" "}
                </p>
              </div>
              <div>
                {!isLoggedIn && (
                  <Container>
                    <Row>
                      <Col sm>
                        <p>Log on to your account</p>
                        <Link to={signInPath} className="btn btn-danger">
                          Log in to online banking
                        </Link>
                      </Col>
                      <Col sm>
                        <p>Open an account today</p>
                        <Link
                          to={signUpPath}
                          className="btn btn-outline-secondary"
                        >
                          Open a new account
                        </Link>
                      </Col>
                    </Row>
                  </Container>
                )}
              </div>
            </Col>
            <Col md={5}>
              <div className={`${classes["tm-welcome-right"]}`}>
                <div className={`${classes["tm-welcome-icon"]}`}>
                <FontAwesomeIcon icon={faAddressCard} size="4x" />
                </div>
                
                <h2 className={`${classes["tm-welcome-title"]}`}>
                  Online banking is evolving
                </h2>
                <p> 
                  Thanks to your feedback, we’ve been busy improving online
                  banking to better suit your needs.
                </p>
                <p>
                  We’re enhancing features and improving the overall look and
                  feel, making it easier for you to carry out day-to-day tasks
                  like making payments or viewing statements. We’re not changing
                  the way things work, so you can still log on as normal.
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <div className={`${classes["card-container"]}`}>
              <Card className={`${classes["card"]}`}>
                <Card.Img variant="top" src={creditCardImg} />
                <Card.Body>
                  <Card.Title>Credit Card</Card.Title>
                  <Card.Text>
                    Manage your cash flow and make purchases you’ll pay off
                    later. Find out more about our credit cards and the guidance
                    we offer.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className={`${classes["card"]}`}>
                <Card.Img variant="top" src={walletImg} />
                <Card.Body>
                  <Card.Title>Personal Loan</Card.Title>
                  <Card.Text>
                    Make your plans a reality with a personal loan with fixed
                    monthly payments, quick access to funds and no arrangement
                    fee.
                  </Card.Text>
                  {isLoggedIn && (
                    <Link to={loanPath} className="btn btn-outline-primary">
                      Apply Loan
                    </Link>
                  )}
                </Card.Body>
              </Card>
              <Card className={`${classes["card"]}`}>
                <Card.Img variant="top" src={homeloanImg} />
                <Card.Body>
                  <Card.Title>Home Loan</Card.Title>
                  <Card.Text>
                    Our home improvement loan could help you get the most out of
                    your property sooner rather than later.
                  </Card.Text>
                  {isLoggedIn && (
                    <Link to={loanPath} className="btn btn-outline-primary">
                      Apply Loan
                    </Link>
                  )}
                </Card.Body>
              </Card>
              <Card className={`${classes["card"]}`}>
                <Card.Img variant="top" src={carloanImg} />
                <Card.Body>
                  <Card.Title>Car Loan</Card.Title>
                  <Card.Text>
                    Our car loan could get you on the road to owning it
                    outright, with monthly repayments at a highly competitive
                    rate.
                  </Card.Text>
                  {isLoggedIn && (
                    <Link to={loanPath} className="btn btn-outline-primary">
                      Apply Loan
                    </Link>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default StartingPageContent;
