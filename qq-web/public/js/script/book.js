//$scope = s;
//$http = h;

//page dashboard
var dash = angular.module('bookDash', ['datatables', 'datatables.bootstrap', 'chart.js'])

.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//').endSymbol('//');
})

.controller('bookDashboard', ['$scope', '$http', function(s,h) {

  h.get('getapi')
    .success(function(res){
      console.log("success");
      console.log(res);
      
    })
    .error(function(error){
      console.log("error");
      console.log(error);
    });



	s.active = {
		name: 'Active',
		count: 350,
		complete: 50,
		ncomplete: 300
	};

	s.nactive = {
		name: 'Non-Active',
		count: 400,
		complete: 250,
		ncomplete: 150
	};

	s.total = {
		name: 'Total',
		count: 750,
		complete: 300,
		ncomplete: 450
	};

	s.totalFuncover = function() {
		s.totalhover = true;
	};

	s.totalFuncleave = function() {
		s.totalhover = false;
	};

	s.activeFuncover = function() {
		s.activehover = true;
	};

	s.activeFuncleave = function() {
		s.activehover = false;
	};

	s.nactiveFuncover = function() {
		s.nactivehover = true;
	};

	s.nactiveFuncleave = function() {
		s.nactivehover = false;
	};
}])

.controller('tableDash', tableDash)

.controller('dotChart', ['$scope', '$http', function(s,h) {
  s.labels = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  s.series = ['Books'];
  s.data = [
    [65, 59, 80, 81, 56, 55, 40, 12, 45, 67, 12, 45]
  ];
  s.onClick = function (points, evt) {
    console.log(points, evt);
  };
  s.colours = ['#f57e0a'];
}]);

function tableDash(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder
        .fromSource('//l-lin.github.io/angular-datatables/data.json')
        .withPaginationType('full')
        .withDOM('lfrtp')
        .withOption('bLengthChange', false)
        .withOption('iDisplayLength', 10);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('firstName').withTitle('Subject'),
        DTColumnBuilder.newColumn('lastName').withTitle('Total'),
        DTColumnBuilder.newColumn(null).withTitle('Complete'),
        DTColumnBuilder.newColumn(null).withTitle('Non-Complete')
    ];
};





//page manage
var man = angular.module('bookMan', ['datatables', 'datatables.bootstrap'])

.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//').endSymbol('//');
})

.controller('tableMan', tableMan);
/*function tableMan(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder
        .fromSource('//l-lin.github.io/angular-datatables/data.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name'),
        DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().renderWith(function(data, type, full) {
        	return '<button class="btn btn-success btn-sm" id="'+ data.id +'">Edit</button>';
        })
    ];
};*/
function tableMan(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder
        .fromSource('//l-lin.github.io/angular-datatables/data.json')
        .withPaginationType('full')
        .withDOM('lfrtp')
        .withOption('bLengthChange', false)
        .withOption('iDisplayLength', 10);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('firstName').withTitle('Book'),
        DTColumnBuilder.newColumn('lastName').withTitle('Description'),
        DTColumnBuilder.newColumn(null).withTitle('Status'),
        DTColumnBuilder.newColumn(null).withTitle('Create'),
        DTColumnBuilder.newColumn(null).withTitle('Update')
    ];
};





//page View
var sh = angular.module('bookShow', ['datatables', 'datatables.bootstrap'])

.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//').endSymbol('//');
})

.controller('tableView', tableView);
function tableView(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder
        .fromSource('//l-lin.github.io/angular-datatables/data.json')
        .withPaginationType('full')
        .withDOM('lfrtp')
        .withOption('bLengthChange', false)
        .withOption('iDisplayLength', 10);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('firstName').withTitle('Book'),
        DTColumnBuilder.newColumn('lastName').withTitle('Description'),
        DTColumnBuilder.newColumn(null).withTitle('Status'),
        DTColumnBuilder.newColumn(null).withTitle('Create'),
        DTColumnBuilder.newColumn(null).withTitle('Update')
    ];
};





//page Add
var add = angular.module('bookAdd', ['ngMaterial', 'ngMessages', 'datatables', 'ui.bootstrap'])

.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//').endSymbol('//');
})

