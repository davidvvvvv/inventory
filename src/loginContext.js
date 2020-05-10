import React, { useState, useEffect, createContext } from "react";
import { Container } from "semantic-ui-react";
import { auth } from "./firebase_";

export const LoginContext = createContext();

const LoginContextProvider = props => {
  const [login, setLogin] = useState(null);

  const ifAuthStateChange = () => {
    return auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        
        console.log("The user is logged in");
        //console.log(userAuth);
        setLogin(userAuth);
      } else {
        console.log("The user is not logged in");
        setLogin(null);
      }
    });
  };

  useEffect(() => {
    console.log("loginContext_useEffect");
    const unsubscribe = ifAuthStateChange();
    return () => {
      unsubscribe();
      console.log("loginContext_useEffect_unsubscribe");
    };
  }, []);

  return (
    <Container style={{ margin: 20 }}>
      <LoginContext.Provider value={[login, setLogin]}>
        {props.children}
      </LoginContext.Provider>
    </Container>
  );
};

export default LoginContextProvider;
