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

	$scope.save = function (callback) {

		var idList = [];
		for (var i = 0; i < $scope.selectSNList.length; i++) {
			idList.push($scope.selectSNList[i]._id);
		}

		var data = {
			idList: idList,
			travelerData: $scope.travelerData
		};
		if (idList.length > 1) {
			delete data.travelerData.sn;
		}
		Traveler.updateMultiple(data).success(function (data) {
			if (callback) callback(data);
		});
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
		// console.log(JSON.stringify($scope.docNum.docNumData));
		DocNum.editDocNumData($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId, function () {});
		});
	};

	$scope.checkForSN = function (data) {

		if (data) {
			$scope.isSNExistMoreThanOne = false;
			for (var i = 0; i < $scope.SNListForDocNum.length; i++) {
				if ($scope.SNListForDocNum[i].sn === data) {
					$scope.isSNExistMoreThanOne = true;
					if (confirm('SN already exist. do you want to create a new traveler with same sn?')) {
						$scope.isSNExistMoreThanOne = false;
					}
					break;
				}
			}

			if (!$scope.isSNExistMoreThanOne) {
				$scope.isSNExistMoreThanOne = false;
				var item = {
					"sn": data,
					"status": "OPEN",
					"createAt": new Date()
				};
				createNewTraveler(item);
				data = '';
				item = {};
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

	$scope.searchSN = function (sn) {

		if (sn) {
			$scope.searchSNList = [];
			$scope.clearAfterChangeTab();
			$scope.selectSNList = [];
			Traveler.normalSearch('sn', sn, 'sn|createAt|status').success(function (data) {
				$scope.isSNExist = true;
				$scope.isSNMoreThanOne = false;
				if (data.length > 1) {
					$scope.isSNMoreThanOne = true;
					$scope.searchSNList = data;
				} else if (data.length == 1) {
					$scope.selectSNList.push({ "_id": data[0]._id, "sn": data[0].sn });
					$scope.selectSN = data[0]._id;
					$scope.loadTraveler();
					loadItemRecord(data[0].formId);
					// $scope.isStartWork = true;
				} else {
						$scope.isSNExist = false;
					}
			});
		}
	};

	$scope.setTravelerData = function (data) {
		$scope.selectSNList = [];
		$scope.selectSNList.push({ "_id": $scope.searchSNList[data]._id, "sn": $scope.searchSNList[data].sn });
		$scope.selectSN = $scope.searchSNList[data]._id;
		$scope.loadTraveler();
		loadItemRecord();
		// $scope.isStartWork = true;
	};

	$scope.createWork = function () {

		if ($scope.selectSNList.length > 0) {
			Counter.nextSequenceValue({ name: 'workNum' }).success(function (data) {
				alert('work number ' + data.sequence_value + ' created');
				$scope.travelerData.workNum = data.sequence_value.toString();
				$scope.save();
			});
		}
	};

	$scope.searchWorkNum = function (input) {
		$scope.isWorkFind = false;
		$scope.clearAfterChangeTab();
		Traveler.normalSearch('workNum', input, 'sn|createAt|status|workNum|formId|itemRecord.docNumId|itemRecord.docNum').success(function (data) {
			$scope.selectSNList = data;
			if (data.length > 0) {
				$scope.isWorkFind = true;
				$scope.travelerData['itemRecord'] = {
					docNumId: data[0].itemRecord.docNumId,
					docNum: data[0].itemRecord.docNum
				};
				loadItemRecord(data[0].formId);

				Traveler.normalSearch('itemRecord.docNumId', data[0].itemRecord.docNumId, 'sn|workNum|status|createAt').success(function (data) {
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (data[i].workNum !== input) {
								$scope.SNListForDocNum.push(data[i]);
							}
						}
					}
				});
			}
		});
	};

	$scope.clearAfterChangeTab = function () {
		// alert(123);
		$scope.selectSNList = [];
		$scope.SNListForDocNum = [];
		// let formId = $scope.formId;
		// reset();
		// $scope.formId = formId;
		// $scope.updateForm();
		$scope.isStartWork = false;
		$scope.isWorkFind = false;
		$scope.docNum.docNumSelect = 'new';
		$scope.docNum.docNumData = {};
		$scope.travelerData.created = false;
	};

	$scope.createTraveler = function (sn) {

		if ($scope.docNum.docNumSelect === 'new') {
			alert('Select a Docnument Number');
			$scope.isCollapsedItemRecord = false;
		} else {
			(function () {
				var isWantCreate = true;
				checkSNExistDB(sn, function (result) {
					if (result) {
						if (!confirm('Same Serial number already exist in the database. Create a new Traveler with same Serial Number?')) {
							isWantCreate = false;
						}
					}
					if (isWantCreate) {
						var item = {
							"sn": sn,
							"status": "OPEN",
							"createAt": new Date()
						};
						createNewTraveler(item, function (data) {
							$scope.selectSNList = [];
							$scope.selectSNList.push({
								"_id": data._id,
								"sn": data.sn
							});
							setNumDoctoTraveler();
							$scope.save();
							$scope.isSNExist = false;
							// $scope.isStartWork = true;
						});
						// console.log($scope.docNum.docNumData);
					}
				});
			})();
		}
	};

	$scope.startWork = function () {
		$scope.isStartWork = true;
		$scope.topCollapse = true;
	};

	var checkSNExistDB = function checkSNExistDB(sn, callback) {
		$scope.isSNExist = false;
		Traveler.normalSearch('sn', sn, 'sn').success(function (data) {
			if (data.length > 0) {
				$scope.isSNExist = true;
			}
			callback($scope.isSNExist);
		});
	};

	var createNewTraveler = function createNewTraveler(item, callback) {
		// console.log(item.sn);
		if ($scope.username) {
			delete $scope.travelerData._id;
			delete $scope.travelerData.step;
			$scope.travelerData.sn = item.sn;
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = $scope.username;
			$scope.travelerData.createAt = item.createAt;
			Traveler.create($scope.travelerData).success(function (data) {
				item._id = data._id;
				$scope.SNListForDocNum.push(item);
				if (callback) {
					callback(data);
				}
			});
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
	var loadItemRecord = function loadItemRecord(formId) {
		if (!formId) {
			formId = $scope.travelerData.formId;
		}
		DocNum.getDocNumList(formId).success(function (data) {
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
		$scope.isSNExist = true;
		$scope.isSNExistMoreThanOne = false;
		$scope.isSNMoreThanOne = false;
		$scope.searchSNList = [];
		$scope.selectSN = '';
		$scope.SNListForDocNum = [];
		$scope.selectSNList = [];
		$scope.isUseWorkNum = false;
		$scope.isStartWork = false;
		$scope.selectSearchSN = '0';
		$scope.isWorkFind = false;
		$scope.input = {};
		$scope.isCollapsed = true;
		// $scope.isCollapsedSelectSNList = true;
		$scope.isCollapseHeaderSNList = true;
		$scope.isSearchClick = true;
		$scope.isCollapsedItemRecord = true;
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
				loadItemRecord(data.formId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvQ291bnRlclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9Eb2NOdW1TZXJ2aWNlLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFJQyxVQUpELEVBTUMsU0FORCxFQU9DLFVBUEQsRUFRQyxjQVJELEVBU0Msb0JBVEQsRUFVQyxnQkFWRCxFQVlDLGlCQVpELEVBYUMsYUFiRCxFQWNDLGVBZEQsRUFlQyxnQkFmRCxDQUREOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsV0FBRCxDQUE1QixFQUNFLE1BREYsQ0FDUyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUF5QyxtQkFBekMsRUFDUCxVQUFTLGNBQVQsRUFBeUIsa0JBQXpCLEVBQTZDLGlCQUE3QyxFQUErRDs7QUFFL0Qsb0JBQW1CLFNBQW5CLENBQTZCLE9BQTdCOzs7QUFHQTs7O0FBQUEsRUFHRSxLQUhGLENBR1EsTUFIUixFQUdnQjtBQUNkLE9BQUssT0FEUztBQUVkLGVBQWEsaUJBRkM7QUFHZCxjQUFZO0FBSEUsRUFIaEIsRUFVRSxLQVZGLENBVVEsVUFWUixFQVVvQjtBQUNsQixPQUFLLHNCQURhO0FBRWxCLFNBQU07QUFDTCxPQUFHO0FBQ0YsaUJBQWEscUJBRFg7QUFFRixnQkFBWTtBQUZWLElBREU7QUFLTCwwQkFBc0I7QUFDckIsaUJBQWE7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QUFNLE1BQU4sQ0FBYSxtQkFBa0IsR0FBL0IsQ0FBUDtBQUNBLFNBL0JFO0FBZ0NILHNCQUFjLHNCQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTRCO0FBQ3RDLGdCQUFHLENBQUMsTUFBSixFQUFXO0FBQ1AseUJBQVMsRUFBVDtBQUNIO0FBQ0QsbUJBQU8sTUFBTSxHQUFOLENBQVUscUNBQW1DLElBQW5DLEdBQXdDLFFBQXhDLEdBQWlELElBQWpELEdBQXNELFVBQXRELEdBQWlFLE1BQTNFLENBQVA7QUFDSCxTQXJDRTtBQXNDSCx3QkFBZ0Isd0JBQVMsSUFBVCxFQUFjO0FBQzFCLG1CQUFPLE1BQU0sR0FBTixDQUFVLDhCQUFWLEVBQTBDLElBQTFDLENBQVA7QUFDSDtBQXhDRSxLQUFQO0FBMENQLENBOUN3QixDQUZ6QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnc2FtcGxlQXBwJywgXHJcblx0W1xyXG5cdFx0J3VpLnJvdXRlcicsIFxyXG5cdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHQnYXBwUm91dGVzJyxcclxuXHRcdCdkbmRMaXN0cycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnLFxyXG5cdFx0J0RvY051bVNlcnZpY2UnLFxyXG5cdFx0J0NvdW50ZXJTZXJ2aWNlJ1xyXG5cdF1cclxuKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwUm91dGVzJywgWyd1aS5yb3V0ZXInXSlcclxuXHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyAsXHJcblx0XHRmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XHJcblxyXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2hvbWUnKTtcclxuXHJcblx0XHQvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcblx0XHQkc3RhdGVQcm92aWRlclxyXG5cclxuXHRcdFx0Ly8gaG9tZSBwYWdlXHJcblx0XHRcdC5zdGF0ZSgnaG9tZScsIHtcclxuXHRcdFx0XHR1cmw6ICcvaG9tZScsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdNYWluQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdFxyXG5cdFx0XHQuc3RhdGUoJ3RyYXZlbGVyJywge1xyXG5cdFx0XHRcdHVybDogJy90cmF2ZWxlcj9faWQmZm9ybUlkJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2Zvcm1SZXZpZXdAdHJhdmVsZXInOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtUmV2aWV3Lmh0bWwnXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHQvLyBcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyB9XVxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9zZWFyY2hUcmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0BzZWFyY2hUcmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQuc3RhdGUoJ2Zvcm1HZW5lcmF0b3InLHtcclxuXHRcdFx0XHR1cmw6ICcvZm9ybUdlbmVyYXRvcicsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1HZW5lcmF0b3JOYXYuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVHZW5lcmF0b3JAZm9ybUdlbmVyYXRvcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RlbXBsYXRlR2VuZXJhdG9yLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3RlbXBsYXRlQ3JlYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVDcmVhdG9yLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnQXBwQ3RybCcsIFsnbmdBbmltYXRlJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtR2VuQ3RybC5qcycsIFsndWkuYm9vdHN0cmFwLnRhYnMnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ0Zvcm0nICwgZnVuY3Rpb24oJHNjb3BlLCBGb3JtKXtcclxuXHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKHBhc3N3b3JkKXtcclxuXHRcdFx0aWYoIXBhc3N3b3JkIHx8IHBhc3N3b3JkID09PSAnJyl7XHJcblx0XHRcdFx0cGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYocGFzc3dvcmQgPT09ICcxMjMnKXtcclxuXHRcdFx0Rm9ybS5jcmVhdGUoJHNjb3BlLnRlbXBsYXRlKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcclxuXHRcdFx0XHRcdGFsZXJ0KCdhZGQnKTtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUgPSBkYXRhO1xyXG5cdFx0XHRcdFx0ZGVsZXRlICRzY29wZS50ZW1wbGF0ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2dvIGhvbWUgc29uJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PScxMjMnKXtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3JlYXRlLl9pZCl7XHJcblx0XHRcdFx0XHRGb3JtLnNhdmUoJHNjb3BlLmNyZWF0ZSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3NhdmUnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRlbXBsYXRlID0gJHNjb3BlLmNyZWF0ZTtcclxuXHRcdFx0XHRcdCRzY29wZS5zdWJtaXQocGFzc3dvcmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2dvIGhvbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJ1FRbW9yZScpe1xyXG5cdFx0XHRcdGlmKGNvbmZpcm0oJ2RlbGV0ZSB0ZW1wbGF0ZT8nKSl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZigkc2NvcGUuY3JlYXRlLl9pZCl7XHJcblx0XHRcdFx0XHRcdEZvcm0uZGVsZXRlKCRzY29wZS5jcmVhdGUuX2lkKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0XHRcdGFsZXJ0KCdyZW1vdmVkJyk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGluaXRDcmVhdGUoKTtcclxuXHRcdFx0XHR9XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2dvIGhvbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2V0U2VsZWN0VGFiID0gZnVuY3Rpb24obil7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RUYWIgPSBuO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkSXRlbVJlY29yZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgJiYgJHNjb3BlLmlucHV0SXRlbVJlY29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XCJpZFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjokc2NvcGUuaW5wdXRJdGVtUmVjb3JkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9PT0gJ3NlbGVjdCcpe1xyXG5cdFx0XHRcdFx0dmFyIGhvbGRlciA9ICRzY29wZS5zZWxlY3RPcHRpb25zO1xyXG5cdFx0XHRcdFx0aG9sZGVyID0gaG9sZGVyLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPGhvbGRlci5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aG9sZGVyW2ldID0gaG9sZGVyW2ldLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGhvbGRlciA9IEFycmF5LmZyb20obmV3IFNldChob2xkZXIpKTtcclxuXHRcdFx0XHRcdGl0ZW1bJ3NlbGVjdCddID0geyduYW1lJzonJ307XHJcblx0XHRcdFx0XHRpdGVtLnNlbGVjdFsnb3B0aW9ucyddID0gaG9sZGVyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQucHVzaChpdGVtKTtcclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBpZigkc2NvcGUuaW5wdXRTdGVwRGVzICYmICRzY29wZS5pbnB1dFN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwcyl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgc3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwidHlwZVwiOiAkc2NvcGUuaW5wdXRTdGVwVHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLmlucHV0U3RlcERlcyB8fCAnJ1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcy5wdXNoKHN0ZXApO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRTdGVwRGVzID0gJyc7XHJcblx0XHRcdC8vIH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN1YlN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgJiYgJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICE9PSAnJyl7XHJcblx0XHRcdFx0bGV0IHN0ZXBJbmRleCA9ICRzY29wZS50ZW1wU3ViLnNlbGVjdFN0ZXBGb3JTdWJTdGVwO1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdD1bXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRsZXQgc3ViU3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3ViX3N0ZXBcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6ICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlc1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QucHVzaChzdWJTdGVwKTtcclxuXHRcdFx0XHQkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViT3B0aW9uID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHN0ZXAgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zZWxlY3RTdWJGb3JPcHRpb24uc3BsaXQoJywnKVswXTtcclxuXHRcdFx0bGV0IHN1YiA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzFdO1xyXG5cdFx0XHRsZXQgc2VsZWN0T3B0aW9uID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5zZWxlY3RTdWJPcHRpb247XHJcblx0XHRcdGxldCBvcHRpb25zID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24uaW5wdXQuc3BsaXQoJywnKTtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8IG9wdGlvbnMubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0b3B0aW9uc1tpXSA9IG9wdGlvbnNbaV0udHJpbSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQob3B0aW9ucykpO1xyXG5cdFx0XHRsZXQgc3ViU3RlcE9wdGlvbiA9IHtcclxuXHRcdFx0XHRcdFwidHlwZVwiOiBzZWxlY3RPcHRpb24sXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSxcclxuXHRcdFx0XHRcdFwib3B0aW9uc1wiOiBvcHRpb25zXHJcblx0XHRcdH07XHJcblx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zKXtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zPVtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMucHVzaChzdWJTdGVwT3B0aW9uKTtcclxuXHRcdFx0Ly8kc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXVtzZWxlY3RPcHRpb25dID0gc3ViU3RlcE9wdGlvbjtcclxuXHRcdFx0JHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSA9ICcnO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dCA9ICcnO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLm1vZGlmeUlEID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlKXtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8b2JqZWN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKHR5cGUgPT09J2l0ZW1SZWNvcmQnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5pZCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0nc3RlcHMnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5zdGVwID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdWJfc3RlcCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN1Yl9zdGVwID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdE9wdGlvbiA9IGZ1bmN0aW9uKGFkZHJlc3MsIGlucHV0KXtcclxuICAgICAgY29uc29sZS5sb2codHlwZW9mIGlucHV0KTtcclxuICAgICAgY29uc29sZS5sb2coaW5wdXQpO1xyXG5cdFx0XHRpZihhZGRyZXNzKXtcclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHQgIGlucHV0ID0gaW5wdXQuc3BsaXQoJywnKTtcclxuICAgICAgICB9XHJcblx0XHRcdFx0Zm9yKGxldCBpPTA7aTxpbnB1dC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGFkZHJlc3Mub3B0aW9uc1tpXSA9IGlucHV0W2ldLnRyaW0oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YWRkcmVzcy5vcHRpb25zID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkZHJlc3Mub3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuICAgICRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcbiAgICAgICAgICBpZigkc2NvcGUuZm9ybUlkKXtcclxuICAgICAgICAgICAgRm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5mb3JtcyA9IGRhdGE7ICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvLyAvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNyZWF0ZT0gZGF0YTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cdFx0dmFyIGluaXRDcmVhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3JlYXRlID0ge307XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuaXNQdWJsaXNoID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuICAgIHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICBGb3JtLmdldEZvcm1MaXN0KClcclxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpbml0Q3JlYXRlKCk7XHJcbiAgICAgIGxvYWRGb3JtTGlzdCgpO1xyXG5cdFx0XHJcblx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID0gJ3RleHQnO1xyXG5cdFx0XHQkc2NvcGUuanNvblZpZXcgPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnTWFpbkN0cmwnLCBbXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLnRhZ2xpbmUgPSAndG8gdGhlIG1vb24gYW5kIGJhY2shJztcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdTZWFyY2hUcmF2ZWxlckN0cmwnLCBbJ2NoYXJ0LmpzJ10pXHJcblxyXG5cdC5jb250cm9sbGVyKCdTZWFyY2hUcmF2ZWxlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdUcmF2ZWxlcicsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIpe1xyXG5cclxuXHRcdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudElucHV0ID0gJHNjb3BlLnNlYXJjaElucHV0O1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSB0cnVlO1xyXG5cdFx0XHRpZigkc2NvcGUuc2VhcmNoSW5wdXQpe1xyXG5cdFx0XHRcdGlmKCRzY29wZS5zZWFyY2hPcHRpb24gPT09J3NuJyl7XHJcblx0XHRcdFx0XHRsZXQgc24gPSAkc2NvcGUuc2VhcmNoSW5wdXQudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFRyYXZlbGVyLnNlYXJjaExpa2Uoc24pXHJcblxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHRcdFx0ZmluZFN0YXRpc3RpY3MoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyBzZWFyY2ggZG9jIG51bVxyXG5cdFx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCRzY29wZS5zZWFyY2hPcHRpb24sICRzY29wZS5zZWFyY2hJbnB1dClcclxuXHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHRcdFx0ZmluZFN0YXRpc3RpY3MoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdFRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBmb3JtSWQpe1xyXG5cdFx0XHR3aW5kb3cub3BlbigndHJhdmVsZXI/X2lkPScrX2lkKycmZm9ybUlkPScrZm9ybUlkLCAnX2JsYW5rJyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZW1vdmVUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgaW5kZXgpe1xyXG5cdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcihfaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnJlc3VsdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudGltZVNwZW5kID0gZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKGRhdGEucmV2aWV3QXQpe1xyXG5cdFx0XHRcdGxldCBkaWZmID0gTWF0aC5yb3VuZCgobmV3IERhdGUoZGF0YS5yZXZpZXdBdCkgLSBuZXcgRGF0ZShkYXRhLmNyZWF0ZUF0KSkvMTAwMCk7XHJcblx0XHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kICs9IGRpZmY7XHJcblx0XHRcdFx0cmV0dXJuIGNhbHVsYXRlVGltZShkaWZmKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IGRpZmYgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoZGF0YS5jcmVhdGVBdCkpLzEwMDApO1xyXG5cdFx0XHRcdCRzY29wZS50b3RhbFRpbWVTcGFuZCArPSBkaWZmO1xyXG5cdFx0XHRcdHJldHVybiBjYWx1bGF0ZVRpbWUoZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnRvdGFsVGltZVNwZW5kID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdHJldHVybiA1O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgY2FsdWxhdGVUaW1lID0gZnVuY3Rpb24oc2Vjb25kcyl7XHJcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMvNjAvNjApICsgJyBIb3VycyBhbmQgJyArIE1hdGguZmxvb3Ioc2Vjb25kcy82MCklNjAgKyBcclxuXHRcdFx0XHRcdCcgbWluIGFuZCAnICsgc2Vjb25kcyAlIDYwICsgJyBzZWMnO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyAkc2NvcGUucHJpbnRUcmF2ZWxlciA9IGZ1bmN0aW9uKGluZGV4KXtcclxuXHRcdC8vIFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9ICRzY29wZS5yZXN1bHRbaW5kZXhdO1xyXG5cdFx0XHQvLyB2YXIgcHJpbnRDb250ZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaWQtc2VsZWN0b3InKS5pbm5lckhUTUw7XHJcblx0XHQgLy8gICAgdmFyIHBvcHVwV2luID0gd2luZG93Lm9wZW4oJycsICdfYmxhbmsnLCAnd2lkdGg9ODAwLGhlaWdodD04MDAsc2Nyb2xsYmFycz1ubyxtZW51YmFyPW5vLHRvb2xiYXI9bm8sbG9jYXRpb249bm8sc3RhdHVzPW5vLHRpdGxlYmFyPW5vLHRvcD01MCcpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLndpbmRvdy5mb2N1cygpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC53cml0ZSgnPCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPlRJVExFIE9GIFRIRSBQUklOVCBPVVQ8L3RpdGxlPicgK1xyXG5cdFx0IC8vICAgICAgICAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCJsaWJzL2Jvb3NhdmVEb2NOdW10c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIj4nICtcclxuXHRcdCAvLyAgICAgICAgJzwvaGVhZD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKTsgd2luZG93LmNsb3NlKCk7XCI+PGRpdj4nICsgcHJpbnRDb250ZW50cyArICc8L2Rpdj48L2h0bWw+Jyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHR2YXIgZmluZFN0YXRpc3RpY3MgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuc3RhdCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUucGllTGFiZWxzMT1bXTtcclxuXHRcdFx0JHNjb3BlLnBpZURhdGExID0gW107XHJcblx0XHRcdGxldCBkYXRhID0gJHNjb3BlLnJlc3VsdDtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZihkYXRhW2ldLnN0YXR1cyBpbiAkc2NvcGUuc3RhdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3RhdFtkYXRhW2ldLnN0YXR1c10gKz0xO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBpZUxhYmVsczEucHVzaChkYXRhW2ldLnN0YXR1cyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3RhdFtkYXRhW2ldLnN0YXR1c10gPTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zdGF0LnRvdGFsID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcdGxldCByZWplY3QgPSAwO1xyXG5cdFx0XHRsZXQgY29tcGxldGVkID0gMDtcclxuXHRcdFx0Ly8gY2FsdWxhdGUgcGVyY2VudCBvZiB0b3RhbCBjb21wbGF0ZWQgb3V0IG9mIHRvdGFsXHJcblx0XHRcdGlmKCRzY29wZS5zdGF0LlJFSkVDVCl7XHJcblx0XHRcdFx0cmVqZWN0ID0gJHNjb3BlLnN0YXQuUkVKRUNUO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZigkc2NvcGUuc3RhdC5DT01QTEVURUQpe1xyXG5cdFx0XHRcdGNvbXBsZXRlZCA9ICRzY29wZS5zdGF0LkNPTVBMRVRFRDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC5wZWNDb21wbGV0ZSA9ICgoKGNvbXBsZXRlZCkrKHJlamVjdCkpLyhkYXRhLmxlbmd0aCkqMTAwKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY2FsdWxhdGUgcGVyY2VudCBvZiByZWplY3Qgb3V0IG9mIHRvdGFsXHJcblx0XHRcdGlmKCgkc2NvcGUuc3RhdC5SRUpFQ1QpLyhkYXRhLmxlbmd0aCkqMTAwKXtcclxuXHRcdFx0XHQkc2NvcGUuc3RhdC5wZWNSZWplY3QgPSAoKHJlamVjdCkvKGRhdGEubGVuZ3RoKSoxMDApLnRvRml4ZWQoMik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGZvcihsZXQgaT0wO2k8JHNjb3BlLnBpZUxhYmVsczEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0JHNjb3BlLnBpZURhdGExLnB1c2goJHNjb3BlLnN0YXRbJHNjb3BlLnBpZUxhYmVsczFbaV1dKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JHNjb3BlLnBpZUxhYmVsczIgPSBbJ0ZpbmlzaCcsICdIb2xkJ107XHJcblx0XHRcdCRzY29wZS5waWVEYXRhMiA9IFtjb21wbGV0ZWQrcmVqZWN0LCAoJHNjb3BlLnN0YXQudG90YWwtKGNvbXBsZXRlZCtyZWplY3QpKV07XHJcblx0XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBpbml0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWFyY2hPcHRpb24gPSAnZG9jTnVtJztcclxuXHRcdFx0JHNjb3BlLnNvcnRUeXBlID0gJ2NyZWF0ZUF0JztcclxuXHRcdFx0JHNjb3BlLnNvcnRSZXZlcnNlID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kID0gMDtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpbml0KCk7XHJcblx0XHR9O1xyXG5cdFx0bWFpbigpO1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJDdHJsJywgW10pXHJcblx0XHJcblx0LmZpbHRlcigndW5pcXVlJywgZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBrZXluYW1lKXtcclxuXHRcdFx0dmFyIG91dHB1dCA9IFtdLFxyXG5cdFx0XHRcdGtleXMgICA9IFtdO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0XHRcdHZhciBrZXkgPSBpdGVtW2tleW5hbWVdO1xyXG5cdFx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSl7XHJcblx0XHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvdXRwdXQ7XHJcblx0XHR9O1xyXG5cdH0pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ1RyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnVHJhdmVsZXInLCAnRm9ybScsICdEb2NOdW0nLCAnQ291bnRlcicsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtLCBEb2NOdW0sIENvdW50ZXIsICRzdGF0ZVBhcmFtcyl7XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAhPT0gJ09QRU4nKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1BBTkRJTkcgRk9SIFJFVklFVyc7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHRpZigkc2NvcGUuZm9ybUlkKXtcclxuXHRcdFx0XHRGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcblx0XHRcdFx0XHRcdCRzY29wZS5sYXN0U3RlcCA9IGRhdGEuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHQvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXYgPSBkYXRhLmZvcm1SZXY7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHRcdFx0bG9hZERvY051bUxpc3QoZGF0YS5faWQsICgpPT57fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSAkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RdO1xyXG5cdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblxyXG5cdFx0XHQvLyBjYWxsIGEgZnVuY3Rpb24gdG8gdXNlIGRvY251bSB0byByZXR1cm4gdGhlIGxpc3Qgb2Ygc2VyaWFsIG51bWJlciBhc3NvY2lhdGUgd2l0aCBcclxuXHRcdFx0Ly8gdGhpcyBkb2NudW1cclxuXHRcdFx0Z2V0U05MaXN0KCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV4dFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgb2JqZWN0ID0gJHNjb3BlLmZvcm1zLnN0ZXBzWyRzY29wZS5jdXJyZW50U3RlcC0xXTtcclxuXHRcdFx0aWYob2JqZWN0Lmxpc3QubGVuZ3RoID49ICRzY29wZS5jdXJyZW50U3ViU3RlcCsxKXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgKz0gMTtcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgKz0gMTtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50U3RlcCA+ICRzY29wZS5sYXN0U3RlcCl7XHJcblx0XHRcdFx0XHQvLyBUcmF2ZWxlci5zZXRSZXZpZXdEYXRhKCRzY29wZS50cmF2ZWxlckRhdGEpO1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gcGFnZTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQvLyAkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzU3ViUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSBwYWdlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBpZExpc3QgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMDtpIDwgJHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZExpc3QucHVzaCgkc2NvcGUuc2VsZWN0U05MaXN0W2ldLl9pZCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBkYXRhID0ge1xyXG5cdFx0XHRcdGlkTGlzdCA6IGlkTGlzdCxcclxuXHRcdFx0XHR0cmF2ZWxlckRhdGE6ICRzY29wZS50cmF2ZWxlckRhdGFcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoaWRMaXN0Lmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhLnRyYXZlbGVyRGF0YS5zbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRUcmF2ZWxlci51cGRhdGVNdWx0aXBsZShkYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHRpZihjYWxsYmFjaylcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZXZpZXcgPSBmdW5jdGlvbihvcHRpb24pe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0J5KXtcclxuXHRcdFx0XHRpZihvcHRpb24gPT09ICdyZWplY3QnKXtcclxuXHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1JFSkVDVCc7XHJcblx0XHRcdFx0fWVsc2UgaWYob3B0aW9uID09PSAnY29tcGxldGUnKXtcclxuXHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ0NPTVBMRVRFRCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3QXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciByZXZpZXdlciBuYW1lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS51c2VybmFtZSAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnNuKXtcclxuXHRcdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmNvbXBsZXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdC8vIHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cclxuXHRcdFx0XHRcdC8vIGlmIHN1Y2Nlc3NmdWwgY3JlYXRlXHJcblx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc3VibWl0IGNvbXBsZXRlJyk7XHJcblx0XHRcdFx0XHRcdHNob3VsZENvbGxhcHNlKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZSBvciBzZXJpYWwgbnVtYmVyIHBseiAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV3ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGFsZXJ0KCdkZWxldGUgY2xpY2snKTtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpe1xyXG5cdFx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYXBwZW5kU3ViU3RlcEVkaXRJbmZvID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHVzZXJuYW1lID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRpZih1c2VybmFtZSAhPT0gJycpe1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3RlcCA9ICRzY29wZS5jdXJyZW50U3RlcDtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN1YlN0ZXAgPSAkc2NvcGUuY3VycmVudFN1YlN0ZXA7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdEJ5ID0gdXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucHJpbnRUcmF2ZWxlciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIHZhciBwcmludENvbnRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pZC1zZWxlY3RvcicpLmlubmVySFRNTDtcclxuXHRcdCAvLyAgICB2YXIgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD04MDAsaGVpZ2h0PTgwMCxzY3JvbGxiYXJzPW5vLG1lbnViYXI9bm8sdG9vbGJhcj1ubyxsb2NhdGlvbj1ubyxzdGF0dXM9bm8sdGl0bGViYXI9bm8sdG9wPTUwJyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4ud2luZG93LmZvY3VzKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8IURPQ1RZUEUgaHRtbD48aHRtbD48aGVhZD48dGl0bGU+VElUTEUgT0YgVEhFIFBSSU5UIE9VVDwvdGl0bGU+JyArXHJcblx0XHQgLy8gICAgICAgICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cImxpYnMvYm9vc2F2ZURvY051bXRzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiPicgK1xyXG5cdFx0IC8vICAgICAgICAnPC9oZWFkPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpOyB3aW5kb3cuY2xvc2UoKTtcIj48ZGl2PicgKyBwcmludENvbnRlbnRzICsgJzwvZGl2PjwvaHRtbD4nKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0XHR3aW5kb3cucHJpbnQoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdCRzY29wZS5zYXZlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1JZCA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybVJldiA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldjtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1ObyA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vO1xyXG5cdFx0XHRzZXREb2NOdW1MYWJlbCgnY3JlYXRlJyk7XHJcblx0XHRcdGRlbGV0ZSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkO1xyXG5cdFx0XHREb2NOdW0uY3JlYXRlKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkLCAobGlzdCk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0XHRpZihsaXN0W2ldLl9pZCA9PT0gZGF0YS5faWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1wiZG9jTnVtXCI6JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bX07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdERvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIHNldERvY051bUxhYmVsKCdlZGl0Jyk7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSkpO1xyXG5cdFx0XHREb2NOdW0uZWRpdERvY051bURhdGEoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQsICgpPT57fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jaGVja0ZvclNOID0gZnVuY3Rpb24oZGF0YSl7XHJcblxyXG5cdFx0XHRpZihkYXRhKXtcclxuXHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgJHNjb3BlLlNOTGlzdEZvckRvY051bS5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRpZigkc2NvcGUuU05MaXN0Rm9yRG9jTnVtW2ldLnNuID09PSBkYXRhKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdE1vcmVUaGFuT25lID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0aWYoY29uZmlybSgnU04gYWxyZWFkeSBleGlzdC4gZG8geW91IHdhbnQgdG8gY3JlYXRlIGEgbmV3IHRyYXZlbGVyIHdpdGggc2FtZSBzbj8nKSl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdE1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZighJHNjb3BlLmlzU05FeGlzdE1vcmVUaGFuT25lKXtcclxuXHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0bGV0IGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcdFwic25cIjogZGF0YSxcclxuXHRcdFx0XHRcdFx0XCJzdGF0dXNcIjogXCJPUEVOXCIsXHJcblx0XHRcdFx0XHRcdFwiY3JlYXRlQXRcIjogbmV3IERhdGVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNyZWF0ZU5ld1RyYXZlbGVyKGl0ZW0pO1xyXG5cdFx0XHRcdFx0ZGF0YSA9ICcnO1xyXG5cdFx0XHRcdFx0aXRlbSA9IHt9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubW92ZVRvU2VsZWN0U05MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLlNOTGlzdEZvckRvY051bS5sZW5ndGgpO1xyXG5cdFxyXG5cdFx0XHRsZXQgc3RhY2sgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBpPSRzY29wZS5TTkxpc3RGb3JEb2NOdW0ubGVuZ3RoO2kgPiAwO2ktLSl7XHJcblx0XHRcdFx0bGV0IGVsID0gJHNjb3BlLlNOTGlzdEZvckRvY051bS5wb3AoKTtcclxuXHRcdFx0XHRpZihlbC5jaGVja2JveCA9PT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHRlbC5jaGVja2JveCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdC5wdXNoKGVsKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN0YWNrLnB1c2goZWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtID0gc3RhY2s7XHJcblx0XHRcdHN0YWNrID0gbnVsbDtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm1vdmVUb1NOTGlzdEZvckRvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGxldCBzdGFjayA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGkgPSRzY29wZS5zZWxlY3RTTkxpc3QubGVuZ3RoOyBpPjA7aS0tKXtcclxuXHRcdFx0XHRsZXQgZWwgPSAkc2NvcGUuc2VsZWN0U05MaXN0LnBvcCgpO1xyXG5cdFx0XHRcdGlmKGVsLmNoZWNrYm94ID09PSAgdHJ1ZSl7XHJcblx0XHRcdFx0XHRlbC5jaGVja2JveCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bS5wdXNoKGVsKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN0YWNrLnB1c2goZWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gc3RhY2s7XHJcblx0XHRcdHN0YWNrID0gbnVsbDtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNlbGVjdEFsbExpc3QgPSBmdW5jdGlvbihsaXN0KXtcclxuXHRcdFx0bGV0IGJvb2wgPSBsaXN0WzBdLmNoZWNrYm94O1xyXG5cdFx0XHRmb3IobGV0IGk9MDtpPGxpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0bGlzdFtpXS5jaGVja2JveCA9ICFib29sO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5sb2FkVHJhdmVsZXIgPSBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHRcdGlmKGlucHV0KXtcclxuXHRcdFx0XHQkc2NvcGUuc2VsZWN0U04gPSBpbnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ19pZCcsICRzY29wZS5zZWxlY3RTTilcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGFbMF07XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaFNOID0gZnVuY3Rpb24oc24pe1xyXG5cclxuXHRcdFx0aWYoc24pe1xyXG5cdFx0XHRcdCRzY29wZS5zZWFyY2hTTkxpc3Q9IFtdO1xyXG5cdFx0XHRcdCRzY29wZS5jbGVhckFmdGVyQ2hhbmdlVGFiKCk7XHJcblx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnc24nLCBzbiwgJ3NufGNyZWF0ZUF0fHN0YXR1cycpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05Nb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NOTW9yZVRoYW5PbmUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTTkxpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihkYXRhLmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6ZGF0YVswXS5faWQsIFwic25cIjpkYXRhWzBdLnNufSk7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gZGF0YVswXS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmxvYWRUcmF2ZWxlcigpO1xyXG5cdFx0XHRcdFx0XHRcdGxvYWRJdGVtUmVjb3JkKGRhdGFbMF0uZm9ybUlkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyAkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRUcmF2ZWxlckRhdGEgPSBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6JHNjb3BlLnNlYXJjaFNOTGlzdFtkYXRhXS5faWQsIFwic25cIjogJHNjb3BlLnNlYXJjaFNOTGlzdFtkYXRhXS5zbn0pO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U04gPSAkc2NvcGUuc2VhcmNoU05MaXN0W2RhdGFdLl9pZDtcclxuXHRcdFx0JHNjb3BlLmxvYWRUcmF2ZWxlcigpO1xyXG5cdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHQvLyAkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY3JlYXRlV29yayA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpZigkc2NvcGUuc2VsZWN0U05MaXN0Lmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdENvdW50ZXIubmV4dFNlcXVlbmNlVmFsdWUoe25hbWU6J3dvcmtOdW0nfSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3dvcmsgbnVtYmVyICcgK2RhdGEuc2VxdWVuY2VfdmFsdWUrICcgY3JlYXRlZCcpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLndvcmtOdW0gPSBkYXRhLnNlcXVlbmNlX3ZhbHVlLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoV29ya051bSA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPWZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2xlYXJBZnRlckNoYW5nZVRhYigpO1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3dvcmtOdW0nLCBpbnB1dCwgJ3NufGNyZWF0ZUF0fHN0YXR1c3x3b3JrTnVtfGZvcm1JZHxpdGVtUmVjb3JkLmRvY051bUlkfGl0ZW1SZWNvcmQuZG9jTnVtJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGFbJ2l0ZW1SZWNvcmQnXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRkb2NOdW1JZDpkYXRhWzBdLml0ZW1SZWNvcmQuZG9jTnVtSWQsXHJcblx0XHRcdFx0XHRcdFx0ZG9jTnVtOmRhdGFbMF0uaXRlbVJlY29yZC5kb2NOdW1cclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0bG9hZEl0ZW1SZWNvcmQoZGF0YVswXS5mb3JtSWQpO1xyXG5cclxuXHRcdFx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdpdGVtUmVjb3JkLmRvY051bUlkJywgZGF0YVswXS5pdGVtUmVjb3JkLmRvY051bUlkLCAnc258d29ya051bXxzdGF0dXN8Y3JlYXRlQXQnKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgPTA7IGkgPCBkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGRhdGFbaV0ud29ya051bSAhPT0gaW5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bS5wdXNoKGRhdGFbaV0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jbGVhckFmdGVyQ2hhbmdlVGFiID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gYWxlcnQoMTIzKTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtPVtdO1xyXG5cdFx0XHQvLyBsZXQgZm9ybUlkID0gJHNjb3BlLmZvcm1JZDtcclxuXHRcdFx0Ly8gcmVzZXQoKTtcclxuXHRcdFx0Ly8gJHNjb3BlLmZvcm1JZCA9IGZvcm1JZDtcclxuXHRcdFx0Ly8gJHNjb3BlLnVwZGF0ZUZvcm0oKTtcclxuXHRcdFx0JHNjb3BlLmlzU3RhcnRXb3JrID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5pc1dvcmtGaW5kID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gJ25ldyc7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSBmYWxzZTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdCRzY29wZS5jcmVhdGVUcmF2ZWxlciA9IGZ1bmN0aW9uKHNuKXtcclxuXHJcblx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID09PSAnbmV3Jyl7XHJcblx0XHRcdFx0YWxlcnQoJ1NlbGVjdCBhIERvY251bWVudCBOdW1iZXInKTtcclxuXHRcdFx0XHQkc2NvcGUuaXNDb2xsYXBzZWRJdGVtUmVjb3JkID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCBpc1dhbnRDcmVhdGUgPSB0cnVlO1xyXG5cdFx0XHRcdGNoZWNrU05FeGlzdERCKHNuLFxyXG5cdFx0XHRcdFx0KHJlc3VsdCk9PntcclxuXHRcdFx0XHRcdFx0aWYocmVzdWx0KXtcclxuXHRcdFx0XHRcdFx0XHRpZighY29uZmlybSgnU2FtZSBTZXJpYWwgbnVtYmVyIGFscmVhZHkgZXhpc3QgaW4gdGhlIGRhdGFiYXNlLiBDcmVhdGUgYSBuZXcgVHJhdmVsZXIgd2l0aCBzYW1lIFNlcmlhbCBOdW1iZXI/Jykpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aXNXYW50Q3JlYXRlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGlzV2FudENyZWF0ZSl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcInNuXCI6IHNuLFxyXG5cdFx0XHRcdFx0XHRcdFx0XCJzdGF0dXNcIjogXCJPUEVOXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcImNyZWF0ZUF0XCI6IG5ldyBEYXRlXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRjcmVhdGVOZXdUcmF2ZWxlcihpdGVtLCAoZGF0YSk9PntcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFwiX2lkXCI6ZGF0YS5faWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFwic25cIjpkYXRhLnNuXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhcnRXb3JrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmlzU3RhcnRXb3JrID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLnRvcENvbGxhcHNlID0gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGNoZWNrU05FeGlzdERCID0gZnVuY3Rpb24oc24sIGNhbGxiYWNrKXtcclxuXHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3NuJywgc24sICdzbicpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRpZihkYXRhLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhbGxiYWNrKCRzY29wZS5pc1NORXhpc3QpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY3JlYXRlTmV3VHJhdmVsZXIgPSBmdW5jdGlvbihpdGVtLCBjYWxsYmFjayl7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKGl0ZW0uc24pO1xyXG5cdFx0XHRpZigkc2NvcGUudXNlcm5hbWUpe1xyXG5cdFx0XHRcdGRlbGV0ZSAkc2NvcGUudHJhdmVsZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc24gPSBpdGVtLnNuO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkQnkgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVBdCA9IGl0ZW0uY3JlYXRlQXQ7XHJcblx0XHRcdFx0VHJhdmVsZXIuY3JlYXRlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0aXRlbS5faWQgPSBkYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRpZihjYWxsYmFjayl7XHJcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBnZXRTTkxpc3QgPSBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnaXRlbVJlY29yZC5kb2NOdW1JZCcsIGlucHV0LCAnc258c3RhdHVzfGNyZWF0ZUF0fHdvcmtOdW0nKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtID0gZGF0YTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNob3VsZENvbGxhcHNlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5zbiAgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkLmRvY051bSl7XHJcblx0XHRcdFx0JHNjb3BlLnRvcENvbGxhcHNlID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2V0TnVtRG9jdG9UcmF2ZWxlciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZCA9IHtcclxuXHRcdFx0XHRcdFwiZG9jTnVtSWRcIjogJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCxcclxuXHRcdFx0XHRcdFwiZG9jTnVtXCIgIDogJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bVxyXG5cdFx0XHRcdH07XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXREb2NOdW1MYWJlbCA9IGZ1bmN0aW9uKGFjdGlvbil7XHJcblxyXG5cdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRpZihhY3Rpb24gPT09ICdjcmVhdGUnKXtcclxuXHRcdFx0XHRmb3IobGV0IGk9MDsgaTwkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRpZigkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uZG9jTnVtID09PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtKXtcclxuXHRcdFx0XHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmKGFjdGlvbiA9PT0gJ2VkaXQnKXtcclxuXHRcdFx0Ly8gXHRmb3IobGV0IGk9MDsgaTwkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdC8vIFx0XHRpZigkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uZG9jTnVtID09PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtICYmXHJcblx0XHRcdC8vIFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5faWQgIT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQpe1xyXG5cdFx0XHQvLyBcdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEubGFiZWwgPSBjb3VudDtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR2YXIgcmVzZXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmZvcm1JZCA9ICcnO1xyXG5cdFx0XHQkc2NvcGUuaXNOZXcgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9hZERvY051bUxpc3QgPSBmdW5jdGlvbihpZCwgY2FsbGJhY2spe1xyXG5cdFx0XHREb2NOdW0uZ2V0RG9jTnVtTGlzdChpZClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdCA9IGRhdGE7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gbG9hZCBpbmZvcm1hdGlvbiBmb3IgSXRlbVJlY29yZCB3aXRoIFxyXG5cdFx0Ly8gZG9jTnVtLiBcclxuXHRcdHZhciBsb2FkSXRlbVJlY29yZCA9IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdGlmKCFmb3JtSWQpe1xyXG5cdFx0XHRcdGZvcm1JZCA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KGZvcm1JZClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGZvcihsZXQgaT0wOyBpPGRhdGEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGFbaV0uX2lkID09PSAkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQuZG9jTnVtSWQpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSA9IGRhdGFbaV07XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPSBpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBpbml0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRvcENvbGxhcHNlPWZhbHNlO1xyXG5cdFx0XHQkc2NvcGUudXNlcm5hbWUgPSAnSm9obiBTbm93JztcclxuXHRcdFx0JHNjb3BlLmRvY051bSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLmlzU05FeGlzdE1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5pc1NOTW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnNlYXJjaFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U04gPSAnJztcclxuXHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bSA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdCRzY29wZS5pc1VzZVdvcmtOdW0gPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmlzU3RhcnRXb3JrID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTZWFyY2hTTj0nMCc7XHJcblx0XHRcdCRzY29wZS5pc1dvcmtGaW5kID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5pbnB1dD17fTtcclxuXHRcdFx0JHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcclxuXHRcdFx0Ly8gJHNjb3BlLmlzQ29sbGFwc2VkU2VsZWN0U05MaXN0ID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLmlzQ29sbGFwc2VIZWFkZXJTTkxpc3QgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2hDbGljayA9IHRydWU7XHJcblx0XHRcdCRzY29wZS5pc0NvbGxhcHNlZEl0ZW1SZWNvcmQgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpbml0KCk7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdGxvYWRGb3JtTGlzdCgpO1xyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLmZvcm1JZCl7XHJcblx0XHRcdFx0JHNjb3BlLmZvcm1JZCA9ICRzdGF0ZVBhcmFtcy5mb3JtSWQ7XHJcblx0XHRcdFx0JHNjb3BlLnVwZGF0ZUZvcm0oKTtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbG9hZCB0aGUgdHJhdmVsZXIgZnJvbSBTZWFyY2ggcGFnZVxyXG5cdFx0XHQvLyB0YWtlIHRoZSBwcmFtYXMgZnJvbSBVUkxcclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCdfaWQnLCAkc3RhdGVQYXJhbXMuX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdC8vIGRhdGEgaXMgYSBhcnJheS4gcmVzdWx0IGNvdWxkIGJlIG1vcmUgdGhhbiBvbmVcclxuXHRcdFx0XHRcdFx0Ly8gbmVlZCB0byBkZWFsIHdpdCB0aGlzLlxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0bG9hZEl0ZW1SZWNvcmQoZGF0YS5mb3JtSWQpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6ZGF0YS5faWQsIFwic25cIjpkYXRhLnNufSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0NvdW50ZXJTZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0NvdW50ZXInLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmV4dFNlcXVlbmNlVmFsdWU6ZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvY291bnRlci9uZXh0U2VxdWVuY2VWYWx1ZS8nLCBpbnB1dCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdEb2NOdW1TZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0RvY051bScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RG9jTnVtTGlzdDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2RvY051bXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2RvY051bXMvJyxkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZWRpdERvY051bURhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvZG9jTnVtcy8nLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9jTnVtOiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZCBzZXJ2aWNlJyk7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zL3NlYXJjaFNpbmdsZT90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1TZXJ2aWNlJywgW10pXHJcblxyXG5cdC5mYWN0b3J5KCdGb3JtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zL2Zvcm1MaXN0Jyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9zZWFyY2gvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZTogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXI/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdHJhdmVsZXInLCBkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFJldmlld0RhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV2aWV3RGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZWFyY2hMaWtlOiBmdW5jdGlvbihzbil7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9zZWFyY2hMaWtlLycrIHNuKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBERUxFVEUgYSBmb3JtXHJcbiAgICAgICAgICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbihfaWQsIGlucHV0KXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKF9pZCk7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS90cmF2ZWxlci8nKyBfaWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub3JtYWxTZWFyY2g6IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIHNlbGVjdCl7XHJcbiAgICAgICAgICAgICAgICBpZighc2VsZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvbm9ybWFsU2VhcmNoP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGErJyZzZWxlY3Q9JytzZWxlY3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVNdWx0aXBsZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyL3VwZGF0ZU11bHRpcGxlJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