.controller('detailCover', ['$scope', '$http', function(s,h){
	s.choices = [{
		id: 'Name',
		name: 'Author'
	}];

	s.addNewChoice = function(idx) {
		//console.log(idx);
		var newItemNo = s.choices.length + 1;

		s.choices.push({
			'id': newItemNo,
			'name': 'Author',
			'placeholder': 'Author Name'
		});
	};

	s.removeNewChoice = function(idx) {
		if(s.choices.length >= 2){
			s.choices.splice(idx, 1);
		}
	};

	s.showAddChoice = function(choice) {
		return choice.id === s.choices[s.choices.length - 1].id;
	};

	s.showRemoveChoice = function(choice) {
		if(s.choices.length>=2){
			return choice.id;
		}
	};

	s.trans = [{
		id: 'Name',
		name: 'Translate'
	}];

	s.addNewTran = function(idx) {
		//console.log(idx);
		var newItemNo = s.trans.length + 1;

		s.trans.push({
			'id': newItemNo,
			'name': 'Translate',
			'placeholder': 'Translate Name'
		});
	};

	s.removeNewTran = function(idx) {
		if(s.trans.length >= 2){	
			s.trans.splice(idx, 1);
		}
	};

	s.showAddTran = function(tran) {
		return tran.id === s.trans[s.trans.length - 1].id;
	};

	s.showRemoveTran = function(tran) {
		if(s.trans.length>=2){
			return tran.id;
		}
	};
}])

.controller('detailStatus', ['$scope', '$http', function(s,h){
	s.messageStatus = 'Non-Active';
	s.messageLock = 'Unlock';
	
	s.onChangeStatus = function(state) {
		if(state === true) {
			s.messageStatus = 'Active';
		}else {
			s.messageStatus = 'Non-Active';
		}
	};

	s.onChangeLock = function(state) {
		if(state === true) {
			s.messageLock = 'Lock';
		}else {
			s.messageLock = "Unlock";
		}
	}
}])

.controller('componentTableLink', function($scope, DTOptionsBuilder, DTColumnBuilder){
	$scope.dtOptions = DTOptionsBuilder.fromSource('//l-lin.github.io/angular-datatables/data.json')
		.withPaginationType('full')
		.withDOM('lfrtp')
		.withOption('bLengthChange', false)
		.withOption('iDisplayLength', 20);
		//.withOption('rowCallback', showModal);
	$scope.dtColumns = [
		DTColumnBuilder.newColumn('firstName').withTitle('Book'),
		DTColumnBuilder.newColumn('lastName').withTitle('Point')
	];
})

/*function showModal(nRow, aData, iDisplayIndex, iDisplayIndexFull){
	$('td', nRow).unbind('click');
	$('td', nRow).bind('click', function() {
		s.$apply(function() {
			this.someClickHandler(aData);
		});
	});
	return nRow;
}

function someClickHandler(info) {
	this.message = info.id + ' - ' + info.firstName;
}*/

