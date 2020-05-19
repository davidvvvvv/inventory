import React, { useState, useContext } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import {logoutAll} from "./firebase_";
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
  const [nfcMessage,setNfcMessage]= useState("");
  const onChange = (event, data) => setNewDate(data.value);
  const [login, setLogin] = useContext(LoginContext);
  
  const onClick = event => {
    logoutAll();
    navigate("/");
  };

  if (login==null) navigate("/");

  if ('NDEFReader' in window) { 
    /*global NDEFReader*/
    const reader = new NDEFReader();
reader.scan().then(() => {
 // setNfcMessage("Scan started successfully.");
  
  reader.onerror = event => {
    setNfcMessage("Error! Cannot read data from the NFC tag. Try a different one?");
  };
  reader.onreading = event => {
    setNfcMessage("NDEF message read.");
  };
}).catch(error => {
  setNfcMessage(`Error! Scan failed to start: ${error}.`);
});
    
   }

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
          New to us?  <a href="#">Sign Up {nfcMessage}</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default InputForm;
