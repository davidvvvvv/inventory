import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "./loginContext";
import { loginWithGoogleRedirect, logoutAll, emailPwSignIn } from "./firebase_";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [test,setTest] = useState("null");

  useEffect(() => {
    console.log("loginForm_useEffect");
   // runNFC();
  });

  const handleClick = () => {
    setIsSummit(false);
    emailPwSignIn(email, password);
    navigate("/input");
  };

  const inputChange = event => {
    const { name, value } = event.currentTarget;
    switch (name) {
      case "email":
        setEmail(value);
        console.log("loginForm_email", value);
        break;
      case "password":
        setPassword(value);
        console.log("loginForm_password", value);
        break;
      default:
        console.log("loginForm can't found input type");
        break;
    }
  };

  const googleLogin = () => {
    //loginWithGoogle();
    loginWithGoogleRedirect();
  };

  const runNFC = async ()=>{
    /* eslint-disable no-undef */
    if ('NDEFReader' in window) {
      try {
        const reader = new NDEFReader();
        await reader.scan();
        console.log("> Scan started");
        setTest("yes1");

        reader.addEventListener("error", (event) => {
          console.log(`Argh! ${event.message}`);
          setTest("no0");
        });

        reader.addEventListener("reading", ({ message, serialNumber }) => {
          console.log(`> Serial Number: ${serialNumber}`);
          console.log(`> Records: (${message.records.length})`);
          setTest("yes2");
        });
      } catch (error) {
        console.log("Argh! " + error);
        setTest("no1");
      }
    }else{
      console.log("not support nfc");
      setTest("no2");
    }
    /* eslint-enable no-undef */
  }

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
              Login{" "}{test}
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
