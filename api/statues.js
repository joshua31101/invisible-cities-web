const express = require('express');
const router = express.Router();
const firebase = require('../controllers/firebaseController');

router.get('/', function(req, res) {
  firebase.getStatues(function(statues) {
    res.status(200).send({
      statues: statues
    });
  });
});

module.exports = router;
