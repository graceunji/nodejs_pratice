var express = require('express');
var app = express();

app.locals.pretty = true; // 코드를 예쁘게 해준다.
app.set('views','./views');
app.set('view engine', 'pug');
app.listen(3000, ()=>{
	console.log("Server has been started");
});

// 최상위 라우트로 접속 시 /test로 리다이렉트
app.get("/", (req, res)=>{
	res.redirect('/test');
});

// Pug 파일 렌더링
app.get("/test", (req,res) => {
	res.render('test', { title: '타이틀입니다', message: 'hello world~~' });
});