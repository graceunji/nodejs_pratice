var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '타이틀틀틀틀틀' });
});

module.exports = router;
