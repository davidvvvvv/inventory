import React from "react";
import "./styles.css";
import LoginContextProvider from "./loginContext";
import MainPage from "./mainPage";
import { Helmet } from "react-helmet";

const App = () => {
  return (
    <LoginContextProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Inventy</title>
        <meta httpEquiv="origin-trial" content="An+ugwRMu6TP9WdggmjXZ7A0w79UP+F01TRh8lEgcSkNYHKVdh2JnmfTkzZPyWGNDoKR3QsWru0CR83uZzRWVgcAAABXeyJvcmlnaW4iOiJodHRwczovL215dGVzdGluZy1jOTQ4OS53ZWIuYXBwOjQ0MyIsImZlYXR1cmUiOiJXZWJORkMiLCJleHBpcnkiOjE1OTMzMDYxOTR9" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Helmet>
      <MainPage />
    </LoginContextProvider>
  );
};

export default App;
