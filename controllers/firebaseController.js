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

exports.hasLoggedIn = () => {
  return _this.getUser() !== null;
};

exports.getUser = () => {
  return firebase.auth().currentUser;
};

exports.getStatues = (lastStatueKey, callback) => {
  let rf = firebase.database().ref('/statues').orderByKey();
  if (lastStatueKey) {
    rf = rf.startAt(lastStatueKey)
  }

  return rf.limitToFirst(17).once('value').then((snapshot) => {
      callback(snapshot.val());
    });
};

exports.getAllStatues = (callback) => {
  firebase.database().ref('/statues').orderByKey().once('value').then((snapshot) => {
    callback(snapshot.val());
  });
}

exports.getStatue = (sId, callback) => {
  return firebase.database().ref('/statues/' + sId).once('value').then((snapshot) => {
    callback(snapshot.val());
  });
};

exports.getMaps = (callback) => {
  return firebase.database().ref('/maps').once('value').then((snapshot) => {
    callback(snapshot.val());
  });
};

exports.getMap = (sId, callback) => {
  return firebase.database().ref('/maps/' + sId).once('value').then((snapshot) => {
    callback(snapshot.val());
  });
};

exports.addTags = (sId, tags) => {
  return firebase.database().ref('/statues/' + sId).update({ tags: tags.join(',') });
}

exports.addLocation = (sId, location) => {
  return firebase.database().ref('/maps/' + sId).update({ location: location });
};

exports.removeStatue = (sId) => {
  firebase.database().ref('/maps/' + sId).remove();
  firebase.database().ref('/ratings/' + sId).remove();
  return firebase.database().ref('/statues/' + sId).remove();
};

exports.toggleStatueFlag = (sId, isFlagged) => {
  return firebase.database().ref(`/statues/${sId}`).update({ isFlagged: !isFlagged });
};

exports.toggleStatuePrivate = (sId, isPrivate) => {
  return firebase.database().ref(`/statues/${sId}`).update({ isPrivate: !isPrivate });
};

exports.login = (email, password, callback) => {
	firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    const email = _this.getUser().email;
    firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).once('value').then((snapshot) => {
      const isAdminUser = snapshot.val() ? true : false;
      callback(null, isAdminUser);
    })
  }).catch((error) => {
    callback(error, false);
  })
};

exports.logout = (callback) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    callback(null);
  }, (error) => {
    callback(error);
  });
};

exports.hasUser = (email, callback) => {
  firebase.auth().fetchProvidersForEmail(email).then(providers => {
    const userFound = providers.length > 0;
    callback(userFound, false);
  }).catch(error => {
    callback(false, error);
  });
};

exports.addAdminUser = (email, callback) => {
  firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).set('1').then(() => {
    callback(null);
  }).catch(error => {
    callback(error);
  });
};

exports.removeAdmin = (email, callback) => {
  return firebase.database().ref(`/adminUsers/${_encodeEmail(email)}`).remove().then(() => {
    callback(null);
  }).catch(error => {
    callback(error);
  });
};

exports.getAdmins = (callback) => {
  return firebase.database().ref('/adminUsers').once('value').then((snapshot) => {
    callback(snapshot.val());
  });
};

function _encodeEmail(email) {
  return email.replace('.', ',');
};
