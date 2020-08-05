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
        <meta httpEquiv="origin-trial" content="An+ugwRMu6TP9WdggmjXZ7A0w79UP+F01TRh8lEgcSkNYHKVdh2JnmfTkzZPyWGNDoKR3QsWru0CR83uZzRWVgcAAABXeyJvcmlnaW4iOiJodHRwczovL215dGVzdGluZy1jOTQ4OS53ZWIuYXBwOjQ0MyIsImZlYXR1cmUiOiJXZWJORkMiLCJleHBpcnkiOjE1OTMzMDYxOTR9" />
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
