const firebase = require('firebase');
const _this = this;

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

exports.hasLoggedIn = function() {
  return _this.getUser() !== null;
};

exports.getUser = function() {
  return firebase.auth().currentUser;
};

exports.getStatues = function(lastStatueKey, callback) {
  let rf = firebase.database().ref('/statues').orderByKey();
  if (lastStatueKey) {
    rf = rf.startAt(lastStatueKey)
  }

  return rf.limitToFirst(17).once('value').then((snapshot) => {
      callback(snapshot.val());
    });
};

exports.searchStatues = function(query, searchCategory, callback) {
  return firebase.database().ref('/statues').orderByChild(searchCategory).startAt(query).once("value").then(function(snapshot) {
    callback(snapshot.val());
  });
};

exports.getStatue = function(sId, callback) {
  return firebase.database().ref('/statues/' + sId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
};

exports.getMaps = function(callback) {
  return firebase.database().ref('/maps').once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
};

exports.getMap = function(sId, callback) {
  return firebase.database().ref('/maps/' + sId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
};

exports.removeStatue = function(sId) {
  firebase.database().ref('/maps/' + sId).remove();
  firebase.database().ref('/ratings/' + sId).remove();
  return firebase.database().ref('/statues/' + sId).remove();
};

exports.toggleStatueFlag = function(sId, isFlagged) {
  return firebase.database().ref(`/statues/${sId}`).update({ isFlagged: !isFlagged });
};

exports.toggleStatuePrivate = function(sId, isPrivate) {
  return firebase.database().ref(`/statues/${sId}`).update({ isPrivate: !isPrivate });
};

exports.login = function(email, password, callback) {
	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    const email = _this.getUser().email;
    firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).once('value').then(function(snapshot) {
      const isAdminUser = snapshot.val() ? true : false;
      callback(null, isAdminUser);
    })
  }).catch(function(error) {
    callback(error, false);
  })
};

exports.logout = function(callback) {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    callback(null);
  }, function(error) {
    callback(error);
  });
};

exports.hasUser = function(email, callback) {
  firebase.auth().fetchProvidersForEmail(email).then(providers => {
    const userFound = providers.length > 0;
    callback(userFound, false);
  }).catch(error => {
    callback(false, error);
  });
};

exports.addAdminUser = function(email, callback) {
  firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).set('1').then(() => {
    callback(null);
  }).catch(error => {
    callback(error);
  });
};

exports.removeAdmin = function(email, callback) {
  return firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).remove().then(() => {
    callback(null);
  }).catch(error => {
    callback(error);
  });
};

exports.getAdmins = function(callback) {
  return firebase.database().ref('/adminUsers').once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
};

function _encodeEmail(email) {
  return email.replace('.', ',');
};
