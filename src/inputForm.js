import React, { useState, useContext, useEffect } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import { logoutAll } from "./firebase_";
import { readTag } from "./nfc";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Menu, 
  Checkbox
} from "semantic-ui-react";

const InputForm = () => {
  const [currentDate, setNewDate] = useState(null);
  const [nfcMessage, setNfcMessage] = useState("");
  const onChange = (event, data) => setNewDate(data.value);
  const [login, setLogin] = useContext(LoginContext);
  const [activeItem, setActiveItem] = useState("");

  const logoutAllFunction = () => {
    setActiveItem("logout");
    logoutAll();
    navigate("/");
  };

  if (login == null) navigate("/");

  useEffect(() => {
    console.log("inputForm_useEffect");
    readTag(setNfcMessage);
    return () => {
      console.log("inputForm_useEffect_unsubscribe");
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Menu pointing >
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={logoutAllFunction}
          />
        </Menu.Menu>
      </Menu>
      <Message error >
        {nfcMessage}
      </Message>

      <Header as="h2" color="teal" textAlign="center">
        租借登記頁
          </Header>


      <Form size="large">
        <Grid columns={2} >
          <Grid.Row>
            <Grid.Column width={9}>
              <Form.Field>
                <label>租借日期</label>
                <SemanticDatepicker readOnly={true} clearable={false} onChange={onChange} value={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())} />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>	&nbsp;</div>
              <div>	&nbsp;</div>
              <Form.Field>
                <Checkbox label="後補" />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form.Field>
          <label>預期歸還日期</label>
          <SemanticDatepicker onChange={onChange} value={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())} />
        </Form.Field>
      </Form>
      <Message>
        New to us?  <a href="#">Sign Up {nfcMessage}</a>
      </Message>
    </div>
  );
};

export default InputForm;
