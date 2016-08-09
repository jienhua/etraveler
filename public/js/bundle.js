'use strict';

angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'appRoutes', 'dndLists', 'AppCtrl', 'MainCtrl', 'TravelerCtrl', 'SearchTravelerCtrl', 'FormGenCtrl.js', 'TravelerService', 'FormService', 'DocNumService', 'CounterService']);
'use strict';

angular.module('appRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise('/home');

	// $urlRouterProvider.otherwise('/');
	$stateProvider

	// home page
	.state('home', {
		url: '/home',
		templateUrl: 'views/home.html',
		controller: 'MainController'
	}).state('traveler', {
		url: '/traveler?_id&formId',
		views: {
			'': {
				templateUrl: 'views/traveler.html',
				controller: 'TravelerController'
			},
			'formReview@traveler': {
				templateUrl: 'views/formReview.html'
				// controller: ['$scope', 'Traveler', 'Form',function($scope, Traveler, Form){
				// 	$scope.reviewData = Traveler.getReviewData();
				// 	Form.get($scope.reviewData.formId)
				// 		.success(function(data){
				// 			$scope.forms = data;
				// 	});
				// }]
				// controller: 'TravelerController'
			}
		}
	}).state('searchTraveler', {
		url: '/searchTraveler',
		views: {
			'': {
				templateUrl: 'views/searchTraveler.html',
				controller: 'SearchTravelerController'
			},
			'formReview@searchTraveler': {
				templateUrl: 'views/formReview.html'
			}
		}
	}).state('formGenerator', {
		url: '/formGenerator',
		views: {
			'': {
				templateUrl: 'views/formGeneratorNav.html',
				controller: 'FormGeneratorController'
			},
			'templateGenerator@formGenerator': {
				templateUrl: 'views/templateGenerator.html',
				controller: 'FormGeneratorController'
			},
			'templateCreator@formGenerator': {
				templateUrl: 'views/templateCreator.html',
				controller: 'FormGeneratorController'
			}
		}
	});

	$locationProvider.html5Mode(true);
}]);
'use strict';

angular.module('AppCtrl', ['ngAnimate']).controller('AppController', ['$scope', function ($scope) {

	$scope.isCollapsed = true;
}]);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

angular.module('FormGenCtrl.js', ['ui.bootstrap.tabs']).controller('FormGeneratorController', ['$scope', 'Form', function ($scope, Form) {

	$scope.submit = function (password) {
		if (!password || password === '') {
			password = prompt('password');
		}
		if (password === '123') {
			Form.create($scope.template).success(function (data) {
				// do something
				alert('add');
				$scope.create = data;
				delete $scope.template;
			});
		} else {
			alert('go home son');
		}
	};

	$scope.save = function () {
		var password = prompt('password');
		if (password === '123') {
			if ($scope.create._id) {
				Form.save($scope.create).success(function (data) {
					alert('save');
				});
			} else {
				$scope.template = $scope.create;
				$scope.submit(password);
			}
		} else {
			alert('go home');
		}
	};

	$scope.delete = function () {
		var password = prompt('password');
		if (password === 'QQmore') {
			if (confirm('delete template?')) {

				if ($scope.create._id) {
					Form.delete($scope.create._id).success(function (data) {
						alert('removed');
					});
				}
				initCreate();
			}
		} else {
			alert('go home');
		}
	};

	$scope.setSelectTab = function (n) {
		$scope.selectTab = n;
	};

	$scope.addItemRecord = function () {
		if ($scope.inputItemRecord && $scope.inputItemRecord !== '') {
			if (!$scope.create.itemRecord) {
				$scope.create.itemRecord = [];
			}
			var len = $scope.create.itemRecord.length;
			var item = {
				"id": len + 1,
				"Description": $scope.inputItemRecord
			};
			if ($scope.inputItemRecordType === 'select') {
				var holder = $scope.selectOptions;
				holder = holder.split(',');
				for (var i = 0; i < holder.length; i++) {
					holder[i] = holder[i].trim();
				}
				holder = Array.from(new Set(holder));
				item['select'] = { 'name': '' };
				item.select['options'] = holder;
			}
			$scope.create.itemRecord.push(item);
			$scope.inputItemRecord = '';
		}
	};

	$scope.addStep = function () {
		// if($scope.inputStepDes && $scope.inputStepDes !== ''){
		if (!$scope.create.steps) {
			$scope.create.steps = [];
		}
		var len = $scope.create.steps.length;
		var step = {
			"step": len + 1,
			"type": $scope.inputStepType || '',
			"Description": $scope.inputStepDes || ''
		};
		$scope.create.steps.push(step);

		$scope.inputStepDes = '';
		// }
	};

	$scope.addSubStep = function () {
		if ($scope.tempSub.inputSubStepDes && $scope.tempSub.inputSubStepDes !== '') {
			var stepIndex = $scope.tempSub.selectStepForSubStep;
			if (!$scope.create.steps[stepIndex].list) {
				$scope.create.steps[stepIndex].list = [];
			}
			var len = $scope.create.steps[stepIndex].list.length;
			var subStep = {
				"sub_step": len + 1,
				"Description": $scope.tempSub.inputSubStepDes
			};
			$scope.create.steps[stepIndex].list.push(subStep);
			$scope.tempSub.inputSubStepDes = '';
		}
	};

	$scope.addSubOption = function () {
		var step = $scope.tempSubOption.selectSubForOption.split(',')[0];
		var sub = $scope.tempSubOption.selectSubForOption.split(',')[1];
		var selectOption = $scope.tempSubOption.subOptions.selectSubOption;
		var options = $scope.tempSubOption.subOptions.option.input.split(',');
		for (var i = 0; i < options.length; i++) {
			options[i] = options[i].trim();
		}
		options = Array.from(new Set(options));
		var subStepOption = {
			"type": selectOption,
			"name": $scope.tempSubOption.subOptions.option.name,
			"options": options
		};
		if (!$scope.create.steps[step].list[sub].options) {
			$scope.create.steps[step].list[sub].options = [];
		}
		$scope.create.steps[step].list[sub].options.push(subStepOption);
		//$scope.create.steps[step].list[sub][selectOption] = subStepOption;
		$scope.tempSubOption.subOptions.option.name = '';
		$scope.tempSubOption.subOptions.option.input = '';
	};

	$scope.modifyID = function (object, type) {
		for (var i = 0; i < object.length; i++) {
			if (type === 'itemRecord') {
				object[i].id = i + 1;
			}
			if (type === 'steps') {
				object[i].step = i + 1;
			}
			if (type === 'sub_step') {
				object[i].sub_step = i + 1;
			}
		}
	};

	$scope.editOption = function (address, input) {
		console.log(typeof input === 'undefined' ? 'undefined' : _typeof(input));
		console.log(input);
		if (address) {
			address.options = [];
			if (typeof input === 'string') {
				input = input.split(',');
			}
			for (var i = 0; i < input.length; i++) {
				address.options[i] = input[i].trim();
			}
			address.options = Array.from(new Set(address.options));
		}
	};

	$scope.updateForm = function () {
		$scope.travelerData = {};
		if ($scope.formId) {
			Form.get($scope.formId).success(function (data) {
				// $scope.forms = data;       
				// // find the last subStep
				// $scope.lastStep = data.steps.length;
				// // init the travelerData from formData
				// $scope.travelerData.formId = data._id;
				// $scope.travelerData.formRev = data.formRev;
				// $scope.travelerData.formNo = data.formNo;
				// $scope.travelerData.customer = data.customer;
				// $scope.travelerData.status = 'OPEN';
				$scope.create = data;
			});
		}
	};

	var initCreate = function initCreate() {
		$scope.create = {};
		$scope.create.isPublish = false;
	};

	var loadFormList = function loadFormList() {
		Form.getFormList().success(function (data) {
			$scope.formList = data;
		});
	};

	var main = function main() {

		initCreate();
		loadFormList();

		$scope.inputItemRecordType = 'text';
		$scope.jsonView = false;
	};

	main();
}]);
'use strict';

angular.module('MainCtrl', []).controller('MainController', ['$scope', function ($scope) {

	$scope.tagline = 'to the moon and back!';
}]);
'use strict';

