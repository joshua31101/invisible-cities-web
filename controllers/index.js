const express = require('express');
const router = express.Router();
const firebase = require('./firebaseController');

router.get('/', function(req, res) {
  const isAdminUser = req.session.isAdminUser;
  const isScroll = req.query.isScroll;
  let lastStatueKey = req.session.lastStatueKey;
  // if the user visits the page and not scrolled
  if (!isScroll) {
    lastStatueKey = 0;
  } else if (!lastStatueKey) {
    return res.render('partials/statueCardContainer', {
      statues: null,
      isAdminUser,
      maps: null,
    });
  }

  firebase.getStatues(lastStatueKey, function(statues) {   
    const statueKeyList = Object.keys(statues);   
    const _lastStatueKey = statueKeyList[statueKeyList.length - 1];
    // update last statue key for next pagination reference
    req.session.lastStatueKey = _lastStatueKey;
    // remove the last statue since it will be loaded in the next scroll
    delete statues[_lastStatueKey];
    // if the current statue list reaches last page, then set the next key null
    // to go over from the beginning
    if (statueKeyList.length < 17) {
      req.session.lastStatueKey = null;
    }
    firebase.getMaps(function(maps) {
      if (isScroll) {
        return res.render('partials/statueCardContainer', {
          statues: statues,
          isAdminUser,
          maps: maps,
        });
      }
      res.render('statueList', {
        statues: statues,
        isAdminUser,
        query: null,
        searchCategory: null,
        maps: maps,
      });
    });
  });
});

router.get('/statue/search', function(req, res) {
  const query = req.query.q;
  const searchCategory = req.query.searchCategory;
  const isAdminUser = req.session.isAdminUser;

  firebase.searchStatues(query, searchCategory, function(statues) {
    firebase.getMaps(function(maps) {
      res.render('statueList', {
        statues: statues,
        query,
        searchCategory,
        isAdminUser,
        maps: maps,
      });
    });
  });
});

router.get('/campus-map', function(req, res) {
  const isAdminUser = req.session.isAdminUser;
  const mapDesign = require('../public/assets/map-design.json');

  firebase.getMaps(function(maps) {
    res.render('campusMap', {
      maps: maps,
      isAdminUser,
      mapDesign,
    });
  });
});

router.get('/admin', function(req, res) {
  if (!req.session.isAdminUser) {
    return res.status(500).send('Unauthorized access');
  }
  firebase.getAdmins(function(admins) {
    req.session.admins = admins;
    res.render('admin', {
      userFound: false,
      email: '',
      error: '',
      success: '',
      admins: admins,
    });
  });
});

router.post('/admin/add', function(req, res) {
  if (!req.session.isAdminUser) {
    return res.status(500).send('Unauthorized access');
  }
  const email = req.body.email;
  if (!email || (email && !email.includes('@'))) {
    return res.render('admin', {
      userFound: false,
      email: '',
      error: 'Please enter an email',
      success: '',
      admins: req.session.admins,
    });
  }

  firebase.hasUser(email, function(userFound, error) {
    if (error) {
      return res.render('admin', {
        userFound: false,
        email: '',
        error: error.message,
        success: '',
        admins: req.session.admins,
      });
    }

    if (userFound) {
      firebase.addAdminUser(email, function(error) {
        if (error) {
          return res.render('admin', {
            userFound,
            email,
            error: error.message,
            success: '',
            admins: req.session.admins,
          });
        }
        req.session.admins[email] = '1';
        return res.render('admin', {
          userFound,
          email,
          error: '',
          success: 'Successfully added!',
          admins: req.session.admins,
        });
      });
    } else {
      res.render('admin', {
        userFound,
        email,
        error: 'User is not found',
        success: '',
        admins: req.session.admins,
      });
    }
  });
});

router.get('/statue/:id', function(req, res) {
  const sId = req.params.id;
  firebase.getStatue(sId, function(statue) {
    firebase.getMap(sId, function(map) {
      res.status(200).send({
        map: map,
        statue: statue
      });
    });
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
