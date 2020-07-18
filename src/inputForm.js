import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
//import SemanticDatepicker from "react-semantic-ui-datepickers";
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import { logoutAll, addRecord, checkItemNotReturn, getFormatToday, getFormatDate } from "./firebase_";
import { readTag } from "./nfc";
import ListGroup from "./listgroup";
import Location from "./inputLocation";
import InputType from "./inputType";


//import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { TextField, CssBaseline, Grid, Typography } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from '@material-ui/pickers';






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

  const [selectedDate, setSelectedDate] = useState();

  const [nfcMessage, setNfcMessage] = useState("");
  const [nfcMessageVisible, setNfcMessageVisible] = useState(false);
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
      <CssBaseline />
      {console.log("inputForm_JSX")}

      <Typography variant="h3" gutterBottom color="primary">
        租借登記頁
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="firstName"
            type="text"
            label="租借人姓名"
          />
        </Grid>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <DatePicker
              variant="dialog"
              label="租借日期"
            // value={selectedDate}
            //  onChange={handleDateChange}
            />
            <DatePicker
              variant="dialog"
              label="預期歸還日期"
            // value={selectedDate}
            //  onChange={handleDateChange}
            />
          </Grid>
        </MuiPickersUtilsProvider>

        <Grid item xs={12}>
        <TextField
            fullWidth
            required
            name="location"
            type="text"
            label="地點"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField id="outlined-basic2" label="租借物件" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField id="outlined-basic2" label="種類" variant="outlined" />
        </Grid>
      </Grid>


    </div >
  );
};

export default InputForm;
