import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCT72ac9bDKa7miAtozx-erO2CLmdFnXEM",
  authDomain: "mytesting-c9489.firebaseapp.com",
  databaseURL: "https://mytesting-c9489.firebaseio.com",
  projectId: "mytesting-c9489",
  storageBucket: "mytesting-c9489.appspot.com",
  messagingSenderId: "303860734763",
  appId: "1:303860734763:web:9784fd9f8178f2c25d836e"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
/*
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
*/

export const loginWithGoogle = () => {
  return auth.signInWithPopup(googleProvider);
};

export const loginWithGoogleRedirect = () => {
  return auth.signInWithRedirect(googleProvider);
};

export const emailPwSignIn = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);//.then(authCreditial=>{console.log("authCreditial ",authCreditial)})
};

export const logoutAll = () => {
  auth
    .signOut()
    .then(() => console.log("User has logout!"))
    .catch(error => {
      console.log("logoutAll_error", error);
    });
};

export const getDBCol = async col => {
  const ref = firestore.collection(col);
  return await ref
    .get()
    .catch(error => console.log("firebase_getDBCol", error.message));
};

export const getDBDoc = async (col, doc) => {
  const ref = firestore.collection(col).doc(doc);
  return await ref
    .get()
    .catch(error => console.log("firebase_getDBDoc", error.message));
};

auth.getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token.
    console.log("accessToken ",result.credential.accessToken);
  }
  console.log("user ",result.user);
});
