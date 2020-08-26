var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.get('/', (req, res) => {
	res.render('main', {title: '* B I N G O *', username: req.query.username});
});

var users = {}; // 사용자 저장
var user_count = 0; // 현재 접속한 사용자 수
var turn_count = 0; // 누구의 차례인지 기록할 변수

io.on('connection', function(socket){
	
	console.log('user connected : ', socket.id);
	
	// 사용자가 접속했을 때 발생
	socket.on('join', function(data){
		var username = data.username;
		socket.username = username;
		
		users[user_count] = {};
		users[user_count].id = socket.id;
		users[user_count].name = username;
		users[user_count].turn = false;
		user_count++;
		
		io.emit('update_users', users, user_count); // 접속유저 목록 업데이트
	});
	
	// 클라이언트쪽에서 게임시작 버튼 누르면 발생하는 이벤트
	socket.on('game_start', function(data){
		socket.broadcast.emit('game_started', data);
		users[turn_count].turn = true;
		
		io.emit('update_users', users);
	});
	
	// 숫자 선택. 현재 유저 턴 종료, 다음 유저 턴 true 세팅
	socket.on('select', function(data){
		socket.broadcast.emit('check_number', data);
		
		users[turn_count].turn = false;
		turn_count++;

		if(turn_count >= user_count){
		   turn_count = 0;
		}
		users[turn_count].turn = true;

		io.sockets.emit('update_users', users);
	});
	
	// 유저 접속 종료 시
	socket.on('disconnect', function(){
		console.log('user disconneted : ', socket.id, socket.username);
		for(var i=0; i<user_count; i++){
			if(users[i].id == socket.id)
				delete users[i];
		}
		
		user_count--;
		io.emit('update_users', users, user_count);
	});	
});

http.listen(3000, function(){
	console.log('server on!');
});