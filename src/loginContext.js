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
        //console.log(await userAuth.getIdToken());
        /*
        userAuth.providerData.forEach(function (profile) {
          console.log("Sign-in provider: " + profile.providerId);
          console.log("  Provider-specific UID: " + profile.uid);
          console.log("  Name: " + profile.displayName);
          console.log("  Email: " + profile.email);
          console.log("  Photo URL: " + profile.photoURL);
        });
        */
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
    <Container>
      <LoginContext.Provider value={[login, setLogin]}>
        {props.children}
      </LoginContext.Provider>
    </Container>
  );
};

export default LoginContextProvider;
