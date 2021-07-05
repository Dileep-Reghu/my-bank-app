import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "../AuthForm";
import Form from "react-bootstrap/Form";

describe("Auth components", () => {
  afterEach(cleanup);
  test("Check for login label", () => {
    //Arrange
    render(<AuthForm />);
    //Act

    //Assert
    const loginLabelElement = screen.getByText("Log in to your account");
    expect(loginLabelElement).toBeInTheDocument();
  });

  test("Check email input render", () => {
    //Arrange
    render(<AuthForm />);
    //Act

    //Assert
    const inputEmailElement = screen.getByTestId("email-input");
    expect(inputEmailElement).toBeTruthy();
  });

  test("Check password input render", () => {
    //Arrange
    render(<AuthForm />);
    //Act

    //Assert
    const inputPasswordElement = screen.getByTestId("password-input");
    expect(inputPasswordElement).toBeTruthy();
  });

  test("Check login failure label", () => {
    //Arrange
    render(<AuthForm />);
    //Act

    //Assert
    const loginFailedLabelElement = screen.queryByTestId("warning-label", {
      exact: false,
    });
    expect(loginFailedLabelElement).toBeFalsy();
  });

});
