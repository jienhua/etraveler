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
				Traveler.searchLike($scope.searchInput).success(function (data) {
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
		$scope.save();
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
		if ($scope.docNum.docNumSelect !== 'new') {
			setNumDoctoTraveler();
			getSNList($scope.docNum.docNumData._id);
		} else {
			delete $scope.travelerData.itemRecord;
		}

		// call a function to use docnum to return the list of serial number associate with
		// this docnum
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
		// if(idList.length > 1){
		delete data.travelerData.sn;
		// }
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
					"createAt": new Date(),
					"itemRecord": {
						"docNumId": $scope.docNum.docNumData._id,
						"docNum": $scope.docNum.docNumData.docNum
					}
				};
				console.log(item);
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
				setNumDoctoTraveler();
				$scope.save();
				$scope.searchWorkNum(data.sequence_value);
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
							if (!data[i].workNum || data[i].workNum !== input.toString()) {
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
			delete $scope.travelerData.workNum;
			$scope.travelerData.sn = item.sn;
			$scope.travelerData.itemRecord = item.itemRecord;
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
				$scope.isStartWork = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvQ291bnRlclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9Eb2NOdW1TZXJ2aWNlLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFJQyxVQUpELEVBTUMsU0FORCxFQU9DLFVBUEQsRUFRQyxjQVJELEVBU0Msb0JBVEQsRUFVQyxnQkFWRCxFQVlDLGlCQVpELEVBYUMsYUFiRCxFQWNDLGVBZEQsRUFlQyxnQkFmRCxDQUREOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsV0FBRCxDQUE1QixFQUNFLE1BREYsQ0FDUyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUF5QyxtQkFBekMsRUFDUCxVQUFTLGNBQVQsRUFBeUIsa0JBQXpCLEVBQTZDLGlCQUE3QyxFQUErRDs7QUFFL0Qsb0JBQW1CLFNBQW5CLENBQTZCLE9BQTdCOzs7QUFHQTs7O0FBQUEsRUFHRSxLQUhGLENBR1EsTUFIUixFQUdnQjtBQUNkLE9BQUssT0FEUztBQUVkLGVBQWEsaUJBRkM7QUFHZCxjQUFZO0FBSEUsRUFIaEIsRUFVRSxLQVZGLENBVVEsVUFWUixFQVVvQjtBQUNsQixPQUFLLHNCQURhO0FBRWxCLFNBQU07QUFDTCxPQUFHO0FBQ0YsaUJBQWEscUJBRFg7QUFFRixnQkFBWTtBQUZWLElBREU7QUFLTCwwQkFBc0I7QUFDckIsaUJBQWE7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UyxJQUFULEVBQWUsSUFBZixFQUFvQjtBQUNyQixtQkFBTyxNQUFNLEdBQU4sQ0FBVSx3QkFBc0IsSUFBdEIsR0FBMkIsUUFBM0IsR0FBb0MsSUFBOUMsQ0FBUDtBQUNILFNBZEU7O0FBZ0JILGNBQU0sY0FBUyxJQUFULEVBQWM7QUFDaEIsbUJBQU8sTUFBTSxHQUFOLENBQVUsZUFBVixFQUEyQixJQUEzQixDQUFQO0FBQ0gsU0FsQkU7O0FBb0JILHVCQUFlLHVCQUFTLElBQVQsRUFBYztBQUN6Qix5QkFBYSxJQUFiO0FBQ0gsU0F0QkU7O0FBd0JILG9CQUFZLG9CQUFTLEVBQVQsRUFBWTtBQUN2QixtQkFBTyxNQUFNLEdBQU4sQ0FBVSw4QkFBNkIsRUFBdkMsQ0FBUDtBQUNBLFNBMUJFOztBQTRCSCx3QkFBZ0Isd0JBQVMsR0FBVCxFQUFjLEtBQWQsRUFBb0I7O0FBRW5DLG1CQUFPLE1BQU0sTUFBTixDQUFhLG1CQUFrQixHQUEvQixDQUFQO0FBQ0EsU0EvQkU7QUFnQ0gsc0JBQWMsc0JBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNEI7QUFDdEMsZ0JBQUcsQ0FBQyxNQUFKLEVBQVc7QUFDUCx5QkFBUyxFQUFUO0FBQ0g7QUFDRCxtQkFBTyxNQUFNLEdBQU4sQ0FBVSxxQ0FBbUMsSUFBbkMsR0FBd0MsUUFBeEMsR0FBaUQsSUFBakQsR0FBc0QsVUFBdEQsR0FBaUUsTUFBM0UsQ0FBUDtBQUNILFNBckNFO0FBc0NILHdCQUFnQix3QkFBUyxJQUFULEVBQWM7QUFDMUIsbUJBQU8sTUFBTSxHQUFOLENBQVUsOEJBQVYsRUFBMEMsSUFBMUMsQ0FBUDtBQUNIO0FBeENFLEtBQVA7QUEwQ1AsQ0E5Q3dCLENBRnpCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdzYW1wbGVBcHAnLCBcclxuXHRbXHJcblx0XHQndWkucm91dGVyJywgXHJcblx0XHQndWkuYm9vdHN0cmFwJyxcclxuXHRcdCdhcHBSb3V0ZXMnLFxyXG5cdFx0J2RuZExpc3RzJyxcclxuXHJcblx0XHQnQXBwQ3RybCcsXHJcblx0XHQnTWFpbkN0cmwnLCBcclxuXHRcdCdUcmF2ZWxlckN0cmwnLCBcclxuXHRcdCdTZWFyY2hUcmF2ZWxlckN0cmwnLCBcclxuXHRcdCdGb3JtR2VuQ3RybC5qcycsXHJcblx0XHRcclxuXHRcdCdUcmF2ZWxlclNlcnZpY2UnLCBcclxuXHRcdCdGb3JtU2VydmljZScsXHJcblx0XHQnRG9jTnVtU2VydmljZScsXHJcblx0XHQnQ291bnRlclNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCdcclxuXHRcdFx0XHRcdFx0Ly8gY29udHJvbGxlcjogWyckc2NvcGUnLCAnVHJhdmVsZXInLCAnRm9ybScsZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSl7XHJcblx0XHRcdFx0XHRcdC8vIFx0JHNjb3BlLnJldmlld0RhdGEgPSBUcmF2ZWxlci5nZXRSZXZpZXdEYXRhKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0Rm9ybS5nZXQoJHNjb3BlLnJldmlld0RhdGEuZm9ybUlkKVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdC8vIH1dXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6ICdUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0LnN0YXRlKCdzZWFyY2hUcmF2ZWxlcicse1xyXG5cdFx0XHRcdHVybDogJy9zZWFyY2hUcmF2ZWxlcicsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaFRyYXZlbGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdmb3JtUmV2aWV3QHNlYXJjaFRyYXZlbGVyJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybVJldmlldy5odG1sJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybUdlbmVyYXRvck5hdi5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUdlbmVyYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVHZW5lcmF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVDcmVhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUNyZWF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdBcHBDdHJsJywgWyduZ0FuaW1hdGUnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1HZW5DdHJsLmpzJywgWyd1aS5ib290c3RyYXAudGFicyddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcicsIFsnJHNjb3BlJywnRm9ybScgLCBmdW5jdGlvbigkc2NvcGUsIEZvcm0pe1xyXG5cclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24ocGFzc3dvcmQpe1xyXG5cdFx0XHRpZighcGFzc3dvcmQgfHwgcGFzc3dvcmQgPT09ICcnKXtcclxuXHRcdFx0XHRwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJzEyMycpe1xyXG5cdFx0XHRGb3JtLmNyZWF0ZSgkc2NvcGUudGVtcGxhdGUpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0YWxlcnQoJ2FkZCcpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZSA9IGRhdGE7XHJcblx0XHRcdFx0XHRkZWxldGUgJHNjb3BlLnRlbXBsYXRlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZSBzb24nKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0aWYocGFzc3dvcmQgPT09JzEyMycpe1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdEZvcm0uc2F2ZSgkc2NvcGUuY3JlYXRlKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc2F2ZScpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUudGVtcGxhdGUgPSAkc2NvcGUuY3JlYXRlO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN1Ym1pdChwYXNzd29yZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnUVFtb3JlJyl7XHJcblx0XHRcdFx0aWYoY29uZmlybSgnZGVsZXRlIHRlbXBsYXRlPycpKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdFx0Rm9ybS5kZWxldGUoJHNjb3BlLmNyZWF0ZS5faWQpXHJcblx0XHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRcdFx0YWxlcnQoJ3JlbW92ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aW5pdENyZWF0ZSgpO1xyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRTZWxlY3RUYWIgPSBmdW5jdGlvbihuKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFRhYiA9IG47XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZCAmJiAkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcImlkXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiRzY29wZS5pbnB1dEl0ZW1SZWNvcmRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID09PSAnc2VsZWN0Jyl7XHJcblx0XHRcdFx0XHR2YXIgaG9sZGVyID0gJHNjb3BlLnNlbGVjdE9wdGlvbnM7XHJcblx0XHRcdFx0XHRob2xkZXIgPSBob2xkZXIuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGk8aG9sZGVyLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRob2xkZXJbaV0gPSBob2xkZXJbaV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aG9sZGVyID0gQXJyYXkuZnJvbShuZXcgU2V0KGhvbGRlcikpO1xyXG5cdFx0XHRcdFx0aXRlbVsnc2VsZWN0J10gPSB7J25hbWUnOicnfTtcclxuXHRcdFx0XHRcdGl0ZW0uc2VsZWN0WydvcHRpb25zJ10gPSBob2xkZXI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGlmKCRzY29wZS5pbnB1dFN0ZXBEZXMgJiYgJHNjb3BlLmlucHV0U3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBzdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6ICRzY29wZS5pbnB1dFN0ZXBUeXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUuaW5wdXRTdGVwRGVzIHx8ICcnXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzLnB1c2goc3RlcCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5pbnB1dFN0ZXBEZXMgPSAnJztcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAmJiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRsZXQgc3RlcEluZGV4ID0gJHNjb3BlLnRlbXBTdWIuc2VsZWN0U3RlcEZvclN1YlN0ZXA7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0PVtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QubGVuZ3RoO1xyXG5cdFx0XHRcdGxldCBzdWJTdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdWJfc3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5wdXNoKHN1YlN0ZXApO1xyXG5cdFx0XHRcdCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJPcHRpb24gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgc3RlcCA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzBdO1xyXG5cdFx0XHRsZXQgc3ViID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMV07XHJcblx0XHRcdGxldCBzZWxlY3RPcHRpb24gPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLnNlbGVjdFN1Yk9wdGlvbjtcclxuXHRcdFx0bGV0IG9wdGlvbnMgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dC5zcGxpdCgnLCcpO1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTwgb3B0aW9ucy5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRvcHRpb25zW2ldID0gb3B0aW9uc1tpXS50cmltKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0aW9ucyA9IEFycmF5LmZyb20obmV3IFNldChvcHRpb25zKSk7XHJcblx0XHRcdGxldCBzdWJTdGVwT3B0aW9uID0ge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IHNlbGVjdE9wdGlvbixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lLFxyXG5cdFx0XHRcdFx0XCJvcHRpb25zXCI6IG9wdGlvbnNcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMpe1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnM9W107XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucy5wdXNoKHN1YlN0ZXBPcHRpb24pO1xyXG5cdFx0XHQvLyRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdW3NlbGVjdE9wdGlvbl0gPSBzdWJTdGVwT3B0aW9uO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lID0gJyc7XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0ID0gJyc7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUubW9kaWZ5SUQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUpe1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxvYmplY3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYodHlwZSA9PT0naXRlbVJlY29yZCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLmlkID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdGVwcycpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N1Yl9zdGVwJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3ViX3N0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0T3B0aW9uID0gZnVuY3Rpb24oYWRkcmVzcywgaW5wdXQpe1xyXG4gICAgICBjb25zb2xlLmxvZyh0eXBlb2YgaW5wdXQpO1xyXG4gICAgICBjb25zb2xlLmxvZyhpbnB1dCk7XHJcblx0XHRcdGlmKGFkZHJlc3Mpe1xyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdCAgaW5wdXQgPSBpbnB1dC5zcGxpdCgnLCcpO1xyXG4gICAgICAgIH1cclxuXHRcdFx0XHRmb3IobGV0IGk9MDtpPGlucHV0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0YWRkcmVzcy5vcHRpb25zW2ldID0gaW5wdXRbaV0udHJpbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRkcmVzcy5vcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuICAgICAgICAgIGlmKCRzY29wZS5mb3JtSWQpe1xyXG4gICAgICAgICAgICBGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmZvcm1zID0gZGF0YTsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gLy8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlPSBkYXRhO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgaW5pdENyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jcmVhdGUgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5pc1B1Ymxpc2ggPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG4gICAgdmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgJHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXRDcmVhdGUoKTtcclxuICAgICAgbG9hZEZvcm1MaXN0KCk7XHJcblx0XHRcclxuXHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPSAndGV4dCc7XHJcblx0XHRcdCRzY29wZS5qc29uVmlldyA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNYWluQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUudGFnbGluZSA9ICd0byB0aGUgbW9vbiBhbmQgYmFjayEnO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlYXJjaFRyYXZlbGVyQ3RybCcsIFsnY2hhcnQuanMnXSlcclxuXHJcblx0LmNvbnRyb2xsZXIoJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlcil7XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50SW5wdXQgPSAkc2NvcGUuc2VhcmNoSW5wdXQ7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IHRydWU7XHJcblx0XHRcdGlmKCRzY29wZS5zZWFyY2hJbnB1dCl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLnNlYXJjaE9wdGlvbiA9PT0nc24nKXtcclxuXHRcdFx0XHRcdGxldCBzbiA9ICRzY29wZS5zZWFyY2hJbnB1dC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0VHJhdmVsZXIuc2VhcmNoTGlrZSgkc2NvcGUuc2VhcmNoSW5wdXQpXHJcblxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHRcdFx0ZmluZFN0YXRpc3RpY3MoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyBzZWFyY2ggZG9jIG51bVxyXG5cdFx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCRzY29wZS5zZWFyY2hPcHRpb24sICRzY29wZS5zZWFyY2hJbnB1dClcclxuXHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHRcdFx0ZmluZFN0YXRpc3RpY3MoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdFRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBmb3JtSWQpe1xyXG5cdFx0XHR3aW5kb3cub3BlbigndHJhdmVsZXI/X2lkPScrX2lkKycmZm9ybUlkPScrZm9ybUlkLCAnX2JsYW5rJyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZW1vdmVUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgaW5kZXgpe1xyXG5cdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcihfaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnJlc3VsdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudGltZVNwZW5kID0gZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKGRhdGEucmV2aWV3QXQpe1xyXG5cdFx0XHRcdGxldCBkaWZmID0gTWF0aC5yb3VuZCgobmV3IERhdGUoZGF0YS5yZXZpZXdBdCkgLSBuZXcgRGF0ZShkYXRhLmNyZWF0ZUF0KSkvMTAwMCk7XHJcblx0XHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kICs9IGRpZmY7XHJcblx0XHRcdFx0cmV0dXJuIGNhbHVsYXRlVGltZShkaWZmKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IGRpZmYgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoZGF0YS5jcmVhdGVBdCkpLzEwMDApO1xyXG5cdFx0XHRcdCRzY29wZS50b3RhbFRpbWVTcGFuZCArPSBkaWZmO1xyXG5cdFx0XHRcdHJldHVybiBjYWx1bGF0ZVRpbWUoZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnRvdGFsVGltZVNwZW5kID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdHJldHVybiA1O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgY2FsdWxhdGVUaW1lID0gZnVuY3Rpb24oc2Vjb25kcyl7XHJcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMvNjAvNjApICsgJyBIb3VycyBhbmQgJyArIE1hdGguZmxvb3Ioc2Vjb25kcy82MCklNjAgKyBcclxuXHRcdFx0XHRcdCcgbWluIGFuZCAnICsgc2Vjb25kcyAlIDYwICsgJyBzZWMnO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyAkc2NvcGUucHJpbnRUcmF2ZWxlciA9IGZ1bmN0aW9uKGluZGV4KXtcclxuXHRcdC8vIFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9ICRzY29wZS5yZXN1bHRbaW5kZXhdO1xyXG5cdFx0XHQvLyB2YXIgcHJpbnRDb250ZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaWQtc2VsZWN0b3InKS5pbm5lckhUTUw7XHJcblx0XHQgLy8gICAgdmFyIHBvcHVwV2luID0gd2luZG93Lm9wZW4oJycsICdfYmxhbmsnLCAnd2lkdGg9ODAwLGhlaWdodD04MDAsc2Nyb2xsYmFycz1ubyxtZW51YmFyPW5vLHRvb2xiYXI9bm8sbG9jYXRpb249bm8sc3RhdHVzPW5vLHRpdGxlYmFyPW5vLHRvcD01MCcpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLndpbmRvdy5mb2N1cygpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC53cml0ZSgnPCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPlRJVExFIE9GIFRIRSBQUklOVCBPVVQ8L3RpdGxlPicgK1xyXG5cdFx0IC8vICAgICAgICAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCJsaWJzL2Jvb3NhdmVEb2NOdW10c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIj4nICtcclxuXHRcdCAvLyAgICAgICAgJzwvaGVhZD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKTsgd2luZG93LmNsb3NlKCk7XCI+PGRpdj4nICsgcHJpbnRDb250ZW50cyArICc8L2Rpdj48L2h0bWw+Jyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHR2YXIgZmluZFN0YXRpc3RpY3MgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuc3RhdCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUucGllTGFiZWxzMT1bXTtcclxuXHRcdFx0JHNjb3BlLnBpZURhdGExID0gW107XHJcblx0XHRcdGxldCBkYXRhID0gJHNjb3BlLnJlc3VsdDtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZihkYXRhW2ldLnN0YXR1cyBpbiAkc2NvcGUuc3RhdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3RhdFtkYXRhW2ldLnN0YXR1c10gKz0xO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBpZUxhYmVsczEucHVzaChkYXRhW2ldLnN0YXR1cyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3RhdFtkYXRhW2ldLnN0YXR1c10gPTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zdGF0LnRvdGFsID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcdGxldCByZWplY3QgPSAwO1xyXG5cdFx0XHRsZXQgY29tcGxldGVkID0gMDtcclxuXHRcdFx0Ly8gY2FsdWxhdGUgcGVyY2VudCBvZiB0b3RhbCBjb21wbGF0ZWQgb3V0IG9mIHRvdGFsXHJcblx0XHRcdGlmKCRzY29wZS5zdGF0LlJFSkVDVCl7XHJcblx0XHRcdFx0cmVqZWN0ID0gJHNjb3BlLnN0YXQuUkVKRUNUO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZigkc2NvcGUuc3RhdC5DT01QTEVURUQpe1xyXG5cdFx0XHRcdGNvbXBsZXRlZCA9ICRzY29wZS5zdGF0LkNPTVBMRVRFRDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC5wZWNDb21wbGV0ZSA9ICgoKGNvbXBsZXRlZCkrKHJlamVjdCkpLyhkYXRhLmxlbmd0aCkqMTAwKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY2FsdWxhdGUgcGVyY2VudCBvZiByZWplY3Qgb3V0IG9mIHRvdGFsXHJcblx0XHRcdGlmKCgkc2NvcGUuc3RhdC5SRUpFQ1QpLyhkYXRhLmxlbmd0aCkqMTAwKXtcclxuXHRcdFx0XHQkc2NvcGUuc3RhdC5wZWNSZWplY3QgPSAoKHJlamVjdCkvKGRhdGEubGVuZ3RoKSoxMDApLnRvRml4ZWQoMik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGZvcihsZXQgaT0wO2k8JHNjb3BlLnBpZUxhYmVsczEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0JHNjb3BlLnBpZURhdGExLnB1c2goJHNjb3BlLnN0YXRbJHNjb3BlLnBpZUxhYmVsczFbaV1dKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JHNjb3BlLnBpZUxhYmVsczIgPSBbJ0ZpbmlzaCcsICdIb2xkJ107XHJcblx0XHRcdCRzY29wZS5waWVEYXRhMiA9IFtjb21wbGV0ZWQrcmVqZWN0LCAoJHNjb3BlLnN0YXQudG90YWwtKGNvbXBsZXRlZCtyZWplY3QpKV07XHJcblx0XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBpbml0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWFyY2hPcHRpb24gPSAnZG9jTnVtJztcclxuXHRcdFx0JHNjb3BlLnNvcnRUeXBlID0gJ2NyZWF0ZUF0JztcclxuXHRcdFx0JHNjb3BlLnNvcnRSZXZlcnNlID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kID0gMDtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpbml0KCk7XHJcblx0XHR9O1xyXG5cdFx0bWFpbigpO1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJDdHJsJywgW10pXHJcblx0XHJcblx0LmZpbHRlcigndW5pcXVlJywgZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBrZXluYW1lKXtcclxuXHRcdFx0dmFyIG91dHB1dCA9IFtdLFxyXG5cdFx0XHRcdGtleXMgICA9IFtdO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0XHRcdHZhciBrZXkgPSBpdGVtW2tleW5hbWVdO1xyXG5cdFx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSl7XHJcblx0XHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvdXRwdXQ7XHJcblx0XHR9O1xyXG5cdH0pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ1RyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnVHJhdmVsZXInLCAnRm9ybScsICdEb2NOdW0nLCAnQ291bnRlcicsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtLCBEb2NOdW0sIENvdW50ZXIsICRzdGF0ZVBhcmFtcyl7XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAhPT0gJ09QRU4nKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1BBTkRJTkcgRk9SIFJFVklFVyc7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnNhdmUoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHRpZigkc2NvcGUuZm9ybUlkKXtcclxuXHRcdFx0XHRGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcblx0XHRcdFx0XHRcdCRzY29wZS5sYXN0U3RlcCA9IGRhdGEuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHQvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXYgPSBkYXRhLmZvcm1SZXY7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHRcdFx0bG9hZERvY051bUxpc3QoZGF0YS5faWQsICgpPT57fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSAkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RdO1xyXG5cdFx0XHRpZigkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCAhPT0gJ25ldycpe1xyXG5cdFx0XHRcdHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRnZXRTTkxpc3QoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGRlbGV0ZSAkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGNhbGwgYSBmdW5jdGlvbiB0byB1c2UgZG9jbnVtIHRvIHJldHVybiB0aGUgbGlzdCBvZiBzZXJpYWwgbnVtYmVyIGFzc29jaWF0ZSB3aXRoIFxyXG5cdFx0XHQvLyB0aGlzIGRvY251bVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV4dFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgb2JqZWN0ID0gJHNjb3BlLmZvcm1zLnN0ZXBzWyRzY29wZS5jdXJyZW50U3RlcC0xXTtcclxuXHRcdFx0aWYob2JqZWN0Lmxpc3QubGVuZ3RoID49ICRzY29wZS5jdXJyZW50U3ViU3RlcCsxKXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgKz0gMTtcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgKz0gMTtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50U3RlcCA+ICRzY29wZS5sYXN0U3RlcCl7XHJcblx0XHRcdFx0XHQvLyBUcmF2ZWxlci5zZXRSZXZpZXdEYXRhKCRzY29wZS50cmF2ZWxlckRhdGEpO1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gcGFnZTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQvLyAkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzU3ViUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSBwYWdlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBpZExpc3QgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMDtpIDwgJHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZExpc3QucHVzaCgkc2NvcGUuc2VsZWN0U05MaXN0W2ldLl9pZCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBkYXRhID0ge1xyXG5cdFx0XHRcdGlkTGlzdCA6IGlkTGlzdCxcclxuXHRcdFx0XHR0cmF2ZWxlckRhdGE6ICRzY29wZS50cmF2ZWxlckRhdGFcclxuXHRcdFx0fTtcclxuXHRcdFx0Ly8gaWYoaWRMaXN0Lmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRkZWxldGUgZGF0YS50cmF2ZWxlckRhdGEuc247XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0VHJhdmVsZXIudXBkYXRlTXVsdGlwbGUoZGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0aWYoY2FsbGJhY2spXHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucmV2aWV3ID0gZnVuY3Rpb24ob3B0aW9uKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdCeSl7XHJcblx0XHRcdFx0aWYob3B0aW9uID09PSAncmVqZWN0Jyl7XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdSRUpFQ1QnO1xyXG5cdFx0XHRcdH1lbHNlIGlmKG9wdGlvbiA9PT0gJ2NvbXBsZXRlJyl7XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdDT01QTEVURUQnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0F0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgcmV2aWV3ZXIgbmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudXNlcm5hbWUgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zbil7XHJcblx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jb21wbGV0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQvLyBzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWRCeSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZUF0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5jcmVhdGUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHJcblx0XHRcdFx0XHQvLyBpZiBzdWNjZXNzZnVsIGNyZWF0ZVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3N1Ym1pdCBjb21wbGV0ZScpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUgb3Igc2VyaWFsIG51bWJlciBwbHogJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5ldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRhbGVydCgnZGVsZXRlIGNsaWNrJyk7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKXtcclxuXHRcdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFwcGVuZFN1YlN0ZXBFZGl0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB1c2VybmFtZSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0aWYodXNlcm5hbWUgIT09ICcnKXtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN0ZXAgPSAkc2NvcGUuY3VycmVudFN0ZXA7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdWJTdGVwID0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRCeSA9IHVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnByaW50VHJhdmVsZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyB2YXIgcHJpbnRDb250ZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaWQtc2VsZWN0b3InKS5pbm5lckhUTUw7XHJcblx0XHQgLy8gICAgdmFyIHBvcHVwV2luID0gd2luZG93Lm9wZW4oJycsICdfYmxhbmsnLCAnd2lkdGg9ODAwLGhlaWdodD04MDAsc2Nyb2xsYmFycz1ubyxtZW51YmFyPW5vLHRvb2xiYXI9bm8sbG9jYXRpb249bm8sc3RhdHVzPW5vLHRpdGxlYmFyPW5vLHRvcD01MCcpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLndpbmRvdy5mb2N1cygpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC53cml0ZSgnPCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPlRJVExFIE9GIFRIRSBQUklOVCBPVVQ8L3RpdGxlPicgK1xyXG5cdFx0IC8vICAgICAgICAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCJsaWJzL2Jvb3NhdmVEb2NOdW10c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIj4nICtcclxuXHRcdCAvLyAgICAgICAgJzwvaGVhZD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKTsgd2luZG93LmNsb3NlKCk7XCI+PGRpdj4nICsgcHJpbnRDb250ZW50cyArICc8L2Rpdj48L2h0bWw+Jyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdFx0d2luZG93LnByaW50KCk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQkc2NvcGUuc2F2ZURvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5mb3JtSWQgPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZDtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1SZXYgPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXY7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5mb3JtTm8gPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObztcclxuXHRcdFx0c2V0RG9jTnVtTGFiZWwoJ2NyZWF0ZScpO1xyXG5cdFx0XHRkZWxldGUgJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZDtcclxuXHRcdFx0RG9jTnVtLmNyZWF0ZSgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRsb2FkRG9jTnVtTGlzdCgkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCwgKGxpc3QpPT57XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaT0wOyBpPGxpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdFx0aWYobGlzdFtpXS5faWQgPT09IGRhdGEuX2lkKXtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9IGkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZCA9IHtcImRvY051bVwiOiRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW19O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXREb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBzZXREb2NOdW1MYWJlbCgnZWRpdCcpO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpKTtcclxuXHRcdFx0RG9jTnVtLmVkaXREb2NOdW1EYXRhKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkLCAoKT0+e30pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tGb3JTTiA9IGZ1bmN0aW9uKGRhdGEpe1xyXG5cclxuXHRcdFx0aWYoZGF0YSl7XHJcblx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdE1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8ICRzY29wZS5TTkxpc3RGb3JEb2NOdW0ubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdFx0aWYoJHNjb3BlLlNOTGlzdEZvckRvY051bVtpXS5zbiA9PT0gZGF0YSl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGlmKGNvbmZpcm0oJ1NOIGFscmVhZHkgZXhpc3QuIGRvIHlvdSB3YW50IHRvIGNyZWF0ZSBhIG5ldyB0cmF2ZWxlciB3aXRoIHNhbWUgc24/Jykpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoISRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGxldCBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XHRcInNuXCI6IGRhdGEsXHJcblx0XHRcdFx0XHRcdFwic3RhdHVzXCI6IFwiT1BFTlwiLFxyXG5cdFx0XHRcdFx0XHRcImNyZWF0ZUF0XCI6IG5ldyBEYXRlLFxyXG5cdFx0XHRcdFx0XHRcIml0ZW1SZWNvcmRcIjp7XHJcblx0XHRcdFx0XHRcdFx0XCJkb2NOdW1JZFwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFwiZG9jTnVtXCI6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xyXG5cdFx0XHRcdFx0Y3JlYXRlTmV3VHJhdmVsZXIoaXRlbSk7XHJcblx0XHRcdFx0XHRkYXRhID0gJyc7XHJcblx0XHRcdFx0XHRpdGVtID0ge307XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5tb3ZlVG9TZWxlY3RTTkxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmxlbmd0aCk7XHJcblx0XHJcblx0XHRcdGxldCBzdGFjayA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGk9JHNjb3BlLlNOTGlzdEZvckRvY051bS5sZW5ndGg7aSA+IDA7aS0tKXtcclxuXHRcdFx0XHRsZXQgZWwgPSAkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnBvcCgpO1xyXG5cdFx0XHRcdGlmKGVsLmNoZWNrYm94ID09PSB0cnVlKXtcclxuXHRcdFx0XHRcdGVsLmNoZWNrYm94ID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goZWwpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3RhY2sucHVzaChlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBzdGFjaztcclxuXHRcdFx0c3RhY2sgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubW92ZVRvU05MaXN0Rm9yRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHN0YWNrID0gW107XHJcblx0XHRcdGZvcihsZXQgaSA9JHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGg7IGk+MDtpLS0pe1xyXG5cdFx0XHRcdGxldCBlbCA9ICRzY29wZS5zZWxlY3RTTkxpc3QucG9wKCk7XHJcblx0XHRcdFx0aWYoZWwuY2hlY2tib3ggPT09ICB0cnVlKXtcclxuXHRcdFx0XHRcdGVsLmNoZWNrYm94ID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnB1c2goZWwpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3RhY2sucHVzaChlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBzdGFjaztcclxuXHRcdFx0c3RhY2sgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VsZWN0QWxsTGlzdCA9IGZ1bmN0aW9uKGxpc3Qpe1xyXG5cdFx0XHRsZXQgYm9vbCA9IGxpc3RbMF0uY2hlY2tib3g7XHJcblx0XHRcdGZvcihsZXQgaT0wO2k8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRsaXN0W2ldLmNoZWNrYm94ID0gIWJvb2w7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmxvYWRUcmF2ZWxlciA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0aWYoaW5wdXQpe1xyXG5cdFx0XHRcdCRzY29wZS5zZWxlY3RTTiA9IGlucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnX2lkJywgJHNjb3BlLnNlbGVjdFNOKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YVswXTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoU04gPSBmdW5jdGlvbihzbil7XHJcblxyXG5cdFx0XHRpZihzbil7XHJcblx0XHRcdFx0JHNjb3BlLnNlYXJjaFNOTGlzdD0gW107XHJcblx0XHRcdFx0JHNjb3BlLmNsZWFyQWZ0ZXJDaGFuZ2VUYWIoKTtcclxuXHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdzbicsIHNuLCAnc258Y3JlYXRlQXR8c3RhdHVzJylcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTTk1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoID4gMSl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzU05Nb3JlVGhhbk9uZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNOTGlzdCA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmKGRhdGEubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QucHVzaCh7XCJfaWRcIjpkYXRhWzBdLl9pZCwgXCJzblwiOmRhdGFbMF0uc259KTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U04gPSBkYXRhWzBdLl9pZDtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUubG9hZFRyYXZlbGVyKCk7XHJcblx0XHRcdFx0XHRcdFx0bG9hZEl0ZW1SZWNvcmQoZGF0YVswXS5mb3JtSWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vICRzY29wZS5pc1N0YXJ0V29yayA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNldFRyYXZlbGVyRGF0YSA9IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QucHVzaCh7XCJfaWRcIjokc2NvcGUuc2VhcmNoU05MaXN0W2RhdGFdLl9pZCwgXCJzblwiOiAkc2NvcGUuc2VhcmNoU05MaXN0W2RhdGFdLnNufSk7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTiA9ICRzY29wZS5zZWFyY2hTTkxpc3RbZGF0YV0uX2lkO1xyXG5cdFx0XHQkc2NvcGUubG9hZFRyYXZlbGVyKCk7XHJcblx0XHRcdGxvYWRJdGVtUmVjb3JkKCk7XHJcblx0XHRcdC8vICRzY29wZS5pc1N0YXJ0V29yayA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jcmVhdGVXb3JrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRDb3VudGVyLm5leHRTZXF1ZW5jZVZhbHVlKHtuYW1lOid3b3JrTnVtJ30pXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCd3b3JrIG51bWJlciAnICtkYXRhLnNlcXVlbmNlX3ZhbHVlKyAnIGNyZWF0ZWQnKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS53b3JrTnVtID0gZGF0YS5zZXF1ZW5jZV92YWx1ZS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hXb3JrTnVtKGRhdGEuc2VxdWVuY2VfdmFsdWUpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaFdvcmtOdW0gPSBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHRcdCRzY29wZS5pc1dvcmtGaW5kID1mYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNsZWFyQWZ0ZXJDaGFuZ2VUYWIoKTtcclxuXHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCd3b3JrTnVtJywgaW5wdXQsICdzbnxjcmVhdGVBdHxzdGF0dXN8d29ya051bXxmb3JtSWR8aXRlbVJlY29yZC5kb2NOdW1JZHxpdGVtUmVjb3JkLmRvY051bScpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IGRhdGE7XHJcblx0XHRcdFx0XHRpZihkYXRhLmxlbmd0aD4wKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhWydpdGVtUmVjb3JkJ10gPSB7XHJcblx0XHRcdFx0XHRcdFx0ZG9jTnVtSWQ6ZGF0YVswXS5pdGVtUmVjb3JkLmRvY051bUlkLFxyXG5cdFx0XHRcdFx0XHRcdGRvY051bTpkYXRhWzBdLml0ZW1SZWNvcmQuZG9jTnVtXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGxvYWRJdGVtUmVjb3JkKGRhdGFbMF0uZm9ybUlkKTtcclxuXHJcblx0XHRcdFx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnaXRlbVJlY29yZC5kb2NOdW1JZCcsIGRhdGFbMF0uaXRlbVJlY29yZC5kb2NOdW1JZCwgJ3NufHdvcmtOdW18c3RhdHVzfGNyZWF0ZUF0JylcclxuXHRcdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdFx0XHRpZihkYXRhLmxlbmd0aD4wKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpID0wOyBpIDwgZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZighZGF0YVtpXS53b3JrTnVtIHx8ZGF0YVtpXS53b3JrTnVtICE9PSBpbnB1dC50b1N0cmluZygpKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0ucHVzaChkYXRhW2ldKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmNsZWFyQWZ0ZXJDaGFuZ2VUYWIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBhbGVydCgxMjMpO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW09W107XHJcblx0XHRcdC8vIGxldCBmb3JtSWQgPSAkc2NvcGUuZm9ybUlkO1xyXG5cdFx0XHQvLyByZXNldCgpO1xyXG5cdFx0XHQvLyAkc2NvcGUuZm9ybUlkID0gZm9ybUlkO1xyXG5cdFx0XHQvLyAkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPSAnbmV3JztcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0ge307XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLmNyZWF0ZVRyYXZlbGVyID0gZnVuY3Rpb24oc24pe1xyXG5cclxuXHRcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPT09ICduZXcnKXtcclxuXHRcdFx0XHRhbGVydCgnU2VsZWN0IGEgRG9jbnVtZW50IE51bWJlcicpO1xyXG5cdFx0XHRcdCRzY29wZS5pc0NvbGxhcHNlZEl0ZW1SZWNvcmQgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IGlzV2FudENyZWF0ZSA9IHRydWU7XHJcblx0XHRcdFx0Y2hlY2tTTkV4aXN0REIoc24sXHJcblx0XHRcdFx0XHQocmVzdWx0KT0+e1xyXG5cdFx0XHRcdFx0XHRpZihyZXN1bHQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFjb25maXJtKCdTYW1lIFNlcmlhbCBudW1iZXIgYWxyZWFkeSBleGlzdCBpbiB0aGUgZGF0YWJhc2UuIENyZWF0ZSBhIG5ldyBUcmF2ZWxlciB3aXRoIHNhbWUgU2VyaWFsIE51bWJlcj8nKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRpc1dhbnRDcmVhdGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoaXNXYW50Q3JlYXRlKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgaXRlbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFwic25cIjogc24sXHJcblx0XHRcdFx0XHRcdFx0XHRcInN0YXR1c1wiOiBcIk9QRU5cIixcclxuXHRcdFx0XHRcdFx0XHRcdFwiY3JlYXRlQXRcIjogbmV3IERhdGVcclxuXHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdGNyZWF0ZU5ld1RyYXZlbGVyKGl0ZW0sIChkYXRhKT0+e1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XCJfaWRcIjpkYXRhLl9pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XCJzblwiOmRhdGEuc25cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0c2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnNhdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vICRzY29wZS5pc1N0YXJ0V29yayA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGFydFdvcmsgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUudG9wQ29sbGFwc2UgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgY2hlY2tTTkV4aXN0REIgPSBmdW5jdGlvbihzbiwgY2FsbGJhY2spe1xyXG5cdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnc24nLCBzbiwgJ3NuJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+IHtcclxuXHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FsbGJhY2soJHNjb3BlLmlzU05FeGlzdCk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjcmVhdGVOZXdUcmF2ZWxlciA9IGZ1bmN0aW9uKGl0ZW0sIGNhbGxiYWNrKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coaXRlbS5zbik7XHJcblx0XHRcdGlmKCRzY29wZS51c2VybmFtZSl7XHJcblx0XHRcdFx0ZGVsZXRlICRzY29wZS50cmF2ZWxlckRhdGEuX2lkO1xyXG5cdFx0XHRcdGRlbGV0ZSAkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXA7XHJcblx0XHRcdFx0ZGVsZXRlICRzY29wZS50cmF2ZWxlckRhdGEud29ya051bTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnNuID0gaXRlbS5zbjtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQgPSBpdGVtLml0ZW1SZWNvcmQ7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWRCeSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZUF0ID0gaXRlbS5jcmVhdGVBdDtcclxuXHRcdFx0XHRUcmF2ZWxlci5jcmVhdGUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRpdGVtLl9pZCA9IGRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGdldFNOTGlzdCA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdpdGVtUmVjb3JkLmRvY051bUlkJywgaW5wdXQsICdzbnxzdGF0dXN8Y3JlYXRlQXR8d29ya051bScpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2hvdWxkQ29sbGFwc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnNuICAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQuZG9jTnVtKXtcclxuXHRcdFx0XHQkc2NvcGUudG9wQ29sbGFwc2UgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXROdW1Eb2N0b1RyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1xyXG5cdFx0XHRcdFx0XCJkb2NOdW1JZFwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XCJkb2NOdW1cIiAgOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtXHJcblx0XHRcdFx0fTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldERvY051bUxhYmVsID0gZnVuY3Rpb24oYWN0aW9uKXtcclxuXHJcblx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdGlmKGFjdGlvbiA9PT0gJ2NyZWF0ZScpe1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0pe1xyXG5cdFx0XHRcdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYoYWN0aW9uID09PSAnZWRpdCcpe1xyXG5cdFx0XHQvLyBcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0Ly8gXHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0gJiZcclxuXHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLl9pZCAhPT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCl7XHJcblx0XHRcdC8vIFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyB9XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5sYWJlbCA9IGNvdW50O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Rm9ybS5nZXRGb3JtTGlzdCgpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciByZXNldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZm9ybUlkID0gJyc7XHJcblx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRG9jTnVtTGlzdCA9IGZ1bmN0aW9uKGlkLCBjYWxsYmFjayl7XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KGlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBsb2FkIGluZm9ybWF0aW9uIGZvciBJdGVtUmVjb3JkIHdpdGggXHJcblx0XHQvLyBkb2NOdW0uIFxyXG5cdFx0dmFyIGxvYWRJdGVtUmVjb3JkID0gZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0aWYoIWZvcm1JZCl7XHJcblx0XHRcdFx0Zm9ybUlkID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0RG9jTnVtLmdldERvY051bUxpc3QoZm9ybUlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aWYoZGF0YVtpXS5faWQgPT09ICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW1JZCl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YVtpXTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9IGkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudG9wQ29sbGFwc2U9ZmFsc2U7XHJcblx0XHRcdCRzY29wZS51c2VybmFtZSA9ICdKb2huIFNub3cnO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtID0ge307XHJcblx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmlzU05Nb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuc2VhcmNoU05MaXN0ID0gW107XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTiA9ICcnO1xyXG5cdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtID0gW107XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLmlzVXNlV29ya051bSA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNlYXJjaFNOPScwJztcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmlucHV0PXt9O1xyXG5cdFx0XHQkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG5cdFx0XHQvLyAkc2NvcGUuaXNDb2xsYXBzZWRTZWxlY3RTTkxpc3QgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUuaXNDb2xsYXBzZUhlYWRlclNOTGlzdCA9IHRydWU7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaENsaWNrID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLmlzQ29sbGFwc2VkSXRlbVJlY29yZCA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXQoKTtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0bG9hZEZvcm1MaXN0KCk7XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsb2FkIHRoZSB0cmF2ZWxlciBmcm9tIFNlYXJjaCBwYWdlXHJcblx0XHRcdC8vIHRha2UgdGhlIHByYW1hcyBmcm9tIFVSTFxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuX2lkKXtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0XHRUcmF2ZWxlci5nZXQoJ19pZCcsICRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZChkYXRhLmZvcm1JZCk7XHJcblx0XHRcdFx0XHRcdHNob3VsZENvbGxhcHNlKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QucHVzaCh7XCJfaWRcIjpkYXRhLl9pZCwgXCJzblwiOmRhdGEuc259KTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU3RhcnRXb3JrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnQ291bnRlclNlcnZpY2UnLCBbXSlcclxuXHRcclxuXHQuZmFjdG9yeSgnQ291bnRlcicsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuZXh0U2VxdWVuY2VWYWx1ZTpmdW5jdGlvbihpbnB1dCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FwaS9jb3VudGVyL25leHRTZXF1ZW5jZVZhbHVlLycsIGlucHV0KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0RvY051bVNlcnZpY2UnLCBbXSlcclxuXHRcclxuXHQuZmFjdG9yeSgnRG9jTnVtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXREb2NOdW1MaXN0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZG9jTnVtcy8nK2Zvcm1JZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZG9jTnVtcy8nLGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlZGl0RG9jTnVtRGF0YTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9kb2NOdW1zLycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXREb2NOdW06IGZ1bmN0aW9uKHR5cGUsIGRhdGEpe1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdkIHNlcnZpY2UnKTtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2RvY051bXMvc2VhcmNoU2luZ2xlP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybVNlcnZpY2UnLCBbXSlcclxuXHJcblx0LmZhY3RvcnkoJ0Zvcm0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRBbGw6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy8nKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldEZvcm1MaXN0OiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvZm9ybUxpc3QnKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zL3NlYXJjaC8nK2Zvcm1JZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvZm9ybXMnLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVsZXRlOiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvZm9ybXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1RyYXZlbGVyU2VydmljZScsIFtdKVxyXG4gICAgICAgXHJcbiAgICAuZmFjdG9yeSgnVHJhdmVsZXInLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICAgICAgICB2YXIgcmV2aWV3RGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG5cdFxyXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIHdvcmsgd2hlbiBtb3JlIEFQSSByb3V0ZXMgYXJlIGRlZmluZWQgb24gdGhlIE5vZGUgc2lkZSBvZiB0aGluZ3NcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBQT1NUIGFuZCBjcmVhdGUgYSBuZXcgZm9ybVxyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGZvcm1EYXRhKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90cmF2ZWxlcicsIGZvcm1EYXRhKTtcclxuICAgICAgICAgICAgfSwgXHJcblxyXG4gICAgICAgICAgICBnZXRSZXZpZXdEYXRhOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldmlld0RhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKHR5cGUsIGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlcj90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS90cmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXZpZXdEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaExpa2U6IGZ1bmN0aW9uKHNuKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL3NlYXJjaExpa2UvJysgc24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIERFTEVURSBhIGZvcm1cclxuICAgICAgICAgICAgcmVtb3ZlVHJhdmVsZXI6IGZ1bmN0aW9uKF9pZCwgaW5wdXQpe1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coX2lkKTtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3RyYXZlbGVyLycrIF9pZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5vcm1hbFNlYXJjaDogZnVuY3Rpb24odHlwZSwgZGF0YSwgc2VsZWN0KXtcclxuICAgICAgICAgICAgICAgIGlmKCFzZWxlY3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9ub3JtYWxTZWFyY2g/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSsnJnNlbGVjdD0nK3NlbGVjdCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVwZGF0ZU11bHRpcGxlOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdHJhdmVsZXIvdXBkYXRlTXVsdGlwbGUnLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cdH07XHRcdFxyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
