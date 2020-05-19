import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "./loginContext";
import { loginWithGoogle, loginWithGoogleRedirect, logoutAll, emailPwSignIn } from "./firebase_";
import { navigate } from "@reach/router";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

const LoginForm = () => {
  const [login, setLogin] = useContext(LoginContext);
  const [pwLoginWaiting, setPwLoginWaiting] = useState(false);
  const [googleLoginWaiting, setGoogleLoginWaiting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



  useEffect(() => {
    console.log("loginForm_useEffect");
    if (login) navigate("/input");
  });

  const pwLogin = async () => {
    if (!(email === "" || password === "")) {
      setPwLoginWaiting(true);
      try {
        await emailPwSignIn(email, password);
      } catch (error) {
        //console.log("loginForm_pwLogin_error.message",error.message);
        setError(error.message);
        setPwLoginWaiting(false);
      }
    }else{
      setError("請輸入適當資料");
    }
  };

  const inputChange = event => {
    const { name, value } = event.currentTarget;
    switch (name) {
      case "email":
        setEmail(value);
        //console.log("loginForm_email", value);
        break;
      case "password":
        setPassword(value);
        //console.log("loginForm_password", value);
        break;
      default:
        console.log("loginForm can't found input type");
        break;
    }
  };

  const googleLogin = () => {
    //loginWithGoogle();
    setGoogleLoginWaiting(true);
    const response = loginWithGoogleRedirect();
    if (!(response === true)) setError(response);
  };

  const logout = () => {
    logoutAll();
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logo.png" /> 余李慕芬簡易租借系統
        </Header>
        <Message>
          <Button {...{ loading: googleLoginWaiting }} color="facebook" fluid size="large" onClick={googleLogin}>
            學校帳戶 - Google 登入
          </Button>
        </Message>
        <Form size="large">
          <Segment>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="電子郵件"
              name="email"
              onChange={inputChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="密碼"
              name="password"
              type="password"
              onChange={inputChange}
            />

            <Button
              color="teal"
              {...{ loading: pwLoginWaiting }}
              fluid
              size="large"
              onClick={pwLogin}
            >
              臨時帳戶登入{" "}
            </Button>

          </Segment>
        </Form>
        <Message negative attached='bottom'>
          {error}
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
