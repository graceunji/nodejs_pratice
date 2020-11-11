var redis = require('redis');

	// 클라이언트 객체 생성
	var client = redis.createClient();
	client.on('error', function(err){
		console.log('Error ' + err);
	});

	// 값을 저장 (일반, 해쉬 테이블 저장)
	client.set('String Key', 'String Value', redis.print);
	client.hset('Hash Key', 'HashTest 1', '1');
	client.hset(['Hash Key', 'HashTest 2', '2']);

	// 값 가져옴
	client.get('String Key', function(err, v){
		if(err) throw err;
		console.log(v);
	});

	// 모든 키 값 가져옴
	client.hkeys('Hash Key', function(err, values){
		if(err) throw err;
		console.log(values.length + ' values : ');
		values.forEach(function(v, i){
			console.log(' ' + i + ': ' + v);
		});
	});

	// input은 키값, output은 배열형태로 얻음
	client.hgetall('Hash Key', function(err, obj){
		if(err) throw err;
		console.dir(obj);
		
	});


	// pub/sub 예제
var subscriber = redis.createClient();
var publisher = redis.createClient();
var msg_count = 0;

	// subscriber 객체가 구독 시작 시 발생하는 콜백 함수
	subscriber.on('subscribe', function(channel, count) {
		// 구독 시작 후 publisher 객체가 발행 하도록 함.(일치하는 채널만)
		publisher.publish('my Channel', '첫번째 공지 메시지 입니다');
		publisher.publish('my Channel', '두번째 공지 메시지 입니다');
		publisher.publish('my Channel', '마지막 공지 메시지 입니다');
	});

	// subscriber 객체가 메시지를 받으면 호출되는 함수
	subscriber.on('message', function(channel, message){
		console.log('채널명: '+channel+', 메시지: '+message);
		msg_count += 1;
		
		// 메시지를 3번 보냈을 시 subscriber 구독 종료, 구독/발행자 종료
		if(msg_count == 3){
			subscriber.unsubscribe();
			subscriber.end();
			publisher.end();
		}
	});

	// 구독 시작!
	subscriber.subscribe('my Channel');






	
	






