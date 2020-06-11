import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
//import SemanticDatepicker from "react-semantic-ui-datepickers";
import { DateInput } from 'semantic-ui-calendar-react';
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import { logoutAll } from "./firebase_";
import { readTag } from "./nfc";
import ListGroup from "./listgroup";
import {
  Button, Form, Grid, Header, Image, Message, Transition, Confirm,
  Segment, Menu, Checkbox, Icon, Label, Select, Dropdown, Popup
} from "semantic-ui-react";
import Location from "./inputLocation"
import InputType from "./inputType"

const InputForm = () => {
  const today = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)
  const todayString = `${ye}-${mo}-${da}`;

  const [login, setLogin] = useContext(LoginContext);
  const [activeItem, setActiveItem] = useState("");
  const [itemsList, _setItemList] = useState([]);
  const [location, setLocation] = useState("");

  const _itemsList = useRef(itemsList);
  const setItemList = data => {
    _itemsList.current = data;
    _setItemList(data);
  };
  const [borrowerName,setBorrowerName] = useState('');
  const [inputType, setInputType] = useState('');
  const [inputItem, setInputItem] = useState('');
  const [inputTypeAlarm, setInputTypeAlarm] = useState("hidden");
  const [inputItemAlarm, setInputItemAlarm] = useState("hidden");
  const [rentDate, setRentDate] = useState(todayString);
  const [expectReturnDate, setExpectReturnDate] = useState(todayString);
  
  const [nfcMessage, setNfcMessage] = useState("");
  const [nfcMessageVisible, setNfcMessageVisible] = useState(false)
  const onChange_Rent = (event, data) => {
    setRentDate(data.value);
    setExpectReturnDate(data.value);
    //setNfcMessage("itemsList" + itemsList);
  }
  const onChange_Expect = (event, data) => setExpectReturnDate(data.value);

  const setError = useCallback((message) => {
    setNfcMessage(message);
    setNfcMessageVisible(true);
  }, [])

  const removeItem = index => {
    itemsList.splice(index, 1);
    const tempList = [...itemsList];
    //_itemsList.current=tempList; 
    setItemList(tempList);
  }

  const addItem = (dataString) => {
    //const decoder = new TextDecoder();
    // for (const record of event.message.records) {
    //setNfcMessage("Record type:  " + record.recordType);
    //setNfcMessage("MIME type:    " + record.mediaType);
    //setNfcMessage("=== data ===\n" + decoder.decode(record.data));
    // }
    //setNfcMessage('tempItemsList.length '+event.itemsList.length);
    //const tempArray = decoder.decode(event.message.records[0].data).split(",");
    const tempArray = dataString.split(",");
    const tempObject = { 'refno': tempArray[0], 'type': tempArray[1], 'desc': 'abc' };
    const tempInput = _itemsList.current.some(item => {
      return item.refno == tempObject.refno;
    });
    !tempInput ? _itemsList.current.push(tempObject) : setError("😫 錯誤 : 重覆輸入!");
    const tempList = [..._itemsList.current];
    setItemList(tempList);
  }

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
    readTag(setError, addItem);
  }, []);

  useEffect(() => {
    console.log("inputForm_useEffect2");
    const messageTimeout = setTimeout(() => {
      setNfcMessageVisible(false);
    }, 3000)
    return (() => {
      clearTimeout(messageTimeout);
    })
  }, [nfcMessageVisible, nfcMessage]);

  return (
    <div style={{ height: "100vh" }}>
      {console.log("inputForm_return")}
      <Menu secondary pointing >
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={logoutAllFunction}
          />
        </Menu.Menu>
      </Menu>

      <Header as="h3" color="teal" block textAlign="center">
        <Icon name='edit' />
        <Header.Content>租借登記頁</Header.Content>
      </Header>

      <Form size="large">
        <Form.Field>
          <Label color="teal">租借人姓名</Label>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="租借人姓名"
            name="user"
            onChange={(error,result)=>{setBorrowerName(result.value)}}
          />
        </Form.Field>
        <Form.Field>
          <Grid columns='equal'>
            <Grid.Column>

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
            </Grid.Column>

            <Grid.Column>
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
            </Grid.Column>
          </Grid>
        </Form.Field>

        <Form.Field>
          <Label color="teal">地點</Label>
          <Location setLocation={setLocation} />
        </Form.Field>
        <Form.Field>
          <Grid columns='equal'>
            <Grid.Column width={7}>
              <Label color="teal">租借物件</Label>
              <Label color="red" key="red" style={{ visibility: inputItemAlarm }}>* 尚未設定</Label>
              <Form.Input
                fluid
                icon="box"
                iconPosition="left"
                placeholder="租借物件"
                name="item"
                onChange={(event) => {
                  setInputItem(event.currentTarget.value);
                  event.currentTarget.value == '' ? setInputItemAlarm('visible') : setInputItemAlarm('hidden');
                }}
              />
            </Grid.Column>

            <Grid.Column width={6}>
              <Label color="teal">種類</Label>
              <Label color="red" key="red" style={{ visibility: inputTypeAlarm }}>* 尚未設定</Label>
              <InputType setInputType={setInputType} setInputTypeAlarm={setInputTypeAlarm} />
            </Grid.Column>

            <Grid.Column verticalAlign="bottom">
              <Button style={{ width: 52 }}
                onClick={() => {
                  inputItem == '' ? setInputItemAlarm('visible') : setInputItemAlarm('hidden');
                  inputType == '' ? setInputTypeAlarm('visible') : setInputTypeAlarm('hidden');
                  if (!(inputItem == '' || inputType == '')) {
                    const tempData = `${inputItem},${inputType}`;
                    addItem(tempData);
                  }
                }}><Icon name='add' /></Button>

            </Grid.Column>
          </Grid>
        </Form.Field>
        <Form.Field>
          <ListGroup list={itemsList} remove={removeItem} />
        </Form.Field>
        <Button onClick={()=>{console.log(borrowerName,rentDate,expectReturnDate,location,itemsList)}}>Submit</Button>
      </Form>
      <Popup content='Add users to your feed###' trigger={<Button icon='add' />} />
      <Transition visible={nfcMessageVisible} duration={500}>
        <Message error
          content={nfcMessage}
        />
      </Transition>

      <Message error>
        {'itemsList_real $' + itemsList.length}
      </Message>
    </div >
  );
};

export default InputForm;
