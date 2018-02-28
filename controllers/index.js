const express = require('express');
const router = express.Router();
const firebase = require('./firebaseController');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/', function(req, res) {
  if (firebase.hasLoggedIn()) {
    firebase.getStatues(function(statues) {
      res.render('statueList', {
        statues: statues
      });
    })
  } else {
    res.redirect('/login');
  }
});

router.post('/statue', urlencodedParser, function(req, res) {
  if (firebase.hasLoggedIn()) {
    firebase.removeStatue(req.body.statueId);
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  if (firebase.hasLoggedIn()) {
    res.redirect('/');
  } else {
    const err = req.session.error;
    delete req.session.error;
    res.render('login', { error: err });
  }
});

router.post('/login', urlencodedParser, function(req, res) {
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