.controller('selectsplitter', ['$scope', '$http', '$compile', function(s, h, c) {

  s.first = {
    available: [{
      "id": "1",
      "name": "Option A",
      "status": "red"
    }, {
      "id": "2",
      "name": "Option B",
      "status": "purple"
    }, {
      "id": "3",
      "name": "Option C",
      "status": "blue"
    }],
  };

  s.second = {
    available: [{
      "id": "4",
      "name": "Option AA",
      "status": "red"
    }, {
      "id": "5",
      "name": "Option BB",
      "status": "blue"
    }, {
      "id": "6",
      "name": "Option CC",
      "status": "purple"
    }],
  };

  s.third = {
    available: [{
      "id": "7",
      "name": "Option AAA",
      "status": "purple"
    }, {
      "id": "8",
      "name": "Option BBB",
      "status": "red"
    }, {
      "id": "9",
      "name": "Option CCC",
      "status": "red"
    }],
  };

  s.fourth = {
    available: [{
      "id": "10",
      "name": "Option AAAA",
      "status": "blue"
    }, {
      "id": "11",
      "name": "Option BBBB",
      "status": "purple"
    }, {
      "id": "12",
      "name": "Option CCCC",
      "status": "blue"
    }],
  };

  s.selectedIndex1 = 0;
  s.selectedIndex2 = 0;
  s.selectedIndex3 = 0;
  s.selectedIndex4 = 0;

  s.clickSecond = function(e) {
    s.selectedIndex1 = e;
    var point = e;

    var placeelem = angular.element(document).find("#selectsecond");
    angular.element(document).find("#selectsecond,#selectthird,#selectfourth").empty();

    var strelem = ' \
    <li ng-repeat="seconds in second.available" value="//seconds.id//" ng-click="clickThird($index)" ng-class="{selectsplit: $index == selectedIndex2}" style="margin-left: 0px;"> \
      //seconds.name// \
      <button title="Detail" class="btn btn-circle //seconds.status//" style="float: right; padding: 0px; font-size: 10px;" ng-click="showData(seconds.id)"><i class="icon-control-play"></i></button> \
    </li>';

    var compileelem = c(strelem)(s);
    placeelem.append(compileelem);
  };

  s.clickThird = function(e) {
    s.selectedIndex2 = e;
    var point = e;

   var placeelem = angular.element(document).find("#selectthird");
    angular.element(document).find("#selectthird,#selectfourth").empty();

    var strelem = ' \
    <li ng-repeat="thirds in third.available" value="//thirds.id//" ng-click="clickFourth($index)" ng-class="{selectsplit: $index == selectedIndex3}" style="margin-left: 0px;"> \
      //thirds.name// \
      <button title="Detail" class="btn btn-circle //thirds.status//" style="float: right; padding: 0px; font-size: 10px;" ng-click="showData(thirds.id)"><i class="icon-control-play"></i></button> \
    </li>';

    var compileelem = c(strelem)(s);
    placeelem.append(compileelem);
  };

  s.clickFourth = function(e) {
    s.selectedIndex3 = e;
    var point = e;

    var placeelem = angular.element(document).find("#selectfourth");
    angular.element(document).find("#selectfourth").empty();

    var strelem = ' \
    <li ng-repeat="fourths in fourth.available" value="//fourths.id//" ng-click="clickFifth($index)" ng-class="{selectsplit: $index == selectedIndex4}" style="margin-left: 0px;"> \
      //fourths.name// \
      <button title="Detail" class="btn btn-circle //fourths.status//" style="float: right; padding: 0px; font-size: 10px;" ng-click="showData(fourths.id)"><i class="icon-control-play"></i></button> \
    </li>';

    var compileelem = c(strelem)(s);
    placeelem.append(compileelem);
  };

  s.clickFifth = function(e) {
    s.selectedIndex4 = e;
  };

  s.showData = function(e) {
    alert("id : "+ e);
  };
}])

.controller('componentTableRelate', function($scope, DTOptionsBuilder, DTColumnBuilder){
	$scope.dtOptions = DTOptionsBuilder.fromSource('//l-lin.github.io/angular-datatables/data.json')
		.withPaginationType('full')
		.withDOM('lfrtp')
		.withOption('bLengthChange', false)
		.withOption('iDisplayLength', 20);
	$scope.dtColumns = [
		DTColumnBuilder.newColumn(null).withTitle('Book'),
		DTColumnBuilder.newColumn(null).withTitle('Point')
	];
})

.controller('componentTableApply', function($scope, DTOptionsBuilder, DTColumnBuilder){
	$scope.dtOptions = DTOptionsBuilder.fromSource('//l-lin.github.io/angular-datatables/data.json')
		.withPaginationType('full')
		.withDOM('lfrtp')
		.withOption('bLengthChange', false)
		.withOption('iDisplayLength', 20);
	$scope.dtColumns = [
		DTColumnBuilder.newColumn(null).withTitle('Book'),
		DTColumnBuilder.newColumn(null).withTitle('Point')
	];
})

.controller('CarouselDemoCtrl', CarouselDemoCtrl);

function CarouselDemoCtrl($scope){
	$scope.myInterval = 3000;
	$scope.slides = [
		{
			position: 'Front',
			image: 'https://nutar.files.wordpress.com/2011/08/ii.jpg'
		},
		{
			position: 'Back',
			image: 'http://app.dnp.go.th/opac/multimedia/bkcover/5_55/cover.jpg'
		}
	];

	$scope.addPic = function(e){
		alert(e);
	};
};