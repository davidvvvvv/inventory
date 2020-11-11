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
  console.log("firebase_initializeApp");
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  hd: "plkylmf.edu.hk"
});
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

export const getLocationCol = col => {
  const ref = firestore.collection(col);
  return ref.orderBy('key', 'asc')
    .get().then(querySnapshot => querySnapshot)
    .catch(error => console.log("firebase_getLocationCol_error", error.message));
};

export const getTypeCol = col => {
  const ref = firestore.collection(col);
  return ref.orderBy('key', 'asc')
    .get().then(querySnapshot => querySnapshot)
    .catch(error => console.log("firebase_getTypeCol_error", error.message));
};

export const getDBDoc = (col, doc) => {
  const ref = firestore.collection(col).doc(doc);
  return ref
    .get()
    .catch(error => console.log("firebase_getDBDoc", error.message));
};

export const addRecord = (borrower,localion, borrowDate, expectReturnDate, itemsMap, setError,resetAllInput) => {
 // const ref = firestore.collection('record').doc(); // doc() 沒有指定名稱
  //console.log('auth.currentUser ',auth.currentUser);
  itemsMap.forEach((element,key) => {
    if (element.dbRefNo) {
      const ref2 = firestore.collection('record').doc(element.dbRefNo);
      ref2.set({
        return_date: new Date(getFormatToday()),
        return_date_disapprove: true
      }, { merge: true }).then(() => {
        console.log('set new return_date successful');
      }).catch(error => console.log("addRecord_set new return_date_error", error.message));
    }
    firestore.collection('record').doc().set({
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      borrower,
      localion,
      borrow_date: borrowDate,
      expect_return_date: expectReturnDate,
      item_type: element.type,
      item: element.refno,
      return_date: new Date("9999/01/01"),
      user: auth.currentUser.email
    }).then(() => {
      console.log('addRecord successful');
      resetAllInput();
    }).catch(error => {
      console.log("addRecord_error", error.message);
      setError("😫 錯誤 : error.message");
    });
  });
}

export const checkItemNotReturn = item => {
  console.log('firebase_checkItemStatus');
  const ref = firestore.collection('record');
  return ref.where('item', '==', item).where('return_date', '>', new Date("3000/01/01")).get()
    .then(querySnapshot => {
      return querySnapshot.docs.length > 0 ? [querySnapshot.docs[0].id, item, querySnapshot.docs[0].data()] : false;
    });
};

export const getFormatDate = (date) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  return `${ye}/${mo}/${da}`;
}

export const getFormatToday = () => {
  const today = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)
  return `${ye}/${mo}/${da}`;
}

/*export const addRecord = async (username,borrowDate,expectReturnDate,location,itemArray,)

/*
auth.getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token.
    console.log("accessToken ",result.credential.accessToken);
    console.log("sign_in_method ",result.credential.signInMethod);
    console.log("providerId ",result.credential.providerId);
  }
  if (result.additionalUserInfo){
    console.log('isNewUser ',result.additionalUserInfo.isNewUser);
  }
});
*/
