var adminDash = angular.module('adminDash', ['chart.js','datatables','ngRoute', 'ngMaterial'])

.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
})

.directive('loginDirective',function(){
    return{
        templateUrl:'partials/tpl/login.tpl.html'
    }

})

.factory('loginService',function($http, $location, sessionService){
    return{
        login:function(data,scope){
            var $promise = $http.post('./api-web/login.php',data); //send data to user.php
            $promise.then(function(msg){
                var uid=msg.data;
                // console.log(msg);
                if(uid){
                    //scope.msgtxt='Correct information';
                    sessionService.set('uid',uid);
                    $location.path('/status');
                }          
                else  
                {
                    scope.msgtxt='incorrect information';
                    $location.path('/login');
                }                  
            });
        },
        logout:function(){
            sessionService.destroy('uid');
            $location.path('/login');
        },
        islogged:function(){
            var $checkSessionServer=$http.post('./api-web/check_session.php');
            return $checkSessionServer;
            /*
            if(sessionService.get('user')) return true;
            else return false;
            */
        }
    }

})

.factory('sessionService', ['$http', function($http){
    return{
        set:function(key,value){
            return sessionStorage.setItem(key,value);
        },
        get:function(key){
            return sessionStorage.getItem(key);
        },
        destroy:function(key){
            $http.post('./api-web/destroy_session.php');
            return sessionStorage.removeItem(key);
        }
    };
}])


// add page
.config(function($routeProvider) {
  $routeProvider

  .when('/login', {
    templateUrl : 'pages/login.html',
    controller: 'loginCtrl'
  })

  .when('/status', {
    templateUrl : 'pages/status.html',
    controller: 'defaultCtrl'
  })

  .when('/data-quantity', {
    templateUrl : 'pages/data-quantity.html',
    controller: 'defaultCtrl'
  })

  .when('/data-quality', {
    templateUrl : 'pages/data-quality.html',
    controller: 'defaultCtrl'
  })

  .when('/config', {
    templateUrl : 'pages/config.html',
    controller: 'defaultCtrl'
  })

  .otherwise({redirectTo: '/login'});
})

.run(function($rootScope, $location, loginService){
    var routespermission = ['/status','/data-quantity','/data-quality','/config'];  //route that require login
    $rootScope.$on('$routeChangeStart', function(){
        if( routespermission.indexOf($location.path()) != -1)
        {
            var connected = loginService.islogged();
            connected.then(function(msg){
                if(!msg.data) $location.path('/login');
            });
        }
    });
})

.controller('loginCtrl', ['$scope','loginService', function ($scope,loginService) {
    $scope.msgtxt='';
    $scope.login = function(data)
    {
        loginService.login(data,$scope); //call login service
    };
}])

.controller('defaultCtrl', ['$scope','loginService', function($scope,loginService){
    
    $scope.logout = function(){
        loginService.logout();
    }
}])

.controller('StatusController', StatusController)
.controller('DataQuantityController', DataQuantityController)
.controller('DataQualityController', DataQualityController)
.controller('ConfigController', ConfigController);

