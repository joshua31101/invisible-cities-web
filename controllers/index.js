const express = require('express');
const router = express.Router();
const firebase = require('./firebaseController');

router.get('/', function(req, res) {
  firebase.getStatues(function(statues) {
    res.render('statueList', {
      statues: statues
    });
  });
});

router.post('/statue', function(req, res) {
  firebase.removeStatue(req.body.statueId);
  res.redirect('/');
});

router.post('/statue-flag', function(req, res) {
  const isFlagged = req.body.isFlagged;
  const statueId = req.body.statueId;
  firebase.toggleStatueFlag(statueId, isFlagged);
  res.redirect('/');
});

router.get('/login', function(req, res) {
  const err = req.session.error;
  delete req.session.error;
  res.render('login', { error: err });
});

router.post('/login', function(req, res) {
  if (!req.body) {

  };
  var email = req.body.email;
  var password = req.body.password;

	firebase.login(email, password,
    function(error, uid) {
    	if (error) {
        req.session.error = 'Incorrect username or password.';
        res.redirect('/login');
    	} else {
        req.session.email = email;
    		res.redirect('/');
      }
    }
  );
});

router.get('/logout', function(req, res) {
	firebase.logout(
    function(error) {
    	if (error) {
    		return res.status(500).send(error.message);
    	} else {
        delete req.session.email;
        res.redirect('/');
      }
    }
  );

});

module.exports = router;
