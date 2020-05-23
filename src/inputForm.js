import React, { useState, useContext, useEffect, useMemo } from "react";
//import SemanticDatepicker from "react-semantic-ui-datepickers";
import { DateInput } from 'semantic-ui-calendar-react';
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
  Icon, Label
} from "semantic-ui-react";

const InputForm = () => {
  const today = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)
  const todayString = `${ye}-${mo}-${da}`;

  const [rentDate, setRentDate] = useState(todayString);
  const [expectReturnDate, setExpectReturnDate] = useState(todayString);
  const [nfcMessage, setNfcMessage] = useState("");
  const onChange_Rent = (event, data) => {
    setRentDate(data.value);
    setExpectReturnDate(data.value);
  }
  const onChange_Expect = (event, data) => setExpectReturnDate(data.value);
  const [login, setLogin] = useContext(LoginContext);
  const [activeItem, setActiveItem] = useState("");
  

  const showTag = useMemo(() => {
    const newSetRentDate = new Date(rentDate).getTime();
    const todayStringDate = new Date(todayString).getTime();
    return todayStringDate > newSetRentDate ? "visible" : "hidden";
  }, [rentDate])

  const logoutAllFunction = () => {
    setActiveItem("logout");
    logoutAll();
    navigate("/");
  };

  if (login == null) navigate("/");

  useEffect(() => {
    console.log("inputForm_useEffect");
    const reader = readTag(setNfcMessage);
    if (reader) {
      try {
         reader.scan();
        reader.onreading = event => {
          const decoder = new TextDecoder();
          const array=[];
          for (const record of event.message.records) {
            //setNfcMessage("Record type:  " + record.recordType);
            //setNfcMessage("MIME type:    " + record.mediaType);
            //setNfcMessage("=== data ===\n" + decoder.decode(record.data));
            array.push(decoder.decode(record.data));
          }
          //setNfcMessage(decoder.decode(event.message.records[0].data));
        }
      } catch (error) {
        setNfcMessage(error.message);
      }
    }
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
          <Label color="teal">租借日期</Label>
          <Label color="red" key="red" style={{ visibility: showTag }}>* 日期早於今天</Label>
          <DateInput
            name="rentDate"
            placeholder="租借日期"
            value={rentDate}
            iconPosition="left"
            onChange={onChange_Rent}
            animation='none'
            maxDate={todayString}
            dateFormat="YYYY-MM-DD"
            hideMobileKeyboard={true}
          />
        </Form.Field>
        <Form.Field>
          <Label color="teal">預期歸還日期</Label>
          <DateInput
            name="expectReturnDate"
            placeholder="預期歸還日期"
            value={expectReturnDate}
            iconPosition="left"
            onChange={onChange_Expect}
            animation='none'
            minDate={rentDate}
            dateFormat="YYYY-MM-DD"
            hideMobileKeyboard={true}
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
