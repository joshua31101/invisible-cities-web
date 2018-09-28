module.exports = {
  hasLoggedIn: hasLoggedIn,
	login: login,
  logout: logout,
  getUser: getUser,
  getStatues: getStatues,
  searchStatues: searchStatues,
  getStatue: getStatue,
  removeStatue: removeStatue,
  toggleStatueFlag: toggleStatueFlag,
  toggleStatuePrivate: toggleStatuePrivate,
  getMaps: getMaps,
  getMap: getMap,
  hasUser: hasUser,
  addAdminUser: addAdminUser,
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

function getStatues(callback) {
  return firebase.database().ref('/statues').once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

function searchStatues(query, searchCategory, callback) {
  return firebase.database().ref('/statues').orderByChild(searchCategory).startAt(query).once("value").then(function(snapshot) {
    callback(snapshot.val());
  });
}

function getStatue(sId, callback) {
  return firebase.database().ref('/statues/' + sId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

function getMaps(callback) {
  return firebase.database().ref('/maps').once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

function getMap(sId, callback) {
  return firebase.database().ref('/maps/' + sId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

function removeStatue(sId) {
  firebase.database().ref('/maps/' + sId).remove();
  firebase.database().ref('/ratings/' + sId).remove();
  return firebase.database().ref('/statues/' + sId).remove();
}

function toggleStatueFlag(sId, isFlagged) {
  return firebase.database().ref(`/statues/${sId}`).update({ isFlagged: !isFlagged });
}

function toggleStatuePrivate(sId, isPrivate) {
  return firebase.database().ref(`/statues/${sId}`).update({ isPrivate: !isPrivate });
}

function login(email, password, callback) {
	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    const email = getUser().email;
    firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).once('value').then(function(snapshot) {
      const isAdminUser = snapshot.val() ? true : false;
      callback(null, isAdminUser);
    })
  }).catch(function(error) {
    callback(error, false);
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

function hasUser(email, callback) {
  firebase.auth().fetchProvidersForEmail(email).then(providers => {
    const userFound = providers.length > 0;
    callback(userFound);
  });
}

function addAdminUser(email, callback) {
  firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).set('1', function(error) {
    callback(error);
  });
}

function _encodeEmail(email) {
  return email.replace('.', ',');
}