angular.module('SearchTravelerCtrl', ['chart.js']).controller('SearchTravelerController', ['$scope', 'Traveler', function ($scope, Traveler) {

	$scope.search = function () {
		$scope.currentInput = $scope.searchInput;
		$scope.isSearch = true;
		if ($scope.searchInput) {
			if ($scope.searchOption === 'sn') {
				var sn = $scope.searchInput.toString();
				Traveler.searchLike(sn).success(function (data) {
					$scope.result = data;
					findStatistics();
				});
			} else {
				// search doc num
				Traveler.normalSearch($scope.searchOption, $scope.searchInput).success(function (data) {
					$scope.result = data;
					findStatistics();
				});
			}
		}
	};

	$scope.editTraveler = function (_id, formId) {
		window.open('traveler?_id=' + _id + '&formId=' + formId, '_blank');
	};

	$scope.removeTraveler = function (_id, index) {
		Traveler.removeTraveler(_id).success(function (data) {
			// $scope.result=data;
			$scope.result.splice(index, 1);
		});
	};

	$scope.timeSpend = function (data) {
		if (data.reviewAt) {
			var diff = Math.round((new Date(data.reviewAt) - new Date(data.createAt)) / 1000);
			$scope.totalTimeSpand += diff;
			return calulateTime(diff);
		} else {
			var _diff = Math.round((new Date() - new Date(data.createAt)) / 1000);
			$scope.totalTimeSpand += _diff;
			return calulateTime(_diff);
		}
	};

	$scope.totalTimeSpend = function () {

		return 5;
	};

	var calulateTime = function calulateTime(seconds) {
		return Math.floor(seconds / 60 / 60) + ' Hours and ' + Math.floor(seconds / 60) % 60 + ' min and ' + seconds % 60 + ' sec';
	};

	// $scope.printTraveler = function(index){
	// 	$scope.travelerData = $scope.result[index];
	// var printContents = document.getElementById('div-id-selector').innerHTML;
	//    var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
	//    popupWin.window.focus();
	//    popupWin.document.open();
	//    popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>' +
	//        '<link rel="stylesheet" type="text/css" href="libs/boosaveDocNumtstrap/dist/css/bootstrap.min.css">' +
	//        '</head><body onload="window.print(); window.close();"><div>' + printContents + '</div></html>');
	//    popupWin.document.close();
	// }

	var findStatistics = function findStatistics() {
		$scope.stat = {};
		$scope.pieLabels1 = [];
		$scope.pieData1 = [];
		var data = $scope.result;
		for (var i = 0; i < data.length; i++) {
			if (data[i].status in $scope.stat) {
				$scope.stat[data[i].status] += 1;
			} else {
				$scope.pieLabels1.push(data[i].status);
				$scope.stat[data[i].status] = 1;
			}
		}
		$scope.stat.total = data.length;
		var reject = 0;
		var completed = 0;
		// calulate percent of total complated out of total
		if ($scope.stat.REJECT) {
			reject = $scope.stat.REJECT;
		}

		if ($scope.stat.COMPLETED) {
			completed = $scope.stat.COMPLETED;
		}
		$scope.stat.pecComplete = ((completed + reject) / data.length * 100).toFixed(2);

		// calulate percent of reject out of total
		if ($scope.stat.REJECT / data.length * 100) {
			$scope.stat.pecReject = (reject / data.length * 100).toFixed(2);
		} else {
			$scope.stat.pecReject = 0;
		}

		for (var _i = 0; _i < $scope.pieLabels1.length; _i++) {
			$scope.pieData1.push($scope.stat[$scope.pieLabels1[_i]]);
		}

		$scope.pieLabels2 = ['Finish', 'Hold'];
		$scope.pieData2 = [completed + reject, $scope.stat.total - (completed + reject)];
	};

	var init = function init() {
		$scope.isSearch = false;
		$scope.searchOption = 'docNum';
		$scope.sortType = 'createAt';
		$scope.sortReverse = false;
		$scope.travelerData = {};
		$scope.totalTimeSpand = 0;
	};

	var main = function main() {
		init();
	};
	main();
}]);
'use strict';

