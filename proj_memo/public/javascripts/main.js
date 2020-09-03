let load = null;
let write = null;
let modify = null;
let del = null;

$(document).ready(function(){
	load = function(){
		// 서버에 /load라는 API를 요청하기 위해 $.get()이라는 메서드를 사용
		// 서버가 성공적으로 데이터 반환시 그 결과(data) 저장됨 data=메모들
		//.get() 함수는 $.ajax()의 단축 함수 $.ajax({ url: url, data: data, success: success, dataType: dataType })
		$.get('/load', function(data){
			$("#memo").empty();
			
			$(data).each(function(i){ // 포문 돌며 각 메모 출력
				var id = this._id; 
				
				console.log(this);
				console.log(this._id);
				
				$("#memo").prepend("<div class='item'></div>");
				$("#memo .item:first").append("<div class='photo_thumb></div>");
				$("#memo .item:first").append(
					"<div class='author'>" +
						"<b>" + this.author + "</b> (" + this.date + ")&nbsp;&nbsp;" +
						"<span class='text_button modify'>MODIFY</span>" +
						"<span class='text_button del'>DELETE</span>" +
					"</div>");
				$("#memo .item:first").append(
					"<div class='contents " + id + "'>" + this.contents + "</div>");
				
				var cnt = 0;
					
				$("#memo .item:first .modify").click(function(evt){ // modify버튼 눌렀을 때
					var contents = $("#memo ."+id).html();
					if(cnt==0){
						$("#memo ." + id).html("<textarea id='textarea_"+ id +"'class 'textarea_modify'>"+contents+"</textarea>");
						cnt = 1;
					}
					$("#textarea_"+id).keypress(function(evt){
						if((evt.keyCode || evt.which) == 13){ // 키보드에서 엔터버튼이 눌려지면 수정!
							if(this.value != ""){
								modify(this.value, id);
								evt.preventDefault();
							}
						}
					});
				});
				
				$("#memo .item:first .del").click(function(evt){ // del 버튼이 눌렸을 때
					del(id);
				})
			});
		});
	}; // load 끝
	
	modify = function(contents, id){
		var postdata = {
			'author' : $("#author").val(),
			'contents' : contents,
			'_id' : id
		};
		
		$.post('/modify', postdata, function(){
			load();
		});
	};
	
	write = function(contents){
		var postdata = {
			'author' : $("#author").val(),
			'contents' : contents
		};
		$.post('/write', postdata, function(){
			load();
		});
	};
	
	del = function(id){
		console.log(id);
		var postdata = {
			'_id' : id
		};
		
		$.post('/del', postdata, function(){
			load();
		});
	};
	
	$("#write textarea").keypress(function(evt){
		if((evt.keyCode || evt.which) == 13){  // 쓰기 영역에서 엔터 버튼을 눌렀을 때
			if(this.value!= "") {
				write(this.value);
				evt.preventDefault();
				$(this).val("");
			}
		}
	});

	$("#write_button").click(function(evt){  // 쓰기 버튼을 클릭했을 때
		console.log($("#write textarea").val());
		write($("#write textarea").val());
		$("#write textarea").val("");
	});

	load();
});