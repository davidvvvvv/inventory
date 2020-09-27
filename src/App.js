import React from "react";
import "./styles.css";
import LoginContextProvider from "./loginContext";
import MainPage from "./mainPage";
import { Helmet } from "react-helmet";
import CssBaseline from '@material-ui/core/CssBaseline';

const App = () => {
  return (
    <CssBaseline>
    <LoginContextProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Inventy</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <MainPage />
    </LoginContextProvider>
    </CssBaseline>
  );
};

export default App;
