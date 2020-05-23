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
  Checkbox,
  Icon
} from "semantic-ui-react";
import { DateInput} from 'semantic-ui-calendar-react';

const InputForm = () => {
  const today = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)

  const [rentDate, setRentDate] = useState(`${da}-${mo}-${ye}`);
  const [expectReturnDate, setExpectReturnDate] = useState(`${da}-${mo}-${ye}`);
  const [nfcMessage, setNfcMessage] = useState("");
  const onChange_Rent = (event, data) => setRentDate(data.value);
  const onChange_Expect = (event, data) => setExpectReturnDate(data.value);
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
      <Menu secondary pointing >
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={logoutAllFunction}
          />
        </Menu.Menu>
      </Menu>

      <Header as="h1" color="teal" block textAlign="center">
        <Icon name='edit' />
        <Header.Content>租借登記頁</Header.Content>
      </Header>


      <Form size="large">
        <Form.Field>
          <label>租借日期</label>
          <DateInput
            name="rentDate"
            placeholder="租借日期"
            value={rentDate}
            iconPosition="left"
            onChange={onChange_Rent}
            animation='none'
          />
        </Form.Field>
        <Form.Field>
          <label>預期歸還日期</label>
          <DateInput
            name="expectReturnDate"
            placeholder="預期歸還日期"
            value={expectReturnDate}
            iconPosition="left"
            onChange={onChange_Expect}
            animation='none'
          />
        </Form.Field>
      </Form>
      <Message error >
        {nfcMessage}
      </Message>
    </div >
  );
};

export default InputForm;
