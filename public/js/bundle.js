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
		// console.log(typeof input);
		// console.log(input);
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
		var data = {
			idList: [_id]
		};
		Traveler.removeTraveler(data).success(function (data) {
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
		if ($scope.travelerData.status && $scope.travelerData.status === 'PANDING FOR REVIEW') {
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
			$scope.closeAlert(0, 'clear');
			$scope.addAlert('warning', 'Enter Reviewer Name');
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
		$scope.closeAlert(0, 'clear');
		$scope.addAlert('warning', 'Enter your Name');
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

	$scope.checkForSN = function (input) {

		if (input) {
			$scope.isSNExistMoreThanOne = false;
			Traveler.normalSearch('sn|formId', input + '|' + $scope.formId, 'sn').success(function (data) {
				if (data.length > 0) {
					$scope.isSNExistMoreThanOne = true;
					if (confirm('SN already exist. do you want to create a new traveler with same sn?')) {
						$scope.isSNExistMoreThanOne = false;
					}
				}

				if (!$scope.isSNExistMoreThanOne) {
					$scope.isSNExistMoreThanOne = false;
					var item = {
						"sn": input,
						"status": "OPEN",
						"createAt": new Date(),
						"itemRecord": {
							"docNumId": $scope.docNum.docNumData._id,
							"docNum": $scope.docNum.docNumData.docNum
						}
					};
					createNewTraveler(item);
					input = '';
					item = {};
				}
			});
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
			Traveler.normalSearch('sn|formId', sn + '|' + $scope.formId, 'sn|createAt|status').success(function (data) {
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
				if (data) {
					$scope.closeAlert(0, 'clear');
					$scope.addAlert('info', 'Group number ' + data.sequence_value + ' created');
					$scope.travelerData.workNum = data.sequence_value.toString();
					setNumDoctoTraveler();
					$scope.save();
					$scope.searchWorkNum(data.sequence_value);
				} else {
					Counter.create({
						"name": "workNum",
						"sequence_value": 0
					}).success(function (data) {
						$scope.createWork();
					});
				}
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
		$scope.selectSNList = [];
		$scope.SNListForDocNum = [];
		$scope.isStartWork = false;
		$scope.isWorkFind = false;
		$scope.docNum.docNumSelect = 'new';
		$scope.docNum.docNumData = {};
		$scope.travelerData.created = false;
	};

	$scope.createTraveler = function (sn) {
		$scope.isSNExist = false;
		if ($scope.docNum.docNumSelect === 'new') {
			$scope.closeAlert(0, 'clear');
			$scope.addAlert('warning', 'Select a Document Number');
			$scope.isCollapsedItemRecord = false;
		} else {
			(function () {
				var isWantCreate = true;
				checkSNExistDB(sn, function (result) {
					if (result) {
						$scope.isSNExist = true;
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
							$scope.closeAlert(0, 'clear');
							$scope.isCollapsedItemRecord = true;
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
					}
				});
			})();
		}
	};

	$scope.startWork = function () {
		$scope.isStartWork = true;
		$scope.topCollapse = true;
	};

	$scope.addAlert = function (type, msg) {
		$scope.alerts.push({
			"type": type,
			"msg": msg
		});
	};

	$scope.closeAlert = function (index, action) {
		if (action === 'clear') {
			$scope.alerts = [];
		} else {
			$scope.alerts.splice(index, 1);
		}
	};

	var checkSNExistDB = function checkSNExistDB(sn, callback) {
		$scope.isSNExist = false;
		Traveler.normalSearch('sn|formId', sn + '|' + $scope.formId, 'sn').success(function (data) {
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
		$scope.alerts = [];
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
		},
		create: function create(data) {
			return $http.post('api/counter/create', data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvQ291bnRlclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9Eb2NOdW1TZXJ2aWNlLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFJQyxVQUpELEVBTUMsU0FORCxFQU9DLFVBUEQsRUFRQyxjQVJELEVBU0Msb0JBVEQsRUFVQyxnQkFWRCxFQVlDLGlCQVpELEVBYUMsYUFiRCxFQWNDLGVBZEQsRUFlQyxnQkFmRCxDQUREOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsV0FBRCxDQUE1QixFQUNFLE1BREYsQ0FDUyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUF5QyxtQkFBekMsRUFDUCxVQUFTLGNBQVQsRUFBeUIsa0JBQXpCLEVBQTZDLGlCQUE3QyxFQUErRDs7QUFFL0Qsb0JBQW1CLFNBQW5CLENBQTZCLE9BQTdCOzs7QUFHQTs7O0FBQUEsRUFHRSxLQUhGLENBR1EsTUFIUixFQUdnQjtBQUNkLE9BQUssT0FEUztBQUVkLGVBQWEsaUJBRkM7QUFHZCxjQUFZO0FBSEUsRUFIaEIsRUFVRSxLQVZGLENBVVEsVUFWUixFQVVvQjtBQUNsQixPQUFLLHNCQURhO0FBRWxCLFNBQU07QUFDTCxPQUFHO0FBQ0YsaUJBQWEscUJBRFg7QUFFRixnQkFBWTtBQUZWLElBREU7QUFLTCwwQkFBc0I7QUFDckIsaUJBQWE7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LElBQTFDLENBQVA7QUFDSDtBQXZDRSxLQUFQO0FBeUNQLENBN0N3QixDQUZ6QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnc2FtcGxlQXBwJywgXHJcblx0W1xyXG5cdFx0J3VpLnJvdXRlcicsIFxyXG5cdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHQnYXBwUm91dGVzJyxcclxuXHRcdCdkbmRMaXN0cycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnLFxyXG5cdFx0J0RvY051bVNlcnZpY2UnLFxyXG5cdFx0J0NvdW50ZXJTZXJ2aWNlJ1xyXG5cdF1cclxuKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwUm91dGVzJywgWyd1aS5yb3V0ZXInXSlcclxuXHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyAsXHJcblx0XHRmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XHJcblxyXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2hvbWUnKTtcclxuXHJcblx0XHQvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcblx0XHQkc3RhdGVQcm92aWRlclxyXG5cclxuXHRcdFx0Ly8gaG9tZSBwYWdlXHJcblx0XHRcdC5zdGF0ZSgnaG9tZScsIHtcclxuXHRcdFx0XHR1cmw6ICcvaG9tZScsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdNYWluQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdFxyXG5cdFx0XHQuc3RhdGUoJ3RyYXZlbGVyJywge1xyXG5cdFx0XHRcdHVybDogJy90cmF2ZWxlcj9faWQmZm9ybUlkJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2Zvcm1SZXZpZXdAdHJhdmVsZXInOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtUmV2aWV3Lmh0bWwnXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHQvLyBcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyB9XVxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9zZWFyY2hUcmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0BzZWFyY2hUcmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQuc3RhdGUoJ2Zvcm1HZW5lcmF0b3InLHtcclxuXHRcdFx0XHR1cmw6ICcvZm9ybUdlbmVyYXRvcicsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1HZW5lcmF0b3JOYXYuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVHZW5lcmF0b3JAZm9ybUdlbmVyYXRvcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RlbXBsYXRlR2VuZXJhdG9yLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3RlbXBsYXRlQ3JlYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVDcmVhdG9yLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnQXBwQ3RybCcsIFsnbmdBbmltYXRlJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtR2VuQ3RybC5qcycsIFsndWkuYm9vdHN0cmFwLnRhYnMnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ0Zvcm0nICwgZnVuY3Rpb24oJHNjb3BlLCBGb3JtKXtcclxuXHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKHBhc3N3b3JkKXtcclxuXHRcdFx0aWYoIXBhc3N3b3JkIHx8IHBhc3N3b3JkID09PSAnJyl7XHJcblx0XHRcdFx0cGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYocGFzc3dvcmQgPT09ICdRUW1vcmUnKXtcclxuXHRcdFx0Rm9ybS5jcmVhdGUoJHNjb3BlLnRlbXBsYXRlKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcclxuXHRcdFx0XHRcdGFsZXJ0KCdhZGQnKTtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUgPSBkYXRhO1xyXG5cdFx0XHRcdFx0ZGVsZXRlICRzY29wZS50ZW1wbGF0ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2dvIGhvbWUgc29uJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSdRUW1vcmUnKXtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3JlYXRlLl9pZCl7XHJcblx0XHRcdFx0XHRGb3JtLnNhdmUoJHNjb3BlLmNyZWF0ZSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3NhdmUnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRlbXBsYXRlID0gJHNjb3BlLmNyZWF0ZTtcclxuXHRcdFx0XHRcdCRzY29wZS5zdWJtaXQocGFzc3dvcmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2dvIGhvbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJ1FRbW9yZScpe1xyXG5cdFx0XHRcdGlmKGNvbmZpcm0oJ2RlbGV0ZSB0ZW1wbGF0ZT8nKSl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZigkc2NvcGUuY3JlYXRlLl9pZCl7XHJcblx0XHRcdFx0XHRcdEZvcm0uZGVsZXRlKCRzY29wZS5jcmVhdGUuX2lkKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0XHRcdGFsZXJ0KCdyZW1vdmVkJyk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGluaXRDcmVhdGUoKTtcclxuXHRcdFx0XHR9XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2dvIGhvbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2V0U2VsZWN0VGFiID0gZnVuY3Rpb24obil7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RUYWIgPSBuO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkSXRlbVJlY29yZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgJiYgJHNjb3BlLmlucHV0SXRlbVJlY29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XCJpZFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjokc2NvcGUuaW5wdXRJdGVtUmVjb3JkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9PT0gJ3NlbGVjdCcpe1xyXG5cdFx0XHRcdFx0dmFyIGhvbGRlciA9ICRzY29wZS5zZWxlY3RPcHRpb25zO1xyXG5cdFx0XHRcdFx0aG9sZGVyID0gaG9sZGVyLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPGhvbGRlci5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aG9sZGVyW2ldID0gaG9sZGVyW2ldLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGhvbGRlciA9IEFycmF5LmZyb20obmV3IFNldChob2xkZXIpKTtcclxuXHRcdFx0XHRcdGl0ZW1bJ3NlbGVjdCddID0geyduYW1lJzonJ307XHJcblx0XHRcdFx0XHRpdGVtLnNlbGVjdFsnb3B0aW9ucyddID0gaG9sZGVyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQucHVzaChpdGVtKTtcclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBpZigkc2NvcGUuaW5wdXRTdGVwRGVzICYmICRzY29wZS5pbnB1dFN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwcyl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgc3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwidHlwZVwiOiAkc2NvcGUuaW5wdXRTdGVwVHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLmlucHV0U3RlcERlcyB8fCAnJ1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcy5wdXNoKHN0ZXApO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRTdGVwRGVzID0gJyc7XHJcblx0XHRcdC8vIH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN1YlN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgJiYgJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICE9PSAnJyl7XHJcblx0XHRcdFx0bGV0IHN0ZXBJbmRleCA9ICRzY29wZS50ZW1wU3ViLnNlbGVjdFN0ZXBGb3JTdWJTdGVwO1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdD1bXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRsZXQgc3ViU3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3ViX3N0ZXBcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6ICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlc1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QucHVzaChzdWJTdGVwKTtcclxuXHRcdFx0XHQkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViT3B0aW9uID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHN0ZXAgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zZWxlY3RTdWJGb3JPcHRpb24uc3BsaXQoJywnKVswXTtcclxuXHRcdFx0bGV0IHN1YiA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzFdO1xyXG5cdFx0XHRsZXQgc2VsZWN0T3B0aW9uID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5zZWxlY3RTdWJPcHRpb247XHJcblx0XHRcdGxldCBvcHRpb25zID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24uaW5wdXQuc3BsaXQoJywnKTtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8IG9wdGlvbnMubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0b3B0aW9uc1tpXSA9IG9wdGlvbnNbaV0udHJpbSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQob3B0aW9ucykpO1xyXG5cdFx0XHRsZXQgc3ViU3RlcE9wdGlvbiA9IHtcclxuXHRcdFx0XHRcdFwidHlwZVwiOiBzZWxlY3RPcHRpb24sXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSxcclxuXHRcdFx0XHRcdFwib3B0aW9uc1wiOiBvcHRpb25zXHJcblx0XHRcdH07XHJcblx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zKXtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zPVtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMucHVzaChzdWJTdGVwT3B0aW9uKTtcclxuXHRcdFx0Ly8kc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXVtzZWxlY3RPcHRpb25dID0gc3ViU3RlcE9wdGlvbjtcclxuXHRcdFx0JHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSA9ICcnO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dCA9ICcnO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLm1vZGlmeUlEID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlKXtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8b2JqZWN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKHR5cGUgPT09J2l0ZW1SZWNvcmQnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5pZCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0nc3RlcHMnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5zdGVwID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdWJfc3RlcCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN1Yl9zdGVwID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdE9wdGlvbiA9IGZ1bmN0aW9uKGFkZHJlc3MsIGlucHV0KXtcclxuICAgICAgLy8gY29uc29sZS5sb2codHlwZW9mIGlucHV0KTtcclxuICAgICAgLy8gY29uc29sZS5sb2coaW5wdXQpO1xyXG5cdFx0XHRpZihhZGRyZXNzKXtcclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHQgIGlucHV0ID0gaW5wdXQuc3BsaXQoJywnKTtcclxuICAgICAgICB9XHJcblx0XHRcdFx0Zm9yKGxldCBpPTA7aTxpbnB1dC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGFkZHJlc3Mub3B0aW9uc1tpXSA9IGlucHV0W2ldLnRyaW0oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YWRkcmVzcy5vcHRpb25zID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkZHJlc3Mub3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuICAgICRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcbiAgICAgICAgICBpZigkc2NvcGUuZm9ybUlkKXtcclxuICAgICAgICAgICAgRm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5mb3JtcyA9IGRhdGE7ICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvLyAvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNyZWF0ZT0gZGF0YTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cdFx0dmFyIGluaXRDcmVhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3JlYXRlID0ge307XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuaXNQdWJsaXNoID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuICAgIHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICBGb3JtLmdldEZvcm1MaXN0KClcclxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpbml0Q3JlYXRlKCk7XHJcbiAgICAgIFx0XHRsb2FkRm9ybUxpc3QoKTtcclxuXHRcdFxyXG5cdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9ICd0ZXh0JztcclxuXHRcdFx0JHNjb3BlLmpzb25WaWV3ID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdG1haW4oKTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ01haW5DdHJsJywgW10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS50YWdsaW5lID0gJ3RvIHRoZSBtb29uIGFuZCBiYWNrISc7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnU2VhcmNoVHJhdmVsZXJDdHJsJywgWydjaGFydC5qcyddKVxyXG5cclxuXHQuY29udHJvbGxlcignU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnVHJhdmVsZXInLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyKXtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRJbnB1dCA9ICRzY29wZS5zZWFyY2hJbnB1dDtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gdHJ1ZTtcclxuXHRcdFx0aWYoJHNjb3BlLnNlYXJjaElucHV0KXtcclxuXHRcdFx0XHRpZigkc2NvcGUuc2VhcmNoT3B0aW9uID09PSdzbicpe1xyXG5cdFx0XHRcdFx0bGV0IHNuID0gJHNjb3BlLnNlYXJjaElucHV0LnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRUcmF2ZWxlci5zZWFyY2hMaWtlKCRzY29wZS5zZWFyY2hJbnB1dClcclxuXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIHNlYXJjaCBkb2MgbnVtXHJcblx0XHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJHNjb3BlLnNlYXJjaE9wdGlvbiwgJHNjb3BlLnNlYXJjaElucHV0KVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0VHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGZvcm1JZCl7XHJcblx0XHRcdHdpbmRvdy5vcGVuKCd0cmF2ZWxlcj9faWQ9JytfaWQrJyZmb3JtSWQ9Jytmb3JtSWQsICdfYmxhbmsnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZVRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBpbmRleCl7XHJcblx0XHRcdGxldCBkYXRhID17XHJcblx0XHRcdFx0aWRMaXN0OltcclxuXHRcdFx0XHRcdF9pZFxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fTtcclxuXHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoZGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PiB7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUucmVzdWx0LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS50aW1lU3BlbmQgPSBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoZGF0YS5yZXZpZXdBdCl7XHJcblx0XHRcdFx0bGV0IGRpZmYgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZShkYXRhLnJldmlld0F0KSAtIG5ldyBEYXRlKGRhdGEuY3JlYXRlQXQpKS8xMDAwKTtcclxuXHRcdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgKz0gZGlmZjtcclxuXHRcdFx0XHRyZXR1cm4gY2FsdWxhdGVUaW1lKGRpZmYpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZGlmZiA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkgLSBuZXcgRGF0ZShkYXRhLmNyZWF0ZUF0KSkvMTAwMCk7XHJcblx0XHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kICs9IGRpZmY7XHJcblx0XHRcdFx0cmV0dXJuIGNhbHVsYXRlVGltZShkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudG90YWxUaW1lU3BlbmQgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0cmV0dXJuIDU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjYWx1bGF0ZVRpbWUgPSBmdW5jdGlvbihzZWNvbmRzKXtcclxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcy82MC82MCkgKyAnIEhvdXJzIGFuZCAnICsgTWF0aC5mbG9vcihzZWNvbmRzLzYwKSU2MCArIFxyXG5cdFx0XHRcdFx0JyBtaW4gYW5kICcgKyBzZWNvbmRzICUgNjAgKyAnIHNlYyc7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vICRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0Ly8gXHQkc2NvcGUudHJhdmVsZXJEYXRhID0gJHNjb3BlLnJlc3VsdFtpbmRleF07XHJcblx0XHRcdC8vIHZhciBwcmludENvbnRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pZC1zZWxlY3RvcicpLmlubmVySFRNTDtcclxuXHRcdCAvLyAgICB2YXIgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD04MDAsaGVpZ2h0PTgwMCxzY3JvbGxiYXJzPW5vLG1lbnViYXI9bm8sdG9vbGJhcj1ubyxsb2NhdGlvbj1ubyxzdGF0dXM9bm8sdGl0bGViYXI9bm8sdG9wPTUwJyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4ud2luZG93LmZvY3VzKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8IURPQ1RZUEUgaHRtbD48aHRtbD48aGVhZD48dGl0bGU+VElUTEUgT0YgVEhFIFBSSU5UIE9VVDwvdGl0bGU+JyArXHJcblx0XHQgLy8gICAgICAgICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cImxpYnMvYm9vc2F2ZURvY051bXRzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiPicgK1xyXG5cdFx0IC8vICAgICAgICAnPC9oZWFkPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpOyB3aW5kb3cuY2xvc2UoKTtcIj48ZGl2PicgKyBwcmludENvbnRlbnRzICsgJzwvZGl2PjwvaHRtbD4nKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHZhciBmaW5kU3RhdGlzdGljcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zdGF0ID0ge307XHJcblx0XHRcdCRzY29wZS5waWVMYWJlbHMxPVtdO1xyXG5cdFx0XHQkc2NvcGUucGllRGF0YTEgPSBbXTtcclxuXHRcdFx0bGV0IGRhdGEgPSAkc2NvcGUucmVzdWx0O1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKGRhdGFbaV0uc3RhdHVzIGluICRzY29wZS5zdGF0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSArPTE7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUucGllTGFiZWxzMS5wdXNoKGRhdGFbaV0uc3RhdHVzKTtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSA9MTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnN0YXQudG90YWwgPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0bGV0IHJlamVjdCA9IDA7XHJcblx0XHRcdGxldCBjb21wbGV0ZWQgPSAwO1xyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHRvdGFsIGNvbXBsYXRlZCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoJHNjb3BlLnN0YXQuUkVKRUNUKXtcclxuXHRcdFx0XHRyZWplY3QgPSAkc2NvcGUuc3RhdC5SRUpFQ1Q7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCRzY29wZS5zdGF0LkNPTVBMRVRFRCl7XHJcblx0XHRcdFx0Y29tcGxldGVkID0gJHNjb3BlLnN0YXQuQ09NUExFVEVEO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zdGF0LnBlY0NvbXBsZXRlID0gKCgoY29tcGxldGVkKSsocmVqZWN0KSkvKGRhdGEubGVuZ3RoKSoxMDApLnRvRml4ZWQoMik7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHJlamVjdCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoKCRzY29wZS5zdGF0LlJFSkVDVCkvKGRhdGEubGVuZ3RoKSoxMDApe1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9ICgocmVqZWN0KS8oZGF0YS5sZW5ndGgpKjEwMCkudG9GaXhlZCgyKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN0YXQucGVjUmVqZWN0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Zm9yKGxldCBpPTA7aTwkc2NvcGUucGllTGFiZWxzMS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHQkc2NvcGUucGllRGF0YTEucHVzaCgkc2NvcGUuc3RhdFskc2NvcGUucGllTGFiZWxzMVtpXV0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkc2NvcGUucGllTGFiZWxzMiA9IFsnRmluaXNoJywgJ0hvbGQnXTtcclxuXHRcdFx0JHNjb3BlLnBpZURhdGEyID0gW2NvbXBsZXRlZCtyZWplY3QsICgkc2NvcGUuc3RhdC50b3RhbC0oY29tcGxldGVkK3JlamVjdCkpXTtcclxuXHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnNlYXJjaE9wdGlvbiA9ICdkb2NOdW0nO1xyXG5cdFx0XHQkc2NvcGUuc29ydFR5cGUgPSAnY3JlYXRlQXQnO1xyXG5cdFx0XHQkc2NvcGUuc29ydFJldmVyc2UgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgPSAwO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGluaXQoKTtcclxuXHRcdH07XHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHRcclxuXHQuZmlsdGVyKCd1bmlxdWUnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGtleW5hbWUpe1xyXG5cdFx0XHR2YXIgb3V0cHV0ID0gW10sXHJcblx0XHRcdFx0a2V5cyAgID0gW107XHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0dmFyIGtleSA9IGl0ZW1ba2V5bmFtZV07XHJcblx0XHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKXtcclxuXHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH07XHJcblx0fSlcclxuXHRcclxuXHQuY29udHJvbGxlcignVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCdUcmF2ZWxlcicsICdGb3JtJywgJ0RvY051bScsICdDb3VudGVyJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0sIERvY051bSwgQ291bnRlciwgJHN0YXRlUGFyYW1zKXtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICYmICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID09PSAnUEFORElORyBGT1IgUkVWSUVXJyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdQQU5ESU5HIEZPUiBSRVZJRVcnO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0aWYoJHNjb3BlLmZvcm1JZCl7XHJcblx0XHRcdFx0Rm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1x0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG5cdFx0XHRcdFx0XHQkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0Ly8gaW5pdCB0aGUgdHJhdmVsZXJEYXRhIGZyb20gZm9ybURhdGFcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObyA9IGRhdGEuZm9ybU5vO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KGRhdGEuX2lkLCAoKT0+e30pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZURvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0WyRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0XTtcclxuXHRcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgIT09ICduZXcnKXtcclxuXHRcdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0Z2V0U05MaXN0KCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBjYWxsIGEgZnVuY3Rpb24gdG8gdXNlIGRvY251bSB0byByZXR1cm4gdGhlIGxpc3Qgb2Ygc2VyaWFsIG51bWJlciBhc3NvY2lhdGUgd2l0aCBcclxuXHRcdFx0Ly8gdGhpcyBkb2NudW1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5leHRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG9iamVjdCA9ICRzY29wZS5mb3Jtcy5zdGVwc1skc2NvcGUuY3VycmVudFN0ZXAtMV07XHJcblx0XHRcdGlmKG9iamVjdC5saXN0Lmxlbmd0aCA+PSAkc2NvcGUuY3VycmVudFN1YlN0ZXArMSl7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwICs9IDE7XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwICs9IDE7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3VycmVudFN0ZXAgPiAkc2NvcGUubGFzdFN0ZXApe1xyXG5cdFx0XHRcdFx0Ly8gVHJhdmVsZXIuc2V0UmV2aWV3RGF0YSgkc2NvcGUudHJhdmVsZXJEYXRhKTtcclxuXHRcdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1x0XHRcclxuXHRcdFx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IHBhZ2U7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0Ly8gJHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1N1YlBhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gcGFnZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgaWRMaXN0ID0gW107XHJcblx0XHRcdGZvcihsZXQgaSA9IDA7aSA8ICRzY29wZS5zZWxlY3RTTkxpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWRMaXN0LnB1c2goJHNjb3BlLnNlbGVjdFNOTGlzdFtpXS5faWQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgZGF0YSA9IHtcclxuXHRcdFx0XHRpZExpc3QgOiBpZExpc3QsXHJcblx0XHRcdFx0dHJhdmVsZXJEYXRhOiAkc2NvcGUudHJhdmVsZXJEYXRhXHJcblx0XHRcdH07XHJcblx0XHRcdC8vIGlmKGlkTGlzdC5sZW5ndGggPiAxKXtcclxuXHRcdFx0ZGVsZXRlIGRhdGEudHJhdmVsZXJEYXRhLnNuO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdFRyYXZlbGVyLnVwZGF0ZU11bHRpcGxlKGRhdGEpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdGlmKGNhbGxiYWNrKVxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJldmlldyA9IGZ1bmN0aW9uKG9wdGlvbil7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3Qnkpe1xyXG5cdFx0XHRcdGlmKG9wdGlvbiA9PT0gJ3JlamVjdCcpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUkVKRUNUJztcclxuXHRcdFx0XHR9ZWxzZSBpZihvcHRpb24gPT09ICdjb21wbGV0ZScpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnQ09NUExFVEVEJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0JHNjb3BlLnNhdmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmNsb3NlQWxlcnQoMCwnY2xlYXInKTtcclxuXHRcdFx0XHQkc2NvcGUuYWRkQWxlcnQoJ3dhcm5pbmcnLCAnRW50ZXIgUmV2aWV3ZXIgTmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudXNlcm5hbWUgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zbil7XHJcblx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jb21wbGV0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQvLyBzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWRCeSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZUF0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5jcmVhdGUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHJcblx0XHRcdFx0XHQvLyBpZiBzdWNjZXNzZnVsIGNyZWF0ZVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ3N1Ym1pdCBjb21wbGV0ZScpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUgb3Igc2VyaWFsIG51bWJlciBwbHogJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5ldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aWYoJHNjb3BlLnNlbGVjdFNOTGlzdCl7XHJcblx0XHRcdFx0aWYoY29uZmlybSgnZGVsZXRlPycpKXtcclxuXHRcdFx0XHRcdGxldCBpZExpc3QgPSBbXTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7aSA8ICRzY29wZS5zZWxlY3RTTkxpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdGlkTGlzdC5wdXNoKCRzY29wZS5zZWxlY3RTTkxpc3RbaV0uX2lkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBkYXRhID0ge1xyXG5cdFx0XHRcdFx0XHRcImlkTGlzdFwiOiBpZExpc3RcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKGRhdGEpXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYXBwZW5kU3ViU3RlcEVkaXRJbmZvID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHVzZXJuYW1lID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRpZih1c2VybmFtZSAhPT0gJycpe1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3RlcCA9ICRzY29wZS5jdXJyZW50U3RlcDtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN1YlN0ZXAgPSAkc2NvcGUuY3VycmVudFN1YlN0ZXA7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdEJ5ID0gdXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5jbG9zZUFsZXJ0KDAsJ2NsZWFyJyk7XHJcblx0XHRcdCRzY29wZS5hZGRBbGVydCgnd2FybmluZycsICdFbnRlciB5b3VyIE5hbWUnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucHJpbnRUcmF2ZWxlciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIHZhciBwcmludENvbnRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pZC1zZWxlY3RvcicpLmlubmVySFRNTDtcclxuXHRcdCAvLyAgICB2YXIgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD04MDAsaGVpZ2h0PTgwMCxzY3JvbGxiYXJzPW5vLG1lbnViYXI9bm8sdG9vbGJhcj1ubyxsb2NhdGlvbj1ubyxzdGF0dXM9bm8sdGl0bGViYXI9bm8sdG9wPTUwJyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4ud2luZG93LmZvY3VzKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8IURPQ1RZUEUgaHRtbD48aHRtbD48aGVhZD48dGl0bGU+VElUTEUgT0YgVEhFIFBSSU5UIE9VVDwvdGl0bGU+JyArXHJcblx0XHQgLy8gICAgICAgICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cImxpYnMvYm9vc2F2ZURvY051bXRzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiPicgK1xyXG5cdFx0IC8vICAgICAgICAnPC9oZWFkPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpOyB3aW5kb3cuY2xvc2UoKTtcIj48ZGl2PicgKyBwcmludENvbnRlbnRzICsgJzwvZGl2PjwvaHRtbD4nKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0XHR3aW5kb3cucHJpbnQoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdCRzY29wZS5zYXZlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1JZCA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybVJldiA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldjtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1ObyA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vO1xyXG5cdFx0XHRzZXREb2NOdW1MYWJlbCgnY3JlYXRlJyk7XHJcblx0XHRcdGRlbGV0ZSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkO1xyXG5cdFx0XHREb2NOdW0uY3JlYXRlKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkLCAobGlzdCk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0XHRpZihsaXN0W2ldLl9pZCA9PT0gZGF0YS5faWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1wiZG9jTnVtXCI6JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bX07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdERvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIHNldERvY051bUxhYmVsKCdlZGl0Jyk7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSkpO1xyXG5cdFx0XHREb2NOdW0uZWRpdERvY051bURhdGEoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQsICgpPT57fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jaGVja0ZvclNOID0gZnVuY3Rpb24oaW5wdXQpe1xyXG5cclxuXHRcdFx0aWYoaW5wdXQpe1xyXG5cdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnc258Zm9ybUlkJywgaW5wdXQrJ3wnKyRzY29wZS5mb3JtSWQsICdzbicpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGlmKGRhdGEubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0aWYoY29uZmlybSgnU04gYWxyZWFkeSBleGlzdC4gZG8geW91IHdhbnQgdG8gY3JlYXRlIGEgbmV3IHRyYXZlbGVyIHdpdGggc2FtZSBzbj8nKSl7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUuaXNTTkV4aXN0TW9yZVRoYW5PbmUpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdGxldCBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XCJzblwiOiBpbnB1dCxcclxuXHRcdFx0XHRcdFx0XHRcdFwic3RhdHVzXCI6IFwiT1BFTlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XCJjcmVhdGVBdFwiOiBuZXcgRGF0ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFwiaXRlbVJlY29yZFwiOntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XCJkb2NOdW1JZFwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcImRvY051bVwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRjcmVhdGVOZXdUcmF2ZWxlcihpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRpbnB1dCA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW0gPSB7fTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5tb3ZlVG9TZWxlY3RTTkxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLmxlbmd0aCk7XHJcblx0XHJcblx0XHRcdGxldCBzdGFjayA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGk9JHNjb3BlLlNOTGlzdEZvckRvY051bS5sZW5ndGg7aSA+IDA7aS0tKXtcclxuXHRcdFx0XHRsZXQgZWwgPSAkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnBvcCgpO1xyXG5cdFx0XHRcdGlmKGVsLmNoZWNrYm94ID09PSB0cnVlKXtcclxuXHRcdFx0XHRcdGVsLmNoZWNrYm94ID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goZWwpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3RhY2sucHVzaChlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBzdGFjaztcclxuXHRcdFx0c3RhY2sgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubW92ZVRvU05MaXN0Rm9yRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHN0YWNrID0gW107XHJcblx0XHRcdGZvcihsZXQgaSA9JHNjb3BlLnNlbGVjdFNOTGlzdC5sZW5ndGg7IGk+MDtpLS0pe1xyXG5cdFx0XHRcdGxldCBlbCA9ICRzY29wZS5zZWxlY3RTTkxpc3QucG9wKCk7XHJcblx0XHRcdFx0aWYoZWwuY2hlY2tib3ggPT09ICB0cnVlKXtcclxuXHRcdFx0XHRcdGVsLmNoZWNrYm94ID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnB1c2goZWwpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3RhY2sucHVzaChlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBzdGFjaztcclxuXHRcdFx0c3RhY2sgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VsZWN0QWxsTGlzdCA9IGZ1bmN0aW9uKGxpc3Qpe1xyXG5cdFx0XHRsZXQgYm9vbCA9IGxpc3RbMF0uY2hlY2tib3g7XHJcblx0XHRcdGZvcihsZXQgaT0wO2k8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRsaXN0W2ldLmNoZWNrYm94ID0gIWJvb2w7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmxvYWRUcmF2ZWxlciA9IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdFx0aWYoaW5wdXQpe1xyXG5cdFx0XHRcdCRzY29wZS5zZWxlY3RTTiA9IGlucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnX2lkJywgJHNjb3BlLnNlbGVjdFNOKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YVswXTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoU04gPSBmdW5jdGlvbihzbil7XHJcblxyXG5cdFx0XHRpZihzbil7XHJcblx0XHRcdFx0JHNjb3BlLnNlYXJjaFNOTGlzdD0gW107XHJcblx0XHRcdFx0JHNjb3BlLmNsZWFyQWZ0ZXJDaGFuZ2VUYWIoKTtcclxuXHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCdzbnxmb3JtSWQnLCBzbisnfCcrJHNjb3BlLmZvcm1JZCwgJ3NufGNyZWF0ZUF0fHN0YXR1cycpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05Nb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NOTW9yZVRoYW5PbmUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTTkxpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihkYXRhLmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6ZGF0YVswXS5faWQsIFwic25cIjpkYXRhWzBdLnNufSk7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gZGF0YVswXS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmxvYWRUcmF2ZWxlcigpO1xyXG5cdFx0XHRcdFx0XHRcdGxvYWRJdGVtUmVjb3JkKGRhdGFbMF0uZm9ybUlkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyAkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRUcmF2ZWxlckRhdGEgPSBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6JHNjb3BlLnNlYXJjaFNOTGlzdFtkYXRhXS5faWQsIFwic25cIjogJHNjb3BlLnNlYXJjaFNOTGlzdFtkYXRhXS5zbn0pO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U04gPSAkc2NvcGUuc2VhcmNoU05MaXN0W2RhdGFdLl9pZDtcclxuXHRcdFx0JHNjb3BlLmxvYWRUcmF2ZWxlcigpO1xyXG5cdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHQvLyAkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY3JlYXRlV29yayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS5zZWxlY3RTTkxpc3QubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0Q291bnRlci5uZXh0U2VxdWVuY2VWYWx1ZSh7bmFtZTond29ya051bSd9KVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuY2xvc2VBbGVydCgwLCdjbGVhcicpO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5hZGRBbGVydCgnaW5mbycsICdHcm91cCBudW1iZXIgJyArZGF0YS5zZXF1ZW5jZV92YWx1ZSsgJyBjcmVhdGVkJyk7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS53b3JrTnVtID0gZGF0YS5zZXF1ZW5jZV92YWx1ZS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hXb3JrTnVtKGRhdGEuc2VxdWVuY2VfdmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRDb3VudGVyLmNyZWF0ZShcclxuXHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XCJuYW1lXCI6XCJ3b3JrTnVtXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFwic2VxdWVuY2VfdmFsdWVcIjowXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0KS5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5jcmVhdGVXb3JrKCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZWFyY2hXb3JrTnVtID0gZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9ZmFsc2U7XHJcblx0XHRcdCRzY29wZS5jbGVhckFmdGVyQ2hhbmdlVGFiKCk7XHJcblx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnd29ya051bScsIGlucHV0LCAnc258Y3JlYXRlQXR8c3RhdHVzfHdvcmtOdW18Zm9ybUlkfGl0ZW1SZWNvcmQuZG9jTnVtSWR8aXRlbVJlY29yZC5kb2NOdW0nKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGE9PntcclxuXHRcdFx0XHRcdCRzY29wZS5zZWxlY3RTTkxpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGg+MCl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc1dvcmtGaW5kID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YVsnaXRlbVJlY29yZCddID0ge1xyXG5cdFx0XHRcdFx0XHRcdGRvY051bUlkOmRhdGFbMF0uaXRlbVJlY29yZC5kb2NOdW1JZCxcclxuXHRcdFx0XHRcdFx0XHRkb2NOdW06ZGF0YVswXS5pdGVtUmVjb3JkLmRvY051bVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZChkYXRhWzBdLmZvcm1JZCk7XHJcblxyXG5cdFx0XHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ2l0ZW1SZWNvcmQuZG9jTnVtSWQnLCBkYXRhWzBdLml0ZW1SZWNvcmQuZG9jTnVtSWQsICdzbnx3b3JrTnVtfHN0YXR1c3xjcmVhdGVBdCcpXHJcblx0XHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGg+MCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihsZXQgaSA9MDsgaSA8IGRhdGEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoIWRhdGFbaV0ud29ya051bSB8fGRhdGFbaV0ud29ya051bSAhPT0gaW5wdXQudG9TdHJpbmcoKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtLnB1c2goZGF0YVtpXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jbGVhckFmdGVyQ2hhbmdlVGFiID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuU05MaXN0Rm9yRG9jTnVtPVtdO1xyXG5cdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmlzV29ya0ZpbmQgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPSAnbmV3JztcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0ge307XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLmNyZWF0ZVRyYXZlbGVyID0gZnVuY3Rpb24oc24pe1xyXG5cdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID09PSAnbmV3Jyl7XHJcblx0XHRcdFx0JHNjb3BlLmNsb3NlQWxlcnQoMCwnY2xlYXInKTtcclxuXHRcdFx0XHQkc2NvcGUuYWRkQWxlcnQoJ3dhcm5pbmcnLCAnU2VsZWN0IGEgRG9jdW1lbnQgTnVtYmVyJyk7XHJcblx0XHRcdFx0JHNjb3BlLmlzQ29sbGFwc2VkSXRlbVJlY29yZCA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgaXNXYW50Q3JlYXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRjaGVja1NORXhpc3REQihzbixcclxuXHRcdFx0XHRcdChyZXN1bHQpPT57XHJcblx0XHRcdFx0XHRcdGlmKHJlc3VsdCl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNvbmZpcm0oJ1NhbWUgU2VyaWFsIG51bWJlciBhbHJlYWR5IGV4aXN0IGluIHRoZSBkYXRhYmFzZS4gQ3JlYXRlIGEgbmV3IFRyYXZlbGVyIHdpdGggc2FtZSBTZXJpYWwgTnVtYmVyPycpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlzV2FudENyZWF0ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihpc1dhbnRDcmVhdGUpe1xyXG5cdFx0XHRcdFx0XHRcdGxldCBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XCJzblwiOiBzbixcclxuXHRcdFx0XHRcdFx0XHRcdFwic3RhdHVzXCI6IFwiT1BFTlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XCJjcmVhdGVBdFwiOiBuZXcgRGF0ZVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0Y3JlYXRlTmV3VHJhdmVsZXIoaXRlbSwgKGRhdGEpPT57XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuY2xvc2VBbGVydCgwLCdjbGVhcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzQ29sbGFwc2VkSXRlbVJlY29yZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0ID0gW107XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcIl9pZFwiOmRhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcInNuXCI6ZGF0YS5zblxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJHNjb3BlLmlzU3RhcnRXb3JrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGFydFdvcmsgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuaXNTdGFydFdvcmsgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUudG9wQ29sbGFwc2UgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkQWxlcnQgPSBmdW5jdGlvbih0eXBlLCBtc2cpe1xyXG5cdFx0XHQkc2NvcGUuYWxlcnRzLnB1c2goXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IHR5cGUsXHJcblx0XHRcdFx0XHRcIm1zZ1wiIDogbXNnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uKGluZGV4LCBhY3Rpb24pe1xyXG5cdFx0XHRpZihhY3Rpb24gPT09ICdjbGVhcicpe1xyXG5cdFx0XHRcdCRzY29wZS5hbGVydHMgPSBbXTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmFsZXJ0cy5zcGxpY2UoaW5kZXgsMSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGNoZWNrU05FeGlzdERCID0gZnVuY3Rpb24oc24sIGNhbGxiYWNrKXtcclxuXHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IGZhbHNlO1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ3NufGZvcm1JZCcsIHNuKyd8Jyskc2NvcGUuZm9ybUlkLCAnc24nKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYWxsYmFjaygkc2NvcGUuaXNTTkV4aXN0KTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNyZWF0ZU5ld1RyYXZlbGVyID0gZnVuY3Rpb24oaXRlbSwgY2FsbGJhY2spe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhpdGVtLnNuKTtcclxuXHRcdFx0aWYoJHNjb3BlLnVzZXJuYW1lKXtcclxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQ7XHJcblx0XHRcdFx0ZGVsZXRlICRzY29wZS50cmF2ZWxlckRhdGEuc3RlcDtcclxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLnRyYXZlbGVyRGF0YS53b3JrTnVtO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc24gPSBpdGVtLnNuO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZCA9IGl0ZW0uaXRlbVJlY29yZDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBpdGVtLmNyZWF0ZUF0O1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uX2lkID0gZGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0ucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZ2V0U05MaXN0ID0gZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJ2l0ZW1SZWNvcmQuZG9jTnVtSWQnLCBpbnB1dCwgJ3NufHN0YXR1c3xjcmVhdGVBdHx3b3JrTnVtJylcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0JHNjb3BlLlNOTGlzdEZvckRvY051bSA9IGRhdGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzaG91bGRDb2xsYXBzZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc24gICYmICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW0pe1xyXG5cdFx0XHRcdCRzY29wZS50b3BDb2xsYXBzZSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldE51bURvY3RvVHJhdmVsZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQgPSB7XHJcblx0XHRcdFx0XHRcImRvY051bUlkXCI6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQsXHJcblx0XHRcdFx0XHRcImRvY051bVwiICA6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW1cclxuXHRcdFx0XHR9O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2V0RG9jTnVtTGFiZWwgPSBmdW5jdGlvbihhY3Rpb24pe1xyXG5cclxuXHRcdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdFx0aWYoYWN0aW9uID09PSAnY3JlYXRlJyl7XHJcblx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLmRvY051bSA9PT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSl7XHJcblx0XHRcdFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZihhY3Rpb24gPT09ICdlZGl0Jyl7XHJcblx0XHRcdC8vIFx0Zm9yKGxldCBpPTA7IGk8JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHQvLyBcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLmRvY051bSA9PT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSAmJlxyXG5cdFx0XHQvLyBcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uX2lkICE9PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkKXtcclxuXHRcdFx0Ly8gXHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmxhYmVsID0gY291bnQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRGb3JtLmdldEZvcm1MaXN0KClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdCRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dmFyIHJlc2V0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5mb3JtSWQgPSAnJztcclxuXHRcdFx0JHNjb3BlLmlzTmV3ID0gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWREb2NOdW1MaXN0ID0gZnVuY3Rpb24oaWQsIGNhbGxiYWNrKXtcclxuXHRcdFx0RG9jTnVtLmdldERvY051bUxpc3QoaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGxvYWQgaW5mb3JtYXRpb24gZm9yIEl0ZW1SZWNvcmQgd2l0aCBcclxuXHRcdC8vIGRvY051bS4gXHJcblx0XHR2YXIgbG9hZEl0ZW1SZWNvcmQgPSBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRpZighZm9ybUlkKXtcclxuXHRcdFx0XHRmb3JtSWQgPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZDtcclxuXHRcdFx0fVxyXG5cdFx0XHREb2NOdW0uZ2V0RG9jTnVtTGlzdChmb3JtSWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhW2ldLl9pZCA9PT0gJHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkLmRvY051bUlkKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50b3BDb2xsYXBzZT1mYWxzZTtcclxuXHRcdFx0JHNjb3BlLnVzZXJuYW1lID0gJ0pvaG4gU25vdyc7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0gPSB7fTtcclxuXHRcdFx0JHNjb3BlLmlzU05FeGlzdCA9IHRydWU7XHJcblx0XHRcdCRzY29wZS5pc1NORXhpc3RNb3JlVGhhbk9uZSA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaXNTTk1vcmVUaGFuT25lID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWFyY2hTTkxpc3QgPSBbXTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOID0gJyc7XHJcblx0XHRcdCRzY29wZS5TTkxpc3RGb3JEb2NOdW0gPSBbXTtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFNOTGlzdCA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuaXNVc2VXb3JrTnVtID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5pc1N0YXJ0V29yayA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U2VhcmNoU049JzAnO1xyXG5cdFx0XHQkc2NvcGUuaXNXb3JrRmluZCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuaW5wdXQ9e307XHJcblx0XHRcdCRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XHJcblx0XHRcdC8vICRzY29wZS5pc0NvbGxhcHNlZFNlbGVjdFNOTGlzdCA9IHRydWU7XHJcblx0XHRcdCRzY29wZS5pc0NvbGxhcHNlSGVhZGVyU05MaXN0ID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoQ2xpY2sgPSB0cnVlO1xyXG5cdFx0XHQkc2NvcGUuaXNDb2xsYXBzZWRJdGVtUmVjb3JkID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLmFsZXJ0cyA9IFtdO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpbml0KCk7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdGxvYWRGb3JtTGlzdCgpO1xyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLmZvcm1JZCl7XHJcblx0XHRcdFx0JHNjb3BlLmZvcm1JZCA9ICRzdGF0ZVBhcmFtcy5mb3JtSWQ7XHJcblx0XHRcdFx0JHNjb3BlLnVwZGF0ZUZvcm0oKTtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbG9hZCB0aGUgdHJhdmVsZXIgZnJvbSBTZWFyY2ggcGFnZVxyXG5cdFx0XHQvLyB0YWtlIHRoZSBwcmFtYXMgZnJvbSBVUkxcclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCdfaWQnLCAkc3RhdGVQYXJhbXMuX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdC8vIGRhdGEgaXMgYSBhcnJheS4gcmVzdWx0IGNvdWxkIGJlIG1vcmUgdGhhbiBvbmVcclxuXHRcdFx0XHRcdFx0Ly8gbmVlZCB0byBkZWFsIHdpdCB0aGlzLlxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0bG9hZEl0ZW1SZWNvcmQoZGF0YS5mb3JtSWQpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0U05MaXN0LnB1c2goe1wiX2lkXCI6ZGF0YS5faWQsIFwic25cIjpkYXRhLnNufSk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc1N0YXJ0V29yayA9IHRydWU7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0NvdW50ZXJTZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0NvdW50ZXInLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmV4dFNlcXVlbmNlVmFsdWU6ZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvY291bnRlci9uZXh0U2VxdWVuY2VWYWx1ZS8nLCBpbnB1dCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FwaS9jb3VudGVyL2NyZWF0ZScsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRG9jTnVtU2VydmljZScsIFtdKVxyXG5cdFxyXG5cdC5mYWN0b3J5KCdEb2NOdW0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldERvY051bUxpc3Q6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zLycrZm9ybUlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9kb2NOdW1zLycsZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVkaXREb2NOdW1EYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2RvY051bXMvJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERvY051bTogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2Qgc2VydmljZScpO1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZG9jTnVtcy9zZWFyY2hTaW5nbGU/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtU2VydmljZScsIFtdKVxyXG5cclxuXHQuZmFjdG9yeSgnRm9ybScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZm9ybXMnLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldEFsbDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0Rm9ybUxpc3Q6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9mb3JtTGlzdCcpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvc2VhcmNoLycrZm9ybUlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGU6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9mb3Jtcy8nK2Zvcm1JZCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJTZXJ2aWNlJywgW10pXHJcbiAgICAgICBcclxuICAgIC5mYWN0b3J5KCdUcmF2ZWxlcicsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gICAgICAgIHZhciByZXZpZXdEYXRhID0ge307XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcblx0XHJcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgd29yayB3aGVuIG1vcmUgQVBJIHJvdXRlcyBhcmUgZGVmaW5lZCBvbiB0aGUgTm9kZSBzaWRlIG9mIHRoaW5nc1xyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIFBPU1QgYW5kIGNyZWF0ZSBhIG5ldyBmb3JtXHJcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oZm9ybURhdGEpe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3RyYXZlbGVyJywgZm9ybURhdGEpO1xyXG4gICAgICAgICAgICB9LCBcclxuXHJcbiAgICAgICAgICAgIGdldFJldmlld0RhdGE6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV2aWV3RGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRSZXZpZXdEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldmlld0RhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2VhcmNoTGlrZTogZnVuY3Rpb24oc24pe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvc2VhcmNoTGlrZS8nKyBzbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gREVMRVRFIGZvcm1zXHJcbiAgICAgICAgICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90cmF2ZWxlci9kZWxldGVUcmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub3JtYWxTZWFyY2g6IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIHNlbGVjdCl7XHJcbiAgICAgICAgICAgICAgICBpZighc2VsZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvbm9ybWFsU2VhcmNoP3R5cGU9Jyt0eXBlKycmZGF0YT0nK2RhdGErJyZzZWxlY3Q9JytzZWxlY3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVNdWx0aXBsZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyL3VwZGF0ZU11bHRpcGxlJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
