// Socket.io practice

var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs');

app.listen(3000);

function handler (req, res){
	fs.readFile('index.html', function(err, data){
		if (err){
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

// 1. connection : 유저가 웹사이트 오픈시 자동발생하는 이벤트. 이벤트 내부 함수엔 접속유저의 소켓이 파라미터로 전달됨. 접속한 각 클라이언트에 대한 이벤트 작성하려면 이 connection 리스너 함수 안에서 socket을 사용!
// connection 안에 각 이벤트를 작성할 때는 socket.on('EVENT 이름', 함수or변수) 형식.
io.on('connection', function(socket){ 
	// socket.emit은 event를 발생시키는 함수. 이렇게 서버쪽에서 이벤트를 발생시 클라이언트페이지의 해당 이벤트 리스너에서 처리함.
	// socket.emit을 이용하면 해당 socket을 통해 상대편으로 전달 io.emit을 이용하면 서버가 현재 접속해있는 모든 클라이언트에게 전달
	// 이 코드에서는 사용자가 맨 처음으로 접속했을 때 news 이벤트가 발생하게 되며, serverData라는 변수에 문자열을 넣어서 전달
	socket.emit('news', { serverData : "서버 작동" }); 
	
	socket.on('client login', function(data){ // 2. client login 만듦. 콘솔창에 전달받은 data 출력
		console.log(data);
	});
	
	socket.on('disconnect', function(){ // 3. disconnect : 사용자 접속이 끊어지면 자동으로 발생.  단, disconnect 이벤트는 개별 클라이언트가 접속이 끊어졌을 때 발생하는 이벤트이므로 io.on이 아닌 socket.on으로!!
		console.log('접속이 종료되었습니다.');
	});
	
});