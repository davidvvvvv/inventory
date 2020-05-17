import React, { useState, useContext } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import { logoutAll } from "./firebase_";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

const InputForm = () => {
  const [currentDate, setNewDate] = useState(null);
  const onChange = (event, data) => setNewDate(data.value);
  const [login, setLogin] = useContext(LoginContext);

  const onClick = event => {
    logoutAll();
    navigate("/");
  };

  if (login == null) navigate("/");

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logo.png" />
        </Header>
        <Form size="large">
          <Segment stacked>
            <Button color="teal" fluid size="large" onClick={onClick}>
              Login{" "}
            </Button>
            <SemanticDatepicker onChange={onChange} />
          </Segment>
        </Form>
        <Message>
          New to us? <a href="#">Sign Up</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default InputForm;
