function addNews(text_data, time){
	var data = $('#news_history');
	data.append("<p><b>", time, "<b> ", text_data);
}


$(document).on('click', '#enter_data', function(){
	var data = $('#text');
	var url = 'api/news';
	var dfr =$.ajax({
			type: 'POST',
			url: url,
			data: {
				'text': data.val(),
			},
			dataType: 'json'
		});
		
	dfr.done(function(){
		console.log('enter data');
		now = new Date();
		ddmmyy = now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear();
		addNews(data.val(), ddmmyy);
		data.val('');
	});
	

});

$(document).ready(function(data){
	var url = 'api/news';
	var dfr =$.ajax({
			type: 'GET',
			url: url,
			dataType: 'json'
		});
		
	dfr.done(function(data){
		console.log('get data');
		for (var i = 0; i != data['news'].length; ++i){
			addNews(data['news'][i]['text'], data['news'][i]['time']);
		}
	});
	
});