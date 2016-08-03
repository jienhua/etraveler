'use strict';

angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'appRoutes', 'dndLists', 'AppCtrl', 'MainCtrl', 'TravelerCtrl', 'SearchTravelerCtrl', 'FormGenCtrl.js', 'TravelerService', 'FormService', 'DocNumService']);
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
}).controller('TravelerController', ['$scope', 'Traveler', 'Form', 'DocNum', '$stateParams', function ($scope, Traveler, Form, DocNum, $stateParams) {

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
		$scope.docNum.docNumData = $scope.docNum.docNumSelectList[$scope.docNum.docNumSelect];
		setNumDoctoTraveler();
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
		if ($scope.travelerData.created) {
			// setNumDoctoTraveler();
			Traveler.save($scope.travelerData).success(function (data) {
				// do something
				alert('saved');
				shouldCollapse();
			});
		} else {
			$scope.submit();
		}
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
		// console.log($scope.docNum.docNumData);
		setDocNumLabel('create');
		delete $scope.docNum.docNumData._id;
		// console.log($scope.docNum.docNumData);
		// console.log($scope.docNum.docNumData.docNum);
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

		if (!$scope.travelerData._id) {
			Traveler.normalSearch('sn', $scope.travelerData.sn).success(function (data) {
				if (data.length > 0) {
					$scope.isSNExist = true;
					$scope.searchSN = data;
				} else {
					$scope.isSNExist = false;
				}
			});
		}
	};

	$scope.setTravelerData = function () {
		$scope.travelerData = $scope.searchSN[$scope.selectSN];
		loadItemRecord();
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
		$scope.searchSN = {};
		$scope.selectSN = '0';
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
			});
		}
	};

	main();
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
        normalSearch: function normalSearch(type, data) {
            return $http.get('/api/traveler/normalSearch?type=' + type + '&data=' + data);
        }
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvRG9jTnVtU2VydmljZS5qcyIsInNlcnZpY2VzL0Zvcm1TZXJ2aWNlLmpzIiwic2VydmljZXMvVHJhdmVsZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsUUFBUSxNQUFSLENBQWUsV0FBZixFQUNDLENBQ0MsV0FERCxFQUVDLGNBRkQsRUFHQyxXQUhELEVBSUMsVUFKRCxFQU1DLFNBTkQsRUFPQyxVQVBELEVBUUMsY0FSRCxFQVNDLG9CQVRELEVBVUMsZ0JBVkQsRUFZQyxpQkFaRCxFQWFDLGFBYkQsRUFjQyxlQWRELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYTs7Ozs7Ozs7O0FBRFE7QUFMakI7QUFGWSxFQVZwQixFQStCRSxLQS9C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QUFrQixHQUEvQixDQUFQO0FBQ0EsU0EvQkU7QUFnQ0gsc0JBQWMsc0JBQVMsSUFBVCxFQUFlLElBQWYsRUFBb0I7QUFDOUIsbUJBQU8sTUFBTSxHQUFOLENBQVUscUNBQW1DLElBQW5DLEdBQXdDLFFBQXhDLEdBQWlELElBQTNELENBQVA7QUFDSDtBQWxDRSxLQUFQO0FBb0NQLENBeEN3QixDQUZ6QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnc2FtcGxlQXBwJywgXHJcblx0W1xyXG5cdFx0J3VpLnJvdXRlcicsIFxyXG5cdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHQnYXBwUm91dGVzJyxcclxuXHRcdCdkbmRMaXN0cycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnLFxyXG5cdFx0J0RvY051bVNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCdcclxuXHRcdFx0XHRcdFx0Ly8gY29udHJvbGxlcjogWyckc2NvcGUnLCAnVHJhdmVsZXInLCAnRm9ybScsZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSl7XHJcblx0XHRcdFx0XHRcdC8vIFx0JHNjb3BlLnJldmlld0RhdGEgPSBUcmF2ZWxlci5nZXRSZXZpZXdEYXRhKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0Rm9ybS5nZXQoJHNjb3BlLnJldmlld0RhdGEuZm9ybUlkKVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdC8vIH1dXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6ICdUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0LnN0YXRlKCdzZWFyY2hUcmF2ZWxlcicse1xyXG5cdFx0XHRcdHVybDogJy9zZWFyY2hUcmF2ZWxlcicsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaFRyYXZlbGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdmb3JtUmV2aWV3QHNlYXJjaFRyYXZlbGVyJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybVJldmlldy5odG1sJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybUdlbmVyYXRvck5hdi5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUdlbmVyYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVHZW5lcmF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVDcmVhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUNyZWF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdBcHBDdHJsJywgWyduZ0FuaW1hdGUnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1HZW5DdHJsLmpzJywgWyd1aS5ib290c3RyYXAudGFicyddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcicsIFsnJHNjb3BlJywnRm9ybScgLCBmdW5jdGlvbigkc2NvcGUsIEZvcm0pe1xyXG5cclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24ocGFzc3dvcmQpe1xyXG5cdFx0XHRpZighcGFzc3dvcmQgfHwgcGFzc3dvcmQgPT09ICcnKXtcclxuXHRcdFx0XHRwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJzEyMycpe1xyXG5cdFx0XHRGb3JtLmNyZWF0ZSgkc2NvcGUudGVtcGxhdGUpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0YWxlcnQoJ2FkZCcpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZSA9IGRhdGE7XHJcblx0XHRcdFx0XHRkZWxldGUgJHNjb3BlLnRlbXBsYXRlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZSBzb24nKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0aWYocGFzc3dvcmQgPT09JzEyMycpe1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdEZvcm0uc2F2ZSgkc2NvcGUuY3JlYXRlKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc2F2ZScpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUudGVtcGxhdGUgPSAkc2NvcGUuY3JlYXRlO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN1Ym1pdChwYXNzd29yZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnUVFtb3JlJyl7XHJcblx0XHRcdFx0aWYoY29uZmlybSgnZGVsZXRlIHRlbXBsYXRlPycpKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdFx0Rm9ybS5kZWxldGUoJHNjb3BlLmNyZWF0ZS5faWQpXHJcblx0XHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRcdFx0YWxlcnQoJ3JlbW92ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aW5pdENyZWF0ZSgpO1xyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRTZWxlY3RUYWIgPSBmdW5jdGlvbihuKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFRhYiA9IG47XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZCAmJiAkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcImlkXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiRzY29wZS5pbnB1dEl0ZW1SZWNvcmRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID09PSAnc2VsZWN0Jyl7XHJcblx0XHRcdFx0XHR2YXIgaG9sZGVyID0gJHNjb3BlLnNlbGVjdE9wdGlvbnM7XHJcblx0XHRcdFx0XHRob2xkZXIgPSBob2xkZXIuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGk8aG9sZGVyLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRob2xkZXJbaV0gPSBob2xkZXJbaV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aG9sZGVyID0gQXJyYXkuZnJvbShuZXcgU2V0KGhvbGRlcikpO1xyXG5cdFx0XHRcdFx0aXRlbVsnc2VsZWN0J10gPSB7J25hbWUnOicnfTtcclxuXHRcdFx0XHRcdGl0ZW0uc2VsZWN0WydvcHRpb25zJ10gPSBob2xkZXI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGlmKCRzY29wZS5pbnB1dFN0ZXBEZXMgJiYgJHNjb3BlLmlucHV0U3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBzdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6ICRzY29wZS5pbnB1dFN0ZXBUeXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUuaW5wdXRTdGVwRGVzIHx8ICcnXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzLnB1c2goc3RlcCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5pbnB1dFN0ZXBEZXMgPSAnJztcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAmJiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRsZXQgc3RlcEluZGV4ID0gJHNjb3BlLnRlbXBTdWIuc2VsZWN0U3RlcEZvclN1YlN0ZXA7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0PVtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QubGVuZ3RoO1xyXG5cdFx0XHRcdGxldCBzdWJTdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdWJfc3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5wdXNoKHN1YlN0ZXApO1xyXG5cdFx0XHRcdCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJPcHRpb24gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgc3RlcCA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzBdO1xyXG5cdFx0XHRsZXQgc3ViID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMV07XHJcblx0XHRcdGxldCBzZWxlY3RPcHRpb24gPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLnNlbGVjdFN1Yk9wdGlvbjtcclxuXHRcdFx0bGV0IG9wdGlvbnMgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dC5zcGxpdCgnLCcpO1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTwgb3B0aW9ucy5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRvcHRpb25zW2ldID0gb3B0aW9uc1tpXS50cmltKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0aW9ucyA9IEFycmF5LmZyb20obmV3IFNldChvcHRpb25zKSk7XHJcblx0XHRcdGxldCBzdWJTdGVwT3B0aW9uID0ge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IHNlbGVjdE9wdGlvbixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lLFxyXG5cdFx0XHRcdFx0XCJvcHRpb25zXCI6IG9wdGlvbnNcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMpe1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnM9W107XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucy5wdXNoKHN1YlN0ZXBPcHRpb24pO1xyXG5cdFx0XHQvLyRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdW3NlbGVjdE9wdGlvbl0gPSBzdWJTdGVwT3B0aW9uO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lID0gJyc7XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0ID0gJyc7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUubW9kaWZ5SUQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUpe1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxvYmplY3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYodHlwZSA9PT0naXRlbVJlY29yZCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLmlkID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdGVwcycpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N1Yl9zdGVwJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3ViX3N0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0T3B0aW9uID0gZnVuY3Rpb24oYWRkcmVzcywgaW5wdXQpe1xyXG4gICAgICBjb25zb2xlLmxvZyh0eXBlb2YgaW5wdXQpO1xyXG4gICAgICBjb25zb2xlLmxvZyhpbnB1dCk7XHJcblx0XHRcdGlmKGFkZHJlc3Mpe1xyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdCAgaW5wdXQgPSBpbnB1dC5zcGxpdCgnLCcpO1xyXG4gICAgICAgIH1cclxuXHRcdFx0XHRmb3IobGV0IGk9MDtpPGlucHV0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0YWRkcmVzcy5vcHRpb25zW2ldID0gaW5wdXRbaV0udHJpbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRkcmVzcy5vcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuICAgICAgICAgIGlmKCRzY29wZS5mb3JtSWQpe1xyXG4gICAgICAgICAgICBGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmZvcm1zID0gZGF0YTsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gLy8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlPSBkYXRhO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgaW5pdENyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jcmVhdGUgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5pc1B1Ymxpc2ggPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG4gICAgdmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgJHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXRDcmVhdGUoKTtcclxuICAgICAgbG9hZEZvcm1MaXN0KCk7XHJcblx0XHRcclxuXHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPSAndGV4dCc7XHJcblx0XHRcdCRzY29wZS5qc29uVmlldyA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNYWluQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUudGFnbGluZSA9ICd0byB0aGUgbW9vbiBhbmQgYmFjayEnO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlYXJjaFRyYXZlbGVyQ3RybCcsIFsnY2hhcnQuanMnXSlcclxuXHJcblx0LmNvbnRyb2xsZXIoJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlcil7XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50SW5wdXQgPSAkc2NvcGUuc2VhcmNoSW5wdXQ7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IHRydWU7XHJcblx0XHRcdGlmKCRzY29wZS5zZWFyY2hJbnB1dCl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLnNlYXJjaE9wdGlvbiA9PT0nc24nKXtcclxuXHRcdFx0XHRcdGxldCBzbiA9ICRzY29wZS5zZWFyY2hJbnB1dC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0VHJhdmVsZXIuc2VhcmNoTGlrZShzbilcclxuXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIHNlYXJjaCBkb2MgbnVtXHJcblx0XHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJHNjb3BlLnNlYXJjaE9wdGlvbiwgJHNjb3BlLnNlYXJjaElucHV0KVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0VHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGZvcm1JZCl7XHJcblx0XHRcdHdpbmRvdy5vcGVuKCd0cmF2ZWxlcj9faWQ9JytfaWQrJyZmb3JtSWQ9Jytmb3JtSWQsICdfYmxhbmsnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZVRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBpbmRleCl7XHJcblx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKF9pZClcclxuXHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PiB7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUucmVzdWx0LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS50aW1lU3BlbmQgPSBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoZGF0YS5yZXZpZXdBdCl7XHJcblx0XHRcdFx0bGV0IGRpZmYgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZShkYXRhLnJldmlld0F0KSAtIG5ldyBEYXRlKGRhdGEuY3JlYXRlQXQpKS8xMDAwKTtcclxuXHRcdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgKz0gZGlmZjtcclxuXHRcdFx0XHRyZXR1cm4gY2FsdWxhdGVUaW1lKGRpZmYpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZGlmZiA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkgLSBuZXcgRGF0ZShkYXRhLmNyZWF0ZUF0KSkvMTAwMCk7XHJcblx0XHRcdFx0JHNjb3BlLnRvdGFsVGltZVNwYW5kICs9IGRpZmY7XHJcblx0XHRcdFx0cmV0dXJuIGNhbHVsYXRlVGltZShkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudG90YWxUaW1lU3BlbmQgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0cmV0dXJuIDU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBjYWx1bGF0ZVRpbWUgPSBmdW5jdGlvbihzZWNvbmRzKXtcclxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcy82MC82MCkgKyAnIEhvdXJzIGFuZCAnICsgTWF0aC5mbG9vcihzZWNvbmRzLzYwKSU2MCArIFxyXG5cdFx0XHRcdFx0JyBtaW4gYW5kICcgKyBzZWNvbmRzICUgNjAgKyAnIHNlYyc7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vICRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0Ly8gXHQkc2NvcGUudHJhdmVsZXJEYXRhID0gJHNjb3BlLnJlc3VsdFtpbmRleF07XHJcblx0XHRcdC8vIHZhciBwcmludENvbnRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pZC1zZWxlY3RvcicpLmlubmVySFRNTDtcclxuXHRcdCAvLyAgICB2YXIgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD04MDAsaGVpZ2h0PTgwMCxzY3JvbGxiYXJzPW5vLG1lbnViYXI9bm8sdG9vbGJhcj1ubyxsb2NhdGlvbj1ubyxzdGF0dXM9bm8sdGl0bGViYXI9bm8sdG9wPTUwJyk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4ud2luZG93LmZvY3VzKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8IURPQ1RZUEUgaHRtbD48aHRtbD48aGVhZD48dGl0bGU+VElUTEUgT0YgVEhFIFBSSU5UIE9VVDwvdGl0bGU+JyArXHJcblx0XHQgLy8gICAgICAgICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cImxpYnMvYm9vc2F2ZURvY051bXRzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiPicgK1xyXG5cdFx0IC8vICAgICAgICAnPC9oZWFkPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpOyB3aW5kb3cuY2xvc2UoKTtcIj48ZGl2PicgKyBwcmludENvbnRlbnRzICsgJzwvZGl2PjwvaHRtbD4nKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHZhciBmaW5kU3RhdGlzdGljcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zdGF0ID0ge307XHJcblx0XHRcdCRzY29wZS5waWVMYWJlbHMxPVtdO1xyXG5cdFx0XHQkc2NvcGUucGllRGF0YTEgPSBbXTtcclxuXHRcdFx0bGV0IGRhdGEgPSAkc2NvcGUucmVzdWx0O1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKGRhdGFbaV0uc3RhdHVzIGluICRzY29wZS5zdGF0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSArPTE7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUucGllTGFiZWxzMS5wdXNoKGRhdGFbaV0uc3RhdHVzKTtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSA9MTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnN0YXQudG90YWwgPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0bGV0IHJlamVjdCA9IDA7XHJcblx0XHRcdGxldCBjb21wbGV0ZWQgPSAwO1xyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHRvdGFsIGNvbXBsYXRlZCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoJHNjb3BlLnN0YXQuUkVKRUNUKXtcclxuXHRcdFx0XHRyZWplY3QgPSAkc2NvcGUuc3RhdC5SRUpFQ1Q7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCRzY29wZS5zdGF0LkNPTVBMRVRFRCl7XHJcblx0XHRcdFx0Y29tcGxldGVkID0gJHNjb3BlLnN0YXQuQ09NUExFVEVEO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5zdGF0LnBlY0NvbXBsZXRlID0gKCgoY29tcGxldGVkKSsocmVqZWN0KSkvKGRhdGEubGVuZ3RoKSoxMDApLnRvRml4ZWQoMik7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHJlamVjdCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoKCRzY29wZS5zdGF0LlJFSkVDVCkvKGRhdGEubGVuZ3RoKSoxMDApe1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9ICgocmVqZWN0KS8oZGF0YS5sZW5ndGgpKjEwMCkudG9GaXhlZCgyKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN0YXQucGVjUmVqZWN0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Zm9yKGxldCBpPTA7aTwkc2NvcGUucGllTGFiZWxzMS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHQkc2NvcGUucGllRGF0YTEucHVzaCgkc2NvcGUuc3RhdFskc2NvcGUucGllTGFiZWxzMVtpXV0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkc2NvcGUucGllTGFiZWxzMiA9IFsnRmluaXNoJywgJ0hvbGQnXTtcclxuXHRcdFx0JHNjb3BlLnBpZURhdGEyID0gW2NvbXBsZXRlZCtyZWplY3QsICgkc2NvcGUuc3RhdC50b3RhbC0oY29tcGxldGVkK3JlamVjdCkpXTtcclxuXHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnNlYXJjaE9wdGlvbiA9ICdkb2NOdW0nO1xyXG5cdFx0XHQkc2NvcGUuc29ydFR5cGUgPSAnY3JlYXRlQXQnO1xyXG5cdFx0XHQkc2NvcGUuc29ydFJldmVyc2UgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUudG90YWxUaW1lU3BhbmQgPSAwO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGluaXQoKTtcclxuXHRcdH07XHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHRcclxuXHQuZmlsdGVyKCd1bmlxdWUnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGtleW5hbWUpe1xyXG5cdFx0XHR2YXIgb3V0cHV0ID0gW10sXHJcblx0XHRcdFx0a2V5cyAgID0gW107XHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0dmFyIGtleSA9IGl0ZW1ba2V5bmFtZV07XHJcblx0XHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKXtcclxuXHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH07XHJcblx0fSlcclxuXHRcclxuXHQuY29udHJvbGxlcignVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCdUcmF2ZWxlcicsICdGb3JtJywgJ0RvY051bScsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtLCBEb2NOdW0sICRzdGF0ZVBhcmFtcyl7XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAhPT0gJ09QRU4nKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1BBTkRJTkcgRk9SIFJFVklFVyc7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHRpZigkc2NvcGUuZm9ybUlkKXtcclxuXHRcdFx0XHRGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcblx0XHRcdFx0XHRcdCRzY29wZS5sYXN0U3RlcCA9IGRhdGEuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHQvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXYgPSBkYXRhLmZvcm1SZXY7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHRcdFx0bG9hZERvY051bUxpc3QoZGF0YS5faWQsICgpPT57fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0WyRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0XTtcclxuXHRcdFx0c2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV4dFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgb2JqZWN0ID0gJHNjb3BlLmZvcm1zLnN0ZXBzWyRzY29wZS5jdXJyZW50U3RlcC0xXTtcclxuXHRcdFx0aWYob2JqZWN0Lmxpc3QubGVuZ3RoID49ICRzY29wZS5jdXJyZW50U3ViU3RlcCsxKXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgKz0gMTtcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgKz0gMTtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50U3RlcCA+ICRzY29wZS5sYXN0U3RlcCl7XHJcblx0XHRcdFx0XHQvLyBUcmF2ZWxlci5zZXRSZXZpZXdEYXRhKCRzY29wZS50cmF2ZWxlckRhdGEpO1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gcGFnZTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQvLyAkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzU3ViUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSBwYWdlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCl7XHJcblx0XHRcdFx0Ly8gc2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLnNhdmUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc2F2ZWQnKTtcclxuXHRcdFx0XHRcdFx0c2hvdWxkQ29sbGFwc2UoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuc3VibWl0KCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJldmlldyA9IGZ1bmN0aW9uKG9wdGlvbil7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3Qnkpe1xyXG5cdFx0XHRcdGlmKG9wdGlvbiA9PT0gJ3JlamVjdCcpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUkVKRUNUJztcclxuXHRcdFx0XHR9ZWxzZSBpZihvcHRpb24gPT09ICdjb21wbGV0ZScpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnQ09NUExFVEVEJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0JHNjb3BlLnNhdmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHJldmlld2VyIG5hbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnVzZXJuYW1lICYmICRzY29wZS50cmF2ZWxlckRhdGEuc24pe1xyXG5cdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEuY29tcGxldGVkID0gZmFsc2U7XHJcblx0XHRcdFx0Ly8gc2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkQnkgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0VHJhdmVsZXIuY3JlYXRlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgc3VjY2Vzc2Z1bCBjcmVhdGVcclxuXHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdzdWJtaXQgY29tcGxldGUnKTtcclxuXHRcdFx0XHRcdFx0c2hvdWxkQ29sbGFwc2UoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lIG9yIHNlcmlhbCBudW1iZXIgcGx6ICcpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0YWxlcnQoJ2RlbGV0ZSBjbGljaycpO1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZCl7XHJcblx0XHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hcHBlbmRTdWJTdGVwRWRpdEluZm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgdXNlcm5hbWUgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdGlmKHVzZXJuYW1lICE9PSAnJyl7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdGVwID0gJHNjb3BlLmN1cnJlbnRTdGVwO1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3ViU3RlcCA9ICRzY29wZS5jdXJyZW50U3ViU3RlcDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0QnkgPSB1c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0VGltZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZScpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gdmFyIHByaW50Q29udGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWlkLXNlbGVjdG9yJykuaW5uZXJIVE1MO1xyXG5cdFx0IC8vICAgIHZhciBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCxoZWlnaHQ9ODAwLHNjcm9sbGJhcnM9bm8sbWVudWJhcj1ubyx0b29sYmFyPW5vLGxvY2F0aW9uPW5vLHN0YXR1cz1ubyx0aXRsZWJhcj1ubyx0b3A9NTAnKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi53aW5kb3cuZm9jdXMoKTtcclxuXHRcdCAvLyAgICBwb3B1cFdpbi5kb2N1bWVudC5vcGVuKCk7XHJcblx0XHQgLy8gICAgcG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzwhRE9DVFlQRSBodG1sPjxodG1sPjxoZWFkPjx0aXRsZT5USVRMRSBPRiBUSEUgUFJJTlQgT1VUPC90aXRsZT4nICtcclxuXHRcdCAvLyAgICAgICAgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwibGlicy9ib29zYXZlRG9jTnVtdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCI+JyArXHJcblx0XHQgLy8gICAgICAgICc8L2hlYWQ+PGJvZHkgb25sb2FkPVwid2luZG93LnByaW50KCk7IHdpbmRvdy5jbG9zZSgpO1wiPjxkaXY+JyArIHByaW50Q29udGVudHMgKyAnPC9kaXY+PC9odG1sPicpO1xyXG5cdFx0IC8vICAgIHBvcHVwV2luLmRvY3VtZW50LmNsb3NlKCk7XHJcblx0XHRcdHdpbmRvdy5wcmludCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHQgKlxyXG5cdFx0ICpcclxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0XHQkc2NvcGUuc2F2ZURvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5mb3JtSWQgPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZDtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1SZXYgPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXY7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5mb3JtTm8gPSAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObztcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKTtcclxuXHRcdFx0c2V0RG9jTnVtTGFiZWwoJ2NyZWF0ZScpO1xyXG5cdFx0XHRkZWxldGUgJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZDtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSk7XHJcblx0XHRcdERvY051bS5jcmVhdGUoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQsIChsaXN0KT0+e1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxsaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRcdGlmKGxpc3RbaV0uX2lkID09PSBkYXRhLl9pZCl7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPSBpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQgPSB7XCJkb2NOdW1cIjokc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtfTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0RG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gc2V0RG9jTnVtTGFiZWwoJ2VkaXQnKTtcclxuXHRcdFx0RG9jTnVtLmVkaXREb2NOdW1EYXRhKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkLCAoKT0+e30pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tGb3JTTiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpZighJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpe1xyXG5cdFx0XHRcdFRyYXZlbGVyLm5vcm1hbFNlYXJjaCgnc24nLCAkc2NvcGUudHJhdmVsZXJEYXRhLnNuKVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRpZihkYXRhLmxlbmd0aCA+IDAgKXtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNOID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5pc1NORXhpc3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRUcmF2ZWxlckRhdGEgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gJHNjb3BlLnNlYXJjaFNOWyRzY29wZS5zZWxlY3RTTl07XHJcblx0XHRcdGxvYWRJdGVtUmVjb3JkKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzaG91bGRDb2xsYXBzZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc24gICYmICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW0pe1xyXG5cdFx0XHRcdCRzY29wZS50b3BDb2xsYXBzZSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldE51bURvY3RvVHJhdmVsZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQgPSB7XHJcblx0XHRcdFx0XHRcImRvY051bUlkXCI6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQsXHJcblx0XHRcdFx0XHRcImRvY051bVwiICA6ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW1cclxuXHRcdFx0XHR9O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2V0RG9jTnVtTGFiZWwgPSBmdW5jdGlvbihhY3Rpb24pe1xyXG5cclxuXHRcdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdFx0aWYoYWN0aW9uID09PSAnY3JlYXRlJyl7XHJcblx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLmRvY051bSA9PT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSl7XHJcblx0XHRcdFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZihhY3Rpb24gPT09ICdlZGl0Jyl7XHJcblx0XHRcdC8vIFx0Zm9yKGxldCBpPTA7IGk8JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHQvLyBcdFx0aWYoJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLmRvY051bSA9PT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bSAmJlxyXG5cdFx0XHQvLyBcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uX2lkICE9PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkKXtcclxuXHRcdFx0Ly8gXHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmxhYmVsID0gY291bnQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRGb3JtLmdldEZvcm1MaXN0KClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdCRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dmFyIHJlc2V0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5mb3JtSWQgPSAnJztcclxuXHRcdFx0JHNjb3BlLmlzTmV3ID0gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWREb2NOdW1MaXN0ID0gZnVuY3Rpb24oaWQsIGNhbGxiYWNrKXtcclxuXHRcdFx0RG9jTnVtLmdldERvY051bUxpc3QoaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGxvYWQgaW5mb3JtYXRpb24gZm9yIEl0ZW1SZWNvcmQgd2l0aCBcclxuXHRcdC8vIGRvY051bS4gXHJcblx0XHR2YXIgbG9hZEl0ZW1SZWNvcmQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcclxuXHRcdFx0RG9jTnVtLmdldERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhW2ldLl9pZCA9PT0gJHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkLmRvY051bUlkKXtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBpbml0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRvcENvbGxhcHNlPWZhbHNlO1xyXG5cdFx0XHQkc2NvcGUudXNlcm5hbWUgPSAnSm9obiBTbm93JztcclxuXHRcdFx0JHNjb3BlLmRvY051bSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuaXNTTkV4aXN0ID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWFyY2hTTiA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0U04gPSAnMCc7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXQoKTtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0bG9hZEZvcm1MaXN0KCk7XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsb2FkIHRoZSB0cmF2ZWxlciBmcm9tIFNlYXJjaCBwYWdlXHJcblx0XHRcdC8vIHRha2UgdGhlIHByYW1hcyBmcm9tIFVSTFxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuX2lkKXtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0XHRUcmF2ZWxlci5nZXQoJ19pZCcsICRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHRcdFx0XHRzaG91bGRDb2xsYXBzZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdG1haW4oKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdEb2NOdW1TZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0RvY051bScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RG9jTnVtTGlzdDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2RvY051bXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2RvY051bXMvJyxkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZWRpdERvY051bURhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvZG9jTnVtcy8nLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9jTnVtOiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZCBzZXJ2aWNlJyk7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zL3NlYXJjaFNpbmdsZT90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1TZXJ2aWNlJywgW10pXHJcblxyXG5cdC5mYWN0b3J5KCdGb3JtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zL2Zvcm1MaXN0Jyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9zZWFyY2gvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZTogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXI/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdHJhdmVsZXInLCBkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFJldmlld0RhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV2aWV3RGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZWFyY2hMaWtlOiBmdW5jdGlvbihzbil7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9zZWFyY2hMaWtlLycrIHNuKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBERUxFVEUgYSBmb3JtXHJcbiAgICAgICAgICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbihfaWQsIGlucHV0KXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKF9pZCk7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS90cmF2ZWxlci8nKyBfaWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub3JtYWxTZWFyY2g6IGZ1bmN0aW9uKHR5cGUsIGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9ub3JtYWxTZWFyY2g/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
