// www로 분리 되어있는 서버 코드 대신 해당 js파일을 이용하기~

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
	res.render('chat'); // 루트 페이지 접속시 chat.pug 렌더링
});

var count = 1;
let userList = {};
io.on('connection', function(socket){ // 채팅방에 접속했을 때 - 1
	var name = "익명" + count++;
	socket.name = name;
	io.to(socket.id).emit('create name', name);
	io.emit('entry user', name);
	userList[String(socket.id)] = name;
	io.emit('set userList', userList);
	
	socket.on('disconnect', function(){ // 채팅방 접속이 끊어졌을 떄 - 2
		io.emit('exit user', socket.name);
		delete userList[String(socket.id)];
		io.emit('set userList', userList);
	});
	
	socket.on('send message', function(name, text){ // 메세지를 보냈을 때 - 3
		if(socket.name!=name){ // 이름변경시
			userList[String(socket.id)] = name;
			io.emit('set userList', userList);
			io.emit('change name', socket.name, name);
			socket.name = name;
		}
		
		var msg = name + ' : ' + text;
		socket.name = name;
		
		io.to(socket.id).emit('receive message', msg, true);
		socket.broadcast.emit('receive message', msg);
	});
	
});

http.listen(3000, function(){
	console.log('server on..');
});

