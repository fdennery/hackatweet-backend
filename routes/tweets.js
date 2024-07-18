var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res,) => {
  res.json({result: true });
});

module.exports = router;
