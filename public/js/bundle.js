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
		$scope.stat.pecComplete = ($scope.stat.COMPLETED + reject) / data.length * 100;

		// calulate percent of reject out of total
		if ($scope.stat.REJECT / data.length * 100) {
			$scope.stat.pecReject = $scope.stat.REJECT / data.length * 100;
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
				loadDocNumList(data._id);
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

	$scope.saveDocNum = function () {
		$scope.docNum.docNumData.formId = $scope.travelerData.formId;
		$scope.docNum.docNumData.formRev = $scope.travelerData.formRev;
		$scope.docNum.docNumData.formNo = $scope.travelerData.formNo;
		// console.log($scope.docNum.docNumData);
		setDocNumLabel('create');
		delete $scope.docNum.docNumData._id;
		// console.log($scope.docNum.docNumData);
		DocNum.create($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId);
		});
	};

	$scope.editDocNum = function () {
		// console.log($scope.docNum.docNumData);
		setDocNumLabel('edit');
		DocNum.editDocNumData($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId);
		});
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

		if (action === 'edit') {
			for (var _i = 0; _i < $scope.docNum.docNumSelectList.length; _i++) {
				if ($scope.docNum.docNumSelectList[_i].docNum === $scope.docNum.docNumData.docNum && $scope.docNum.docNumSelectList[_i]._id !== $scope.docNum.docNumData._id) {
					count += 1;
				}
			}
		}
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

	var loadDocNumList = function loadDocNumList(id) {
		DocNum.getDocNumList(id).success(function (data) {
			$scope.docNum.docNumSelectList = data;
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
		// startWatch();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvRG9jTnVtU2VydmljZS5qcyIsInNlcnZpY2VzL0Zvcm1TZXJ2aWNlLmpzIiwic2VydmljZXMvVHJhdmVsZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsUUFBUSxNQUFSLENBQWUsV0FBZixFQUNDLENBQ0MsV0FERCxFQUVDLGNBRkQsRUFHQyxXQUhELEVBSUMsVUFKRCxFQU1DLFNBTkQsRUFPQyxVQVBELEVBUUMsY0FSRCxFQVNDLG9CQVRELEVBVUMsZ0JBVkQsRUFZQyxpQkFaRCxFQWFDLGFBYkQsRUFjQyxlQWRELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYTtBQURRO0FBTGpCO0FBRlksRUFWcEI7Ozs7Ozs7O0FBK0JFLE1BL0JG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QUFQO0FBb0NQLENBeEN3QixDQUZ6QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnc2FtcGxlQXBwJywgXHJcblx0W1xyXG5cdFx0J3VpLnJvdXRlcicsIFxyXG5cdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHQnYXBwUm91dGVzJyxcclxuXHRcdCdkbmRMaXN0cycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnLFxyXG5cdFx0J0RvY051bVNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHQvLyBcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyB9XVxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybUdlbmVyYXRvck5hdi5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUdlbmVyYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVHZW5lcmF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVDcmVhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUNyZWF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdBcHBDdHJsJywgWyduZ0FuaW1hdGUnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1HZW5DdHJsLmpzJywgWyd1aS5ib290c3RyYXAudGFicyddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcicsIFsnJHNjb3BlJywnRm9ybScgLCBmdW5jdGlvbigkc2NvcGUsIEZvcm0pe1xyXG5cclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24ocGFzc3dvcmQpe1xyXG5cdFx0XHRpZighcGFzc3dvcmQgfHwgcGFzc3dvcmQgPT09ICcnKXtcclxuXHRcdFx0XHRwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJzEyMycpe1xyXG5cdFx0XHRGb3JtLmNyZWF0ZSgkc2NvcGUudGVtcGxhdGUpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0YWxlcnQoJ2FkZCcpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZSA9IGRhdGE7XHJcblx0XHRcdFx0XHRkZWxldGUgJHNjb3BlLnRlbXBsYXRlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZSBzb24nKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwYXNzd29yZCA9IHByb21wdCgncGFzc3dvcmQnKTtcclxuXHRcdFx0aWYocGFzc3dvcmQgPT09JzEyMycpe1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdEZvcm0uc2F2ZSgkc2NvcGUuY3JlYXRlKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc2F2ZScpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUudGVtcGxhdGUgPSAkc2NvcGUuY3JlYXRlO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN1Ym1pdChwYXNzd29yZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZihjb25maXJtKCdkZWxldGUgdGVtcGxhdGU/Jykpe1xyXG5cdFx0XHRcclxuXHRcdFx0XHRpZigkc2NvcGUuY3JlYXRlLl9pZCl7XHJcblx0XHRcdFx0XHRGb3JtLmRlbGV0ZSgkc2NvcGUuY3JlYXRlLl9pZClcclxuXHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YT0+e1xyXG5cdFx0XHRcdFx0XHRcdGFsZXJ0KCdyZW1vdmVkJyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcdGluaXRDcmVhdGUoKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2V0U2VsZWN0VGFiID0gZnVuY3Rpb24obil7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RUYWIgPSBuO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkSXRlbVJlY29yZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgJiYgJHNjb3BlLmlucHV0SXRlbVJlY29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XCJpZFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjokc2NvcGUuaW5wdXRJdGVtUmVjb3JkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9PT0gJ3NlbGVjdCcpe1xyXG5cdFx0XHRcdFx0dmFyIGhvbGRlciA9ICRzY29wZS5zZWxlY3RPcHRpb25zO1xyXG5cdFx0XHRcdFx0aG9sZGVyID0gaG9sZGVyLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPGhvbGRlci5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aG9sZGVyW2ldID0gaG9sZGVyW2ldLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGhvbGRlciA9IEFycmF5LmZyb20obmV3IFNldChob2xkZXIpKTtcclxuXHRcdFx0XHRcdGl0ZW1bJ3NlbGVjdCddID0geyduYW1lJzonJ307XHJcblx0XHRcdFx0XHRpdGVtLnNlbGVjdFsnb3B0aW9ucyddID0gaG9sZGVyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQucHVzaChpdGVtKTtcclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBpZigkc2NvcGUuaW5wdXRTdGVwRGVzICYmICRzY29wZS5pbnB1dFN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwcyl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgc3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwidHlwZVwiOiAkc2NvcGUuaW5wdXRTdGVwVHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLmlucHV0U3RlcERlcyB8fCAnJ1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcy5wdXNoKHN0ZXApO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRTdGVwRGVzID0gJyc7XHJcblx0XHRcdC8vIH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN1YlN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgJiYgJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICE9PSAnJyl7XHJcblx0XHRcdFx0bGV0IHN0ZXBJbmRleCA9ICRzY29wZS50ZW1wU3ViLnNlbGVjdFN0ZXBGb3JTdWJTdGVwO1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdD1bXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRsZXQgc3ViU3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3ViX3N0ZXBcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6ICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlc1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QucHVzaChzdWJTdGVwKTtcclxuXHRcdFx0XHQkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViT3B0aW9uID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHN0ZXAgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zZWxlY3RTdWJGb3JPcHRpb24uc3BsaXQoJywnKVswXTtcclxuXHRcdFx0bGV0IHN1YiA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzFdO1xyXG5cdFx0XHRsZXQgc2VsZWN0T3B0aW9uID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5zZWxlY3RTdWJPcHRpb247XHJcblx0XHRcdGxldCBvcHRpb25zID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24uaW5wdXQuc3BsaXQoJywnKTtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8IG9wdGlvbnMubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0b3B0aW9uc1tpXSA9IG9wdGlvbnNbaV0udHJpbSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQob3B0aW9ucykpO1xyXG5cdFx0XHRsZXQgc3ViU3RlcE9wdGlvbiA9IHtcclxuXHRcdFx0XHRcdFwidHlwZVwiOiBzZWxlY3RPcHRpb24sXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSxcclxuXHRcdFx0XHRcdFwib3B0aW9uc1wiOiBvcHRpb25zXHJcblx0XHRcdH07XHJcblx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zKXtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zPVtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMucHVzaChzdWJTdGVwT3B0aW9uKTtcclxuXHRcdFx0Ly8kc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXVtzZWxlY3RPcHRpb25dID0gc3ViU3RlcE9wdGlvbjtcclxuXHRcdFx0JHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSA9ICcnO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dCA9ICcnO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLm1vZGlmeUlEID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlKXtcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8b2JqZWN0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKHR5cGUgPT09J2l0ZW1SZWNvcmQnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5pZCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0nc3RlcHMnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5zdGVwID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdWJfc3RlcCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN1Yl9zdGVwID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdE9wdGlvbiA9IGZ1bmN0aW9uKGFkZHJlc3MsIGlucHV0KXtcclxuICAgICAgY29uc29sZS5sb2codHlwZW9mIGlucHV0KTtcclxuICAgICAgY29uc29sZS5sb2coaW5wdXQpO1xyXG5cdFx0XHRpZihhZGRyZXNzKXtcclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHQgIGlucHV0ID0gaW5wdXQuc3BsaXQoJywnKTtcclxuICAgICAgICB9XHJcblx0XHRcdFx0Zm9yKGxldCBpPTA7aTxpbnB1dC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGFkZHJlc3Mub3B0aW9uc1tpXSA9IGlucHV0W2ldLnRyaW0oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YWRkcmVzcy5vcHRpb25zID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkZHJlc3Mub3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuICAgICRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcbiAgICAgICAgICBpZigkc2NvcGUuZm9ybUlkKXtcclxuICAgICAgICAgICAgRm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5mb3JtcyA9IGRhdGE7ICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvLyAvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNyZWF0ZT0gZGF0YTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cdFx0dmFyIGluaXRDcmVhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3JlYXRlID0ge307XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuaXNQdWJsaXNoID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuICAgIHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICBGb3JtLmdldEZvcm1MaXN0KClcclxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpbml0Q3JlYXRlKCk7XHJcbiAgICAgIGxvYWRGb3JtTGlzdCgpO1xyXG5cdFx0XHJcblx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID0gJ3RleHQnO1xyXG5cdFx0XHQkc2NvcGUuanNvblZpZXcgPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnTWFpbkN0cmwnLCBbXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLnRhZ2xpbmUgPSAndG8gdGhlIG1vb24gYW5kIGJhY2shJztcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdTZWFyY2hUcmF2ZWxlckN0cmwnLCBbJ2NoYXJ0LmpzJ10pXHJcblxyXG5cdC5jb250cm9sbGVyKCdTZWFyY2hUcmF2ZWxlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdUcmF2ZWxlcicsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIpe1xyXG5cclxuXHRcdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudElucHV0ID0gJHNjb3BlLnNlYXJjaElucHV0O1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSB0cnVlO1xyXG5cdFx0XHRpZigkc2NvcGUuc2VhcmNoSW5wdXQpe1xyXG5cdFx0XHRcdGlmKCRzY29wZS5zZWFyY2hPcHRpb24gPT09J3NuJyl7XHJcblx0XHRcdFx0XHRsZXQgc24gPSAkc2NvcGUuc2VhcmNoSW5wdXQudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFRyYXZlbGVyLnNlYXJjaExpa2Uoc24pXHJcblxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHRcdFx0ZmluZFN0YXRpc3RpY3MoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyBzZWFyY2ggZG9jIG51bVxyXG5cdFx0XHRcdFx0VHJhdmVsZXIubm9ybWFsU2VhcmNoKCRzY29wZS5zZWFyY2hPcHRpb24sICRzY29wZS5zZWFyY2hJbnB1dClcclxuXHRcdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHRcdFx0ZmluZFN0YXRpc3RpY3MoKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdFRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBmb3JtSWQpe1xyXG5cdFx0XHR3aW5kb3cub3BlbigndHJhdmVsZXI/X2lkPScrX2lkKycmZm9ybUlkPScrZm9ybUlkLCAnX2JsYW5rJyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZW1vdmVUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgaW5kZXgpe1xyXG5cdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcihfaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnJlc3VsdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZmluZFN0YXRpc3RpY3MgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuc3RhdCA9IHt9XHJcblx0XHRcdCRzY29wZS5waWVMYWJlbHMxPVtdO1xyXG5cdFx0XHQkc2NvcGUucGllRGF0YTEgPSBbXTtcclxuXHRcdFx0bGV0IGRhdGEgPSAkc2NvcGUucmVzdWx0O1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxkYXRhLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKGRhdGFbaV0uc3RhdHVzIGluICRzY29wZS5zdGF0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSArPTE7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkc2NvcGUucGllTGFiZWxzMS5wdXNoKGRhdGFbaV0uc3RhdHVzKTtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0W2RhdGFbaV0uc3RhdHVzXSA9MTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnN0YXQudG90YWwgPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0bGV0IHJlamVjdCA9IDA7XHJcblxyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHRvdGFsIGNvbXBsYXRlZCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoJHNjb3BlLnN0YXQuUkVKRUNUKXtcclxuXHRcdFx0XHRyZWplY3QgPSAkc2NvcGUuc3RhdC5SRUpFQ1Q7XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnN0YXQucGVjQ29tcGxldGUgPSAoKCRzY29wZS5zdGF0LkNPTVBMRVRFRCkrKHJlamVjdCkpLyhkYXRhLmxlbmd0aCkqMTAwO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY2FsdWxhdGUgcGVyY2VudCBvZiByZWplY3Qgb3V0IG9mIHRvdGFsXHJcblx0XHRcdGlmKCgkc2NvcGUuc3RhdC5SRUpFQ1QpLyhkYXRhLmxlbmd0aCkqMTAwKXtcclxuXHRcdFx0XHQkc2NvcGUuc3RhdC5wZWNSZWplY3QgPSAoJHNjb3BlLnN0YXQuUkVKRUNUKS8oZGF0YS5sZW5ndGgpKjEwMDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN0YXQucGVjUmVqZWN0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Zm9yKGxldCBpPTA7aTwkc2NvcGUucGllTGFiZWxzMS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHQkc2NvcGUucGllRGF0YTEucHVzaCgkc2NvcGUuc3RhdFskc2NvcGUucGllTGFiZWxzMVtpXV0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkc2NvcGUucGllTGFiZWxzMiA9IFsnRmluaXNoJywgJ0hvbGQnXTtcclxuXHRcdFx0JHNjb3BlLnBpZURhdGEyID0gWyRzY29wZS5zdGF0LkNPTVBMRVRFRCtyZWplY3QsICgkc2NvcGUuc3RhdC50b3RhbC0oJHNjb3BlLnN0YXQuQ09NUExFVEVEK3JlamVjdCkpXTtcclxuXHRcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuc2VhcmNoT3B0aW9uID0gJ2RvY051bSc7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0bWFpbigpO1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJDdHJsJywgW10pXHJcblx0XHJcblx0LmZpbHRlcigndW5pcXVlJywgZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBrZXluYW1lKXtcclxuXHRcdFx0dmFyIG91dHB1dCA9IFtdLFxyXG5cdFx0XHRcdGtleXMgICA9IFtdO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0XHRcdHZhciBrZXkgPSBpdGVtW2tleW5hbWVdO1xyXG5cdFx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSl7XHJcblx0XHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvdXRwdXQ7XHJcblx0XHR9O1xyXG5cdH0pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ1RyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnVHJhdmVsZXInLCAnRm9ybScsICdEb2NOdW0nLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSwgRG9jTnVtLCAkc3RhdGVQYXJhbXMpe1xyXG5cclxuXHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgIT09ICdPUEVOJyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdQQU5ESU5HIEZPUiBSRVZJRVcnO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0aWYoJHNjb3BlLmZvcm1JZCl7XHJcblx0XHRcdFx0Rm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1x0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG5cdFx0XHRcdFx0XHQkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0Ly8gaW5pdCB0aGUgdHJhdmVsZXJEYXRhIGZyb20gZm9ybURhdGFcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObyA9IGRhdGEuZm9ybU5vO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KGRhdGEuX2lkKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZURvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSA9ICRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFskc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdF07XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXh0U3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBvYmplY3QgPSAkc2NvcGUuZm9ybXMuc3RlcHNbJHNjb3BlLmN1cnJlbnRTdGVwLTFdO1xyXG5cdFx0XHRpZihvYmplY3QubGlzdC5sZW5ndGggPj0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwKzEpe1xyXG5cdFx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCArPSAxO1x0XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCArPSAxO1xyXG5cdFx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmN1cnJlbnRTdGVwID4gJHNjb3BlLmxhc3RTdGVwKXtcclxuXHRcdFx0XHRcdC8vIFRyYXZlbGVyLnNldFJldmlld0RhdGEoJHNjb3BlLnRyYXZlbGVyRGF0YSk7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gdHJ1ZTtcdFx0XHJcblx0XHRcdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSBwYWdlO1xyXG5cdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdC8vICRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNTdWJQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IHBhZ2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkKXtcclxuXHRcdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0VHJhdmVsZXIuc2F2ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN1Ym1pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZXZpZXcgPSBmdW5jdGlvbihvcHRpb24pe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0J5KXtcclxuXHRcdFx0aWYob3B0aW9uID09PSAncmVqZWN0Jyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUkVKRUNUJztcclxuXHRcdFx0fWVsc2UgaWYob3B0aW9uID09PSAnY29tcGxldGUnKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdDT01QTEVURUQnO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3QXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgcmV2aWV3ZXIgbmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudXNlcm5hbWUgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zbil7XHJcblx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jb21wbGV0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRzZXROdW1Eb2N0b1RyYXZlbGVyKCk7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWRCeSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZUF0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5jcmVhdGUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHJcblx0XHRcdFx0XHQvLyBpZiBzdWNjZXNzZnVsIGNyZWF0ZVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lIG9yIHNlcmlhbCBudW1iZXIgcGx6ICcpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0YWxlcnQoJ2RlbGV0ZSBjbGljaycpO1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZCl7XHJcblx0XHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hcHBlbmRTdWJTdGVwRWRpdEluZm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgdXNlcm5hbWUgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdGlmKHVzZXJuYW1lICE9PSAnJyl7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdGVwID0gJHNjb3BlLmN1cnJlbnRTdGVwO1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3ViU3RlcCA9ICRzY29wZS5jdXJyZW50U3ViU3RlcDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0QnkgPSB1c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0VGltZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZScpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1JZCA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkO1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybVJldiA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldjtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmZvcm1ObyA9ICRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpO1xyXG5cdFx0XHRzZXREb2NOdW1MYWJlbCgnY3JlYXRlJyk7XHJcblx0XHRcdGRlbGV0ZSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpO1xyXG5cdFx0XHREb2NOdW0uY3JlYXRlKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSlcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGxvYWREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXREb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpO1xyXG5cdFx0XHRzZXREb2NOdW1MYWJlbCgnZWRpdCcpO1xyXG5cdFx0XHREb2NOdW0uZWRpdERvY051bURhdGEoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc2V0TnVtRG9jdG9UcmF2ZWxlciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZCA9IHtcclxuXHRcdFx0XHRcdFwiZG9jTnVtSWRcIjogJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCxcclxuXHRcdFx0XHRcdFwiZG9jTnVtXCIgIDogJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLmRvY051bVxyXG5cdFx0XHRcdH07XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXREb2NOdW1MYWJlbCA9IGZ1bmN0aW9uKGFjdGlvbil7XHJcblxyXG5cdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRpZihhY3Rpb24gPT09ICdjcmVhdGUnKXtcclxuXHRcdFx0XHRmb3IobGV0IGk9MDsgaTwkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRpZigkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uZG9jTnVtID09PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtKXtcclxuXHRcdFx0XHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGFjdGlvbiA9PT0gJ2VkaXQnKXtcclxuXHRcdFx0XHRmb3IobGV0IGk9MDsgaTwkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRpZigkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3RbaV0uZG9jTnVtID09PSAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtICYmXHJcblx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5faWQgIT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQpe1xyXG5cdFx0XHRcdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEubGFiZWwgPSBjb3VudDtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR2YXIgcmVzZXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmZvcm1JZCA9ICcnO1xyXG5cdFx0XHQkc2NvcGUuaXNOZXcgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9hZERvY051bUxpc3QgPSBmdW5jdGlvbihpZCl7XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KGlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0ID0gZGF0YTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gbG9hZCBpbmZvcm1hdGlvbiBmb3IgSXRlbVJlY29yZCB3aXRoIFxyXG5cdFx0Ly8gZG9jTnVtLiBcclxuXHRcdHZhciBsb2FkSXRlbVJlY29yZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFxyXG5cdFx0XHREb2NOdW0uZ2V0RG9jTnVtTGlzdCgkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdGZvcihsZXQgaT0wOyBpPGRhdGEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGFbaV0uX2lkID09PSAkc2NvcGUudHJhdmVsZXJEYXRhLml0ZW1SZWNvcmQuZG9jTnVtSWQpe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSA9IGRhdGFbaV07XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3QgPSBpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHQkc2NvcGUudG9wQ29sbGFwc2U9ZmFsc2U7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdGxvYWRGb3JtTGlzdCgpO1xyXG5cdFx0XHQkc2NvcGUudXNlcm5hbWUgPSAnSm9obiBTbm93JztcclxuXHRcdFx0JHNjb3BlLmRvY051bSA9IHt9O1xyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLmZvcm1JZCl7XHJcblx0XHRcdFx0JHNjb3BlLmZvcm1JZCA9ICRzdGF0ZVBhcmFtcy5mb3JtSWQ7XHJcblx0XHRcdFx0JHNjb3BlLnVwZGF0ZUZvcm0oKTtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbG9hZCB0aGUgdHJhdmVsZXIgZnJvbSBTZWFyY2ggcGFnZVxyXG5cdFx0XHQvLyB0YWtlIHRoZSBwcmFtYXMgZnJvbSBVUkxcclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gc3RhcnRXYXRjaCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRG9jTnVtU2VydmljZScsIFtdKVxyXG5cdFxyXG5cdC5mYWN0b3J5KCdEb2NOdW0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldERvY051bUxpc3Q6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zLycrZm9ybUlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9kb2NOdW1zLycsZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVkaXREb2NOdW1EYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2RvY051bXMvJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERvY051bTogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2Qgc2VydmljZScpO1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZG9jTnVtcy9zZWFyY2hTaW5nbGU/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtU2VydmljZScsIFtdKVxyXG5cclxuXHQuZmFjdG9yeSgnRm9ybScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZm9ybXMnLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldEFsbDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0Rm9ybUxpc3Q6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9mb3JtTGlzdCcpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvc2VhcmNoLycrZm9ybUlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGU6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9mb3Jtcy8nK2Zvcm1JZCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJTZXJ2aWNlJywgW10pXHJcbiAgICAgICBcclxuICAgIC5mYWN0b3J5KCdUcmF2ZWxlcicsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gICAgICAgIHZhciByZXZpZXdEYXRhID0ge307XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcblx0XHJcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgd29yayB3aGVuIG1vcmUgQVBJIHJvdXRlcyBhcmUgZGVmaW5lZCBvbiB0aGUgTm9kZSBzaWRlIG9mIHRoaW5nc1xyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIFBPU1QgYW5kIGNyZWF0ZSBhIG5ldyBmb3JtXHJcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oZm9ybURhdGEpe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3RyYXZlbGVyJywgZm9ybURhdGEpO1xyXG4gICAgICAgICAgICB9LCBcclxuXHJcbiAgICAgICAgICAgIGdldFJldmlld0RhdGE6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV2aWV3RGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oX2lkKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXI/X2lkPScrIF9pZCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdHJhdmVsZXInLCBkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFJldmlld0RhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV2aWV3RGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZWFyY2hMaWtlOiBmdW5jdGlvbihzbil7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9zZWFyY2hMaWtlLycrIHNuKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBERUxFVEUgYSBmb3JtXHJcbiAgICAgICAgICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbihfaWQsIGlucHV0KXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKF9pZCk7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS90cmF2ZWxlci8nKyBfaWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub3JtYWxTZWFyY2g6IGZ1bmN0aW9uKHR5cGUsIGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlci9ub3JtYWxTZWFyY2g/dHlwZT0nK3R5cGUrJyZkYXRhPScrZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
