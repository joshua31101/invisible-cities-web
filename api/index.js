const express = require('express');
const router = express.Router();

router.use('/api/statues', require('./statues'));

module.exports = router;
