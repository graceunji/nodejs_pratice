var express = require('express');
var router = express.Router();

// 구글 로그인
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mongoose = require('mongoose');
var db = mongoose.connect('----deleted----', {useNewUrlParser: true});
var Schema = mongoose.Schema;

var Post = new Schema({
	author : String,
	picture : String,
	contents : String,
	date : Date,
	like : Number,
	comments : Array
});


var postModel = mongoose.model('Post', Post);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
