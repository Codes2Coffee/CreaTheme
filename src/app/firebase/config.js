import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";
var firebaseConfig = {
  apiKey: "AIzaSyCaZCkgv3pLLKCCwCs8gKsLuLTY8LhgatA",
  authDomain: "agripo-development.firebaseapp.com",
  projectId: "agripo-development",
  storageBucket: "agripo-development.appspot.com",
  messagingSenderId: "830527029525",
  appId: "1:830527029525:web:657ff27dd39ec28764691c",
  measurementId: "G-RYDRYH8DRH",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export default firebase;
export { firestore, auth, storage };