angular.module('TravelerCtrl', []).filter('unique', function () {
	return function (collection, keyname) {
		var output = [],
		    keys = [];

		angular.forEach(collection, function (item) {
			var key = item[keyname];
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	};
}).controller('TravelerController', ['$scope', 'Traveler', 'Form', 'DocNum', 'Counter', '$stateParams', function ($scope, Traveler, Form, DocNum, Counter, $stateParams) {

	$scope.checkReadyReview = function () {
		if ($scope.travelerData.status && $scope.travelerData.status !== 'OPEN') {
			$scope.travelerData.status = 'OPEN';
			$scope.travelerData.readyReview = false;
		} else {
			$scope.travelerData.status = 'PANDING FOR REVIEW';
			$scope.travelerData.readyReview = true;
		}
	};

	$scope.updateForm = function () {
		$scope.travelerData = {};
		if ($scope.formId) {
			Form.get($scope.formId).success(function (data) {
				$scope.forms = data;
				// find the last subStep
				$scope.lastStep = data.steps.length;
				// init the travelerData from formData
				$scope.travelerData.formId = data._id;
				$scope.travelerData.formRev = data.formRev;
				$scope.travelerData.formNo = data.formNo;
				$scope.travelerData.customer = data.customer;
				$scope.travelerData.status = 'OPEN';
				loadDocNumList(data._id, function () {});
			});
		}
	};

	$scope.updateDocNum = function () {
		$scope.selectSNList = [];
		$scope.isWorkFind = false;
		$scope.docNum.docNumData = $scope.docNum.docNumSelectList[$scope.docNum.docNumSelect];
		setNumDoctoTraveler();

		// call a function to use docnum to return the list of serial number associate with
		// this docnum
		getSNList($scope.docNum.docNumData._id);
	};

	$scope.nextStep = function () {
		var object = $scope.forms.steps[$scope.currentStep - 1];
		if (object.list.length >= $scope.currentSubStep + 1) {
			$scope.currentSubStep += 1;
		} else {
			$scope.currentStep += 1;
			$scope.currentSubStep = 1;
			if ($scope.currentStep > $scope.lastStep) {
				// Traveler.setReviewData($scope.travelerData);
				// $scope.travelerData.readyReview = true;		
				$scope.checkReadyReview();
			}
		}
	};

	$scope.statusPage = function (page) {
		$scope.currentSubStep = 1;
		$scope.currentStep = page;
		// $scope.travelerData.readyReview = false;
		// $scope.checkReadyReview();
	};

	$scope.statusSubPage = function (page) {
		$scope.currentSubStep = page;
	};

	$scope.goBack = function () {
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		// $scope.travelerData.readyReview = false;
		$scope.checkReadyReview();
	};

	$scope.save = function () {

		var idList = [];
		for (var i = 0; i < $scope.selectSNList.length; i++) {
			idList.push($scope.selectSNList[i]._id);
		}

		var data = {
			idList: idList,
			travelerData: $scope.travelerData
		};
		Traveler.updateMultiple(data).success(function (data) {});
	};

	$scope.review = function (option) {
		if ($scope.travelerData.reviewBy) {
			if (option === 'reject') {
				$scope.travelerData.status = 'REJECT';
			} else if (option === 'complete') {
				$scope.travelerData.status = 'COMPLETED';
			}
			$scope.travelerData.reviewAt = new Date();
			$scope.save();
		} else {
			alert('enter reviewer name');
		}
	};

	$scope.submit = function () {
		if ($scope.username && $scope.travelerData.sn) {
			// $scope.travelerData.completed = false;
			// setNumDoctoTraveler();
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = $scope.username;
			$scope.travelerData.createAt = new Date();
			Traveler.create($scope.travelerData)

			// if successful create
			.success(function (data) {
				// console.log(data);
				$scope.travelerData = data;
				alert('submit complete');
				shouldCollapse();
			});
		} else {
			alert('enter your name or serial number plz ');
		}
	};

	$scope.new = function () {
		reset();
	};

	$scope.delete = function () {
		alert('delete click');
		if ($scope.travelerData._id) {
			Traveler.removeTraveler($scope.travelerData._id).success(function (data) {
				reset();
			});
		}
	};

	$scope.appendSubStepEditInfo = function () {
		var username = $scope.username;
		if (username !== '') {
			var currentStep = $scope.currentStep;
			var currentSubStep = $scope.currentSubStep;
			$scope.travelerData.step[currentStep][currentSubStep].editBy = username;
			$scope.travelerData.step[currentStep][currentSubStep].editTime = new Date();
			return true;
		}
		alert('enter your name');
		return false;
	};

	$scope.printTraveler = function () {
		// var printContents = document.getElementById('div-id-selector').innerHTML;
		//    var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
		//    popupWin.window.focus();
		//    popupWin.document.open();
		//    popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>' +
		//        '<link rel="stylesheet" type="text/css" href="libs/boosaveDocNumtstrap/dist/css/bootstrap.min.css">' +
		//        '</head><body onload="window.print(); window.close();"><div>' + printContents + '</div></html>');
		//    popupWin.document.close();
		window.print();
	};

	/************************
  *
  *
  ************************/
	$scope.saveDocNum = function () {
		$scope.docNum.docNumData.formId = $scope.travelerData.formId;
		$scope.docNum.docNumData.formRev = $scope.travelerData.formRev;
		$scope.docNum.docNumData.formNo = $scope.travelerData.formNo;
		setDocNumLabel('create');
		delete $scope.docNum.docNumData._id;
		DocNum.create($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId, function (list) {
				for (var i = 0; i < list.length; i++) {
					if (list[i]._id === data._id) {
						$scope.docNum.docNumData = data;
						$scope.docNum.docNumSelect = i.toString();
						$scope.travelerData.itemRecord = { "docNum": $scope.docNum.docNumData.docNum };
					}
				}
			});
		});
	};

	$scope.editDocNum = function () {
		// setDocNumLabel('edit');
		DocNum.editDocNumData($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId, function () {});
		});
	};

	$scope.checkForSN = function () {

		// if(!$scope.travelerData._id){
		// 	Traveler.normalSearch('sn', $scope.travelerData.sn)
		// 			.success(function(data){
		// 				if(data.length > 0 ){
		// 					$scope.isSNExist = true;
		// 					$scope.searchSN = data;
		// 				}else{
		// 					$scope.isSNExist = false;
		// 				}
		// 			});
		// }

		if ($scope.inputSN) {
			// Traveler.normalSearch('sn', $scope.inputSN, '_id|sn')
			// 	.success(data=>{
			// 		if(data.length > 0){
			// 			$scope.isSNExist = true;
			// 			if(confirm('SN already exist. do you want to create a new traveler with same sn?')){
			// 				$scope.isSNExist = false;
			// 				$scope.SNListForDocNum.append({
			// 					"sn": $scope.inputSN
			// 				});
			// 				$scope.inputSN = '';
			// 			}
			// 		}else{
			// 			$scope.isSNExist = false;
			// 		}
			// 	});
			$scope.isSNExist = false;
			for (var i = 0; i < $scope.SNListForDocNum.length; i++) {
				if ($scope.SNListForDocNum[i].sn === $scope.inputSN) {
					$scope.isSNExist = true;
					if (confirm('SN already exist. do you want to create a new traveler with same sn?')) {
						$scope.isSNExist = false;
					}
					break;
				}
			}
			if (!$scope.isSNExist) {
				$scope.isSNExist = false;
				var item = {
					"sn": $scope.inputSN,
					"status": "OPEN",
					"createAt": new Date()
				};
				$scope.SNListForDocNum.push(item);
				createNewTraveler(item);
				$scope.inputSN = '';
			}
		}
	};

	$scope.moveToSelectSNList = function () {
		// console.log($scope.SNListForDocNum.length);

		var stack = [];
		for (var i = $scope.SNListForDocNum.length; i > 0; i--) {
			var el = $scope.SNListForDocNum.pop();
			if (el.checkbox === true) {
				el.checkbox = false;
				$scope.selectSNList.push(el);
			} else {
				stack.push(el);
			}
		}
		$scope.SNListForDocNum = stack;
		stack = null;
	};

	$scope.moveToSNListForDocNum = function () {
		var stack = [];
		for (var i = $scope.selectSNList.length; i > 0; i--) {
			var el = $scope.selectSNList.pop();
			if (el.checkbox === true) {
				el.checkbox = false;
				$scope.SNListForDocNum.push(el);
			} else {
				stack.push(el);
			}
		}
		$scope.selectSNList = stack;
		stack = null;
	};

	$scope.selectAllList = function (list) {
		var bool = list[0].checkbox;
		for (var i = 0; i < list.length; i++) {
			list[i].checkbox = !bool;
		}
	};

	$scope.loadTraveler = function (input) {
		if (input) {
			$scope.selectSN = input;
		}
		Traveler.normalSearch('_id', $scope.selectSN).success(function (data) {
			$scope.travelerData = data[0];
		});
	};

	$scope.searchSN = function () {
		$scope.selectSNList = [];
		Traveler.normalSearch('sn', $scope.travelerData.sn, 'sn|createAt|status').success(function (data) {
			$scope.isSNMoreThanOne = false;
			if (data.length > 1) {
				$scope.isSNMoreThanOne = true;
				$scope.searchSNList = data;
			} else {
				$scope.selectSNList.push({ "_id": data[0]._id, "sn": data[0].sn });
				$scope.selectSN = data[0]._id;
				$scope.loadTraveler();
				// console.log($scope.travelerData.formId);
				loadItemRecord();
			}
		});
	};

	$scope.setTravelerData = function (data) {
		$scope.selectSNList = [];
		$scope.selectSNList.push({ "_id": $scope.searchSNList[data]._id, "sn": $scope.searchSNList[data].sn });
		$scope.selectSN = $scope.searchSNList[data]._id;
		$scope.loadTraveler();
		loadItemRecord();
	};

	$scope.createWork = function () {
		if ($scope.selectSNList.length > 2) {
			Counter.nextSequenceValue({ name: 'workNum' }).success(function (data) {
				alert('work number ' + data.sequence_value + ' created');
				$scope.travelerData.workNum = data.sequence_value.toString();
				$scope.save();
			});
		}
	};

	$scope.searchWorkNum = function (input) {
		$scope.isWorkFind = false;
		Traveler.normalSearch('workNum', input, 'sn|createAt|status|workNum').success(function (data) {
			$scope.selectSNList = data;
			if (data.length > 0) {
				$scope.isWorkFind = true;
			}
		});
	};

	var createNewTraveler = function createNewTraveler(item) {
		// console.log(item.sn);
		if ($scope.username) {
			$scope.travelerData.sn = item.sn;
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = $scope.username;
			$scope.travelerData.createAt = item.createAt;
			Traveler.create($scope.travelerData).success(function (data) {});
		}
	};

	var getSNList = function getSNList(input) {
		Traveler.normalSearch('itemRecord.docNumId', input, 'sn|status|createAt|workNum').success(function (data) {
			$scope.SNListForDocNum = data;
		});
	};

	var shouldCollapse = function shouldCollapse() {
		if ($scope.travelerData.sn && $scope.travelerData.itemRecord.docNum) {
			$scope.topCollapse = true;
		}
	};

	var setNumDoctoTraveler = function setNumDoctoTraveler() {
		$scope.travelerData.itemRecord = {
			"docNumId": $scope.docNum.docNumData._id,
			"docNum": $scope.docNum.docNumData.docNum
		};
	};

	var setDocNumLabel = function setDocNumLabel(action) {

		var count = 1;
		if (action === 'create') {
			for (var i = 0; i < $scope.docNum.docNumSelectList.length; i++) {
				if ($scope.docNum.docNumSelectList[i].docNum === $scope.docNum.docNumData.docNum) {
					count += 1;
				}
			}
		}

		// if(action === 'edit'){
		// 	for(let i=0; i<$scope.docNum.docNumSelectList.length;i++){
		// 		if($scope.docNum.docNumSelectList[i].docNum === $scope.docNum.docNumData.docNum &&
		// 			$scope.docNum.docNumSelectList[i]._id !== $scope.docNum.docNumData._id){
		// 			count += 1;
		// 		}
		// 	}
		// }
		$scope.docNum.docNumData.label = count;
	};

	var loadFormList = function loadFormList() {
		Form.getFormList().success(function (data) {
			$scope.formList = data;
		});
	};

	var reset = function reset() {
		$scope.travelerData = {};
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		$scope.travelerData.readyReview = false;
		$scope.formId = '';
		$scope.isNew = true;
	};

	var loadDocNumList = function loadDocNumList(id, callback) {
		DocNum.getDocNumList(id).success(function (data) {
			$scope.docNum.docNumSelectList = data;
			callback(data);
		});
	};

	// load information for ItemRecord with
	// docNum.
	var loadItemRecord = function loadItemRecord() {

		DocNum.getDocNumList($scope.travelerData.formId).success(function (data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i]._id === $scope.travelerData.itemRecord.docNumId) {
					$scope.docNum.docNumData = data[i];
					$scope.docNum.docNumSelect = i.toString();
					break;
				}
			}
		});
	};

	var init = function init() {
		$scope.topCollapse = false;
		$scope.username = 'John Snow';
		$scope.docNum = {};
		$scope.isSNExist = false;
		$scope.isSNMoreThanOne = false;
		// $scope.searchSN = {};
		$scope.searchSNList = [];
		$scope.selectSN = '';
		$scope.SNListForDocNum = [];
		$scope.selectSNList = [];
		$scope.isUseWorkNum = false;
		$scope.isStartWork = true;
		$scope.selectSearchSN = '0';
		$scope.isWorkFind = false;
		$scope.input = {};
	};

	var main = function main() {

		init();
		reset();
		loadFormList();

		if ($stateParams.formId) {
			$scope.formId = $stateParams.formId;
			$scope.updateForm();
			$scope.isNew = false;
		}

		// load the traveler from Search page
		// take the pramas from URL
		if ($stateParams._id) {
			$scope.isNew = false;
			Traveler.get('_id', $stateParams._id).success(function (data) {
				// data is a array. result could be more than one
				// need to deal wit this.
				$scope.travelerData = data;
				loadItemRecord();
				shouldCollapse();
				$scope.selectSNList.push({ "_id": data._id, "sn": data.sn });
			});
		}
	};

	main();
}]);
'use strict';

