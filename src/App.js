import React from "react";
import "./styles.css";
import LoginContextProvider from "./loginContext";
import MainPage from "./mainPage";

const App = () => {
  return (
    <LoginContextProvider>
      <MainPage />
    </LoginContextProvider>
  );
};

export default App;
