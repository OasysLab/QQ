var app = angular.module('myApp', []);
app.config(function($interpolateProvider){
	$interpolateProvider.startSymbol('//').endSymbol('//');
});
app.controller('myCtrl', ['$scope', '$http', function(s,h) {
	s.submit = function() {
		console.log("submit");
		console.log(s.username);
		console.log(s.password);
		var data={ 'username': s.username, 'password' : s.password ,'url':'/authen/index.php?a=in'};
		h({
		method : 'POST',
		url : 'index/curl',
		headers: {
	    'Content-Type': 'application/json',
	    'Accept': 'application/json'
	 	},
		data: data,
		})
		.success(function(res){
			console.log("success");
			console.log(res);
			var datain = angular.fromJson(res)
			if(datain.status == 200)
			{
				console.log("200");
				s.res = datain;
				console.log(s.res);
				window.location.href = 'account/index';
			}
			else
			{				
				s.errorcode = datain.result.msg;
				s.errorshow = true;
				console.log(datain.result.msg);
				s.res =datain.status;
				console.log(s.errorcode);
			}
			//console.log(res);
			
		})
		.error(function(error){
			console.log("error");
			console.log(error);
		});

    };
}]);