angular.module('CounterService', []).factory('Counter', ['$http', function ($http) {
	return {
		nextSequenceValue: function nextSequenceValue(input) {
			return $http.post('api/counter/nextSequenceValue/', input);
		}
	};
}]);
'use strict';

angular.module('DocNumService', []).factory('DocNum', ['$http', function ($http) {

	return {
		getDocNumList: function getDocNumList(formId) {
			return $http.get('/api/docNums/' + formId);
		},
		create: function create(data) {
			return $http.post('/api/docNums/', data);
		},
		editDocNumData: function editDocNumData(data) {
			return $http.put('/api/docNums/', data);
		},
		getDocNum: function getDocNum(type, data) {
			console.log('d service');
			return $http.get('/api/docNums/searchSingle?type=' + type + '&data=' + data);
		}
	};
}]);
'use strict';

angular.module('FormService', []).factory('Form', ['$http', function ($http) {

	return {

		create: function create(data) {
			return $http.post('/api/forms', data);
		},

		getAll: function getAll() {
			return $http.get('/api/forms/');
		},

		getFormList: function getFormList() {
			return $http.get('/api/forms/formList');
		},

		get: function get(formId) {
			return $http.get('/api/forms/search/' + formId);
		},
		save: function save(data) {
			return $http.put('/api/forms', data);
		},
		delete: function _delete(formId) {
			return $http.delete('/api/forms/' + formId);
		}
	};
}]);
'use strict';

