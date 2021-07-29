function addNews(text_data, time){
	var data = $('#news-history');
	data.append("<p><b>", time, "<b> ", text_data);
}

$(document).on('click', '#in-quiz', function(){
	$(location).attr('href', "/create-config.html");
});

$(document).on('click', '#enter-data', function(){
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

$(document).on('click', '#report-for-the-speriod', function(){
	var startPeriod = $('#start-period');
	var endPeriod = $('#end-period');
	var url = 'api/report';
	var dfr = $.ajax({
			type: 'POST',
			url: url,
			data: {
				'start': startPeriod.val(),
				'end': endPeriod.val()
			},
			dataType: 'json'
		});
		
	dfr.done(function(data){
		console.log('add report');
	});

	dfr = $.ajax({
		type: 'GET',
		url: url,
		dataType: 'json'
	});

	dfr.done(function(data){
		console.log('get report');
		var hrefText = $('#href-report');
		hrefText.val(data['report']);
	});
});

$(document).on('click', '#quiz-page', function(){
	console.log('new page');
	$(location).attr('href', "/create-config.html");
});

$(document).on('click', '#report-page', function(){
    $(location).attr('href', "/report.html");
});