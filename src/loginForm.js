import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "./loginContext";
import { loginWithGoogle, logoutAll, emailPwSignIn } from "./firebase_";
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
  const [isSummit, setIsSummit] = useState(false);
  const [use_email, set_use_email] = useState("");
  const [use_password, set_use_password] = useState("");
  const [use_error, set_use_error] = useState(null);

  useEffect(() => {
    console.log("loginForm_useEffect");
  });

  const handleClick = event => {
    setIsSummit(false);
    //emailPwSignIn(use_email, use_password);
    navigate("/input");
  };

  const inputChange = event => {
    const { name, value } = event.currentTarget;
    switch (name) {
      case "email":
        set_use_email(value);
        console.log("loginForm_email", value);
        break;
      case "password":
        set_use_password(value);
        console.log("loginForm_password", value);
        break;
      default:
        console.log("loginForm can't found input type");
        break;
    }
  };

  const googleLogin = () => {
    loginWithGoogle();
  };

  const logout = () => {
    logoutAll();
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logo.png" /> Log-in to your account
        </Header>
        <Form size="large">
          <Segment>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              name="email"
              onChange={inputChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              name="password"
              type="password"
              onChange={inputChange}
            />

            <Button
              color="teal"
              {...{ loading: isSummit }}
              fluid
              size="large"
              onClick={handleClick}
            >
              Login{" "}
            </Button>
          </Segment>
        </Form>
        <Message>
          Google User ? Here !
          <Button color="facebook" fluid size="large" onClick={googleLogin}>
            Google User Login
          </Button>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
