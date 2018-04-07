const express = require('express'),
      router = express.Router(),
      firebase = require('./firebase');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

router.get('/hello', (req, res) => {
  res.status(200).send({ express: 'Hello From Express' });
});

router.get('/statue-list', (req, res) => {
  firebase.getStatues((statues) => {
    res.status(200).send({ statues: statues });
  });
});

router.get('/statue-map', (req, res) => {
  firebase.getMaps((maps) => {
    res.status(200).send({ maps: maps });
  });
});

router.get('/statue/:id', (req, res) => {
  const sId = req.params.id;
  firebase.getStatue(sId, (statue) => {
    res.status(200).send({ statue: statue });
  });
});

router.post('/statue', (req, res) => {
  const statueId = req.body.statueId;
  firebase.removeStatue(statueId);

  res.status(200).send({ statueId: statueId });
});

router.post('/statue-flag', (req, res) => {
  const isFlagged = JSON.parse(req.body.isFlagged);
  const statueId = req.body.statueId;
  firebase.toggleStatueFlag(statueId, isFlagged);

  res.status(200).send({ isFlagged: !isFlagged, statueId: statueId });
});

router.post('/statue-private', (req, res) => {
  const isPrivate = JSON.parse(req.body.isPrivate);
  const statueId = req.body.statueId;
  firebase.toggleStatuePrivate(statueId, isPrivate);

  res.status(200).send({ isPrivate: !isPrivate, statueId: statueId });
});

// router.get('/login', (req, res) => {
//   const err = req.session.error;
//   delete req.session.error;
//   res.render('login', { error: err });
// });

router.post('/login', (req, res) => {
  if (!req.body) {

  };
  var email = req.body.email;
  var password = req.body.password;

	firebase.login(email, password, (error, uid) => {
    	if (error) {
        res.statue(500).send('Incorrect username or password.');
    	} else {
        res.statue(200).send('Successfully login!');
      }
    }
  );
});

router.get('/logout', (req, res) => {
	firebase.logout((error) => {
    	if (error) {
    		return res.status(500).send(error.message);
    	} else {
        res.statue(200).send('Successfully logout!');
      }
    }
  );

});

module.exports = router;
