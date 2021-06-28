import firebase from 'firebase';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAlUjDjAX5fZDqKZTvcw-09jj7OevnXSK4",
  authDomain: "my-bank-app-f61cf.firebaseapp.com",
  databaseURL: "https://my-bank-app-f61cf-default-rtdb.firebaseio.com",
  projectId: "my-bank-app-f61cf",
  storageBucket: "my-bank-app-f61cf.appspot.com",
  messagingSenderId: "631873049907",
  appId: "1:631873049907:web:c0f393c5ab3cef28265a46",
  measurementId: "G-QCS0HZHFVW",
};
// Initialize Firebase
var fireDb = firebase.initializeApp(firebaseConfig);
//firebase.analytics();
export default fireDb.database().ref();
