var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


// 복잡한 웹 애플리케이션이라면 데이터베이스를 처리하는 모듈을 별도의 자바스크립트 파일로 생성하여 관리하는 것이 좋지만, 
// 여기서 구현하고자 하는 예제는 비교적 단순하므로 페이지 라우팅을 담당하는 index.js에서 데이터 입출력을 처리
mongoose.connect('mongodb+srv://dbUser:Akl8sSI4O6fmtxai@mongo-test.yd31m.mongodb.net/mongo-test?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
	console.log("!!!!!!! DB connected !!!!!!");
});

var Schema = mongoose.Schema;

var Memo = new Schema({
	author : String,
	contents : String,
	date : Date
});

var memoModel = mongoose.model('Memo', Memo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 해당하는 URL로 요청이 있을 때
router.get('/load', function(req, res, next){
	memoModel.find({}, function(err, data){ //find() 메소드 : SELECT * FROM users == db.users.find()
		res.json(data);
	});
});

router.post('/write', function(req, res, next){
	var author = req.body.author;
	var contents = req.body.contents;
	var date = Date.now();
	
	var memo = new memoModel();
	
	memo.author = author;
	memo.contents = contents;
	memo.date = date;
	memo.comments = [];
	
	memo.save(function(err){ //객체를 생성하는 메소드
		if(err) throw err;
		else res.json({status:"SUCCESS"});
	});
});

router.post('/del', function(req, res, next){
	var _id = req.body._id;
	memoModel.deleteOne({_id: _id}, function(err, result){
		if(err) throw err;
		res.json({status : "SUCCESS"});
	});
})

router.post('/modify', function(req, res, next){
	var _id = req.body._id;
	var contents = req.body.contents;
	
	memoModel.findOne({_id : _id}, function(err,memo){
		if(err) throw err;
		else memo.contents = contents;
		
		memo.save(function(err){
			if(err) throw err;
			else res.json({status:"SUCCESS"});
		})
	});
})


module.exports = router;
