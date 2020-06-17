import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
//import SemanticDatepicker from "react-semantic-ui-datepickers";
import { DateInput } from 'semantic-ui-calendar-react';
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import { logoutAll, addRecord, checkItemNotReturn, getFormatToday, getFormatDate } from "./firebase_";
import { readTag } from "./nfc";
import ListGroup from "./listgroup";
import {
  Button, Form, Grid, Header, Image, Message, Transition, Confirm,
  Segment, Menu, Checkbox, Icon, Label, Select, Dropdown, Popup
} from "semantic-ui-react";
import Location from "./inputLocation";
import InputType from "./inputType";

const InputForm = () => {
  const todayString = getFormatToday();

  const [login, setLogin] = useContext(LoginContext);
  const [activeItem, setActiveItem] = useState("");
  const [itemsList, _setItemList] = useState([]);
  const [location, setLocation] = useState("");


  const _itemsList = useRef(itemsList);
  const setItemList = data => {
    _itemsList.current = data;
    _setItemList(data);
  };
  const [borrowerName, setBorrowerName] = useState('');
  const [inputType, setInputType] = useState('');
  const [inputItem, setInputItem] = useState('');
  const [showTypeTag, setShowTypeTag] = useState("hidden");
  const [showItemTag, setShowItemTag] = useState("hidden");
  const [showNameTag, setShowNameTag] = useState("hidden");
  const [showLocationTag, setShowLocationTag] = useState("hidden");
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
    const tempObject = { 'refno': tempArray[0], 'type': tempArray[1], 'desc': '', 'dbRefNo': '' };
    const tempInput = _itemsList.current.some(item => {
      return item.refno === tempObject.refno;
    });
    !tempInput ? _itemsList.current.push(tempObject) : setError("😫 錯誤 : 重覆輸入!");
    const tempList = [..._itemsList.current];
    setItemList(tempList);
    checkItemNotReturn(tempArray[0]).then(result => {
      if (result) {
        const [nonReturnDbRefNo, nonReturnItemRefno, nonReturnItemData] = result;
        _itemsList.current.forEach(item => {
          if (item.refno == nonReturnItemRefno) {
            item.desc = `應未歸還: ${nonReturnItemData.borrower} (${getFormatDate(nonReturnItemData.borrow_date.toDate())})`;
            item.dbRefNo = nonReturnDbRefNo;
          }
        })
        const tempList = [..._itemsList.current];
        setItemList(tempList);
      }
    })
  }

  const showDateTag = useMemo(() => {
    const newSetRentDate = new Date(rentDate).getTime();
    const todayStringDate = new Date(todayString).getTime();
    return todayStringDate > newSetRentDate ? "visible" : "hidden";
  }, [rentDate])

  const submit = () => {
    
    if (borrowerName === '') setShowNameTag('visible');
    if (location === '') setShowLocationTag('visible');
    if (itemsList.length === 0) setError("😫 錯誤 : 請輸入租借物件");
    if (borrowerName !== '' && location !== '' && itemsList.length > 0) {
      addRecord(borrowerName, new Date(rentDate), new Date(expectReturnDate), location, itemsList, setError)
      setBorrowerName('');
      setBorrowerName('');
      setLocation('');
      setInputItem('');
      setInputType('');
      setItemList([]);
      setRentDate(todayString);
      setExpectReturnDate(todayString);
    }
  }

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
      console.log("InputForm_useEffect2_return");
      clearTimeout(messageTimeout);
    })
  }, [nfcMessageVisible, nfcMessage]);

  return (
    <div style={{ height: "100vh" }}>
      {console.log("inputForm_JSX")}
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
          <Label color="red" key="red" style={{ visibility: showNameTag }}>* 請輸入租借人姓名</Label>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="租借人姓名"
            name="user"
            value={borrowerName}
            onChange={(event, result) => {
              setBorrowerName(result.value)
              result.value === '' ? setShowNameTag('visible') : setShowNameTag('hidden');
            }}
          />
        </Form.Field>
        <Form.Field>
          <Grid columns='equal'>
            <Grid.Column>

              <Label color="teal">租借日期</Label>
              <Label color="red" key="red" style={{ visibility: showDateTag }}>* 日期早於今天</Label>
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
          <Label color="red" key="red" style={{ visibility: showLocationTag }}>* 請輸入地點</Label>
          <Location
            setLocation={setLocation} setShowLocationTag={setShowLocationTag} location={location}
          />
        </Form.Field>
        <Form.Field>
          <Grid columns='equal'>
            <Grid.Column width={7}>
              <Label color="teal">租借物件</Label>
              <Label color="red" key="red" style={{ visibility: showItemTag }}>* 尚未設定</Label>
              <Form.Input
                fluid
                icon="box"
                iconPosition="left"
                placeholder="租借物件"
                name="item"
                value={inputItem}
                onChange={(event) => {
                  setInputItem(event.currentTarget.value);
                  event.currentTarget.value === '' ? setShowItemTag('visible') : setShowItemTag('hidden');
                }}
              />
            </Grid.Column>

            <Grid.Column width={6}>
              <Label color="teal">種類</Label>
              <Label color="red" key="red" style={{ visibility: showTypeTag }}>* 尚未設定</Label>
              <InputType setInputType={setInputType} setInputTypeAlarm={setShowTypeTag} inputType={inputType} />
            </Grid.Column>

            <Grid.Column verticalAlign="bottom">
              <Button style={{ width: 52 }}
                onClick={() => {
                  inputItem === '' ? setShowItemTag('visible') : setShowItemTag('hidden');
                  inputType === '' ? setShowTypeTag('visible') : setShowTypeTag('hidden');
                  if (!(inputItem === '' || inputType === '')) {
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
        <Button onClick={submit}>Submit</Button>
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