function StatusController(DTOptionsBuilder, DTColumnBuilder, $http, $q, $interval, $compile ,$scope) {
    var vm = this;
    vm.dtInstance = {};
    vm.newPromise = newPromise;
    vm.reloadData = reloadData;

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        // var data = {'url' : 'http://139.59.251.210/api-prevent/ajax/getallrounds'};
        // $http.get('http://l-lin.github.io/angular-datatables/archives/data.json')

        $http({
			method : 'GET',
			url : './api-web/getallstatus.php',
			headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/json'
		 	},
			// data: data,
		})
		.then(function(result) {
			// console.log(result.data);
			var datain = angular.fromJson(result.data);
			// // console.log(datain);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    })
    // vm.dtOptions = DTOptionsBuilder.fromSource('http://l-lin.github.io/angular-datatables/archives/data.json')
        .withPaginationType('full')
        // Active Responsive plugin
        .withOption('createdRow', createdRow)
        .withOption('responsive', true);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('station_id')		.withTitle('Station ID')							  .renderWith(idHtml),        
        DTColumnBuilder.newColumn('power')			.withTitle('Power')						.notSortable().renderWith(statusHtml),
        DTColumnBuilder.newColumn('pump')			.withTitle('Pump')						.notSortable().renderWith(statusHtml),
        DTColumnBuilder.newColumn('ultrasonic')		.withTitle('Ultrasonic Sensor')			.notSortable().renderWith(statusHtml),
        DTColumnBuilder.newColumn('DO')				.withTitle('DO Sensor')					.notSortable().renderWith(statusHtml),
        DTColumnBuilder.newColumn('pH')				.withTitle('pH Sensor')					.notSortable().renderWith(statusHtml),
        DTColumnBuilder.newColumn('conductivity')	.withTitle('Conductivity Sensor')		.notSortable().renderWith(statusHtml),
        DTColumnBuilder.newColumn('temperature')	.withTitle('Water Temperature Sensor')	.notSortable().renderWith(statusHtml)
    ];

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    $interval(function() {
    	vm.dtInstance.changeData(vm.newPromise());
    }, 60000);

    function newPromise() {
    	var defer = $q.defer();
        $http({
			method : 'GET',
			url : './api-web/getallstatus.php',
			headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/json'
		 	},
			// data: data,
		})
		.then(function(result) {
			// console.log(result.data);
			var datain = angular.fromJson(result.data);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    }

    function reloadData() {
        var resetPaging = true;
        vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback(json) {
        console.log(json);
    }

    function idHtml(data, type, full, meta) {
        // console.log(data);
        return  '<div style="text-align: center;">'+ data +'</div>';
        
        
    }

    function statusHtml(data, type, full, meta) {
        if(data == 0)
        {
            return '<div class="btn btn-danger" style="width:100px"  title="'+data+'" data-toggle="tooltip" data-placement="top" tooltip></div>';
        
        }
        else
        {

            return '<div class="btn btn-success" style="width:100px"  title="'+data+'" data-toggle="tooltip" data-placement="top" tooltip></div>';
        }
    }

    
}

function DataQuantityController(DTOptionsBuilder, DTColumnBuilder, $http, $q, $interval, $compile ,$scope) {
    var vm = this;
    vm.dtInstance = {};
    vm.newPromise = newPromise;
    vm.reloadData = reloadData;
    vm.newPromise = newPromise;
    

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        // var data = {'url' : 'http://139.59.251.210/api-prevent/ajax/getallrounds'};
        // $http.get('http://l-lin.github.io/angular-datatables/archives/data.json')

        $http({
			method : 'GET',
			url : './api-web/getallquantity.php',
			headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/json'
		 	},
			// data: data,
		})
		.then(function(result) {
			// console.log(result.data);
			var datain = angular.fromJson(result.data);
			// // console.log(datain);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    })
    // vm.dtOptions = DTOptionsBuilder.fromSource('http://l-lin.github.io/angular-datatables/archives/data.json')
        .withPaginationType('full')
        // Active Responsive plugin
        .withOption('order', [1,'desc'])
        .withOption('responsive', true);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('station_id')		.withTitle('Station ID'),
        DTColumnBuilder.newColumn('time_receive')	.withTitle('Time receive'),        
        DTColumnBuilder.newColumn('ultrasonic')		.withTitle('Ultrasonic')
    ];

    $interval(function() {
    	vm.dtInstance.changeData(vm.newPromise());
    }, 60000);

    function newPromise() {
    	var defer = $q.defer();
        // var data = {'url' : 'admindash/currentcon'};
        // $http.get('http://l-lin.github.io/angular-datatables/archives/data.json')

        $http({
			method : 'GET',
			url : './api-web/getallquantity.php',
			headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/json'
		 	},
			// data: data,
		})
		.then(function(result) {
			// console.log(result.data);
			var datain = angular.fromJson(result.data);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    }

    function reloadData() {
        var resetPaging = true;
        vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback(json) {
        console.log(json);
    }
}

function DataQualityController(DTOptionsBuilder, DTColumnBuilder, $http, $q, $interval, $compile ,$scope) {
    var vm = this;
    vm.dtInstance = {};
    vm.newPromise = newPromise;
    vm.reloadData = reloadData;
    vm.newPromise = newPromise;
    

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        // var data = {'url' : 'http://139.59.251.210/api-prevent/ajax/getallrounds'};
        // $http.get('http://l-lin.github.io/angular-datatables/archives/data.json')

        $http({
			method : 'GET',
			url : './api-web/getallquality.php',
			headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/json'
		 	},
			// data: data,
		})
		.then(function(result) {
			// console.log(result.data);
			var datain = angular.fromJson(result.data);
			// // console.log(datain);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    })
    // vm.dtOptions = DTOptionsBuilder.fromSource('http://l-lin.github.io/angular-datatables/archives/data.json')
        .withPaginationType('full')
        // Active Responsive plugin
        .withOption('order', [1,'desc'])
        .withOption('responsive', true);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('station_id')		.withTitle('Station ID'),
        DTColumnBuilder.newColumn('time_receive')	.withTitle('Time receive'),        
        DTColumnBuilder.newColumn('doxigen')		.withTitle('Dissolved Oxygen'),
        DTColumnBuilder.newColumn('ph')				.withTitle('pH'),
        DTColumnBuilder.newColumn('conductivity')	.withTitle('Conductivity'),
        DTColumnBuilder.newColumn('temperature')	.withTitle('Water temperature'),
    ];

    $interval(function() {
    	vm.dtInstance.changeData(vm.newPromise());
    }, 60000);

    function newPromise() {
    	var defer = $q.defer();
        // var data = {'url' : 'admindash/currentcon'};
        // $http.get('http://l-lin.github.io/angular-datatables/archives/data.json')

        $http({
			method : 'GET',
			url : './api-web/getallquality.php',
			headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/json'
		 	},
			// data: data,
		})
		.then(function(result) {
			// console.log(result.data);
			var datain = angular.fromJson(result.data);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    }

    function reloadData() {
        var resetPaging = true;
        vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback(json) {
        console.log(json);
    }
}

function ConfigController(DTOptionsBuilder, DTColumnBuilder, $http, $q, $interval, $compile ,$scope) {
    var vm = this;
    vm.dtInstance = {};
    vm.newPromise = newPromise;
    vm.reloadData = reloadData;
    vm.update = update;
    $scope.persons = {};

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();

        $http({
            method : 'GET',
            url : './api-web/getallconfig.php',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            // data: data,
        })
        .then(function(result) {
            // console.log(result.data);
            var datain = angular.fromJson(result.data);
            // console.log(datain);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    })

        .withPaginationType('full')
        // Active Responsive plugin
        .withOption('responsive', { details: { renderer: renderer }})
        .withOption('order',[0,'asc'])
        .withOption('createdRow', createdRow);
    vm.dtColumns = [
        DTColumnBuilder.newColumn(null)			.withTitle('Station ID')						  .renderWith(idHtml),       
        DTColumnBuilder.newColumn(null)			.withTitle('Delay reset')			.notSortable().renderWith(delayresetHtml),
        DTColumnBuilder.newColumn(null)			.withTitle('Duration pump error')	.notSortable().renderWith(pumperrorHtml),
        DTColumnBuilder.newColumn(null)			.withTitle('Rain overflow')			.notSortable().renderWith(overflowHtml),
        DTColumnBuilder.newColumn(null)			.withTitle('Rain work')				.notSortable().renderWith(workHtml),
        DTColumnBuilder.newColumn(null)			.withTitle('Number data')			.notSortable().renderWith(numberHtml),
        DTColumnBuilder.newColumn(null)			.withTitle('Mode')					.notSortable().renderWith(modeHtml)		.withClass('none'),
        DTColumnBuilder.newColumn(null)			.withTitle('Ultrasonic routine')	.notSortable().renderWith(ultraHtml)	.withClass('none'),
        DTColumnBuilder.newColumn(null)			.withTitle('Round1 hour')			.notSortable().renderWith(r1hHtml)		.withClass('none'),
        DTColumnBuilder.newColumn(null)			.withTitle('Round1 minute')			.notSortable().renderWith(r1mHtml)		.withClass('none'),
        DTColumnBuilder.newColumn(null)			.withTitle('Round2 hour')			.notSortable().renderWith(r2hHtml)		.withClass('none'),
        DTColumnBuilder.newColumn(null)			.withTitle('Round2 minute')			.notSortable().renderWith(r2mHtml)		.withClass('none'),

    ];

    function renderer(api, rowIdx, columns) {
		var data = $.map( columns, function ( col, i ) {
			return col.hidden ?
				'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
				'<span class="dtr-title">'+
				col.title+
				'</span> '+
				'<span class="dtr-data">'+
				col.data+
				'</span>'+
				'</li>' : 
				'';
		}).join('');
			return data ?
				$compile(angular.element($('<ul data-dtr-index="'+rowIdx+'"/>').append( data )))($scope) :  
				false;
	}

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function newPromise() {
        var defer = $q.defer();
        $http({
            method : 'GET',
            url : './api-web/getallconfig.php',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            // data: data,
        })
        .then(function(result) {
            // console.log(result.data);
            var datain = angular.fromJson(result.data);
            defer.resolve(datain);
            // defer.resolve(result.data);
        });
        return defer.promise;
    }

    function reloadData() {
        var resetPaging = true;
        vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback(json) {
        console.log(json);
    }

    function update(no)
    {
    	// console.log(no);
    	// console.log($scope.persons[no]);
        if(confirm("Do you want to update station "+$scope.persons[no].station_id+"?"))
        {
            $http({
                method : 'POST',
                url : './api-web/updateconfig.php',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                data: {data:$scope.persons[no]},
            })
            .then(function(result) {
                // console.log(result.data);
                if(result.data.status == true)
                {
                    alert("Update Success");
                }
                else
                {
                    alert("Update Fail");
                }
                // var datain = angular.fromJson(result.data);
                // defer.resolve(datain);
                // // defer.resolve(result.data);
            });
        }
    }

    function idHtml(data, type, full, meta) {
        // console.log(data);
        $scope.persons[data.no] = data;
        return  '<div style="text-align: center;">'+ data.station_id +'</div>';
        
    }

	function delayresetHtml(data, type, full, meta) {
        $scope.delayreset = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
        // console.log($scope.persons[data.no]);
        return  '<select class="form-control" ng-model="persons['+data.no+'].delay_reset" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in delayreset" value="{{option}}">{{option}}</option>'+
                    '</select>';
        
        
    }

    function pumperrorHtml(data, type, full, meta) {
        $scope.pumperror = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].duration_pump_error" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in pumperror" value="{{option}}">{{option}}</option>'+
                    '</select>';
        
        
    }


    function overflowHtml(data, type, full, meta) {
        // console.log(data.no);
        return  '<input type="text" class="form-control-static" ng-model="persons['+data.no+'].rain_overflow" placeholder="Frist Api" aria-invalid="false" >'+
                '&nbsp;<a class="btn btn-success " ng-click="showCase.update(' + data.no + ')" title="Save" data-toggle="tooltip" data-placement="top" tooltip>' +
                '   <i class="fa fa-check"></i>' +
                '</a> </input>';
        
    }

    function workHtml(data, type, full, meta) {
        // console.log(data);
        return  '<input type="text" class="form-control-static" ng-model="persons['+data.no+'].rain_work" placeholder="Second Api" aria-invalid="false" >'+
                '&nbsp;<a class="btn btn-success " ng-click="showCase.update(' + data.no + ')" title="Save" data-toggle="tooltip" data-placement="top" tooltip>' +
                '   <i class="fa fa-check"></i>' +
                '</a> </input>';
        
    }

    function numberHtml(data, type, full, meta) {
        // console.log(data);
        return  '<input type="text" class="form-control-static" ng-model="persons['+data.no+'].number_data" placeholder="Second Api" aria-invalid="false" >'+
                '&nbsp;<a class="btn btn-success " ng-click="showCase.update(' + data.no + ')" title="Save" data-toggle="tooltip" data-placement="top" tooltip>' +
                '   <i class="fa fa-check"></i>' +
                '</a> </input>';
        
    }

    function modeHtml(data, type, full, meta) {
        $scope.mode = 	[
        					{"mode":1,"name" : "1 Ultrasonic only"},
        					{"mode":2,"name" : "2 Pump only"},
        					{"mode":3,"name" : "3 Both"},
        					{"mode":4,"name" : "4 Test rain sensor"}
        				];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].mode" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in mode" value="{{option.mode}}">{{option.name}}</option>'+
                    '</select>';
        
        
    }

    function ultraHtml(data, type, full, meta) {
        $scope.ultra = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].ultrasonic_routine" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in ultra" value="{{option}}">{{option}}</option>'+
                    '</select>';
        
        
    }

    function r1hHtml(data, type, full, meta) {
        $scope.r1h = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,99];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].round_H_1" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in r1h" value="{{option}}">{{option}}</option>'+
                    '</select>';
        
        
    }

    function r1mHtml(data, type, full, meta) {
        $scope.r1m = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,99];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].round_M_1" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in r1m" value="{{option}}">{{option}}</option>'+
                    '</select>';
    }

    function r2hHtml(data, type, full, meta) {
        $scope.r2h = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,99];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].round_H_2" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in r2h" value="{{option}}">{{option}}</option>'+
                    '</select>';
        
        
    }

    function r2mHtml(data, type, full, meta) {
        $scope.r2m = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,99];
        // console.log($scope.arrayTime);
        return  '<select class="form-control" ng-model="persons['+data.no+'].round_M_2" ng-change="showCase.update('+ data.no +')" required> '+
                    ' <option ng-repeat="option in r2m" value="{{option}}">{{option}}</option>'+
                    '</select>';
        
        
    }
}