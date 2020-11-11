var timer = null;
var editing = false;

var load = function(){
	if(!editing){ // 작성중이 아니라면
		$.get('/load', function(data){
			$('#wall').empty();
			$(data).each(function(i){
				var id = this._id;
					
				// 1.빈 아이템을 먼저 붙임
				$('#wall').prepend("<div class='item'><div class='left'></div></div class='right'></div></div>");
				
				$('#wall .item:first .left').append("<img class='photo_thumb' src='"+ this.picture+"'/>");
				$('#wall .item:first .right').append("<div class='author'><b>"+this.author+"</b>("+this.date+")&nbsp;&nbsp; <span class='text_button modify'>수정</span> <span class='text_button del'>삭제</span> <span class='text_button like'>좋아요</span></div>");
				$("#wall .item:first .right").append("<div class='contents "+id+"'>"+this.contents+"</div>");
				$("#wall .item:first .right").append("<div class='likes'>LIKE : "+this.like+"</div>");
				$("#wall .item:first .right").append("<div class='comments'></div>");
				
				
				
			})
		})
	}
}