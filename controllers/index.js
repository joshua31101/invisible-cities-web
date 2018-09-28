const express = require('express');
const router = express.Router();
const firebase = require('./firebaseController');

router.get('/', function(req, res) {
  const isAdminUser = req.session.isAdminUser;

  firebase.getStatues(function(statues) {
    res.render('statueList', {
      statues: statues,
      query: null,
      searchCategory: null,
      isAdminUser,
    });
  });
});

router.get('/statue/search', function(req, res) {
  const query = req.query.q;
  const searchCategory = req.query.searchCategory;
  const isAdminUser = req.session.isAdminUser;
  
  firebase.searchStatues(query, searchCategory, function(statues) {
    res.render('statueList', {
      statues,
      query,
      searchCategory,
      isAdminUser,
    });
  });
});

router.get('/campus-map', function(req, res) {
  const isAdminUser = req.session.isAdminUser;

  firebase.getMaps(function(maps) {
    res.render('campusMap', {
      maps: maps,
      isAdminUser,
    });
  });
});

router.get('/admin', function(req, res) {
  if (!req.session.isAdminUser) {
    res.status(500).send('Unauthorized access');
  }
  res.render('addAdmin', {
    userFound: false,
    email: '',
    error: '',
    success: '',
  });
});

router.post('/add-admin', function(req, res) {
  if (!req.session.isAdminUser) {
    res.status(500).send('Unauthorized access');
  }
  const email = req.body.email;
  if (!email) {
    res.render('addAdmin', {
      userFound: false,
      email: '',
      error: 'Please enter an email',
      success: '',
    });
  }

  firebase.hasUser(email, function(userFound) {
    if (userFound) {
      firebase.addAdminUser(email, function(error) {
        if (error) {
          res.render('addAdmin', {
            userFound,
            email,
            error: 'An error occurred',
            success: '',
          });
        } else {
          res.render('addAdmin', {
            userFound,
            email,
            error: '',
            success: 'Successfully added!',
          });
        }
      });
    } else {
        res.render('addAdmin', {
          userFound,
          email,
          error: 'User is not found',
          success: '',
        });
    }
  });
});

router.get('/statue/:id', function(req, res) {
  const sId = req.params.id;
  firebase.getStatue(sId, function(statue) {
    res.status(200).send({ statue: statue });
  });
});

router.post('/statue', function(req, res) {
  const statueId = req.body.statueId;
  firebase.removeStatue(statueId);
  if (req.body.isJson) {
    return res.status(200).send({ statueId: statueId });
  }
  return res.redirect('/');
});

router.post('/statue-flag', function(req, res) {
  const isFlagged = JSON.parse(req.body.isFlagged);
  const statueId = req.body.statueId;
  firebase.toggleStatueFlag(statueId, isFlagged);
  if (req.body.isJson) {
    return res.status(200).send({ isFlagged: !isFlagged, statueId: statueId });
  }
  return res.redirect('/');
});

router.post('/statue-private', function(req, res) {
  const isPrivate = JSON.parse(req.body.isPrivate);
  const statueId = req.body.statueId;
  firebase.toggleStatuePrivate(statueId, isPrivate);
  if (req.body.isJson) {
    return res.status(200).send({ isPrivate: !isPrivate, statueId: statueId });
  }
  return res.redirect('/');
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
    function(error, isAdminUser) {
    	if (error) {
        req.session.error = 'Incorrect username or password.';
        res.redirect('/login');
    	} else {
        req.session.email = email;
        req.session.isAdminUser = isAdminUser;      
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
        delete req.session.isAdminUser;
        res.redirect('/');
      }
    }
  );

});

module.exports = router;
