$( document ).on("click", "#sign-in", function(){
	
		var email = $("#floatingInput");
		var password = $("#floatingPassword");
		var url = "api/login";
		
		var dfr =$.ajax({
			type: 'POST',
			url: url,
			data: {
				"email": email.val(),
				"password": password.val()
			},
			dataType: "json"
		});
		
		email.val("");
		password.val("");
		
		dfr.done(function(){
			console.log("good job");
			$(location).attr('href', "/news.html");
		});
});