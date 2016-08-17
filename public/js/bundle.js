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
		if (password === 'QQmore') {
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
		if (password === 'QQmore') {
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

		if ($scope.selectSNList) {
			if (confirm('delete?')) {
				var idList = [];
				for (var i = 0; i < $scope.selectSNList.length; i++) {
					idList.push($scope.selectSNList[i]._id);
				}
				var data = {
					"idList": idList
				};
				Traveler.removeTraveler(data).success(function (data) {
					reset();
				});
			}
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
        // call to DELETE forms
        removeTraveler: function removeTraveler(data) {
            return $http.post('/api/traveler/deleteTraveler', data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvQ291bnRlclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9Eb2NOdW1TZXJ2aWNlLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFJQyxVQUpELEVBTUMsU0FORCxFQU9DLFVBUEQsRUFRQyxjQVJELEVBU0Msb0JBVEQsRUFVQyxnQkFWRCxFQVlDLGlCQVpELEVBYUMsYUFiRCxFQWNDLGVBZEQsRUFlQyxnQkFmRCxDQUREOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsV0FBRCxDQUE1QixFQUNFLE1BREYsQ0FDUyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUF5QyxtQkFBekMsRUFDUCxVQUFTLGNBQVQsRUFBeUIsa0JBQXpCLEVBQTZDLGlCQUE3QyxFQUErRDs7QUFFL0Qsb0JBQW1CLFNBQW5CLENBQTZCLE9BQTdCOzs7QUFHQTs7O0FBQUEsRUFHRSxLQUhGLENBR1EsTUFIUixFQUdnQjtBQUNkLE9BQUssT0FEUztBQUVkLGVBQWEsaUJBRkM7QUFHZCxjQUFZO0FBSEUsRUFIaEIsRUFVRSxLQVZGLENBVVEsVUFWUixFQVVvQjtBQUNsQixPQUFLLHNCQURhO0FBRWxCLFNBQU07QUFDTCxPQUFHO0FBQ0YsaUJBQWEscUJBRFg7QUFFRixnQkFBWTtBQUZWLElBREU7QUFLTCwwQkFBc0I7QUFDckIsaUJBQWE7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LCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3NhbXBsZUFwcCcsIFxyXG5cdFtcclxuXHRcdCd1aS5yb3V0ZXInLCBcclxuXHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0J2FwcFJvdXRlcycsXHJcblx0XHQnZG5kTGlzdHMnLFxyXG5cclxuXHRcdCdBcHBDdHJsJyxcclxuXHRcdCdNYWluQ3RybCcsIFxyXG5cdFx0J1RyYXZlbGVyQ3RybCcsIFxyXG5cdFx0J1NlYXJjaFRyYXZlbGVyQ3RybCcsIFxyXG5cdFx0J0Zvcm1HZW5DdHJsLmpzJyxcclxuXHRcdFxyXG5cdFx0J1RyYXZlbGVyU2VydmljZScsIFxyXG5cdFx0J0Zvcm1TZXJ2aWNlJyxcclxuXHRcdCdEb2NOdW1TZXJ2aWNlJyxcclxuXHRcdCdDb3VudGVyU2VydmljZSdcclxuXHRdXHJcbik7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcFJvdXRlcycsIFsndWkucm91dGVyJ10pXHJcblx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicgLFxyXG5cdFx0ZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpe1xyXG5cclxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9ob21lJyk7XHJcblxyXG5cdFx0Ly8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cdFx0JHN0YXRlUHJvdmlkZXJcclxuXHJcblx0XHRcdC8vIGhvbWUgcGFnZVxyXG5cdFx0XHQuc3RhdGUoJ2hvbWUnLCB7XHJcblx0XHRcdFx0dXJsOiAnL2hvbWUnLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvaG9tZS5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnTWFpbkNvbnRyb2xsZXInXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRcclxuXHRcdFx0LnN0YXRlKCd0cmF2ZWxlcicsIHtcclxuXHRcdFx0XHR1cmw6ICcvdHJhdmVsZXI/X2lkJmZvcm1JZCcsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RyYXZlbGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdmb3JtUmV2aWV3QHRyYXZlbGVyJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybVJldmlldy5odG1sJ1xyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiBbJyRzY29wZScsICdUcmF2ZWxlcicsICdGb3JtJyxmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHQkc2NvcGUucmV2aWV3RGF0YSA9IFRyYXZlbGVyLmdldFJldmlld0RhdGEoKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRGb3JtLmdldCgkc2NvcGUucmV2aWV3RGF0YS5mb3JtSWQpXHJcblx0XHRcdFx0XHRcdC8vIFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0XHRcdFx0Ly8gfV1cclxuXHRcdFx0XHRcdFx0Ly8gY29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQuc3RhdGUoJ3NlYXJjaFRyYXZlbGVyJyx7XHJcblx0XHRcdFx0dXJsOiAnL3NlYXJjaFRyYXZlbGVyJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWFyY2hUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2Zvcm1SZXZpZXdAc2VhcmNoVHJhdmVsZXInOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtUmV2aWV3Lmh0bWwnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0LnN0YXRlKCdmb3JtR2VuZXJhdG9yJyx7XHJcblx0XHRcdFx0dXJsOiAnL2Zvcm1HZW5lcmF0b3InLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtR2VuZXJhdG9yTmF2Lmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3RlbXBsYXRlR2VuZXJhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUdlbmVyYXRvci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUNyZWF0b3JAZm9ybUdlbmVyYXRvcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RlbXBsYXRlQ3JlYXRvci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0FwcEN0cmwnLCBbJ25nQW5pbWF0ZSddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybUdlbkN0cmwuanMnLCBbJ3VpLmJvb3RzdHJhcC50YWJzJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJywgWyckc2NvcGUnLCdGb3JtJyAsIGZ1bmN0aW9uKCRzY29wZSwgRm9ybSl7XHJcblxyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihwYXNzd29yZCl7XHJcblx0XHRcdGlmKCFwYXNzd29yZCB8fCBwYXNzd29yZCA9PT0gJycpe1xyXG5cdFx0XHRcdHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnUVFtb3JlJyl7XHJcblx0XHRcdEZvcm0uY3JlYXRlKCRzY29wZS50ZW1wbGF0ZSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHRhbGVydCgnYWRkJyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlID0gZGF0YTtcclxuXHRcdFx0XHRcdGRlbGV0ZSAkc2NvcGUudGVtcGxhdGU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lIHNvbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0nUVFtb3JlJyl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0Rm9ybS5zYXZlKCRzY29wZS5jcmVhdGUpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdzYXZlJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS50ZW1wbGF0ZSA9ICRzY29wZS5jcmVhdGU7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3VibWl0KHBhc3N3b3JkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0aWYocGFzc3dvcmQgPT09ICdRUW1vcmUnKXtcclxuXHRcdFx0XHRpZihjb25maXJtKCdkZWxldGUgdGVtcGxhdGU/Jykpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0XHRGb3JtLmRlbGV0ZSgkc2NvcGUuY3JlYXRlLl9pZClcclxuXHRcdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdFx0XHRhbGVydCgncmVtb3ZlZCcpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpbml0Q3JlYXRlKCk7XHJcblx0XHRcdFx0fVx0XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNldFNlbGVjdFRhYiA9IGZ1bmN0aW9uKG4pe1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0VGFiID0gbjtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZEl0ZW1SZWNvcmQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICYmICRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgaXRlbSA9IHtcclxuXHRcdFx0XHRcdFwiaWRcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6JHNjb3BlLmlucHV0SXRlbVJlY29yZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPT09ICdzZWxlY3QnKXtcclxuXHRcdFx0XHRcdHZhciBob2xkZXIgPSAkc2NvcGUuc2VsZWN0T3B0aW9ucztcclxuXHRcdFx0XHRcdGhvbGRlciA9IGhvbGRlci5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaTxob2xkZXIubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdGhvbGRlcltpXSA9IGhvbGRlcltpXS50cmltKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRob2xkZXIgPSBBcnJheS5mcm9tKG5ldyBTZXQoaG9sZGVyKSk7XHJcblx0XHRcdFx0XHRpdGVtWydzZWxlY3QnXSA9IHsnbmFtZSc6Jyd9O1xyXG5cdFx0XHRcdFx0aXRlbS5zZWxlY3RbJ29wdGlvbnMnXSA9IGhvbGRlcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZCA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gaWYoJHNjb3BlLmlucHV0U3RlcERlcyAmJiAkc2NvcGUuaW5wdXRTdGVwRGVzICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHMpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcyA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIHN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN0ZXBcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcInR5cGVcIjogJHNjb3BlLmlucHV0U3RlcFR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6ICRzY29wZS5pbnB1dFN0ZXBEZXMgfHwgJydcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMucHVzaChzdGVwKTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmlucHV0U3RlcERlcyA9ICcnO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICYmICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGxldCBzdGVwSW5kZXggPSAkc2NvcGUudGVtcFN1Yi5zZWxlY3RTdGVwRm9yU3ViU3RlcDtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3Qpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3Q9W107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBsZW4gPSAkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5sZW5ndGg7XHJcblx0XHRcdFx0bGV0IHN1YlN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN1Yl9zdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0LnB1c2goc3ViU3RlcCk7XHJcblx0XHRcdFx0JHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN1Yk9wdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGxldCBzdGVwID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMF07XHJcblx0XHRcdGxldCBzdWIgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zZWxlY3RTdWJGb3JPcHRpb24uc3BsaXQoJywnKVsxXTtcclxuXHRcdFx0bGV0IHNlbGVjdE9wdGlvbiA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMuc2VsZWN0U3ViT3B0aW9uO1xyXG5cdFx0XHRsZXQgb3B0aW9ucyA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0LnNwbGl0KCcsJyk7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPCBvcHRpb25zLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdG9wdGlvbnNbaV0gPSBvcHRpb25zW2ldLnRyaW0oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvcHRpb25zID0gQXJyYXkuZnJvbShuZXcgU2V0KG9wdGlvbnMpKTtcclxuXHRcdFx0bGV0IHN1YlN0ZXBPcHRpb24gPSB7XHJcblx0XHRcdFx0XHRcInR5cGVcIjogc2VsZWN0T3B0aW9uLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLm5hbWUsXHJcblx0XHRcdFx0XHRcIm9wdGlvbnNcIjogb3B0aW9uc1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucyl7XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucz1bXTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zLnB1c2goc3ViU3RlcE9wdGlvbik7XHJcblx0XHRcdC8vJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl1bc2VsZWN0T3B0aW9uXSA9IHN1YlN0ZXBPcHRpb247XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLm5hbWUgPSAnJztcclxuXHRcdFx0JHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24uaW5wdXQgPSAnJztcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdCRzY29wZS5tb2RpZnlJRCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSl7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPG9iamVjdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZih0eXBlID09PSdpdGVtUmVjb3JkJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uaWQgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N0ZXBzJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3RlcCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0nc3ViX3N0ZXAnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5zdWJfc3RlcCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXRPcHRpb24gPSBmdW5jdGlvbihhZGRyZXNzLCBpbnB1dCl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHR5cGVvZiBpbnB1dCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGlucHV0KTtcclxuXHRcdFx0aWYoYWRkcmVzcyl7XHJcblx0XHRcdFx0YWRkcmVzcy5vcHRpb25zID0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0ICBpbnB1dCA9IGlucHV0LnNwbGl0KCcsJyk7XHJcbiAgICAgICAgfVxyXG5cdFx0XHRcdGZvcihsZXQgaT0wO2k8aW5wdXQubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRhZGRyZXNzLm9wdGlvbnNbaV0gPSBpbnB1dFtpXS50cmltKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IEFycmF5LmZyb20obmV3IFNldChhZGRyZXNzLm9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcbiAgICAkc2NvcGUudXBkYXRlRm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG4gICAgICAgICAgaWYoJHNjb3BlLmZvcm1JZCl7XHJcbiAgICAgICAgICAgIEZvcm0uZ2V0KCRzY29wZS5mb3JtSWQpXHJcbiAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZm9ybXMgPSBkYXRhOyAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBmaW5kIHRoZSBsYXN0IHN1YlN0ZXBcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5sYXN0U3RlcCA9IGRhdGEuc3RlcHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgLy8gLy8gaW5pdCB0aGUgdHJhdmVsZXJEYXRhIGZyb20gZm9ybURhdGFcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkID0gZGF0YS5faWQ7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXYgPSBkYXRhLmZvcm1SZXY7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObyA9IGRhdGEuZm9ybU5vO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jdXN0b21lciA9IGRhdGEuY3VzdG9tZXI7XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuICAgICAgICAgICAgICAgICRzY29wZS5jcmVhdGU9IGRhdGE7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHRcdHZhciBpbml0Q3JlYXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuY3JlYXRlLmlzUHVibGlzaCA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcbiAgICB2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgRm9ybS5nZXRGb3JtTGlzdCgpXHJcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aW5pdENyZWF0ZSgpO1xyXG4gICAgICBsb2FkRm9ybUxpc3QoKTtcclxuXHRcdFxyXG5cdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9ICd0ZXh0JztcclxuXHRcdFx0JHNjb3BlLmpzb25WaWV3ID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdG1haW4oKTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ01haW5DdHJsJywgW10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS50YWdsaW5lID0gJ3RvIHRoZSBtb29uIGFuZCBiYWNrISc7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnU2VhcmNoVHJhdmVsZXJDdHJsJywgWydjaGFydC5qcyddKVxyXG5cclxuXHQuY29udHJvbGxlcignU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnVHJhdmVsZXInLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyKXtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRJbnB1dCA9ICRzY29wZS5zZWFyY2hJbnB1dDtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gdHJ1ZTtcclxuXHRcdFx0aWYoJHNjb3BlLnNlYXJjaElucHV0KXtcclxuXHRcdFx0XHRpZigkc2NvcGUuc2VhcmNoT3B0aW9uID09PSdzbicpe1xyXG5cdFx0XHRcdFx0bGV0IHNuID0gJHNjb3BlLnNlYXJjaElucHV0LnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRUcmF2ZWxlci5zZWFyY2hMaWtlKCRzY29wZS5zZWFyY2hJbnB1dClcclxuXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIHNlYXJjaCBkb2MgbnVtXHJcblx0XHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJHNjb3BlLnNlYXJjaE9wdGlvbiwgJHNjb3BlLnNlYXJjaElucHV0KVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0VHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGZvcm1JZCl7XHJcblx0XHRcdHdpbmRvdy5vcGVuKCd0cmF2ZWxlcj9faWQ9JytfaWQrJyZmb3JtSWQ9Jytmb3JtSWQsICdfYmxhbmsnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZVRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBpbmRleCl7XHJcblx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKF9pZClcclxuXHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PiB7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUucmVzdWx0LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS50aW1lU3BlbmQgPSBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoZGF0YS5yZXZpZXdBdCl7XHJcblx0XHRcdFx0bGV0IGRpZmYgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZShkYXRhLnJldmlld0F0KSAtIG5ldyBEYXRlKGRhdGEuY3JlYXRlQXQpKS8xMDAwKTtcclxuXHRcdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgKz0gZGlmZjtcclxuXHRcdFx0XHRyZXR1cm4gY2FsdWxhdGVUaW1lKGRpZmYpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZGlmZiA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkgLSBuZXcgRGF0ZShkYXRhLmNyZWF0ZUF0KSkvMTAwMCk7XHJcblx0XHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kICs9IGRpZmY7XHJcblx0XHRcdFx0cmV0dXJuIGNhbHVsYXRlVGltZShkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudG90YWxUaW1lU3BlbmQgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0cmV0dXJuIDU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjYWx1bGF0ZVRpbWUgPSBmdW5jdGlvbihzZWNvbmRzKXtcclxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcy82MC82MCkgKyAnIEhvdXJzIGFuZCAnICsgTWF0aC5mbG9vcihzZWNvbmRzLzYwKSU2MCArIFxyXG5cdFx0XHRcdFx0JyBtaW4gYW5kICcgKyBzZWNvbmRzICUgNjAgKyAnIHNlYyc7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vICRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0Ly8gXHQkc2NvcGUudHJhdmVsZXJEYXRhID0gJHNjb3BlLnJlc3VsdFtpbmRleF07XHJcblx0XHRcdC8vIHZhciBwcmludENvbnRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pZC1zZWxlY3RvcicpLmlubmVySFRNTDtcclxuXHRcdCAvLyAgICB2YXIgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD04MDAsaGVpZ2h0PTgwMCxzY3JvbGxiYXJzPW5vLG1lbnViYXI9bm8sdG9vbGJhcj1ubyxsb2NhdGlvbj1ubyxzdGF0dXM9bm8sdGl0bGViYXI9bm8sdG9wPTUwJyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4ud2luZG93LmZvY3VzKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8IURPQ1RZUEUgaHRtbD48aHRtbD48aGVhZD48dGl0bGU+VElUTEUgT0YgVEhFIFBSSU5UIE9VVDwvdGl0bGU+JyArXHJcblx0XHQgLy8gICAgICAgICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cImxpYnMvYm9vc2F2ZURvY051bXRzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiPicgK1xyXG5cdFx0IC8vICAgICAgICAnPC9oZWFkPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpOyB3aW5kb3cuY2xvc2UoKTtcIj48ZGl2PicgKyBwcmludENvbnRlbnRzICsgJzwvZGl2PjwvaHRtbD4nKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHZhciBmaW5kU3RhdGlzdGljcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zdGF0ID0ge307XHJcblx0XHRcdCRzY29wZS5waWVMYWJlbHMxPVtdO1xyXG5cdFx0XHQkc2NvcGUucGllRGF0YTEgPSBbXTtcclxuXHRcdFx0bGV0IGRhdGEgPSAkc2NvcGUucmVzdWx0O1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKGRhdGFbaV0uc3RhdHVzIGluICRzY29wZS5zdGF0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSArPTE7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUucGllTGFiZWxzMS5wdXNoKGRhdGFbaV0uc3RhdHVzKTtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSA9MTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnN0YXQudG90YWwgPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0bGV0IHJlamVjdCA9IDA7XHJcblx0XHRcdGxldCBjb21wbGV0ZWQgPSAwO1xyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHRvdGFsIGNvbXBsYXRlZCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoJHNjb3BlLnN0YXQuUkVKRUNUKXtcclxuXHRcdFx0XHRyZWplY3QgPSAkc2NvcGUuc3RhdC5SRUpFQ1Q7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCRzY29wZS5zdGF0LkNPTVBMRVRFRCl7XHJcblx0XHRcdFx0Y29tcGxldGVkID0gJHNjb3BlLnN0YXQuQ09NUExFVEVEO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zdGF0LnBlY0NvbXBsZXRlID0gKCgoY29tcGxldGVkKSsocmVqZWN0KSkvKGRhdGEubGVuZ3RoKSoxMDApLnRvRml4ZWQoMik7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHJlamVjdCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoKCRzY29wZS5zdGF0LlJFSkVDVCkvKGRhdGEubGVuZ3RoKSoxMDApe1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9ICgocmVqZWN0KS8oZGF0YS5sZW5ndGgpKjEwMCkudG9GaXhlZCgyKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN0YXQucGVjUmVqZWN0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Zm9yKGxldCBpPTA7aTwkc2NvcGUucGllTGFiZWxzMS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHQkc2NvcGUucGllRGF0YTEucHVzaCgkc2NvcGUuc3RhdFskc2NvcGUucGllTGFiZWxzMVtpXV0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkc2NvcGUucGllTGFiZWxzMiA9IFsnRmluaXNoJywgJ0hvbGQnXTtcclxuXHRcdFx0JHNjb3BlLnBpZURhdGEyID0gW2NvbXBsZXRlZCtyZWplY3QsICgkc2NvcGUuc3RhdC50b3RhbC0oY29tcGxldGVkK3JlamVjdCkpXTtcclxuXHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnNlYXJjaE9wdGlvbiA9ICdkb2NOdW0nO1xyXG5cdFx0XHQkc2NvcGUuc29ydFR5cGUgPSAnY3JlYXRlQXQnO1xyXG5cdFx0XHQkc2NvcGUuc29ydFJldmVyc2UgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgPSAwO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGluaXQoKTtcclxuXHRcdH07XHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHRcclxuXHQuZmlsdGVyKCd1bmlxdWUnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGtleW5hbWUpe1xyXG5cdFx0XHR2YXIgb3V0cHV0ID0gW10sXHJcblx0XHRcdFx0a2V5cyAgID0gW107XHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0dmFyIGtleSA9IGl0ZW1ba2V5bmFtZV07XHJcblx0XHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKXtcclxuXHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH07XHJcblx0fSlcclxuXHRcclxuXHQuY29udHJvbGxlcignVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCdUcmF2ZWxlcicsICdGb3JtJywgJ0RvY051bScsICdDb3VudGVyJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0sIERvY051bSwgQ291bnRlciwgJHN0YXRlUGFyYW1zKXtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICYmICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICE9PSAnT1BFTicpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUEFORElORyBGT1IgUkVWSUVXJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRm9ybSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdGlmKCRzY29wZS5mb3JtSWQpe1xyXG5cdFx0XHRcdEZvcm0uZ2V0KCRzY29wZS5mb3JtSWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyBmaW5kIHRoZSBsYXN0IHN1YlN0ZXBcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkID0gZGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jdXN0b21lciA9IGRhdGEuY3VzdG9tZXI7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdFx0XHRsb2FkRG9jTnVtTGlzdChkYXRhLl9pZCwgKCk9Pnt9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS51cGRhdGVEb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdCRzY29wZS5pc1dvcmtGaW5kID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSA9ICRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFskc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdF07XHJcblx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ICE9PSAnbmV3Jyl7XHJcblx0XHRcdFx0c2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0XHRcdGdldFNOTGlzdCgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGVsZXRlICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gY2FsbCBhIGZ1bmN0aW9uIHRvIHVzZSBkb2NudW0gdG8gcmV0dXJuIHRoZSBsaXN0IG9mIHNlcmlhbCBudW1iZXIgYXNzb2NpYXRlIHdpdGggXHJcblx0XHRcdC8vIHRoaXMgZG9jbnVtXHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXh0U3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBvYmplY3QgPSAkc2NvcGUuZm9ybXMuc3RlcHNbJHNjb3BlLmN1cnJlbnRTdGVwLTFdO1xyXG5cdFx0XHRpZihvYmplY3QubGlzdC5sZW5ndGggPj0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwKzEpe1xyXG5cdFx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCArPSAxO1x0XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCArPSAxO1xyXG5cdFx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmN1cnJlbnRTdGVwID4gJHNjb3BlLmxhc3RTdGVwKXtcclxuXHRcdFx0XHRcdC8vIFRyYXZlbGVyLnNldFJldmlld0RhdGEoJHNjb3BlLnRyYXZlbGVyRGF0YSk7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gdHJ1ZTtcdFx0XHJcblx0XHRcdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSBwYWdlO1xyXG5cdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdC8vICRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNTdWJQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IHBhZ2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IGlkTGlzdCA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGkgPSAwO2kgPCAkc2NvcGUuc2VsZWN0U05MaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlkTGlzdC5wdXNoKCRzY29wZS5zZWxlY3RTTkxpc3RbaV0uX2lkKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGRhdGEgPSB7XHJcblx0XHRcdFx0aWRMaXN0IDogaWRMaXN0LFxyXG5cdFx0XHRcdHRyYXZlbGVyRGF0YTogJHNjb3BlLnRyYXZlbGVyRGF0YVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQvLyBpZihpZExpc3QubGVuZ3RoID4gMSl7XHJcblx0XHRcdGRlbGV0ZSBkYXRhLnRyYXZlbGVyRGF0YS5zbjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRUcmF2ZWxlci51cGRhdGVNdWx0aXBsZShkYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHRpZihjYWxsYmFjaylcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZXZpZXcgPSBmdW5jdGlvbihvcHRpb24pe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0J5KXtcclxuXHRcdFx0XHRpZihvcHRpb24gPT09ICdyZWplY3QnKXtcclxuXHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1JFSkVDVCc7XHJcblx0XHRcdFx0fWVsc2UgaWYob3B0aW9uID09PSAnY29tcGxldGUnKXtcclxuXHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ0NPTVBMRVRFRCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3QXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciByZXZpZXdlciBuYW1lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS51c2VybmFtZSAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnNuKXtcclxuXHRcdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmNvbXBsZXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdC8vIHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cclxuXHRcdFx0XHRcdC8vIGlmIHN1Y2Nlc3NmdWwgY3JlYXRlXHJcblx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc3VibWl0IGNvbXBsZXRlJyk7XHJcblx0XHRcdFx0XHRcdHNob3VsZENvbGxhcHNlKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZSBvciBzZXJpYWwgbnVtYmVyIHBseiAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV3ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpZigkc2NvcGUuc2VsZWN0U05MaXN0KXtcclxuXHRcdFx0XHRpZihjb25maXJtKCdkZWxldGU/Jykpe1xyXG5cdFx0XHRcdFx0bGV0IGlkTGlzdCA9IFtdO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpID0gMDtpIDwgJHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aWRMaXN0LnB1c2goJHNjb3BlLnNlbGVjdFNOTGlzdFtpXS5faWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IGRhdGEgPSB7XHJcblx0XHRcdFx0XHRcdFwiaWRMaXN0XCI6IGlkTGlzdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoZGF0YSlcclxuXHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hcHBlbmRTdWJTdGVwRWRpdEluZm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgdXNlcm5hbWUgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdGlmKHVzZXJuYW1lICE9PSAnJyl7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdGVwID0gJHNjb3BlLmN1cnJlbnRTdGVwO1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3ViU3RlcCA9ICRzY29wZS5jdXJyZW50U3ViU3RlcDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0QnkgPSB1c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0VGltZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZScpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gdmFyIHByaW50Q29udGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWlkLXNlbGVjdG9yJykuaW5uZXJIVE1MO1xyXG5cdFx0IC8vICAgIHZhciBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCxoZWlnaHQ9ODAwLHNjcm9sbGJhcnM9bm8sbWVudWJhcj1ubyx0b29sYmFyPW5vLGxvY2F0aW9uPW5vLHN0YXR1cz1ubyx0aXRsZWJhcj1ubyx0b3A9NTAnKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi53aW5kb3cuZm9jdXMoKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5vcGVuKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzwhRE9DVFlQRSBodG1sPjxodG1sPjxoZWFkPjx0aXRsZT5USVRMRSBPRiBUSEUgUFJJTlQgT1VUPC90aXRsZT4nICtcclxuXHRcdCAvLyAgICAgICAgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwibGlicy9ib29zYXZlRG9jTnVtdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCI+JyArXHJcblx0XHQgLy8gICAgICAgICc8L2hlYWQ+PGJvZHkgb25sb2FkPVwid2luZG93LnByaW50KCk7IHdpbmRvdy5jbG9zZSgpO1wiPjxkaXY+JyArIHByaW50Q29udGVudHMgKyAnPC9kaXY+PC9odG1sPicpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LmNsb3NlKCk7XHJcblx0XHRcdHdpbmRvdy5wcmludCgpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0JHNjb3BlLnNhdmVEb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybUlkID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQ7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5mb3JtUmV2ID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2O1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybU5vID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm87XHJcblx0XHRcdHNldERvY051bUxhYmVsKCdjcmVhdGUnKTtcclxuXHRcdFx0ZGVsZXRlICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQ7XHJcblx0XHRcdERvY051bS5jcmVhdGUoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQsIChsaXN0KT0+e1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxsaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRcdGlmKGxpc3RbaV0uX2lkID09PSBkYXRhLl9pZCl7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPSBpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQgPSB7XCJkb2NOdW1cIjokc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtfTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0RG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gc2V0RG9jTnVtTGFiZWwoJ2VkaXQnKTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKSk7XHJcblx0XHRcdERvY051bS5lZGl0RG9jTnVtRGF0YSgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRsb2FkRG9jTnVtTGlzdCgkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCwgKCk9Pnt9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrRm9yU04gPSBmdW5jdGlvbihkYXRhKXtcclxuXHJcblx0XHRcdGlmKGRhdGEpe1xyXG5cdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCAkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5TTkxpc3RGb3JEb2NOdW1baV0uc24gPT09IGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRpZihjb25maXJtKCdTTiBhbHJlYWR5IGV4aXN0LiBkbyB5b3Ugd2FudCB0byBjcmVhdGUgYSBuZXcgdHJhdmVsZXIgd2l0aCBzYW1lIHNuPycpKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKCEkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdE1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdFx0XHRsZXQgaXRlbSA9IHtcclxuXHRcdFx0XHRcdFx0XCJzblwiOiBkYXRhLFxyXG5cdFx0XHRcdFx0XHRcInN0YXR1c1wiOiBcIk9QRU5cIixcclxuXHRcdFx0XHRcdFx0XCJjcmVhdGVBdFwiOiBuZXcgRGF0ZSxcclxuXHRcdFx0XHRcdFx0XCJpdGVtUmVjb3JkXCI6e1xyXG5cdFx0XHRcdFx0XHRcdFwiZG9jTnVtSWRcIjogJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCxcclxuXHRcdFx0XHRcdFx0XHRcImRvY051bVwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRjcmVhdGVOZXdUcmF2ZWxlcihpdGVtKTtcclxuXHRcdFx0XHRcdGRhdGEgPSAnJztcclxuXHRcdFx0XHRcdGl0ZW0gPSB7fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm1vdmVUb1NlbGVjdFNOTGlzdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCRzY29wZS5TTkxpc3RGb3JEb2NOdW0ubGVuZ3RoKTtcclxuXHRcclxuXHRcdFx0bGV0IHN0YWNrID0gW107XHJcblx0XHRcdGZvcihsZXQgaT0kc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmxlbmd0aDtpID4gMDtpLS0pe1xyXG5cdFx0XHRcdGxldCBlbCA9ICRzY29wZS5TTkxpc3RGb3JEb2NOdW0ucG9wKCk7XHJcblx0XHRcdFx0aWYoZWwuY2hlY2tib3ggPT09IHRydWUpe1xyXG5cdFx0XHRcdFx0ZWwuY2hlY2tib3ggPSBmYWxzZTtcclxuXHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QucHVzaChlbCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzdGFjay5wdXNoKGVsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bSA9IHN0YWNrO1xyXG5cdFx0XHRzdGFjayA9IG51bGw7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5tb3ZlVG9TTkxpc3RGb3JEb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgc3RhY2sgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBpID0kc2NvcGUuc2VsZWN0U05MaXN0Lmxlbmd0aDsgaT4wO2ktLSl7XHJcblx0XHRcdFx0bGV0IGVsID0gJHNjb3BlLnNlbGVjdFNOTGlzdC5wb3AoKTtcclxuXHRcdFx0XHRpZihlbC5jaGVja2JveCA9PT0gIHRydWUpe1xyXG5cdFx0XHRcdFx0ZWwuY2hlY2tib3ggPSBmYWxzZTtcclxuXHRcdFx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0ucHVzaChlbCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzdGFjay5wdXNoKGVsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IHN0YWNrO1xyXG5cdFx0XHRzdGFjayA9IG51bGw7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZWxlY3RBbGxMaXN0ID0gZnVuY3Rpb24obGlzdCl7XHJcblx0XHRcdGxldCBib29sID0gbGlzdFswXS5jaGVja2JveDtcclxuXHRcdFx0Zm9yKGxldCBpPTA7aTxsaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGxpc3RbaV0uY2hlY2tib3ggPSAhYm9vbDtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubG9hZFRyYXZlbGVyID0gZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHRpZihpbnB1dCl7XHJcblx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gaW5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdfaWQnLCAkc2NvcGUuc2VsZWN0U04pXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhWzBdO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZWFyY2hTTiA9IGZ1bmN0aW9uKHNuKXtcclxuXHJcblx0XHRcdGlmKHNuKXtcclxuXHRcdFx0XHQkc2NvcGUuc2VhcmNoU05MaXN0PSBbXTtcclxuXHRcdFx0XHQkc2NvcGUuY2xlYXJBZnRlckNoYW5nZVRhYigpO1xyXG5cdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3NuJywgc24sICdzbnxjcmVhdGVBdHxzdGF0dXMnKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc1NOTW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaXNTTk1vcmVUaGFuT25lID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU05MaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYoZGF0YS5sZW5ndGggPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdC5wdXNoKHtcIl9pZFwiOmRhdGFbMF0uX2lkLCBcInNuXCI6ZGF0YVswXS5zbn0pO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTiA9IGRhdGFbMF0uX2lkO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5sb2FkVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZChkYXRhWzBdLmZvcm1JZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gJHNjb3BlLmlzU3RhcnRXb3JrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2V0VHJhdmVsZXJEYXRhID0gZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdC5wdXNoKHtcIl9pZFwiOiRzY29wZS5zZWFyY2hTTkxpc3RbZGF0YV0uX2lkLCBcInNuXCI6ICRzY29wZS5zZWFyY2hTTkxpc3RbZGF0YV0uc259KTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gJHNjb3BlLnNlYXJjaFNOTGlzdFtkYXRhXS5faWQ7XHJcblx0XHRcdCRzY29wZS5sb2FkVHJhdmVsZXIoKTtcclxuXHRcdFx0bG9hZEl0ZW1SZWNvcmQoKTtcclxuXHRcdFx0Ly8gJHNjb3BlLmlzU3RhcnRXb3JrID0gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZVdvcmsgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUuc2VsZWN0U05MaXN0Lmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdENvdW50ZXIubmV4dFNlcXVlbmNlVmFsdWUoe25hbWU6J3dvcmtOdW0nfSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3dvcmsgbnVtYmVyICcgK2RhdGEuc2VxdWVuY2VfdmFsdWUrICcgY3JlYXRlZCcpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLndvcmtOdW0gPSBkYXRhLnNlcXVlbmNlX3ZhbHVlLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnNhdmUoKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFdvcmtOdW0oZGF0YS5zZXF1ZW5jZV92YWx1ZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoV29ya051bSA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPWZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2xlYXJBZnRlckNoYW5nZVRhYigpO1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3dvcmtOdW0nLCBpbnB1dCwgJ3NufGNyZWF0ZUF0fHN0YXR1c3x3b3JrTnVtfGZvcm1JZHxpdGVtUmVjb3JkLmRvY051bUlkfGl0ZW1SZWNvcmQuZG9jTnVtJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGFbJ2l0ZW1SZWNvcmQnXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRkb2NOdW1JZDpkYXRhWzBdLml0ZW1SZWNvcmQuZG9jTnVtSWQsXHJcblx0XHRcdFx0XHRcdFx0ZG9jTnVtOmRhdGFbMF0uaXRlbVJlY29yZC5kb2NOdW1cclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0bG9hZEl0ZW1SZWNvcmQoZGF0YVswXS5mb3JtSWQpO1xyXG5cclxuXHRcdFx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdpdGVtUmVjb3JkLmRvY051bUlkJywgZGF0YVswXS5pdGVtUmVjb3JkLmRvY051bUlkLCAnc258d29ya051bXxzdGF0dXN8Y3JlYXRlQXQnKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgPTA7IGkgPCBkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKCFkYXRhW2ldLndvcmtOdW0gfHxkYXRhW2ldLndvcmtOdW0gIT09IGlucHV0LnRvU3RyaW5nKCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bS5wdXNoKGRhdGFbaV0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2xlYXJBZnRlckNoYW5nZVRhYiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGFsZXJ0KDEyMyk7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bT1bXTtcclxuXHRcdFx0Ly8gbGV0IGZvcm1JZCA9ICRzY29wZS5mb3JtSWQ7XHJcblx0XHRcdC8vIHJlc2V0KCk7XHJcblx0XHRcdC8vICRzY29wZS5mb3JtSWQgPSBmb3JtSWQ7XHJcblx0XHRcdC8vICRzY29wZS51cGRhdGVGb3JtKCk7XHJcblx0XHRcdCRzY29wZS5pc1N0YXJ0V29yayA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9ICduZXcnO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUuY3JlYXRlVHJhdmVsZXIgPSBmdW5jdGlvbihzbil7XHJcblxyXG5cdFx0XHRpZigkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9PT0gJ25ldycpe1xyXG5cdFx0XHRcdGFsZXJ0KCdTZWxlY3QgYSBEb2NudW1lbnQgTnVtYmVyJyk7XHJcblx0XHRcdFx0JHNjb3BlLmlzQ29sbGFwc2VkSXRlbVJlY29yZCA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgaXNXYW50Q3JlYXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRjaGVja1NORXhpc3REQihzbixcclxuXHRcdFx0XHRcdChyZXN1bHQpPT57XHJcblx0XHRcdFx0XHRcdGlmKHJlc3VsdCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNvbmZpcm0oJ1NhbWUgU2VyaWFsIG51bWJlciBhbHJlYWR5IGV4aXN0IGluIHRoZSBkYXRhYmFzZS4gQ3JlYXRlIGEgbmV3IFRyYXZlbGVyIHdpdGggc2FtZSBTZXJpYWwgTnVtYmVyPycpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlzV2FudENyZWF0ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihpc1dhbnRDcmVhdGUpe1xyXG5cdFx0XHRcdFx0XHRcdGxldCBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XCJzblwiOiBzbixcclxuXHRcdFx0XHRcdFx0XHRcdFwic3RhdHVzXCI6IFwiT1BFTlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XCJjcmVhdGVBdFwiOiBuZXcgRGF0ZVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Y3JlYXRlTmV3VHJhdmVsZXIoaXRlbSwgKGRhdGEpPT57XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcIl9pZFwiOmRhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcInNuXCI6ZGF0YS5zblxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJHNjb3BlLmlzU3RhcnRXb3JrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXJ0V29yayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5pc1N0YXJ0V29yayA9IHRydWU7XHJcblx0XHRcdCRzY29wZS50b3BDb2xsYXBzZSA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjaGVja1NORXhpc3REQiA9IGZ1bmN0aW9uKHNuLCBjYWxsYmFjayl7XHJcblx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSBmYWxzZTtcclxuXHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdzbicsIHNuLCAnc24nKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYWxsYmFjaygkc2NvcGUuaXNTTkV4aXN0KTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNyZWF0ZU5ld1RyYXZlbGVyID0gZnVuY3Rpb24oaXRlbSwgY2FsbGJhY2spe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhpdGVtLnNuKTtcclxuXHRcdFx0aWYoJHNjb3BlLnVzZXJuYW1lKXtcclxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQ7XHJcblx0XHRcdFx0ZGVsZXRlICRzY29wZS50cmF2ZWxlckRhdGEuc3RlcDtcclxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLnRyYXZlbGVyRGF0YS53b3JrTnVtO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc24gPSBpdGVtLnNuO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZCA9IGl0ZW0uaXRlbVJlY29yZDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBpdGVtLmNyZWF0ZUF0O1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uX2lkID0gZGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0ucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZ2V0U05MaXN0ID0gZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ2l0ZW1SZWNvcmQuZG9jTnVtSWQnLCBpbnB1dCwgJ3NufHN0YXR1c3xjcmVhdGVBdHx3b3JrTnVtJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bSA9IGRhdGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzaG91bGRDb2xsYXBzZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc24gICYmICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW0pe1xyXG5cdFx0XHRcdCRzY29wZS50b3BDb2xsYXBzZSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldE51bURvY3RvVHJhdmVsZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQgPSB7XHJcblx0XHRcdFx0XHRcImRvY051bUlkXCI6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQsXHJcblx0XHRcdFx0XHRcImRvY051bVwiICA6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW1cclxuXHRcdFx0XHR9O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2V0RG9jTnVtTGFiZWwgPSBmdW5jdGlvbihhY3Rpb24pe1xyXG5cclxuXHRcdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdFx0aWYoYWN0aW9uID09PSAnY3JlYXRlJyl7XHJcblx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLmRvY051bSA9PT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSl7XHJcblx0XHRcdFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZihhY3Rpb24gPT09ICdlZGl0Jyl7XHJcblx0XHRcdC8vIFx0Zm9yKGxldCBpPTA7IGk8JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHQvLyBcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLmRvY051bSA9PT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSAmJlxyXG5cdFx0XHQvLyBcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uX2lkICE9PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkKXtcclxuXHRcdFx0Ly8gXHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmxhYmVsID0gY291bnQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRGb3JtLmdldEZvcm1MaXN0KClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdCRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dmFyIHJlc2V0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5mb3JtSWQgPSAnJztcclxuXHRcdFx0JHNjb3BlLmlzTmV3ID0gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWREb2NOdW1MaXN0ID0gZnVuY3Rpb24oaWQsIGNhbGxiYWNrKXtcclxuXHRcdFx0RG9jTnVtLmdldERvY051bUxpc3QoaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGxvYWQgaW5mb3JtYXRpb24gZm9yIEl0ZW1SZWNvcmQgd2l0aCBcclxuXHRcdC8vIGRvY051bS4gXHJcblx0XHR2YXIgbG9hZEl0ZW1SZWNvcmQgPSBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRpZighZm9ybUlkKXtcclxuXHRcdFx0XHRmb3JtSWQgPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZDtcclxuXHRcdFx0fVxyXG5cdFx0XHREb2NOdW0uZ2V0RG9jTnVtTGlzdChmb3JtSWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhW2ldLl9pZCA9PT0gJHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkLmRvY051bUlkKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50b3BDb2xsYXBzZT1mYWxzZTtcclxuXHRcdFx0JHNjb3BlLnVzZXJuYW1lID0gJ0pvaG4gU25vdyc7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0gPSB7fTtcclxuXHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaXNTTk1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWFyY2hTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gJyc7XHJcblx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBbXTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuaXNVc2VXb3JrTnVtID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5pc1N0YXJ0V29yayA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U2VhcmNoU049JzAnO1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaW5wdXQ9e307XHJcblx0XHRcdCRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XHJcblx0XHRcdC8vICRzY29wZS5pc0NvbGxhcHNlZFNlbGVjdFNOTGlzdCA9IHRydWU7XHJcblx0XHRcdCRzY29wZS5pc0NvbGxhcHNlSGVhZGVyU05MaXN0ID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoQ2xpY2sgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUuaXNDb2xsYXBzZWRJdGVtUmVjb3JkID0gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aW5pdCgpO1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRsb2FkRm9ybUxpc3QoKTtcclxuXHJcblx0XHRcdGlmKCRzdGF0ZVBhcmFtcy5mb3JtSWQpe1xyXG5cdFx0XHRcdCRzY29wZS5mb3JtSWQgPSAkc3RhdGVQYXJhbXMuZm9ybUlkO1xyXG5cdFx0XHRcdCRzY29wZS51cGRhdGVGb3JtKCk7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGxvYWQgdGhlIHRyYXZlbGVyIGZyb20gU2VhcmNoIHBhZ2VcclxuXHRcdFx0Ly8gdGFrZSB0aGUgcHJhbWFzIGZyb20gVVJMXHJcblx0XHRcdGlmKCRzdGF0ZVBhcmFtcy5faWQpe1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHRcdFRyYXZlbGVyLmdldCgnX2lkJywgJHN0YXRlUGFyYW1zLl9pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhIGlzIGEgYXJyYXkuIHJlc3VsdCBjb3VsZCBiZSBtb3JlIHRoYW4gb25lXHJcblx0XHRcdFx0XHRcdC8vIG5lZWQgdG8gZGVhbCB3aXQgdGhpcy5cclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGxvYWRJdGVtUmVjb3JkKGRhdGEuZm9ybUlkKTtcclxuXHRcdFx0XHRcdFx0c2hvdWxkQ29sbGFwc2UoKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdC5wdXNoKHtcIl9pZFwiOmRhdGEuX2lkLCBcInNuXCI6ZGF0YS5zbn0pO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdG1haW4oKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdDb3VudGVyU2VydmljZScsIFtdKVxyXG5cdFxyXG5cdC5mYWN0b3J5KCdDb3VudGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5leHRTZXF1ZW5jZVZhbHVlOmZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYXBpL2NvdW50ZXIvbmV4dFNlcXVlbmNlVmFsdWUvJywgaW5wdXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRG9jTnVtU2VydmljZScsIFtdKVxyXG5cdFxyXG5cdC5mYWN0b3J5KCdEb2NOdW0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldERvY051bUxpc3Q6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zLycrZm9ybUlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9kb2NOdW1zLycsZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVkaXREb2NOdW1EYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2RvY051bXMvJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERvY051bTogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2Qgc2VydmljZScpO1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZG9jTnVtcy9zZWFyY2hTaW5nbGU/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtU2VydmljZScsIFtdKVxyXG5cclxuXHQuZmFjdG9yeSgnRm9ybScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZm9ybXMnLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldEFsbDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0Rm9ybUxpc3Q6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9mb3JtTGlzdCcpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvc2VhcmNoLycrZm9ybUlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGU6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9mb3Jtcy8nK2Zvcm1JZCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJTZXJ2aWNlJywgW10pXHJcbiAgICAgICBcclxuICAgIC5mYWN0b3J5KCdUcmF2ZWxlcicsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gICAgICAgIHZhciByZXZpZXdEYXRhID0ge307XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcblx0XHJcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgd29yayB3aGVuIG1vcmUgQVBJIHJvdXRlcyBhcmUgZGVmaW5lZCBvbiB0aGUgTm9kZSBzaWRlIG9mIHRoaW5nc1xyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIFBPU1QgYW5kIGNyZWF0ZSBhIG5ldyBmb3JtXHJcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oZm9ybURhdGEpe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3RyYXZlbGVyJywgZm9ybURhdGEpO1xyXG4gICAgICAgICAgICB9LCBcclxuXHJcbiAgICAgICAgICAgIGdldFJldmlld0RhdGE6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV2aWV3RGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRSZXZpZXdEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldmlld0RhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2VhcmNoTGlrZTogZnVuY3Rpb24oc24pe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvc2VhcmNoTGlrZS8nKyBzbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gREVMRVRFIGZvcm1zXHJcbiAgICAgICAgICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90cmF2ZWxlci9kZWxldGVUcmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub3JtYWxTZWFyY2g6IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIHNlbGVjdCl7XHJcbiAgICAgICAgICAgICAgICBpZighc2VsZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvbm9ybWFsU2VhcmNoP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGErJyZzZWxlY3Q9JytzZWxlY3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVNdWx0aXBsZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyL3VwZGF0ZU11bHRpcGxlJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
