import React , {useEffect, useState } from 'react';
import nfc_react from "./nfc_react";

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

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    height: '92vh',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    //justifyContent:'space-between'
    //alignItems:'center',
  },
  submitButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  inputGroupBg:{
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: '#cfe8fc' ,
  }
}));


const ReturnForm=()=> {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);

  return (
  <div className={classes.root}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        <Snackbar open={errorMessageVisible} autoHideDuration={3000} onClose={() => { setErrorMessageVisible(false) }}>
          <SnackbarContent style={{ backgroundColor: 'orange', fontSize: '1rem' }} message={errorMessage} />
        </Snackbar>

        <Typography variant="h6" gutterBottom color="primary">
        歸還登記頁
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="歸還者姓名" id="borrower" margin="none"  fullWidth required>
            </TextField>
          </Grid>
          
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={6}>
              <DatePicker
                autoOk
                variant="dialog"
                label="歸還日期"
                fullWidth
                disableFuture
                format="dd/MM/yyyy"
                //value={selectBorrowDate}
                //onChange={//setSelectBorrowDate
                 // (arg) => setSubmitObject({ ...submitObject, selectBorrowDate: arg })
                //}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          
          <Grid container spacing={2} className={classes.inputGroupBg}>
            <Grid item xs={10}>
              <TextField label="歸還物件編號" id="rentItem" margin="none"  fullWidth required>
              </TextField>
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
        </Grid>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <ListGroup itemsMap={itemsMap} removeItem={removeItem} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button variant="contained" color="primary" className={classes.submitButton} type="submit" >確定</Button>
      </div>
    </div>
  );
}

export default ReturnForm;