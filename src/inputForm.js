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
import { TextField, CssBaseline, Grid, Typography, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    margin: 0,
    display: 'flex',
    wrap: 'nowrap'
  },
  itemInput: {
    //margin: theme.spacing(1),
    marginTop: 0,
    display: 'flex',
    wrap: 'nowrap'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));



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


  const classes = useStyles();

  const [groupOpen, setGroupOpen] = useState(false);
  const [groupNo, setGroupNo] = useState();
  const groupHandleClose = () => {
    setGroupOpen(false);
  };
  const groupHandleOpen = () => {
    setGroupOpen(true);
  };
  const groupNoChange = (event) => {
    setGroupNo(event.target.value);
  };

  return (
    <div style={{ height: "100vh" }}>
      <CssBaseline />
      {console.log("inputForm_JSX")}

      <Typography variant="h3" gutterBottom color="primary">
        租借登記頁
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="group">組別</InputLabel>
            <Select
              autoWidth={true}
              labelId="group"
              id="group"
              open={groupOpen}
              onClose={groupHandleClose}
              onOpen={groupHandleOpen}
              value={groupNo}
              onChange={groupNoChange}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>1組</MenuItem>
              <MenuItem value={2}>2組</MenuItem>
              <MenuItem value={3}>3組</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="borrower">租借者姓名</InputLabel>
            <Select
              autoWidth={true}
              labelId="borrower"
              id="borrower"
              open={groupOpen}
              onClose={groupHandleClose}
              onOpen={groupHandleOpen}
              value={groupNo}
              onChange={groupNoChange}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>1組</MenuItem>
              <MenuItem value={2}>2組</MenuItem>
              <MenuItem value={3}>3組</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={6}>
            <DatePicker
              variant="dialog"
              label="租借日期"
              fullWidth
            // value={selectedDate}
            //  onChange={handleDateChange}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              variant="dialog"
              label="預期歸還日期"
              fullWidth
            // value={selectedDate}
            //  onChange={handleDateChange}
            />
          </Grid>
        </MuiPickersUtilsProvider>

        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="location">地點</InputLabel>
            <Select
              autoWidth={true}
              labelId="location"
              id="location"
              open={groupOpen}
              onClose={groupHandleClose}
              onOpen={groupHandleOpen}
              value={groupNo}
              onChange={groupNoChange}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>1組</MenuItem>
              <MenuItem value={2}>2組</MenuItem>
              <MenuItem value={3}>3組</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.itemInput}>
            <TextField label="租借物件" id="rentItem" required>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="itemType">種類</InputLabel>
            <Select
              autoWidth={true}
              labelId="itemType"
              id="itemType"
              open={groupOpen}
              onClose={groupHandleClose}
              onOpen={groupHandleOpen}
              value={groupNo}
              onChange={groupNoChange}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>1組</MenuItem>
              <MenuItem value={2}>2組</MenuItem>
              <MenuItem value={3}>3組</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>


    </div >
  );
};

export default InputForm;
