import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "./loginContext";
<<<<<<< HEAD
import { loginWithGoogleRedirect, logoutAll, emailPwSignIn } from "./firebase_";
=======
import { loginWithGoogle, loginWithGoogleRedirect, logoutAll, emailPwSignIn } from "./firebase_";
>>>>>>> 2020_05_21
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
  const [showMessageBox,setShowMessageBox] = useState("hidden");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [test,setTest] = useState("null");

  useEffect(() => {
    console.log("loginForm_useEffect");
   // runNFC();
=======
  const [error, setError] = useState("");


  useEffect(() => {
    console.log("loginForm_useEffect");
    if (login) navigate("/input");
>>>>>>> 2020_05_21
  });

  const pwLogin = async () => {
    if (!(email === "" || password === "")) {
      setPwLoginWaiting(true);
      try {
        await emailPwSignIn(email, password);
        setShowMessageBox("hidden");
      } catch (error) {
        //console.log("loginForm_pwLogin_error.message",error.message);
        setError(error.message);
        setPwLoginWaiting(false);
        setShowMessageBox("visible");
      }
    }else{
      setError("請輸入適當資料");
      setShowMessageBox("visible");
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

  const googleLogin = async() => {
    //loginWithGoogle();
    setGoogleLoginWaiting(true);
    setShowMessageBox("hidden");
    try{
      await loginWithGoogle();
    } catch (error){
      setError(error.message);
      setGoogleLoginWaiting(false);
      setShowMessageBox("visible");
    }
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
        <Message negative style={{visibility:showMessageBox}} >
          {error}
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
