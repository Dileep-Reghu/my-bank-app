import { Fragment } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import classes from "./ProfileTitleBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
const ProfileTitleBar = (props) => {
  const isEditing = props.isEditing;
  const editClickHandler = () => {
    props.updateEditStatus(true);
  };
  return (
    <Fragment>
      <Jumbotron className={classes["head-bg-grey-transparent"]} fluid>
        <Container>
          <Row>
            <Col md={11}>
              <h3 className="display-10">{props.title}</h3>
            </Col>
            {!isEditing && (
              <Col>
                <Button variant="outline-secondary" onClick={editClickHandler}>
                  <FontAwesomeIcon icon={faEdit} size="1x" />
                </Button>
              </Col>
            )}
          </Row>
        </Container>
      </Jumbotron>
    </Fragment>
  );
};

export default ProfileTitleBar;
