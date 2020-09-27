import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
//import SemanticDatepicker from "react-semantic-ui-datepickers";
import { LoginContext } from "./loginContext";
import { navigate } from "@reach/router";
import { logoutAll, addRecord, checkItemNotReturn, getFormatToday, getFormatDate } from "./firebase_";
import { readTag } from "./nfc";
import ListGroup from "./listgroup";
//import Location from "./_inputLocation";
//import InputType from "./inputType";


//import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Archive from '@material-ui/icons/Archive';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Box from '@material-ui/core/Box';
import { flexbox } from '@material-ui/system';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from '@material-ui/pickers';
import useFetch from 'use-http';

const useStyles = makeStyles((theme) => ({
  root: {
    //paddingLeft: theme.spacing(1),
    //paddingRight: theme.spacing(1),
    height: '92vh',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    //justifyContent:'space-between'
  },
  submitButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%'
  }
}));


const InputForm = () => {
  const todayString = getFormatToday();

  const [login, setLogin] = useContext(LoginContext);
  const [activeItem, setActiveItem] = useState("");
  const [itemsList, _setItemList] = useState([]);

  const _itemsList = useRef(itemsList);
  const setItemList = data => {
    _itemsList.current = data;
    _setItemList(data);
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);

  const setError = useCallback((message) => {
    setErrorMessage(message);
    setErrorMessageVisible(true);
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

  const submit = () => {
    //if (itemsList.length === 0) setError("😫 錯誤 : 請輸入租借物件");
    //addRecord(borrowerName, new Date(rentDate), new Date(expectReturnDate), location, itemsList, setError)
    // }
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

  /*
  useEffect(() => {
    console.log("inputForm_useEffect2");
    const messageTimeout = setTimeout(() => {
      setErrorMessageVisible(false);
    }, 3000)
    return (() => {
      console.log("InputForm_useEffect2_return");
      clearTimeout(messageTimeout);
    })
  }, [nfcMessageVisible, nfcMessage]);
*/

  const classes = useStyles();
  const todayDate = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));


  const initObject = { groupNo:"",borrowerName:"",location:"", itemType:"",
  itemInput:"",selectBorrowDate:todayDate,predictReturnDate:todayDate}; 

  const [submitObject,setSubmitObject] = useState(initObject);
  const {groupNo,borrowerName,location,itemType,itemInput,selectBorrowDate,predictReturnDate}=submitObject;


/*
  const [groupNo, setGroupNo] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  // const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState("");
  //const [itemTypeOpen, setItemTypeOpen] = useState(false);
  const [itemType, setItemType] = useState("");
  const [itemInput, setItemInput] = useState("");
  
  const [selectBorrowDate, setSelectBorrowDate] = useState(todayDate);
  const [predictReturnDate, setPredictReturnDate] = useState(todayDate);
  //const { loading, error, data = [] } = useFetch('data.json',[]);
  */
  const [selectGroup, setSelectGroup] = useState([]);
  const [selectLocation, setSelectLocation] = useState([]);
  const [selectType, setSelectType] = useState([]);
  const { get, post, response, loading, error } = useFetch('.')
  const [fetchPath, setFetchPath] = useState('/data.json');

  const groupNoChange = (event, value) => {
    //console.log(value);
    //setGroupNo(value);
    setSubmitObject({
      ...submitObject,
      groupNo:value,
    });
  };

  const borrowerNameChange = (event, value) => {
    //setBorrowerName(value);
    setSubmitObject({
      ...submitObject,
      borrowerName:value,
    })
  };
  /*
    const localtionHandle = () => {
      setLocationOpen(!locationOpen);
    };
    */
  const locationChange = (event) => {
    //setLocation(event.target.value);
    setSubmitObject({
      ...submitObject,
      location:event.target.value,
    })
  };
  /*
    const itemTypeHandle = () => {
      setItemTypeOpen(!itemTypeOpen);
    };
    */

  const itemTypeChange = (event) => {
    //setItemType(event.target.innerText || event.target.value)
    setSubmitObject({
      ...submitObject,
      itemType:event.target.innerText || event.target.value,
    })
  }

  useEffect(() => { initSelect() }, [fetchPath])

  async function initSelect() {
    const initSelectData = await get(fetchPath);
    if (response.ok) {
      //console.log(initSelectData.groups);
      setSelectGroup(initSelectData.groups);
      setSelectLocation(initSelectData.location);
      setSelectType(initSelectData.type);
      //console.log("selectBorrowDate",selectBorrowDate);
    }
  }

  const selectBorrowerArray = useMemo(() => {
    const temp = selectGroup.find(object => {
      return object.group === groupNo
    })
    return temp !== undefined ? temp.staff : [];
  }, [groupNo])

  const inputListFunction = () => {
    if (itemInput && itemType) {
      console.log(`${itemInput},${itemType}`);
      addItem(`${itemInput},${itemType}`);
    } else {
      setError("請輸入 租借物件編號 及 租借種類");
    }
  }

  const itemInputFunction = (event) => {
    //setItemInput(event.target.value);
    setSubmitObject({...submitObject, itemInput:event.target.value});
  }

  return (
    <div className={classes.root}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        <Snackbar open={errorMessageVisible} autoHideDuration={3000} onClose={()=>{setErrorMessageVisible(false)}}>
          <SnackbarContent style={{ backgroundColor: 'orange', fontSize:'1rem' }} message={errorMessage} />
        </Snackbar>

        <Typography variant="h6" gutterBottom color="primary">
          租借登記頁
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField onChange={itemInputFunction} label="租借者姓名" id="borrower" margin="none" required>
            </TextField>
          </Grid>
          <Grid item xs={6}>
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={6}>
              <DatePicker
                autoOk
                variant="dialog"
                label="租借日期"
                fullWidth
                disableFuture
                format="dd/MM/yyyy"
                value={selectBorrowDate}
                onChange={//setSelectBorrowDate
                  (arg)=>setSubmitObject({...submitObject,selectBorrowDate:arg})
                }
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                autoOk
                variant="dialog"
                label="預期歸還日期"
                format="dd/MM/yyyy"
                fullWidth
                disablePast
                value={predictReturnDate}
                onChange={//setPredictReturnDate
                  (arg)=>setSubmitObject({...submitObject,predictReturnDate:arg})
                }
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid item xs={5}>
            <TextField onChange={itemInputFunction} label="租借物件編號" id="rentItem" margin="none" fullWidth required>
            </TextField>
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              id="itemType"
              freeSolo
              options = {selectType} // {selectType.map((type) => type)}
              onInputChange={itemTypeChange}
              renderInput={(params) => (
                <TextField {...params} label="租借種類" margin="none" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <IconButton onClick={inputListFunction} color="primary" aria-label="plus">
                <Archive fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <ListGroup itemList={itemsList}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button variant="contained" color="primary" className={classes.submitButton} type="submit">確定</Button>
      </div>
    </div>
  );
};

export default InputForm;
