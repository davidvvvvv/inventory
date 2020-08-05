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
import { TextField, CssBaseline, Grid, Typography, InputLabel, Select, MenuItem, FormControl, Button, Fab, IconButton, Paper, FormHelperText, AppBar, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Archive from '@material-ui/icons/Archive';
import AddAPhoto from '@material-ui/icons/AddAPhoto';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from '@material-ui/pickers';
import useFetch from 'use-http';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

  },
  itemInput: {
    //margin: theme.spacing(1),
    marginTop: 16,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  content: {
    height: "100%",
    padding: "0px 10px",
    flexGrow: 1,
  }
}));


const InputForm = () => {
  const todayString = getFormatToday();

  const [login, setLogin] = useContext(LoginContext);
  const [activeItem, setActiveItem] = useState("");
  const [itemsList, _setItemList] = useState([]);
  //const [location, setLocation] = useState("");

  const _itemsList = useRef(itemsList);
  const setItemList = data => {
    _itemsList.current = data;
    _setItemList(data);
  };

  //const [borrowerName, setBorrowerName] = useState('');
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


  const classes = useStyles();

  const [groupNo, setGroupNo] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [itemTypeOpen, setItemTypeOpen] = useState(false);
  const [itemType, setItemType] = useState("");
  const [selectGroup, setSelectGroup] = useState([]);
  const [selectLocation, setSelectLocation] = useState([]);
  const [selectType, setSelectType] = useState([]);
  //const { loading, error, data = [] } = useFetch('data.json',[]);
  const { get, post, response, loading, error } = useFetch('.')
  const [fetchPath, setFetchPath] = useState('/data.json');

  const groupNoChange = (event, value) => {
    console.log(value);
    setGroupNo(value);
  };

  const borrowerNameChange = (event, value) => {
    setBorrowerName(value);
  };

  const localtionHandle = () => {
    setLocationOpen(!locationOpen);
  };
  const locationChange = (event) => {
    setLocation(event.target.value);
  };

  const itemTypeHandle = () => {
    setItemTypeOpen(!itemTypeOpen);
  };
  const itemTypeChange = (event) => {
    setItemType(event.target.value);
  };

  useEffect(() => { initSelect() }, [fetchPath])

  async function initSelect() {
    const initSelectData = await get(fetchPath);
    if (response.ok) {
      //console.log(initSelectData.groups);
      setSelectGroup(initSelectData.groups);
      setSelectLocation(initSelectData.location);
      setSelectType(initSelectData.type);
    }
  }

  const selectBorrowerArray = useMemo(() => {
    const temp = selectGroup.find(object => {
      return object.group === groupNo
    })
    return temp !== undefined ? temp.staff : [];
  }, [groupNo])

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="h6" gutterBottom color="primary">
          租借登記頁
      </Typography>
        <Grid container spacing={3} >
          <Grid item xs={6}>
            <Autocomplete
              id="group"
              options={selectGroup.map((group) => group.group)}
              onInputChange={groupNoChange}
              renderInput={(params) => (
                <TextField {...params} label="組別" margin="none" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              id="borrower"
              freeSolo
              options={selectBorrowerArray.map((borrower) => borrower)}
              onInputChange={borrowerNameChange}
              renderInput={(params) => (
                <TextField {...params} label="租借者姓名" margin="none" />
              )}
            />
          </Grid>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={6}>
              <DatePicker
                variant="dialog"
                label="租借日期"
                fullWidth
              // value={selectBorrowDate}
              //  onChange={handleBorrowDateChange}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                variant="dialog"
                label="預期歸還日期"
                fullWidth
              // value={selectPredictDate}
                //onChange={handlePredictDateChange}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid item xs={10}>
            <Autocomplete
              id="location"
              freeSolo
              options={selectLocation.map((sLocation) => sLocation)}
              onInputChange={locationChange}
              renderInput={(params) => (
                <TextField {...params} label="地點" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <IconButton color="primary" aria-label="plus">
                <AddAPhoto fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <TextField label="租借物件" id="rentItem" margin="none" fullWidth required>
            </TextField>
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              id="itemType"
              freeSolo
              options={selectType.map((type) => type)}
              onInputChange={itemTypeChange}
              renderInput={(params) => (
                <TextField {...params} label="種類" margin="none" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <IconButton color="primary" aria-label="plus">
                <Archive fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default InputForm;
