module.exports = {
  hasLoggedIn: hasLoggedIn,
	login: login,
  logout: logout,
  getUser: getUser
}

const firebase = require('firebase');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID
});

function hasLoggedIn() {
  return getUser() !== null;
}

function getUser() {
  return firebase.auth().currentUser;
}

function login(email, password, callback) {
	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    callback(null, getUser().uid);
  }).catch(function(error) {
    callback(error);
  })
}

function logout(callback) {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    callback(null);
  }, function(error) {
    callback(error);
  });
}
