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
			}
		}
	}). // controller: ['$scope', 'Traveler', 'Form',function($scope, Traveler, Form){
	// 	$scope.reviewData = Traveler.getReviewData();
	// 	Form.get($scope.reviewData.formId)
	// 		.success(function(data){
	// 			$scope.forms = data;
	// 	});
	// }]
	// controller: 'TravelerController'
	state('searchTraveler', {
		url: '/searchTraveler',
		templateUrl: 'views/searchTraveler.html',
		controller: 'SearchTravelerController'
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

        get: function get(_id) {
            return $http.get('/api/traveler?_id=' + _id);
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
		if (confirm('delete template?')) {

			if ($scope.create._id) {
				Form.delete($scope.create._id).success(function (data) {
					alert('removed');
				});
			}
			initCreate();
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

	// $scope.printTraveler = function(_id, formId){
	// 	window.open('traveler?_id='+_id+'&formId='+formId+'&action=print', '_blank');
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

		// calulate percent of total complated out of total
		if ($scope.stat.REJECT) {
			reject = $scope.stat.REJECT;
		}
		$scope.stat.pecComplete = (($scope.stat.COMPLETED + reject) / data.length * 100).toFixed(2);

		// calulate percent of reject out of total
		if ($scope.stat.REJECT / data.length * 100) {
			$scope.stat.pecReject = ($scope.stat.REJECT / data.length * 100).toFixed(2);
		} else {
			$scope.stat.pecReject = 0;
		}

		for (var _i = 0; _i < $scope.pieLabels1.length; _i++) {
			$scope.pieData1.push($scope.stat[$scope.pieLabels1[_i]]);
		}

		$scope.pieLabels2 = ['Finish', 'Hold'];
		$scope.pieData2 = [$scope.stat.COMPLETED + reject, $scope.stat.total - ($scope.stat.COMPLETED + reject)];
	};

	var init = function init() {
		$scope.isSearch = false;
		$scope.searchOption = 'docNum';
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
			setNumDoctoTraveler();
			Traveler.save($scope.travelerData).success(function (data) {
				// do something
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
			setNumDoctoTraveler();
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = $scope.username;
			$scope.travelerData.createAt = new Date();
			Traveler.create($scope.travelerData)

			// if successful create
			.success(function (data) {
				// console.log(data);
				$scope.travelerData = data;
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
		var printContents = document.getElementById('div-id-selector').innerHTML;
		var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
		popupWin.window.focus();
		popupWin.document.open();
		popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>' + '<link rel="stylesheet" type="text/css" href="libs/boosaveDocNumtstrap/dist/css/bootstrap.min.css">' + '</head><body onload="window.print(); window.close();"><div>' + printContents + '</div></html>');
		popupWin.document.close();
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
		DocNum.create($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId, function (list) {
				for (var i = 0; i < list.length; i++) {
					if (list[i]._id === data._id) {
						$scope.docNum.docNumData = data;
						$scope.docNum.docNumSelect = i.toString();
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

		// Traveler.get($scope.travelerData.sn)
		// 		.success(function(data){
		// 			console.log(data);
		// 		});
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

	var main = function main() {

		$scope.topCollapse = false;
		reset();
		loadFormList();
		$scope.username = 'John Snow';
		$scope.docNum = {};

		if ($stateParams.formId) {
			$scope.formId = $stateParams.formId;
			$scope.updateForm();
			$scope.isNew = false;
		}

		// load the traveler from Search page
		// take the pramas from URL
		if ($stateParams._id) {
			$scope.isNew = false;
			Traveler.get($stateParams._id).success(function (data) {
				// data is a array. result could be more than one
				// need to deal wit this.
				$scope.travelerData = data;
				loadItemRecord();
			});
		}
	};

	main();
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsInNlcnZpY2VzL0RvY051bVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9Gb3JtU2VydmljZS5qcyIsInNlcnZpY2VzL1RyYXZlbGVyU2VydmljZS5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsUUFBUSxNQUFSLENBQWUsV0FBZixFQUNDLENBQ0MsV0FERCxFQUVDLGNBRkQsRUFHQyxXQUhELEVBSUMsVUFKRCxFQU1DLFNBTkQsRUFPQyxVQVBELEVBUUMsY0FSRCxFQVNDLG9CQVRELEVBVUMsZ0JBVkQsRUFZQyxpQkFaRCxFQWFDLGFBYkQsRUFjQyxlQWRELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYTtBQURRO0FBTGpCO0FBRlksRUFWcEI7Ozs7Ozs7O0FBK0JFLE1BL0JG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LEVBWkQ7O0FBY0EsS0FBSSxPQUFPLFNBQVAsSUFBTyxHQUFVOztBQUVwQixTQUFPLFdBQVAsR0FBbUIsS0FBbkI7QUFDQTtBQUNBO0FBQ0EsU0FBTyxRQUFQLEdBQWtCLFdBQWxCO0FBQ0EsU0FBTyxNQUFQLEdBQWdCLEVBQWhCOztBQUVBLE1BQUcsYUFBYSxNQUFoQixFQUF1QjtBQUN0QixVQUFPLE1BQVAsR0FBZ0IsYUFBYSxNQUE3QjtBQUNBLFVBQU8sVUFBUDtBQUNBLFVBQU8sS0FBUCxHQUFlLEtBQWY7QUFDQTs7OztBQUlELE1BQUcsYUFBYSxHQUFoQixFQUFvQjtBQUNuQixVQUFPLEtBQVAsR0FBZSxLQUFmO0FBQ0EsWUFBUyxHQUFULENBQWEsYUFBYSxHQUExQixFQUNFLE9BREYsQ0FDVSxVQUFTLElBQVQsRUFBYzs7O0FBR3RCLFdBQU8sWUFBUCxHQUFzQixJQUF0QjtBQUNBO0FBQ0EsSUFORjtBQU9BO0FBRUQsRUEzQkQ7O0FBNkJBO0FBQ0QsQ0FyU2tDLENBbEJuQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnc2FtcGxlQXBwJywgXHJcblx0W1xyXG5cdFx0J3VpLnJvdXRlcicsIFxyXG5cdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHQnYXBwUm91dGVzJyxcclxuXHRcdCdkbmRMaXN0cycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnLFxyXG5cdFx0J0RvY051bVNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHQvLyBcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyB9XVxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybUdlbmVyYXRvck5hdi5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUdlbmVyYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVHZW5lcmF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVDcmVhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUNyZWF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdEb2NOdW1TZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0RvY051bScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RG9jTnVtTGlzdDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2RvY051bXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2RvY051bXMvJyxkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZWRpdERvY051bURhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvZG9jTnVtcy8nLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9jTnVtOiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZCBzZXJ2aWNlJyk7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zL3NlYXJjaFNpbmdsZT90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1TZXJ2aWNlJywgW10pXHJcblxyXG5cdC5mYWN0b3J5KCdGb3JtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zL2Zvcm1MaXN0Jyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9zZWFyY2gvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZTogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbihfaWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlcj9faWQ9JysgX2lkKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS90cmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXZpZXdEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaExpa2U6IGZ1bmN0aW9uKHNuKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL3NlYXJjaExpa2UvJysgc24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIERFTEVURSBhIGZvcm1cclxuICAgICAgICAgICAgcmVtb3ZlVHJhdmVsZXI6IGZ1bmN0aW9uKF9pZCwgaW5wdXQpe1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coX2lkKTtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3RyYXZlbGVyLycrIF9pZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5vcm1hbFNlYXJjaDogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL25vcm1hbFNlYXJjaD90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cdH07XHRcdFxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0FwcEN0cmwnLCBbJ25nQW5pbWF0ZSddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybUdlbkN0cmwuanMnLCBbJ3VpLmJvb3RzdHJhcC50YWJzJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJywgWyckc2NvcGUnLCdGb3JtJyAsIGZ1bmN0aW9uKCRzY29wZSwgRm9ybSl7XHJcblxyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihwYXNzd29yZCl7XHJcblx0XHRcdGlmKCFwYXNzd29yZCB8fCBwYXNzd29yZCA9PT0gJycpe1xyXG5cdFx0XHRcdHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnMTIzJyl7XHJcblx0XHRcdEZvcm0uY3JlYXRlKCRzY29wZS50ZW1wbGF0ZSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHRhbGVydCgnYWRkJyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlID0gZGF0YTtcclxuXHRcdFx0XHRcdGRlbGV0ZSAkc2NvcGUudGVtcGxhdGU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lIHNvbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0nMTIzJyl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0Rm9ybS5zYXZlKCRzY29wZS5jcmVhdGUpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdzYXZlJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS50ZW1wbGF0ZSA9ICRzY29wZS5jcmVhdGU7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3VibWl0KHBhc3N3b3JkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKGNvbmZpcm0oJ2RlbGV0ZSB0ZW1wbGF0ZT8nKSl7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdEZvcm0uZGVsZXRlKCRzY29wZS5jcmVhdGUuX2lkKVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdFx0YWxlcnQoJ3JlbW92ZWQnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aW5pdENyZWF0ZSgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRTZWxlY3RUYWIgPSBmdW5jdGlvbihuKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFRhYiA9IG47XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZCAmJiAkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcImlkXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiRzY29wZS5pbnB1dEl0ZW1SZWNvcmRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID09PSAnc2VsZWN0Jyl7XHJcblx0XHRcdFx0XHR2YXIgaG9sZGVyID0gJHNjb3BlLnNlbGVjdE9wdGlvbnM7XHJcblx0XHRcdFx0XHRob2xkZXIgPSBob2xkZXIuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGk8aG9sZGVyLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRob2xkZXJbaV0gPSBob2xkZXJbaV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aG9sZGVyID0gQXJyYXkuZnJvbShuZXcgU2V0KGhvbGRlcikpO1xyXG5cdFx0XHRcdFx0aXRlbVsnc2VsZWN0J10gPSB7J25hbWUnOicnfTtcclxuXHRcdFx0XHRcdGl0ZW0uc2VsZWN0WydvcHRpb25zJ10gPSBob2xkZXI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGlmKCRzY29wZS5pbnB1dFN0ZXBEZXMgJiYgJHNjb3BlLmlucHV0U3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBzdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6ICRzY29wZS5pbnB1dFN0ZXBUeXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUuaW5wdXRTdGVwRGVzIHx8ICcnXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzLnB1c2goc3RlcCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5pbnB1dFN0ZXBEZXMgPSAnJztcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAmJiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRsZXQgc3RlcEluZGV4ID0gJHNjb3BlLnRlbXBTdWIuc2VsZWN0U3RlcEZvclN1YlN0ZXA7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0PVtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QubGVuZ3RoO1xyXG5cdFx0XHRcdGxldCBzdWJTdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdWJfc3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5wdXNoKHN1YlN0ZXApO1xyXG5cdFx0XHRcdCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJPcHRpb24gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgc3RlcCA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzBdO1xyXG5cdFx0XHRsZXQgc3ViID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMV07XHJcblx0XHRcdGxldCBzZWxlY3RPcHRpb24gPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLnNlbGVjdFN1Yk9wdGlvbjtcclxuXHRcdFx0bGV0IG9wdGlvbnMgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dC5zcGxpdCgnLCcpO1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTwgb3B0aW9ucy5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRvcHRpb25zW2ldID0gb3B0aW9uc1tpXS50cmltKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0aW9ucyA9IEFycmF5LmZyb20obmV3IFNldChvcHRpb25zKSk7XHJcblx0XHRcdGxldCBzdWJTdGVwT3B0aW9uID0ge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IHNlbGVjdE9wdGlvbixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lLFxyXG5cdFx0XHRcdFx0XCJvcHRpb25zXCI6IG9wdGlvbnNcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMpe1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnM9W107XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucy5wdXNoKHN1YlN0ZXBPcHRpb24pO1xyXG5cdFx0XHQvLyRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdW3NlbGVjdE9wdGlvbl0gPSBzdWJTdGVwT3B0aW9uO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lID0gJyc7XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0ID0gJyc7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUubW9kaWZ5SUQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUpe1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxvYmplY3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYodHlwZSA9PT0naXRlbVJlY29yZCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLmlkID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdGVwcycpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N1Yl9zdGVwJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3ViX3N0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0T3B0aW9uID0gZnVuY3Rpb24oYWRkcmVzcywgaW5wdXQpe1xyXG4gICAgICBjb25zb2xlLmxvZyh0eXBlb2YgaW5wdXQpO1xyXG4gICAgICBjb25zb2xlLmxvZyhpbnB1dCk7XHJcblx0XHRcdGlmKGFkZHJlc3Mpe1xyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdCAgaW5wdXQgPSBpbnB1dC5zcGxpdCgnLCcpO1xyXG4gICAgICAgIH1cclxuXHRcdFx0XHRmb3IobGV0IGk9MDtpPGlucHV0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0YWRkcmVzcy5vcHRpb25zW2ldID0gaW5wdXRbaV0udHJpbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRkcmVzcy5vcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuICAgICAgICAgIGlmKCRzY29wZS5mb3JtSWQpe1xyXG4gICAgICAgICAgICBGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmZvcm1zID0gZGF0YTsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gLy8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlPSBkYXRhO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgaW5pdENyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jcmVhdGUgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5pc1B1Ymxpc2ggPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG4gICAgdmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgJHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXRDcmVhdGUoKTtcclxuICAgICAgbG9hZEZvcm1MaXN0KCk7XHJcblx0XHRcclxuXHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPSAndGV4dCc7XHJcblx0XHRcdCRzY29wZS5qc29uVmlldyA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNYWluQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUudGFnbGluZSA9ICd0byB0aGUgbW9vbiBhbmQgYmFjayEnO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlYXJjaFRyYXZlbGVyQ3RybCcsIFsnY2hhcnQuanMnXSlcclxuXHJcblx0LmNvbnRyb2xsZXIoJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlcil7XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50SW5wdXQgPSAkc2NvcGUuc2VhcmNoSW5wdXQ7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IHRydWU7XHJcblx0XHRcdGlmKCRzY29wZS5zZWFyY2hJbnB1dCl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLnNlYXJjaE9wdGlvbiA9PT0nc24nKXtcclxuXHRcdFx0XHRcdGxldCBzbiA9ICRzY29wZS5zZWFyY2hJbnB1dC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0VHJhdmVsZXIuc2VhcmNoTGlrZShzbilcclxuXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIHNlYXJjaCBkb2MgbnVtXHJcblx0XHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJHNjb3BlLnNlYXJjaE9wdGlvbiwgJHNjb3BlLnNlYXJjaElucHV0KVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0VHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGZvcm1JZCl7XHJcblx0XHRcdHdpbmRvdy5vcGVuKCd0cmF2ZWxlcj9faWQ9JytfaWQrJyZmb3JtSWQ9Jytmb3JtSWQsICdfYmxhbmsnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZVRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBpbmRleCl7XHJcblx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKF9pZClcclxuXHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PiB7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUucmVzdWx0LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vICRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBmb3JtSWQpe1xyXG5cdFx0Ly8gXHR3aW5kb3cub3BlbigndHJhdmVsZXI/X2lkPScrX2lkKycmZm9ybUlkPScrZm9ybUlkKycmYWN0aW9uPXByaW50JywgJ19ibGFuaycpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHZhciBmaW5kU3RhdGlzdGljcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zdGF0ID0ge31cclxuXHRcdFx0JHNjb3BlLnBpZUxhYmVsczE9W107XHJcblx0XHRcdCRzY29wZS5waWVEYXRhMSA9IFtdO1xyXG5cdFx0XHRsZXQgZGF0YSA9ICRzY29wZS5yZXN1bHQ7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPGRhdGEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYoZGF0YVtpXS5zdGF0dXMgaW4gJHNjb3BlLnN0YXQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRbZGF0YVtpXS5zdGF0dXNdICs9MTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS5waWVMYWJlbHMxLnB1c2goZGF0YVtpXS5zdGF0dXMpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRbZGF0YVtpXS5zdGF0dXNdID0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC50b3RhbCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRsZXQgcmVqZWN0ID0gMDtcclxuXHJcblx0XHRcdC8vIGNhbHVsYXRlIHBlcmNlbnQgb2YgdG90YWwgY29tcGxhdGVkIG91dCBvZiB0b3RhbFxyXG5cdFx0XHRpZigkc2NvcGUuc3RhdC5SRUpFQ1Qpe1xyXG5cdFx0XHRcdHJlamVjdCA9ICRzY29wZS5zdGF0LlJFSkVDVDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC5wZWNDb21wbGV0ZSA9ICgoKCRzY29wZS5zdGF0LkNPTVBMRVRFRCkrKHJlamVjdCkpLyhkYXRhLmxlbmd0aCkqMTAwKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY2FsdWxhdGUgcGVyY2VudCBvZiByZWplY3Qgb3V0IG9mIHRvdGFsXHJcblx0XHRcdGlmKCgkc2NvcGUuc3RhdC5SRUpFQ1QpLyhkYXRhLmxlbmd0aCkqMTAwKXtcclxuXHRcdFx0XHQkc2NvcGUuc3RhdC5wZWNSZWplY3QgPSAoKCRzY29wZS5zdGF0LlJFSkVDVCkvKGRhdGEubGVuZ3RoKSoxMDApLnRvRml4ZWQoMik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGZvcihsZXQgaT0wO2k8JHNjb3BlLnBpZUxhYmVsczEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0JHNjb3BlLnBpZURhdGExLnB1c2goJHNjb3BlLnN0YXRbJHNjb3BlLnBpZUxhYmVsczFbaV1dKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JHNjb3BlLnBpZUxhYmVsczIgPSBbJ0ZpbmlzaCcsICdIb2xkJ107XHJcblx0XHRcdCRzY29wZS5waWVEYXRhMiA9IFskc2NvcGUuc3RhdC5DT01QTEVURUQrcmVqZWN0LCAoJHNjb3BlLnN0YXQudG90YWwtKCRzY29wZS5zdGF0LkNPTVBMRVRFRCtyZWplY3QpKV07XHJcblx0XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLnNlYXJjaE9wdGlvbiA9ICdkb2NOdW0nO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGluaXQoKTtcclxuXHRcdH1cclxuXHRcdG1haW4oKTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1RyYXZlbGVyQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5maWx0ZXIoJ3VuaXF1ZScsIGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwga2V5bmFtZSl7XHJcblx0XHRcdHZhciBvdXRwdXQgPSBbXSxcclxuXHRcdFx0XHRrZXlzICAgPSBbXTtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcclxuXHRcdFx0XHR2YXIga2V5ID0gaXRlbVtrZXluYW1lXTtcclxuXHRcdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpe1xyXG5cdFx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdFx0fTtcclxuXHR9KVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdUcmF2ZWxlckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ1RyYXZlbGVyJywgJ0Zvcm0nLCAnRG9jTnVtJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0sIERvY051bSwgJHN0YXRlUGFyYW1zKXtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICYmICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICE9PSAnT1BFTicpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUEFORElORyBGT1IgUkVWSUVXJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRm9ybSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdGlmKCRzY29wZS5mb3JtSWQpe1xyXG5cdFx0XHRcdEZvcm0uZ2V0KCRzY29wZS5mb3JtSWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyBmaW5kIHRoZSBsYXN0IHN1YlN0ZXBcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkID0gZGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jdXN0b21lciA9IGRhdGEuY3VzdG9tZXI7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdFx0XHRsb2FkRG9jTnVtTGlzdChkYXRhLl9pZCwgKCk9Pnt9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS51cGRhdGVEb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEgPSAkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RdO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV4dFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgb2JqZWN0ID0gJHNjb3BlLmZvcm1zLnN0ZXBzWyRzY29wZS5jdXJyZW50U3RlcC0xXTtcclxuXHRcdFx0aWYob2JqZWN0Lmxpc3QubGVuZ3RoID49ICRzY29wZS5jdXJyZW50U3ViU3RlcCsxKXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgKz0gMTtcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgKz0gMTtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50U3RlcCA+ICRzY29wZS5sYXN0U3RlcCl7XHJcblx0XHRcdFx0XHQvLyBUcmF2ZWxlci5zZXRSZXZpZXdEYXRhKCRzY29wZS50cmF2ZWxlckRhdGEpO1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gcGFnZTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQvLyAkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzU3ViUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSBwYWdlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCl7XHJcblx0XHRcdFx0c2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLnNhdmUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS5zdWJtaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucmV2aWV3ID0gZnVuY3Rpb24ob3B0aW9uKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdCeSl7XHJcblx0XHRcdGlmKG9wdGlvbiA9PT0gJ3JlamVjdCcpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1JFSkVDVCc7XHJcblx0XHRcdH1lbHNlIGlmKG9wdGlvbiA9PT0gJ2NvbXBsZXRlJyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnQ09NUExFVEVEJztcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0F0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0JHNjb3BlLnNhdmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHJldmlld2VyIG5hbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnVzZXJuYW1lICYmICRzY29wZS50cmF2ZWxlckRhdGEuc24pe1xyXG5cdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEuY29tcGxldGVkID0gZmFsc2U7XHJcblx0XHRcdFx0c2V0TnVtRG9jdG9UcmF2ZWxlcigpO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkQnkgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0VHJhdmVsZXIuY3JlYXRlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgc3VjY2Vzc2Z1bCBjcmVhdGVcclxuXHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZSBvciBzZXJpYWwgbnVtYmVyIHBseiAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV3ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGFsZXJ0KCdkZWxldGUgY2xpY2snKTtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpe1xyXG5cdFx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYXBwZW5kU3ViU3RlcEVkaXRJbmZvID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHVzZXJuYW1lID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRpZih1c2VybmFtZSAhPT0gJycpe1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3RlcCA9ICRzY29wZS5jdXJyZW50U3RlcDtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN1YlN0ZXAgPSAkc2NvcGUuY3VycmVudFN1YlN0ZXA7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdEJ5ID0gdXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucHJpbnRUcmF2ZWxlciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwcmludENvbnRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pZC1zZWxlY3RvcicpLmlubmVySFRNTDtcclxuXHRcdCAgICB2YXIgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD04MDAsaGVpZ2h0PTgwMCxzY3JvbGxiYXJzPW5vLG1lbnViYXI9bm8sdG9vbGJhcj1ubyxsb2NhdGlvbj1ubyxzdGF0dXM9bm8sdGl0bGViYXI9bm8sdG9wPTUwJyk7XHJcblx0XHQgICAgcG9wdXBXaW4ud2luZG93LmZvY3VzKCk7XHJcblx0XHQgICAgcG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG5cdFx0ICAgIHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8IURPQ1RZUEUgaHRtbD48aHRtbD48aGVhZD48dGl0bGU+VElUTEUgT0YgVEhFIFBSSU5UIE9VVDwvdGl0bGU+JyArXHJcblx0XHQgICAgICAgICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cImxpYnMvYm9vc2F2ZURvY051bXRzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiPicgK1xyXG5cdFx0ICAgICAgICAnPC9oZWFkPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpOyB3aW5kb3cuY2xvc2UoKTtcIj48ZGl2PicgKyBwcmludENvbnRlbnRzICsgJzwvZGl2PjwvaHRtbD4nKTtcclxuXHRcdCAgICBwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcdCAqXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRcdCRzY29wZS5zYXZlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1JZCA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybVJldiA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldjtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1ObyA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpO1xyXG5cdFx0XHRzZXREb2NOdW1MYWJlbCgnY3JlYXRlJyk7XHJcblx0XHRcdGRlbGV0ZSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpO1xyXG5cdFx0XHREb2NOdW0uY3JlYXRlKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkLCAobGlzdCk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8bGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0XHRpZihsaXN0W2ldLl9pZCA9PT0gZGF0YS5faWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0ID0gaS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXREb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBzZXREb2NOdW1MYWJlbCgnZWRpdCcpO1xyXG5cdFx0XHREb2NOdW0uZWRpdERvY051bURhdGEoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQsICgpPT57fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jaGVja0ZvclNOID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdC8vIFRyYXZlbGVyLmdldCgkc2NvcGUudHJhdmVsZXJEYXRhLnNuKVxyXG5cdFx0XHQvLyBcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdC8vIFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHQvLyBcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXROdW1Eb2N0b1RyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1xyXG5cdFx0XHRcdFx0XCJkb2NOdW1JZFwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XCJkb2NOdW1cIiAgOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtXHJcblx0XHRcdFx0fTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldERvY051bUxhYmVsID0gZnVuY3Rpb24oYWN0aW9uKXtcclxuXHJcblx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdGlmKGFjdGlvbiA9PT0gJ2NyZWF0ZScpe1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0pe1xyXG5cdFx0XHRcdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYoYWN0aW9uID09PSAnZWRpdCcpe1xyXG5cdFx0XHQvLyBcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0Ly8gXHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0gJiZcclxuXHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLl9pZCAhPT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCl7XHJcblx0XHRcdC8vIFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyB9XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5sYWJlbCA9IGNvdW50O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Rm9ybS5nZXRGb3JtTGlzdCgpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciByZXNldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZm9ybUlkID0gJyc7XHJcblx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRG9jTnVtTGlzdCA9IGZ1bmN0aW9uKGlkLCBjYWxsYmFjayl7XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KGlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0ID0gZGF0YTtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBsb2FkIGluZm9ybWF0aW9uIGZvciBJdGVtUmVjb3JkIHdpdGggXHJcblx0XHQvLyBkb2NOdW0uIFxyXG5cdFx0dmFyIGxvYWRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aWYoZGF0YVtpXS5faWQgPT09ICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW1JZCl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YVtpXTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9IGkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdCRzY29wZS50b3BDb2xsYXBzZT1mYWxzZTtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0bG9hZEZvcm1MaXN0KCk7XHJcblx0XHRcdCRzY29wZS51c2VybmFtZSA9ICdKb2huIFNub3cnO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtID0ge307XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsb2FkIHRoZSB0cmF2ZWxlciBmcm9tIFNlYXJjaCBwYWdlXHJcblx0XHRcdC8vIHRha2UgdGhlIHByYW1hcyBmcm9tIFVSTFxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuX2lkKXtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0XHRUcmF2ZWxlci5nZXQoJHN0YXRlUGFyYW1zLl9pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBkYXRhIGlzIGEgYXJyYXkuIHJlc3VsdCBjb3VsZCBiZSBtb3JlIHRoYW4gb25lXHJcblx0XHRcdFx0XHRcdC8vIG5lZWQgdG8gZGVhbCB3aXQgdGhpcy5cclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGxvYWRJdGVtUmVjb3JkKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
