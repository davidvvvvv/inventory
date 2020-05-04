import React, { useContext } from "react";
import { LoginContext } from "./loginContext";
import LoginForm from "./loginForm";
import InputForm from "./inputForm";
import { Router } from "@reach/router";

const MainPage = props => {
  const [login, setLogin] = useContext(LoginContext);

  return (
    <Router>
      {/*login.user === false && <LoginForm />*/}
      {/*login.user === true && <InputForm />*/}
      <LoginForm path="/" />
      <InputForm path="/input" />
    </Router>
  );
};

export default MainPage;
