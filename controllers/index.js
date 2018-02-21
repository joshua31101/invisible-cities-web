const express = require('express');
const router = express.Router();
const firebase = require('./firebaseController');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/', function(req, res) {
  if (firebase.hasLoggedIn()) {
    res.render('statueList', {
      email: firebase.getUser() ? firebase.getUser().email : null,
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  const err = req.session.error;
  delete req.session.error;
  res.render('login', { error: err });
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
    		res.redirect('/');
      }
    }
  );
});

router.post('/logout', function(req, res) {
	firebase.logout(
    function(error) {
    	if (error) {
    		return res.status(500).send(error.message);
    	} else {
            return res.status(200).send();
        }
    }
  );

});

module.exports = router;
