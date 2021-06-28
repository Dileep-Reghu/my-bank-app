import { Fragment } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import classes from './TitleBar.module.css';
const TitleBar = (props) => {
  return (
    <Fragment>
      <Jumbotron className={classes["head-bg-grey-transparent"]} fluid>
        <Container>
          <h3 className="display-10">{props.title}</h3>
        </Container>
      </Jumbotron>
    </Fragment>
  );
};

export default TitleBar;
