import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCaUcotB3_yZxsfXHzJCJZGMVJL9qhuhnc",
    authDomain: "instagram-clone-ada3b.firebaseapp.com",
    databaseURL: "https://instagram-clone-ada3b.firebaseio.com",
  projectId: "instagram-clone-ada3b",
  storageBucket: "instagram-clone-ada3b.appspot.com",
  messagingSenderId: "226540241740",
  appId: "1:226540241740:web:53c2 a594be29e107d185e9",
  measurementId: "G-CRRYVEEJ02"

});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