angular.module('TravelerService', []).factory('Traveler', ['$http', function ($http) {

    var reviewData = {};

    return {

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new form
        create: function create(formData) {
            return $http.post('/api/traveler', formData);
        },

        getReviewData: function getReviewData() {
            return reviewData;
        },

        get: function get(type, data) {
            return $http.get('/api/traveler?type=' + type + '&data=' + data);
        },

        save: function save(data) {
            return $http.put('/api/traveler', data);
        },

        setReviewData: function setReviewData(data) {
            reviewData = data;
        },

        searchLike: function searchLike(sn) {
            return $http.get('/api/traveler/searchLike/' + sn);
        },
        // call to DELETE a form
        removeTraveler: function removeTraveler(_id, input) {
            // console.log(_id);
            return $http.delete('/api/traveler/' + _id);
        },
        normalSearch: function normalSearch(type, data, select) {
            if (!select) {
                select = '';
            }
            return $http.get('/api/traveler/normalSearch?type=' + type + '&data=' + data + '&select=' + select);
        },
        updateMultiple: function updateMultiple(data) {
            return $http.put('/api/traveler/updateMultiple', data);
        }
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvQ291bnRlclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9Eb2NOdW1TZXJ2aWNlLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFJQyxVQUpELEVBTUMsU0FORCxFQU9DLFVBUEQsRUFRQyxjQVJELEVBU0Msb0JBVEQsRUFVQyxnQkFWRCxFQVlDLGlCQVpELEVBYUMsYUFiRCxFQWNDLGVBZEQsRUFlQyxnQkFmRCxDQUREOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsV0FBRCxDQUE1QixFQUNFLE1BREYsQ0FDUyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUF5QyxtQkFBekMsRUFDUCxVQUFTLGNBQVQsRUFBeUIsa0JBQXpCLEVBQTZDLGlCQUE3QyxFQUErRDs7QUFFL0Qsb0JBQW1CLFNBQW5CLENBQTZCLE9BQTdCOzs7QUFHQTs7O0FBQUEsRUFHRSxLQUhGLENBR1EsTUFIUixFQUdnQjtBQUNkLE9BQUssT0FEUztBQUVkLGVBQWEsaUJBRkM7QUFHZCxjQUFZO0FBSEUsRUFIaEIsRUFVRSxLQVZGLENBVVEsVUFWUixFQVVvQjtBQUNsQixPQUFLLHNCQURhO0FBRWxCLFNBQU07QUFDTCxPQUFHO0FBQ0YsaUJBQWEscUJBRFg7QUFFRixnQkFBWTtBQUZWLElBREU7QUFLTCwwQkFBc0I7QUFDckIsaUJBQWE7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Q0gsU0FkRTs7QUFnQkgsY0FBTSxjQUFTLElBQVQsRUFBYztBQUNoQixtQkFBTyxNQUFNLEdBQU4sQ0FBVSxlQUFWLEVBQTJCLElBQTNCLENBQVA7QUFDSCxTQWxCRTs7QUFvQkgsdUJBQWUsdUJBQVMsSUFBVCxFQUFjO0FBQ3pCLHlCQUFhLElBQWI7QUFDSCxTQXRCRTs7QUF3Qkgsb0JBQVksb0JBQVMsRUFBVCxFQUFZO0FBQ3ZCLG1CQUFPLE1BQU0sR0FBTixDQUFVLDhCQUE2QixFQUF2QyxDQUFQO0FBQ0EsU0ExQkU7O0FBNEJILHdCQUFnQix3QkFBUyxHQUFULEVBQWMsS0FBZCxFQUFvQjs7QUFFbkMsbUJBQU8sTUFBTSxNQUFOLENBQWEsbUJBQWtCLEdBQS9CLENBQVA7QUFDQSxTQS9CRTtBQWdDSCxzQkFBYyxzQkFBUyxJQUFULEVBQWUsSUFBZixFQUFxQixNQUFyQixFQUE0QjtBQUN0QyxnQkFBRyxDQUFDLE1BQUosRUFBVztBQUNQLHlCQUFTLEVBQVQ7QUFDSDtBQUNELG1CQUFPLE1BQU0sR0FBTixDQUFVLHFDQUFtQyxJQUFuQyxHQUF3QyxRQUF4QyxHQUFpRCxJQUFqRCxHQUFzRCxVQUF0RCxHQUFpRSxNQUEzRSxDQUFQO0FBQ0gsU0FyQ0U7QUFzQ0gsd0JBQWdCLHdCQUFTLElBQVQsRUFBYztBQUMxQixtQkFBTyxNQUFNLEdBQU4sQ0FBVSw4QkFBVixFQUEwQyxJQUExQyxDQUFQO0FBQ0g7QUF4Q0UsS0FBUDtBQTBDUCxDQTlDd0IsQ0FGekIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3NhbXBsZUFwcCcsIFxyXG5cdFtcclxuXHRcdCd1aS5yb3V0ZXInLCBcclxuXHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0J2FwcFJvdXRlcycsXHJcblx0XHQnZG5kTGlzdHMnLFxyXG5cclxuXHRcdCdBcHBDdHJsJyxcclxuXHRcdCdNYWluQ3RybCcsIFxyXG5cdFx0J1RyYXZlbGVyQ3RybCcsIFxyXG5cdFx0J1NlYXJjaFRyYXZlbGVyQ3RybCcsIFxyXG5cdFx0J0Zvcm1HZW5DdHJsLmpzJyxcclxuXHRcdFxyXG5cdFx0J1RyYXZlbGVyU2VydmljZScsIFxyXG5cdFx0J0Zvcm1TZXJ2aWNlJyxcclxuXHRcdCdEb2NOdW1TZXJ2aWNlJyxcclxuXHRcdCdDb3VudGVyU2VydmljZSdcclxuXHRdXHJcbik7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcFJvdXRlcycsIFsndWkucm91dGVyJ10pXHJcblx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicgLFxyXG5cdFx0ZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpe1xyXG5cclxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9ob21lJyk7XHJcblxyXG5cdFx0Ly8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cdFx0JHN0YXRlUHJvdmlkZXJcclxuXHJcblx0XHRcdC8vIGhvbWUgcGFnZVxyXG5cdFx0XHQuc3RhdGUoJ2hvbWUnLCB7XHJcblx0XHRcdFx0dXJsOiAnL2hvbWUnLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvaG9tZS5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnTWFpbkNvbnRyb2xsZXInXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRcclxuXHRcdFx0LnN0YXRlKCd0cmF2ZWxlcicsIHtcclxuXHRcdFx0XHR1cmw6ICcvdHJhdmVsZXI/X2lkJmZvcm1JZCcsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RyYXZlbGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdmb3JtUmV2aWV3QHRyYXZlbGVyJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybVJldmlldy5odG1sJ1xyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiBbJyRzY29wZScsICdUcmF2ZWxlcicsICdGb3JtJyxmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHQkc2NvcGUucmV2aWV3RGF0YSA9IFRyYXZlbGVyLmdldFJldmlld0RhdGEoKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRGb3JtLmdldCgkc2NvcGUucmV2aWV3RGF0YS5mb3JtSWQpXHJcblx0XHRcdFx0XHRcdC8vIFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0XHRcdFx0Ly8gfV1cclxuXHRcdFx0XHRcdFx0Ly8gY29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQuc3RhdGUoJ3NlYXJjaFRyYXZlbGVyJyx7XHJcblx0XHRcdFx0dXJsOiAnL3NlYXJjaFRyYXZlbGVyJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWFyY2hUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2Zvcm1SZXZpZXdAc2VhcmNoVHJhdmVsZXInOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtUmV2aWV3Lmh0bWwnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0LnN0YXRlKCdmb3JtR2VuZXJhdG9yJyx7XHJcblx0XHRcdFx0dXJsOiAnL2Zvcm1HZW5lcmF0b3InLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtR2VuZXJhdG9yTmF2Lmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3RlbXBsYXRlR2VuZXJhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUdlbmVyYXRvci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUNyZWF0b3JAZm9ybUdlbmVyYXRvcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RlbXBsYXRlQ3JlYXRvci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0FwcEN0cmwnLCBbJ25nQW5pbWF0ZSddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybUdlbkN0cmwuanMnLCBbJ3VpLmJvb3RzdHJhcC50YWJzJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJywgWyckc2NvcGUnLCdGb3JtJyAsIGZ1bmN0aW9uKCRzY29wZSwgRm9ybSl7XHJcblxyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihwYXNzd29yZCl7XHJcblx0XHRcdGlmKCFwYXNzd29yZCB8fCBwYXNzd29yZCA9PT0gJycpe1xyXG5cdFx0XHRcdHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnMTIzJyl7XHJcblx0XHRcdEZvcm0uY3JlYXRlKCRzY29wZS50ZW1wbGF0ZSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHRhbGVydCgnYWRkJyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlID0gZGF0YTtcclxuXHRcdFx0XHRcdGRlbGV0ZSAkc2NvcGUudGVtcGxhdGU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lIHNvbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0nMTIzJyl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0Rm9ybS5zYXZlKCRzY29wZS5jcmVhdGUpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdzYXZlJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS50ZW1wbGF0ZSA9ICRzY29wZS5jcmVhdGU7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3VibWl0KHBhc3N3b3JkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0aWYocGFzc3dvcmQgPT09ICdRUW1vcmUnKXtcclxuXHRcdFx0XHRpZihjb25maXJtKCdkZWxldGUgdGVtcGxhdGU/Jykpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0XHRGb3JtLmRlbGV0ZSgkc2NvcGUuY3JlYXRlLl9pZClcclxuXHRcdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdFx0XHRhbGVydCgncmVtb3ZlZCcpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpbml0Q3JlYXRlKCk7XHJcblx0XHRcdFx0fVx0XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNldFNlbGVjdFRhYiA9IGZ1bmN0aW9uKG4pe1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0VGFiID0gbjtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZEl0ZW1SZWNvcmQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICYmICRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgaXRlbSA9IHtcclxuXHRcdFx0XHRcdFwiaWRcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6JHNjb3BlLmlucHV0SXRlbVJlY29yZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPT09ICdzZWxlY3QnKXtcclxuXHRcdFx0XHRcdHZhciBob2xkZXIgPSAkc2NvcGUuc2VsZWN0T3B0aW9ucztcclxuXHRcdFx0XHRcdGhvbGRlciA9IGhvbGRlci5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaTxob2xkZXIubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdGhvbGRlcltpXSA9IGhvbGRlcltpXS50cmltKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRob2xkZXIgPSBBcnJheS5mcm9tKG5ldyBTZXQoaG9sZGVyKSk7XHJcblx0XHRcdFx0XHRpdGVtWydzZWxlY3QnXSA9IHsnbmFtZSc6Jyd9O1xyXG5cdFx0XHRcdFx0aXRlbS5zZWxlY3RbJ29wdGlvbnMnXSA9IGhvbGRlcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZCA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gaWYoJHNjb3BlLmlucHV0U3RlcERlcyAmJiAkc2NvcGUuaW5wdXRTdGVwRGVzICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHMpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcyA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIHN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN0ZXBcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcInR5cGVcIjogJHNjb3BlLmlucHV0U3RlcFR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6ICRzY29wZS5pbnB1dFN0ZXBEZXMgfHwgJydcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMucHVzaChzdGVwKTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmlucHV0U3RlcERlcyA9ICcnO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICYmICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGxldCBzdGVwSW5kZXggPSAkc2NvcGUudGVtcFN1Yi5zZWxlY3RTdGVwRm9yU3ViU3RlcDtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3Qpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3Q9W107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBsZW4gPSAkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5sZW5ndGg7XHJcblx0XHRcdFx0bGV0IHN1YlN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN1Yl9zdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0LnB1c2goc3ViU3RlcCk7XHJcblx0XHRcdFx0JHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN1Yk9wdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGxldCBzdGVwID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMF07XHJcblx0XHRcdGxldCBzdWIgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zZWxlY3RTdWJGb3JPcHRpb24uc3BsaXQoJywnKVsxXTtcclxuXHRcdFx0bGV0IHNlbGVjdE9wdGlvbiA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMuc2VsZWN0U3ViT3B0aW9uO1xyXG5cdFx0XHRsZXQgb3B0aW9ucyA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0LnNwbGl0KCcsJyk7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPCBvcHRpb25zLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdG9wdGlvbnNbaV0gPSBvcHRpb25zW2ldLnRyaW0oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvcHRpb25zID0gQXJyYXkuZnJvbShuZXcgU2V0KG9wdGlvbnMpKTtcclxuXHRcdFx0bGV0IHN1YlN0ZXBPcHRpb24gPSB7XHJcblx0XHRcdFx0XHRcInR5cGVcIjogc2VsZWN0T3B0aW9uLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLm5hbWUsXHJcblx0XHRcdFx0XHRcIm9wdGlvbnNcIjogb3B0aW9uc1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucyl7XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucz1bXTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zLnB1c2goc3ViU3RlcE9wdGlvbik7XHJcblx0XHRcdC8vJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl1bc2VsZWN0T3B0aW9uXSA9IHN1YlN0ZXBPcHRpb247XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLm5hbWUgPSAnJztcclxuXHRcdFx0JHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24uaW5wdXQgPSAnJztcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdCRzY29wZS5tb2RpZnlJRCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSl7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPG9iamVjdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZih0eXBlID09PSdpdGVtUmVjb3JkJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uaWQgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N0ZXBzJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3RlcCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0nc3ViX3N0ZXAnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5zdWJfc3RlcCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXRPcHRpb24gPSBmdW5jdGlvbihhZGRyZXNzLCBpbnB1dCl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHR5cGVvZiBpbnB1dCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGlucHV0KTtcclxuXHRcdFx0aWYoYWRkcmVzcyl7XHJcblx0XHRcdFx0YWRkcmVzcy5vcHRpb25zID0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0ICBpbnB1dCA9IGlucHV0LnNwbGl0KCcsJyk7XHJcbiAgICAgICAgfVxyXG5cdFx0XHRcdGZvcihsZXQgaT0wO2k8aW5wdXQubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRhZGRyZXNzLm9wdGlvbnNbaV0gPSBpbnB1dFtpXS50cmltKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IEFycmF5LmZyb20obmV3IFNldChhZGRyZXNzLm9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcbiAgICAkc2NvcGUudXBkYXRlRm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG4gICAgICAgICAgaWYoJHNjb3BlLmZvcm1JZCl7XHJcbiAgICAgICAgICAgIEZvcm0uZ2V0KCRzY29wZS5mb3JtSWQpXHJcbiAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZm9ybXMgPSBkYXRhOyAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBmaW5kIHRoZSBsYXN0IHN1YlN0ZXBcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5sYXN0U3RlcCA9IGRhdGEuc3RlcHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgLy8gLy8gaW5pdCB0aGUgdHJhdmVsZXJEYXRhIGZyb20gZm9ybURhdGFcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkID0gZGF0YS5faWQ7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXYgPSBkYXRhLmZvcm1SZXY7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObyA9IGRhdGEuZm9ybU5vO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jdXN0b21lciA9IGRhdGEuY3VzdG9tZXI7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuICAgICAgICAgICAgICAgICRzY29wZS5jcmVhdGU9IGRhdGE7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHRcdHZhciBpbml0Q3JlYXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuY3JlYXRlLmlzUHVibGlzaCA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcbiAgICB2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgRm9ybS5nZXRGb3JtTGlzdCgpXHJcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aW5pdENyZWF0ZSgpO1xyXG4gICAgICBsb2FkRm9ybUxpc3QoKTtcclxuXHRcdFxyXG5cdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9ICd0ZXh0JztcclxuXHRcdFx0JHNjb3BlLmpzb25WaWV3ID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdG1haW4oKTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ01haW5DdHJsJywgW10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS50YWdsaW5lID0gJ3RvIHRoZSBtb29uIGFuZCBiYWNrISc7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnU2VhcmNoVHJhdmVsZXJDdHJsJywgWydjaGFydC5qcyddKVxyXG5cclxuXHQuY29udHJvbGxlcignU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnVHJhdmVsZXInLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyKXtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRJbnB1dCA9ICRzY29wZS5zZWFyY2hJbnB1dDtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gdHJ1ZTtcclxuXHRcdFx0aWYoJHNjb3BlLnNlYXJjaElucHV0KXtcclxuXHRcdFx0XHRpZigkc2NvcGUuc2VhcmNoT3B0aW9uID09PSdzbicpe1xyXG5cdFx0XHRcdFx0bGV0IHNuID0gJHNjb3BlLnNlYXJjaElucHV0LnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRUcmF2ZWxlci5zZWFyY2hMaWtlKHNuKVxyXG5cclxuXHRcdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cdFx0XHRcdFx0XHRcdGZpbmRTdGF0aXN0aWNzKCk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0Ly8gc2VhcmNoIGRvYyBudW1cclxuXHRcdFx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgkc2NvcGUuc2VhcmNoT3B0aW9uLCAkc2NvcGUuc2VhcmNoSW5wdXQpXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cdFx0XHRcdFx0XHRcdGZpbmRTdGF0aXN0aWNzKCk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXRUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgZm9ybUlkKXtcclxuXHRcdFx0d2luZG93Lm9wZW4oJ3RyYXZlbGVyP19pZD0nK19pZCsnJmZvcm1JZD0nK2Zvcm1JZCwgJ19ibGFuaycpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucmVtb3ZlVHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGluZGV4KXtcclxuXHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoX2lkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+IHtcclxuXHRcdFx0XHRcdC8vICRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdCRzY29wZS5yZXN1bHQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnRpbWVTcGVuZCA9IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZihkYXRhLnJldmlld0F0KXtcclxuXHRcdFx0XHRsZXQgZGlmZiA9IE1hdGgucm91bmQoKG5ldyBEYXRlKGRhdGEucmV2aWV3QXQpIC0gbmV3IERhdGUoZGF0YS5jcmVhdGVBdCkpLzEwMDApO1xyXG5cdFx0XHRcdCRzY29wZS50b3RhbFRpbWVTcGFuZCArPSBkaWZmO1xyXG5cdFx0XHRcdHJldHVybiBjYWx1bGF0ZVRpbWUoZGlmZik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCBkaWZmID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSAtIG5ldyBEYXRlKGRhdGEuY3JlYXRlQXQpKS8xMDAwKTtcclxuXHRcdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgKz0gZGlmZjtcclxuXHRcdFx0XHRyZXR1cm4gY2FsdWxhdGVUaW1lKGRpZmYpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS50b3RhbFRpbWVTcGVuZCA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRyZXR1cm4gNTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGNhbHVsYXRlVGltZSA9IGZ1bmN0aW9uKHNlY29uZHMpe1xyXG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzLzYwLzYwKSArICcgSG91cnMgYW5kICcgKyBNYXRoLmZsb29yKHNlY29uZHMvNjApJTYwICsgXHJcblx0XHRcdFx0XHQnIG1pbiBhbmQgJyArIHNlY29uZHMgJSA2MCArICcgc2VjJztcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gJHNjb3BlLnByaW50VHJhdmVsZXIgPSBmdW5jdGlvbihpbmRleCl7XHJcblx0XHQvLyBcdCRzY29wZS50cmF2ZWxlckRhdGEgPSAkc2NvcGUucmVzdWx0W2luZGV4XTtcclxuXHRcdFx0Ly8gdmFyIHByaW50Q29udGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWlkLXNlbGVjdG9yJykuaW5uZXJIVE1MO1xyXG5cdFx0IC8vICAgIHZhciBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCxoZWlnaHQ9ODAwLHNjcm9sbGJhcnM9bm8sbWVudWJhcj1ubyx0b29sYmFyPW5vLGxvY2F0aW9uPW5vLHN0YXR1cz1ubyx0aXRsZWJhcj1ubyx0b3A9NTAnKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi53aW5kb3cuZm9jdXMoKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5vcGVuKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzwhRE9DVFlQRSBodG1sPjxodG1sPjxoZWFkPjx0aXRsZT5USVRMRSBPRiBUSEUgUFJJTlQgT1VUPC90aXRsZT4nICtcclxuXHRcdCAvLyAgICAgICAgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwibGlicy9ib29zYXZlRG9jTnVtdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCI+JyArXHJcblx0XHQgLy8gICAgICAgICc8L2hlYWQ+PGJvZHkgb25sb2FkPVwid2luZG93LnByaW50KCk7IHdpbmRvdy5jbG9zZSgpO1wiPjxkaXY+JyArIHByaW50Q29udGVudHMgKyAnPC9kaXY+PC9odG1sPicpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LmNsb3NlKCk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0dmFyIGZpbmRTdGF0aXN0aWNzID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnN0YXQgPSB7fTtcclxuXHRcdFx0JHNjb3BlLnBpZUxhYmVsczE9W107XHJcblx0XHRcdCRzY29wZS5waWVEYXRhMSA9IFtdO1xyXG5cdFx0XHRsZXQgZGF0YSA9ICRzY29wZS5yZXN1bHQ7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPGRhdGEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYoZGF0YVtpXS5zdGF0dXMgaW4gJHNjb3BlLnN0YXQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRbZGF0YVtpXS5zdGF0dXNdICs9MTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS5waWVMYWJlbHMxLnB1c2goZGF0YVtpXS5zdGF0dXMpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRbZGF0YVtpXS5zdGF0dXNdID0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC50b3RhbCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRsZXQgcmVqZWN0ID0gMDtcclxuXHRcdFx0bGV0IGNvbXBsZXRlZCA9IDA7XHJcblx0XHRcdC8vIGNhbHVsYXRlIHBlcmNlbnQgb2YgdG90YWwgY29tcGxhdGVkIG91dCBvZiB0b3RhbFxyXG5cdFx0XHRpZigkc2NvcGUuc3RhdC5SRUpFQ1Qpe1xyXG5cdFx0XHRcdHJlamVjdCA9ICRzY29wZS5zdGF0LlJFSkVDVDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoJHNjb3BlLnN0YXQuQ09NUExFVEVEKXtcclxuXHRcdFx0XHRjb21wbGV0ZWQgPSAkc2NvcGUuc3RhdC5DT01QTEVURUQ7XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnN0YXQucGVjQ29tcGxldGUgPSAoKChjb21wbGV0ZWQpKyhyZWplY3QpKS8oZGF0YS5sZW5ndGgpKjEwMCkudG9GaXhlZCgyKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGNhbHVsYXRlIHBlcmNlbnQgb2YgcmVqZWN0IG91dCBvZiB0b3RhbFxyXG5cdFx0XHRpZigoJHNjb3BlLnN0YXQuUkVKRUNUKS8oZGF0YS5sZW5ndGgpKjEwMCl7XHJcblx0XHRcdFx0JHNjb3BlLnN0YXQucGVjUmVqZWN0ID0gKChyZWplY3QpLyhkYXRhLmxlbmd0aCkqMTAwKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuc3RhdC5wZWNSZWplY3QgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IobGV0IGk9MDtpPCRzY29wZS5waWVMYWJlbHMxLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdCRzY29wZS5waWVEYXRhMS5wdXNoKCRzY29wZS5zdGF0WyRzY29wZS5waWVMYWJlbHMxW2ldXSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5waWVMYWJlbHMyID0gWydGaW5pc2gnLCAnSG9sZCddO1xyXG5cdFx0XHQkc2NvcGUucGllRGF0YTIgPSBbY29tcGxldGVkK3JlamVjdCwgKCRzY29wZS5zdGF0LnRvdGFsLShjb21wbGV0ZWQrcmVqZWN0KSldO1xyXG5cdFxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuc2VhcmNoT3B0aW9uID0gJ2RvY051bSc7XHJcblx0XHRcdCRzY29wZS5zb3J0VHlwZSA9ICdjcmVhdGVBdCc7XHJcblx0XHRcdCRzY29wZS5zb3J0UmV2ZXJzZSA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdCRzY29wZS50b3RhbFRpbWVTcGFuZCA9IDA7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aW5pdCgpO1xyXG5cdFx0fTtcclxuXHRcdG1haW4oKTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1RyYXZlbGVyQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5maWx0ZXIoJ3VuaXF1ZScsIGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwga2V5bmFtZSl7XHJcblx0XHRcdHZhciBvdXRwdXQgPSBbXSxcclxuXHRcdFx0XHRrZXlzICAgPSBbXTtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcclxuXHRcdFx0XHR2YXIga2V5ID0gaXRlbVtrZXluYW1lXTtcclxuXHRcdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpe1xyXG5cdFx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdFx0fTtcclxuXHR9KVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdUcmF2ZWxlckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ1RyYXZlbGVyJywgJ0Zvcm0nLCAnRG9jTnVtJywgJ0NvdW50ZXInLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSwgRG9jTnVtLCBDb3VudGVyLCAkc3RhdGVQYXJhbXMpe1xyXG5cclxuXHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgIT09ICdPUEVOJyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdQQU5ESU5HIEZPUiBSRVZJRVcnO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0aWYoJHNjb3BlLmZvcm1JZCl7XHJcblx0XHRcdFx0Rm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1x0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG5cdFx0XHRcdFx0XHQkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0Ly8gaW5pdCB0aGUgdHJhdmVsZXJEYXRhIGZyb20gZm9ybURhdGFcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObyA9IGRhdGEuZm9ybU5vO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KGRhdGEuX2lkLCAoKT0+e30pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZURvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0WyRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0XTtcclxuXHRcdFx0c2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cclxuXHRcdFx0Ly8gY2FsbCBhIGZ1bmN0aW9uIHRvIHVzZSBkb2NudW0gdG8gcmV0dXJuIHRoZSBsaXN0IG9mIHNlcmlhbCBudW1iZXIgYXNzb2NpYXRlIHdpdGggXHJcblx0XHRcdC8vIHRoaXMgZG9jbnVtXHJcblx0XHRcdGdldFNOTGlzdCgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5leHRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG9iamVjdCA9ICRzY29wZS5mb3Jtcy5zdGVwc1skc2NvcGUuY3VycmVudFN0ZXAtMV07XHJcblx0XHRcdGlmKG9iamVjdC5saXN0Lmxlbmd0aCA+PSAkc2NvcGUuY3VycmVudFN1YlN0ZXArMSl7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwICs9IDE7XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwICs9IDE7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3VycmVudFN0ZXAgPiAkc2NvcGUubGFzdFN0ZXApe1xyXG5cdFx0XHRcdFx0Ly8gVHJhdmVsZXIuc2V0UmV2aWV3RGF0YSgkc2NvcGUudHJhdmVsZXJEYXRhKTtcclxuXHRcdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1x0XHRcclxuXHRcdFx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IHBhZ2U7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0Ly8gJHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1N1YlBhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gcGFnZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IGlkTGlzdCA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGkgPSAwO2kgPCAkc2NvcGUuc2VsZWN0U05MaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlkTGlzdC5wdXNoKCRzY29wZS5zZWxlY3RTTkxpc3RbaV0uX2lkKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGRhdGEgPSB7XHJcblx0XHRcdFx0aWRMaXN0IDogaWRMaXN0LFxyXG5cdFx0XHRcdHRyYXZlbGVyRGF0YTogJHNjb3BlLnRyYXZlbGVyRGF0YVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRUcmF2ZWxlci51cGRhdGVNdWx0aXBsZShkYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucmV2aWV3ID0gZnVuY3Rpb24ob3B0aW9uKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdCeSl7XHJcblx0XHRcdFx0aWYob3B0aW9uID09PSAncmVqZWN0Jyl7XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdSRUpFQ1QnO1xyXG5cdFx0XHRcdH1lbHNlIGlmKG9wdGlvbiA9PT0gJ2NvbXBsZXRlJyl7XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdDT01QTEVURUQnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0F0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgcmV2aWV3ZXIgbmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudXNlcm5hbWUgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zbil7XHJcblx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jb21wbGV0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQvLyBzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWRCeSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZUF0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5jcmVhdGUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHJcblx0XHRcdFx0XHQvLyBpZiBzdWNjZXNzZnVsIGNyZWF0ZVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3N1Ym1pdCBjb21wbGV0ZScpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUgb3Igc2VyaWFsIG51bWJlciBwbHogJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5ldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRhbGVydCgnZGVsZXRlIGNsaWNrJyk7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKXtcclxuXHRcdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFwcGVuZFN1YlN0ZXBFZGl0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB1c2VybmFtZSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0aWYodXNlcm5hbWUgIT09ICcnKXtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN0ZXAgPSAkc2NvcGUuY3VycmVudFN0ZXA7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdWJTdGVwID0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRCeSA9IHVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnByaW50VHJhdmVsZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyB2YXIgcHJpbnRDb250ZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaWQtc2VsZWN0b3InKS5pbm5lckhUTUw7XHJcblx0XHQgLy8gICAgdmFyIHBvcHVwV2luID0gd2luZG93Lm9wZW4oJycsICdfYmxhbmsnLCAnd2lkdGg9ODAwLGhlaWdodD04MDAsc2Nyb2xsYmFycz1ubyxtZW51YmFyPW5vLHRvb2xiYXI9bm8sbG9jYXRpb249bm8sc3RhdHVzPW5vLHRpdGxlYmFyPW5vLHRvcD01MCcpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLndpbmRvdy5mb2N1cygpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC53cml0ZSgnPCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPlRJVExFIE9GIFRIRSBQUklOVCBPVVQ8L3RpdGxlPicgK1xyXG5cdFx0IC8vICAgICAgICAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCJsaWJzL2Jvb3NhdmVEb2NOdW10c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIj4nICtcclxuXHRcdCAvLyAgICAgICAgJzwvaGVhZD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKTsgd2luZG93LmNsb3NlKCk7XCI+PGRpdj4nICsgcHJpbnRDb250ZW50cyArICc8L2Rpdj48L2h0bWw+Jyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdFx0d2luZG93LnByaW50KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcdCAqXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRcdCRzY29wZS5zYXZlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1JZCA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybVJldiA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldjtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1ObyA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vO1xyXG5cdFx0XHRzZXREb2NOdW1MYWJlbCgnY3JlYXRlJyk7XHJcblx0XHRcdGRlbGV0ZSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkO1xyXG5cdFx0XHREb2NOdW0uY3JlYXRlKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkLCAobGlzdCk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0XHRpZihsaXN0W2ldLl9pZCA9PT0gZGF0YS5faWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1wiZG9jTnVtXCI6JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bX07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdERvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIHNldERvY051bUxhYmVsKCdlZGl0Jyk7XHJcblx0XHRcdERvY051bS5lZGl0RG9jTnVtRGF0YSgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRsb2FkRG9jTnVtTGlzdCgkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCwgKCk9Pnt9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrRm9yU04gPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0Ly8gaWYoISRzY29wZS50cmF2ZWxlckRhdGEuX2lkKXtcclxuXHRcdFx0Ly8gXHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3NuJywgJHNjb3BlLnRyYXZlbGVyRGF0YS5zbilcclxuXHRcdFx0Ly8gXHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdC8vIFx0XHRcdFx0aWYoZGF0YS5sZW5ndGggPiAwICl7XHJcblx0XHRcdC8vIFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gdHJ1ZTtcclxuXHRcdFx0Ly8gXHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTTiA9IGRhdGE7XHJcblx0XHRcdC8vIFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdC8vIFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdC8vIFx0XHRcdFx0fVxyXG5cdFx0XHQvLyBcdFx0XHR9KTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0aWYoJHNjb3BlLmlucHV0U04pe1xyXG5cdFx0XHRcdC8vIFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnc24nLCAkc2NvcGUuaW5wdXRTTiwgJ19pZHxzbicpXHJcblx0XHRcdFx0Ly8gXHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0Ly8gXHRcdGlmKGRhdGEubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdFx0Ly8gXHRcdFx0aWYoY29uZmlybSgnU04gYWxyZWFkeSBleGlzdC4gZG8geW91IHdhbnQgdG8gY3JlYXRlIGEgbmV3IHRyYXZlbGVyIHdpdGggc2FtZSBzbj8nKSl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmFwcGVuZCh7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRcdFwic25cIjogJHNjb3BlLmlucHV0U05cclxuXHRcdFx0XHQvLyBcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdC8vIFx0XHRcdFx0JHNjb3BlLmlucHV0U04gPSAnJztcclxuXHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0Ly8gXHRcdH1lbHNle1xyXG5cdFx0XHRcdC8vIFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSBmYWxzZTtcclxuXHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCAkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5TTkxpc3RGb3JEb2NOdW1baV0uc24gPT09ICRzY29wZS5pbnB1dFNOKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGlmKGNvbmZpcm0oJ1NOIGFscmVhZHkgZXhpc3QuIGRvIHlvdSB3YW50IHRvIGNyZWF0ZSBhIG5ldyB0cmF2ZWxlciB3aXRoIHNhbWUgc24/Jykpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoISRzY29wZS5pc1NORXhpc3Qpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0bGV0IGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcdFwic25cIjogJHNjb3BlLmlucHV0U04sXHJcblx0XHRcdFx0XHRcdFwic3RhdHVzXCI6IFwiT1BFTlwiLFxyXG5cdFx0XHRcdFx0XHRcImNyZWF0ZUF0XCI6IG5ldyBEYXRlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRjcmVhdGVOZXdUcmF2ZWxlcihpdGVtKTtcclxuXHRcdFx0XHRcdCRzY29wZS5pbnB1dFNOID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5tb3ZlVG9TZWxlY3RTTkxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmxlbmd0aCk7XHJcblx0XHJcblx0XHRcdGxldCBzdGFjayA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGk9JHNjb3BlLlNOTGlzdEZvckRvY051bS5sZW5ndGg7aSA+IDA7aS0tKXtcclxuXHRcdFx0XHRsZXQgZWwgPSAkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnBvcCgpO1xyXG5cdFx0XHRcdGlmKGVsLmNoZWNrYm94ID09PSB0cnVlKXtcclxuXHRcdFx0XHRcdGVsLmNoZWNrYm94ID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goZWwpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3RhY2sucHVzaChlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBzdGFjaztcclxuXHRcdFx0c3RhY2sgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubW92ZVRvU05MaXN0Rm9yRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHN0YWNrID0gW107XHJcblx0XHRcdGZvcihsZXQgaSA9JHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGg7IGk+MDtpLS0pe1xyXG5cdFx0XHRcdGxldCBlbCA9ICRzY29wZS5zZWxlY3RTTkxpc3QucG9wKCk7XHJcblx0XHRcdFx0aWYoZWwuY2hlY2tib3ggPT09ICB0cnVlKXtcclxuXHRcdFx0XHRcdGVsLmNoZWNrYm94ID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnB1c2goZWwpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3RhY2sucHVzaChlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBzdGFjaztcclxuXHRcdFx0c3RhY2sgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VsZWN0QWxsTGlzdCA9IGZ1bmN0aW9uKGxpc3Qpe1xyXG5cdFx0XHRsZXQgYm9vbCA9IGxpc3RbMF0uY2hlY2tib3g7XHJcblx0XHRcdGZvcihsZXQgaT0wO2k8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRsaXN0W2ldLmNoZWNrYm94ID0gIWJvb2w7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmxvYWRUcmF2ZWxlciA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0aWYoaW5wdXQpe1xyXG5cdFx0XHRcdCRzY29wZS5zZWxlY3RTTiA9IGlucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnX2lkJywgJHNjb3BlLnNlbGVjdFNOKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YVswXTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoU04gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnc24nLCAkc2NvcGUudHJhdmVsZXJEYXRhLnNuLCAnc258Y3JlYXRlQXR8c3RhdHVzJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0JHNjb3BlLmlzU05Nb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05Nb3JlVGhhbk9uZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTTkxpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QucHVzaCh7XCJfaWRcIjpkYXRhWzBdLl9pZCwgXCJzblwiOmRhdGFbMF0uc259KTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gZGF0YVswXS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5sb2FkVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQpO1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2V0VHJhdmVsZXJEYXRhID0gZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdC5wdXNoKHtcIl9pZFwiOiRzY29wZS5zZWFyY2hTTkxpc3RbZGF0YV0uX2lkLCBcInNuXCI6ICRzY29wZS5zZWFyY2hTTkxpc3RbZGF0YV0uc259KTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gJHNjb3BlLnNlYXJjaFNOTGlzdFtkYXRhXS5faWQ7XHJcblx0XHRcdCRzY29wZS5sb2FkVHJhdmVsZXIoKTtcclxuXHRcdFx0bG9hZEl0ZW1SZWNvcmQoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZVdvcmsgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUuc2VsZWN0U05MaXN0Lmxlbmd0aCA+IDIpe1xyXG5cdFx0XHRcdENvdW50ZXIubmV4dFNlcXVlbmNlVmFsdWUoe25hbWU6J3dvcmtOdW0nfSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3dvcmsgbnVtYmVyICcgK2RhdGEuc2VxdWVuY2VfdmFsdWUrICcgY3JlYXRlZCcpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLndvcmtOdW0gPSBkYXRhLnNlcXVlbmNlX3ZhbHVlLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoV29ya051bSA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPWZhbHNlO1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3dvcmtOdW0nLCBpbnB1dCwgJ3NufGNyZWF0ZUF0fHN0YXR1c3x3b3JrTnVtJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjcmVhdGVOZXdUcmF2ZWxlciA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhpdGVtLnNuKTtcclxuXHRcdFx0aWYoJHNjb3BlLnVzZXJuYW1lKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnNuID0gaXRlbS5zbjtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBpdGVtLmNyZWF0ZUF0O1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGdldFNOTGlzdCA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdpdGVtUmVjb3JkLmRvY051bUlkJywgaW5wdXQsICdzbnxzdGF0dXN8Y3JlYXRlQXR8d29ya051bScpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2hvdWxkQ29sbGFwc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnNuICAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQuZG9jTnVtKXtcclxuXHRcdFx0XHQkc2NvcGUudG9wQ29sbGFwc2UgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXROdW1Eb2N0b1RyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1xyXG5cdFx0XHRcdFx0XCJkb2NOdW1JZFwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XCJkb2NOdW1cIiAgOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtXHJcblx0XHRcdFx0fTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldERvY051bUxhYmVsID0gZnVuY3Rpb24oYWN0aW9uKXtcclxuXHJcblx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdGlmKGFjdGlvbiA9PT0gJ2NyZWF0ZScpe1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0pe1xyXG5cdFx0XHRcdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYoYWN0aW9uID09PSAnZWRpdCcpe1xyXG5cdFx0XHQvLyBcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0Ly8gXHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0gJiZcclxuXHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLl9pZCAhPT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCl7XHJcblx0XHRcdC8vIFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyB9XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5sYWJlbCA9IGNvdW50O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Rm9ybS5nZXRGb3JtTGlzdCgpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciByZXNldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZm9ybUlkID0gJyc7XHJcblx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRG9jTnVtTGlzdCA9IGZ1bmN0aW9uKGlkLCBjYWxsYmFjayl7XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KGlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBsb2FkIGluZm9ybWF0aW9uIGZvciBJdGVtUmVjb3JkIHdpdGggXHJcblx0XHQvLyBkb2NOdW0uIFxyXG5cdFx0dmFyIGxvYWRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aWYoZGF0YVtpXS5faWQgPT09ICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW1JZCl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YVtpXTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9IGkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50b3BDb2xsYXBzZT1mYWxzZTtcclxuXHRcdFx0JHNjb3BlLnVzZXJuYW1lID0gJ0pvaG4gU25vdyc7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0gPSB7fTtcclxuXHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaXNTTk1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdC8vICRzY29wZS5zZWFyY2hTTiA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuc2VhcmNoU05MaXN0ID0gW107XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTiA9ICcnO1xyXG5cdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtID0gW107XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLmlzVXNlV29ya051bSA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U2VhcmNoU049JzAnO1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaW5wdXQ9e307XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXQoKTtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0bG9hZEZvcm1MaXN0KCk7XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsb2FkIHRoZSB0cmF2ZWxlciBmcm9tIFNlYXJjaCBwYWdlXHJcblx0XHRcdC8vIHRha2UgdGhlIHByYW1hcyBmcm9tIFVSTFxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuX2lkKXtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0XHRUcmF2ZWxlci5nZXQoJ19pZCcsICRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6ZGF0YS5faWQsIFwic25cIjpkYXRhLnNufSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0NvdW50ZXJTZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0NvdW50ZXInLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmV4dFNlcXVlbmNlVmFsdWU6ZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvY291bnRlci9uZXh0U2VxdWVuY2VWYWx1ZS8nLCBpbnB1dCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdEb2NOdW1TZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0RvY051bScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RG9jTnVtTGlzdDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2RvY051bXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2RvY051bXMvJyxkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZWRpdERvY051bURhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvZG9jTnVtcy8nLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9jTnVtOiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZCBzZXJ2aWNlJyk7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zL3NlYXJjaFNpbmdsZT90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1TZXJ2aWNlJywgW10pXHJcblxyXG5cdC5mYWN0b3J5KCdGb3JtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zL2Zvcm1MaXN0Jyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9zZWFyY2gvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZTogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXI/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdHJhdmVsZXInLCBkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFJldmlld0RhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV2aWV3RGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZWFyY2hMaWtlOiBmdW5jdGlvbihzbil7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9zZWFyY2hMaWtlLycrIHNuKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBERUxFVEUgYSBmb3JtXHJcbiAgICAgICAgICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbihfaWQsIGlucHV0KXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKF9pZCk7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS90cmF2ZWxlci8nKyBfaWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub3JtYWxTZWFyY2g6IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIHNlbGVjdCl7XHJcbiAgICAgICAgICAgICAgICBpZighc2VsZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvbm9ybWFsU2VhcmNoP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGErJyZzZWxlY3Q9JytzZWxlY3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVNdWx0aXBsZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyL3VwZGF0ZU11bHRpcGxlJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
