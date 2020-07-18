import React, { useContext } from "react";
import { LoginContext } from "./loginContext";
import LoginForm from "./loginForm";
import InputForm from "./inputForm";
import ReturnForm from "./returnForm";
import { Router,navigate } from "@reach/router";

const MainPage = props => {
  const [login, setLogin] = useContext(LoginContext);

  return (
    <Router /*basepath="/inventory"*/>
      {/*login.user === false && <LoginForm />*/}
      {/*login.user === true && <InputForm />*/}
      <LoginForm path="/" />
      <InputForm path="/input" />
      <ReturnForm path="/return" />
    </Router>
  );
};

export default MainPage;
