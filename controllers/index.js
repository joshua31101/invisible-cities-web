const express = require('express');
const router = express.Router();
const firebase = require('./firebaseController');

const statueController = require('./statueController');
const adminController = require('./adminController');
const authController = require('./authController');

/*
 * statues
 */
router.get('/statues/search', statueController.search);
router.get('/statues/card/:id', statueController.statueCardGet);
router.post('/statues/remove', statueController.statueRemove);
router.post('/statues/flag', statueController.statueFlagPost);
router.post('/statues/private', statueController.statuePrivatePost);

/*
 * admin
 */
router.get('/admin', adminController.index);
router.post('/admin/add', adminController.adminAddPost);
router.post('/admin/remove', adminController.adminRemovePost);

/*
 * authentication
 */
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);

router.get('/', (req, res) => {
  const isScroll = req.query.isScroll;
  let lastStatueKey = req.session.lastStatueKey;
  // if the user visits the page and not scrolled
  if (!isScroll) {
    lastStatueKey = 0;
  } else if (!lastStatueKey) {
    return res.render('partials/statueCardContainer', {
      statues: null,
      maps: null,
    });
  }

  firebase.getStatues(lastStatueKey, (statues) => {
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
    firebase.getMaps((maps) => {
      if (isScroll) {
        return res.render('partials/statueCardContainer', {
          statues: statues,
          maps: maps,
        });
      }
      res.render('statueList', {
        statues: statues,
        query: null,
        maps: maps,
      });
    });
  });
});

router.get('/campus-map', (req, res) => {
  const mapDesign = require('../public/assets/map-design.json');

  firebase.getMaps((maps) => {
    res.render('campusMap', {
      maps: maps,
      mapDesign,
    });
  });
});

module.exports = router;
