'use strict';

angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'appRoutes', 'dndLists', 'AppCtrl', 'MainCtrl', 'TravelerCtrl', 'SearchTravelerCtrl', 'FormGenCtrl.js', 'TravelerService', 'FormService']);
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

angular.module('FormGenCtrl.js', ['ui.bootstrap.tabs']).controller('FormGeneratorController', ['$scope', 'Form', function ($scope, Form) {

	$scope.submit = function (password) {
		if (!password || password === '') {
			var password = prompt('password');
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
		if (address) {
			address.options = [];
			input = input.split(',');
			for (var i = 0; i < input.length; i++) {
				address.options[i] = input[i].trim();
			}
			address.options = Array.from(new Set(address.options));
		}
	};

	var initCreate = function initCreate() {
		$scope.create = {
			"isPublish": false,
			"formNo": "RF-750-010-327",
			"formRev": "10",
			"customer": "CHECK POINT",
			"itemRecord": [{
				"id": 1,
				"Description": "SW VER"
			}, {
				"id": 2,
				"Description": "SO#"
			}, {
				"id": 3,
				"Description": "MAC#"
			}, {
				"id": 4,
				"Description": "Product Model",
				"select": {
					"name": "",
					"options": ["POWER", "VSX", "CONNECTRA", "DLP"]
				}
			}],
			"steps": [{
				"step": 1,
				"type": "IQC",
				"Description": "Initial Visual Inspection",
				"list": [{
					"sub_step": 1,
					"Description": "Outer Box",
					"options": [{
						"type": "checkbox",
						"name": "123",
						"options": ["12", "3", "123"]
					}, {
						"type": "select",
						"name": "12312123",
						"options": [".3.123.1.23.123.", "1", "23", "123", "12", "31", "2"]
					}, {
						"type": "radio",
						"name": "231s",
						"options": ["sad", "f", "as", "fa", "sf", "e", "ae", "wef", "aef"]
					}, {
						"type": "checkbox",
						"name": "gewg",
						"options": ["g", "d", "ga", "dg", "as", "asd", "sdg", ""]
					}]
				}, {
					"sub_step": 2,
					"Description": "Inner Carton and Form"
				}]
			}, {
				"step": 2,
				"type": "IQC",
				"Description": "Packaging Check",
				"list": [{
					"sub_step": 1,
					"Description": "Appliance Sn matched with Box SN"
				}]
			}]
		};
		$scope.create.isPublish = false;
	};

	var main = function main() {

		initCreate();

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

angular.module('SearchTravelerCtrl', []).controller('SearchTravelerController', ['$scope', 'Traveler', function ($scope, Traveler) {

	$scope.isSearch = false;

	$scope.search = function () {
		$scope.currentInput = $scope.searchInput;
		$scope.isSearch = true;
		if ($scope.searchInput) {
			var sn = $scope.searchInput.toString();
			Traveler.searchLike(sn).success(function (data) {
				$scope.result = data;
			});
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
}]);
'use strict';

angular.module('TravelerCtrl', []).controller('TravelerController', ['$scope', 'Traveler', 'Form', '$stateParams', function ($scope, Traveler, Form, $stateParams) {

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
			});
		}
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
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = $scope.username;
			$scope.travelerData.createAt = new Date();
			Traveler.create($scope.travelerData)

			// if successful create
			.success(function (data) {
				console.log(data);
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

	// var appendSubStepEditInfo = function(){
	// 	alert(123123);
	// 	var username = document.getElementById('username').value;
	// 	if(username !== ''){
	// 		var currentStep = $scope.currentStep;
	// 		var currentSubStep = $scope.currentSubStep;
	// 		$scope.travelerData.step[currentStep][currentSubStep].editBy = username;
	// 		$scope.travelerData.step[currentStep][currentSubStep].editTime = new Date();
	// 		return true;
	// 	}
	// 	alert('enter your name');
	// 	return false;
	// };

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

	// var startWatch = function(){
	// 	$scope.$watch(
	// 		'travelerData.step',
	// 		function(newValue, oldValue){
	// 			if(!$scope.isNew){
	// 				$scope.isNew = true;
	// 			}else{
	// 				// console.log($scope.currentStep + ';'+$scope.currentSubStep+'changed');
	// 				appendSubStepEditInfo();
	// 			}
	// 		}, true
	// 	);
	// };

	var main = function main() {
		reset();
		loadFormList();
		$scope.username = 'John Snow';

		if ($stateParams.formId) {
			$scope.formId = $stateParams.formId;
			$scope.updateForm();
			$scope.isNew = false;
		}

		if ($stateParams._id) {
			$scope.isNew = false;
			Traveler.get($stateParams._id).success(function (data) {
				// data is a array. result could be more than one
				// need to deal wit this.
				$scope.travelerData = data;
			});
		}
		// startWatch();
	};

	main();
}]);
'use strict';

angular.module('FormService', []).factory('Form', ['$http', function ($http) {

	return {

		create: function create(data) {
			return $http.post('/api/forms', data);
		},

		getFormList: function getFormList() {
			return $http.get('/api/forms/');
		},

		get: function get(formId) {
			return $http.get('/api/forms/' + formId);
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
            console.log(_id);
            return $http.delete('/api/traveler/' + _id);
        }
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFJQyxVQUpELEVBTUMsU0FORCxFQU9DLFVBUEQsRUFRQyxjQVJELEVBU0Msb0JBVEQsRUFVQyxnQkFWRCxFQVlDLGlCQVpELEVBYUMsYUFiRCxDQUREOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsV0FBRCxDQUE1QixFQUNFLE1BREYsQ0FDUyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUF5QyxtQkFBekMsRUFDUCxVQUFTLGNBQVQsRUFBeUIsa0JBQXpCLEVBQTZDLGlCQUE3QyxFQUErRDs7QUFFL0Qsb0JBQW1CLFNBQW5CLENBQTZCLE9BQTdCOzs7QUFHQTs7O0FBQUEsRUFHRSxLQUhGLENBR1EsTUFIUixFQUdnQjtBQUNkLE9BQUssT0FEUztBQUVkLGVBQWEsaUJBRkM7QUFHZCxjQUFZO0FBSEUsRUFIaEIsRUFVRSxLQVZGLENBVVEsVUFWUixFQVVvQjtBQUNsQixPQUFLLHNCQURhO0FBRWxCLFNBQU07QUFDTCxPQUFHO0FBQ0YsaUJBQWEscUJBRFg7QUFFRixnQkFBWTtBQUZWLElBREU7QUFLTCwwQkFBc0I7QUFDckIsaUJBQWE7QUFEUTtBQUxqQjtBQUZZLEVBVnBCOzs7Ozs7OztBQStCRSxNQS9CRixDQStCUSxnQkEvQlIsRUErQnlCO0FBQ3ZCLE9BQUssaUJBRGtCO0FBRXZCLGVBQWEsMkJBRlU7QUFHdkIsY0FBWTtBQUhXLEVBL0J6QixFQXFDRSxLQXJDRixDQXFDUSxlQXJDUixFQXFDd0I7QUFDdEIsT0FBSyxnQkFEaUI7QUFFdEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSw2QkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLHNDQUFrQztBQUNqQyxpQkFBYSw4QkFEb0I7QUFFakMsZ0JBQVk7QUFGcUIsSUFMN0I7QUFTTCxvQ0FBZ0M7QUFDL0IsaUJBQWEsNEJBRGtCO0FBRS9CLGdCQUFZO0FBRm1CO0FBVDNCO0FBRmdCLEVBckN4Qjs7QUF1REEsbUJBQWtCLFNBQWxCLENBQTRCLElBQTVCO0FBQ0QsQ0E5RFEsQ0FEVDs7O0FDQUEsUUFBUSxNQUFSLENBQWUsU0FBZixFQUEwQixDQUFDLFdBQUQsQ0FBMUIsRUFFRSxVQUZGLENBRWEsZUFGYixFQUU4QixDQUFDLFFBQUQsRUFBVyxVQUFTLE1BQVQsRUFBZ0I7O0FBRXZELFFBQU8sV0FBUCxHQUFxQixJQUFyQjtBQUNELENBSDZCLENBRjlCOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxnQkFBZixFQUFpQyxDQUFDLG1CQUFELENBQWpDLEVBRUUsVUFGRixDQUVhLHlCQUZiLEVBRXdDLENBQUMsUUFBRCxFQUFVLE1BQVYsRUFBbUIsVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXNCOztBQUcvRSxRQUFPLE1BQVAsR0FBZ0IsVUFBUyxRQUFULEVBQWtCO0FBQ2pDLE1BQUcsQ0FBQyxRQUFELElBQWEsYUFBYSxFQUE3QixFQUFnQztBQUMvQixPQUFJLFdBQVcsT0FBTyxVQUFQLENBQWY7QUFDQTtBQUNELE1BQUcsYUFBYSxLQUFoQixFQUFzQjtBQUN0QixRQUFLLE1BQUwsQ0FBWSxPQUFPLFFBQW5CLEVBQ0UsT0FERixDQUNVLGdCQUFPOztBQUVmLFVBQU0sS0FBTjtBQUNBLFdBQU8sTUFBUCxHQUFnQixJQUFoQjtBQUNBLFdBQU8sT0FBTyxRQUFkO0FBQ0EsSUFORjtBQU9DLEdBUkQsTUFRSztBQUNKLFNBQU0sYUFBTjtBQUNBO0FBQ0QsRUFmRDs7QUFpQkEsUUFBTyxJQUFQLEdBQWMsWUFBVTtBQUN2QixNQUFJLFdBQVcsT0FBTyxVQUFQLENBQWY7QUFDQSxNQUFHLGFBQVksS0FBZixFQUFxQjtBQUNwQixPQUFHLE9BQU8sTUFBUCxDQUFjLEdBQWpCLEVBQXFCO0FBQ3BCLFNBQUssSUFBTCxDQUFVLE9BQU8sTUFBakIsRUFDQyxPQURELENBQ1MsZ0JBQU07QUFDZCxXQUFNLE1BQU47QUFDQSxLQUhEO0FBSUEsSUFMRCxNQUtLO0FBQ0osV0FBTyxRQUFQLEdBQWtCLE9BQU8sTUFBekI7QUFDQSxXQUFPLE1BQVAsQ0FBYyxRQUFkO0FBQ0E7QUFDRCxHQVZELE1BVUs7QUFDSixTQUFNLFNBQU47QUFDQTtBQUNELEVBZkQ7O0FBaUJBLFFBQU8sTUFBUCxHQUFnQixZQUFVO0FBQ3pCLE1BQUcsUUFBUSxrQkFBUixDQUFILEVBQStCOztBQUU5QixPQUFHLE9BQU8sTUFBUCxDQUFjLEdBQWpCLEVBQXFCO0FBQ3BCLFNBQUssTUFBTCxDQUFZLE9BQU8sTUFBUCxDQUFjLEdBQTFCLEVBQ0UsT0FERixDQUNVLGdCQUFNO0FBQ2QsV0FBTSxTQUFOO0FBQ0EsS0FIRjtBQUlBO0FBQ0E7QUFFRDtBQUNELEVBWkQ7O0FBY0EsUUFBTyxZQUFQLEdBQXNCLFVBQVMsQ0FBVCxFQUFXO0FBQ2hDLFNBQU8sU0FBUCxHQUFtQixDQUFuQjtBQUNBLEVBRkQ7O0FBSUEsUUFBTyxhQUFQLEdBQXVCLFlBQVU7QUFDaEMsTUFBRyxPQUFPLGVBQVAsSUFBMEIsT0FBTyxlQUFQLEtBQTJCLEVBQXhELEVBQTJEO0FBQzFELE9BQUcsQ0FBQyxPQUFPLE1BQVAsQ0FBYyxVQUFsQixFQUE2QjtBQUM1QixXQUFPLE1BQVAsQ0FBYyxVQUFkLEdBQTJCLEVBQTNCO0FBQ0E7QUFDRCxPQUFJLE1BQU0sT0FBTyxNQUFQLENBQWMsVUFBZCxDQUF5QixNQUFuQztBQUNBLE9BQUksT0FBTztBQUNWLFVBQU0sTUFBSSxDQURBO0FBRVYsbUJBQWMsT0FBTztBQUZYLElBQVg7QUFJQSxPQUFHLE9BQU8sbUJBQVAsS0FBK0IsUUFBbEMsRUFBMkM7QUFDMUMsUUFBSSxTQUFTLE9BQU8sYUFBcEI7QUFDQSxhQUFTLE9BQU8sS0FBUCxDQUFhLEdBQWIsQ0FBVDtBQUNBLFNBQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFFLE9BQU8sTUFBeEIsRUFBK0IsR0FBL0IsRUFBbUM7QUFDbEMsWUFBTyxDQUFQLElBQVksT0FBTyxDQUFQLEVBQVUsSUFBVixFQUFaO0FBQ0E7QUFDRCxhQUFTLE1BQU0sSUFBTixDQUFXLElBQUksR0FBSixDQUFRLE1BQVIsQ0FBWCxDQUFUO0FBQ0EsU0FBSyxRQUFMLElBQWlCLEVBQUMsUUFBTyxFQUFSLEVBQWpCO0FBQ0EsU0FBSyxNQUFMLENBQVksU0FBWixJQUF5QixNQUF6QjtBQUNBO0FBQ0QsVUFBTyxNQUFQLENBQWMsVUFBZCxDQUF5QixJQUF6QixDQUE4QixJQUE5QjtBQUNBLFVBQU8sZUFBUCxHQUF5QixFQUF6QjtBQUNBO0FBQ0QsRUF2QkQ7O0FBeUJBLFFBQU8sT0FBUCxHQUFpQixZQUFVOztBQUV6QixNQUFHLENBQUMsT0FBTyxNQUFQLENBQWMsS0FBbEIsRUFBd0I7QUFDdkIsVUFBTyxNQUFQLENBQWMsS0FBZCxHQUFzQixFQUF0QjtBQUNBO0FBQ0QsTUFBSSxNQUFNLE9BQU8sTUFBUCxDQUFjLEtBQWQsQ0FBb0IsTUFBOUI7QUFDQSxNQUFJLE9BQU87QUFDVixXQUFRLE1BQUksQ0FERjtBQUVWLFdBQVEsT0FBTyxhQUFQLElBQXdCLEVBRnRCO0FBR1Ysa0JBQWUsT0FBTyxZQUFQLElBQXVCO0FBSDVCLEdBQVg7QUFLQSxTQUFPLE1BQVAsQ0FBYyxLQUFkLENBQW9CLElBQXBCLENBQXlCLElBQXpCOztBQUVBLFNBQU8sWUFBUCxHQUFzQixFQUF0Qjs7QUFFRCxFQWZEOztBQWlCQSxRQUFPLFVBQVAsR0FBb0IsWUFBVTtBQUM3QixNQUFHLE9BQU8sT0FBUCxDQUFlLGVBQWYsSUFBa0MsT0FBTyxPQUFQLENBQWUsZUFBZixLQUFtQyxFQUF4RSxFQUEyRTtBQUMxRSxPQUFJLFlBQVksT0FBTyxPQUFQLENBQWUsb0JBQS9CO0FBQ0EsT0FBRyxDQUFDLE9BQU8sTUFBUCxDQUFjLEtBQWQsQ0FBb0IsU0FBcEIsRUFBK0IsSUFBbkMsRUFBd0M7QUFDdkMsV0FBTyxNQUFQLENBQWMsS0FBZCxDQUFvQixTQUFwQixFQUErQixJQUEvQixHQUFvQyxFQUFwQztBQUNBO0FBQ0QsT0FBSSxNQUFNLE9BQU8sTUFBUCxDQUFjLEtBQWQsQ0FBb0IsU0FBcEIsRUFBK0IsSUFBL0IsQ0FBb0MsTUFBOUM7QUFDQSxPQUFJLFVBQVU7QUFDYixnQkFBWSxNQUFJLENBREg7QUFFYixtQkFBZSxPQUFPLE9BQVAsQ0FBZTtBQUZqQixJQUFkO0FBSUEsVUFBTyxNQUFQLENBQWMsS0FBZCxDQUFvQixTQUFwQixFQUErQixJQUEvQixDQUFvQyxJQUFwQyxDQUF5QyxPQUF6QztBQUNBLFVBQU8sT0FBUCxDQUFlLGVBQWYsR0FBaUMsRUFBakM7QUFDQTtBQUNELEVBZEQ7O0FBZ0JBLFFBQU8sWUFBUCxHQUFzQixZQUFVO0FBQy9CLE1BQUksT0FBTyxPQUFPLGFBQVAsQ0FBcUIsa0JBQXJCLENBQXdDLEtBQXhDLENBQThDLEdBQTlDLEVBQW1ELENBQW5ELENBQVg7QUFDQSxNQUFJLE1BQU0sT0FBTyxhQUFQLENBQXFCLGtCQUFyQixDQUF3QyxLQUF4QyxDQUE4QyxHQUE5QyxFQUFtRCxDQUFuRCxDQUFWO0FBQ0EsTUFBSSxlQUFlLE9BQU8sYUFBUCxDQUFxQixVQUFyQixDQUFnQyxlQUFuRDtBQUNBLE1BQUksVUFBVSxPQUFPLGFBQVAsQ0FBcUIsVUFBckIsQ0FBZ0MsTUFBaEMsQ0FBdUMsS0FBdkMsQ0FBNkMsS0FBN0MsQ0FBbUQsR0FBbkQsQ0FBZDtBQUNBLE9BQUksSUFBSSxJQUFFLENBQVYsRUFBYSxJQUFHLFFBQVEsTUFBeEIsRUFBK0IsR0FBL0IsRUFBbUM7QUFDbEMsV0FBUSxDQUFSLElBQWEsUUFBUSxDQUFSLEVBQVcsSUFBWCxFQUFiO0FBQ0E7QUFDRCxZQUFVLE1BQU0sSUFBTixDQUFXLElBQUksR0FBSixDQUFRLE9BQVIsQ0FBWCxDQUFWO0FBQ0EsTUFBSSxnQkFBZ0I7QUFDbEIsV0FBUSxZQURVO0FBRWxCLFdBQVEsT0FBTyxhQUFQLENBQXFCLFVBQXJCLENBQWdDLE1BQWhDLENBQXVDLElBRjdCO0FBR2xCLGNBQVc7QUFITyxHQUFwQjtBQUtBLE1BQUcsQ0FBQyxPQUFPLE1BQVAsQ0FBYyxLQUFkLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQStCLEdBQS9CLEVBQW9DLE9BQXhDLEVBQWdEO0FBQy9DLFVBQU8sTUFBUCxDQUFjLEtBQWQsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBK0IsR0FBL0IsRUFBb0MsT0FBcEMsR0FBNEMsRUFBNUM7QUFDQTtBQUNELFNBQU8sTUFBUCxDQUFjLEtBQWQsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBK0IsR0FBL0IsRUFBb0MsT0FBcEMsQ0FBNEMsSUFBNUMsQ0FBaUQsYUFBakQ7O0FBRUEsU0FBTyxhQUFQLENBQXFCLFVBQXJCLENBQWdDLE1BQWhDLENBQXVDLElBQXZDLEdBQThDLEVBQTlDO0FBQ0EsU0FBTyxhQUFQLENBQXFCLFVBQXJCLENBQWdDLE1BQWhDLENBQXVDLEtBQXZDLEdBQStDLEVBQS9DO0FBQ0EsRUFyQkQ7O0FBdUJBLFFBQU8sUUFBUCxHQUFrQixVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdkMsT0FBSSxJQUFJLElBQUUsQ0FBVixFQUFhLElBQUUsT0FBTyxNQUF0QixFQUE2QixHQUE3QixFQUFpQztBQUNoQyxPQUFHLFNBQVEsWUFBWCxFQUF3QjtBQUN2QixXQUFPLENBQVAsRUFBVSxFQUFWLEdBQWUsSUFBRSxDQUFqQjtBQUNBO0FBQ0QsT0FBRyxTQUFRLE9BQVgsRUFBbUI7QUFDbEIsV0FBTyxDQUFQLEVBQVUsSUFBVixHQUFpQixJQUFFLENBQW5CO0FBQ0E7QUFDRCxPQUFHLFNBQVEsVUFBWCxFQUFzQjtBQUNyQixXQUFPLENBQVAsRUFBVSxRQUFWLEdBQXFCLElBQUUsQ0FBdkI7QUFDQTtBQUNEO0FBQ0QsRUFaRDs7QUFjQSxRQUFPLFVBQVAsR0FBb0IsVUFBUyxPQUFULEVBQWtCLEtBQWxCLEVBQXdCO0FBQzNDLE1BQUcsT0FBSCxFQUFXO0FBQ1YsV0FBUSxPQUFSLEdBQWtCLEVBQWxCO0FBQ0EsV0FBUSxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQVI7QUFDQSxRQUFJLElBQUksSUFBRSxDQUFWLEVBQVksSUFBRSxNQUFNLE1BQXBCLEVBQTJCLEdBQTNCLEVBQStCO0FBQzlCLFlBQVEsT0FBUixDQUFnQixDQUFoQixJQUFxQixNQUFNLENBQU4sRUFBUyxJQUFULEVBQXJCO0FBQ0E7QUFDRCxXQUFRLE9BQVIsR0FBa0IsTUFBTSxJQUFOLENBQVcsSUFBSSxHQUFKLENBQVEsUUFBUSxPQUFoQixDQUFYLENBQWxCO0FBQ0E7QUFDRCxFQVREOztBQVlBLEtBQUksYUFBYSxTQUFiLFVBQWEsR0FBVTtBQUMxQixTQUFPLE1BQVAsR0FBZ0I7QUFDakIsZ0JBQWEsS0FESTtBQUVqQixhQUFVLGdCQUZPO0FBR2pCLGNBQVcsSUFITTtBQUlqQixlQUFZLGFBSks7QUFLakIsaUJBQWMsQ0FDWjtBQUNFLFVBQU0sQ0FEUjtBQUVFLG1CQUFlO0FBRmpCLElBRFksRUFLWjtBQUNFLFVBQU0sQ0FEUjtBQUVFLG1CQUFlO0FBRmpCLElBTFksRUFTWjtBQUNFLFVBQU0sQ0FEUjtBQUVFLG1CQUFlO0FBRmpCLElBVFksRUFhWjtBQUNFLFVBQU0sQ0FEUjtBQUVFLG1CQUFlLGVBRmpCO0FBR0UsY0FBVTtBQUNSLGFBQVEsRUFEQTtBQUVSLGdCQUFXLENBQ1QsT0FEUyxFQUVULEtBRlMsRUFHVCxXQUhTLEVBSVQsS0FKUztBQUZIO0FBSFosSUFiWSxDQUxHO0FBZ0NqQixZQUFTLENBQ1A7QUFDRSxZQUFRLENBRFY7QUFFRSxZQUFRLEtBRlY7QUFHRSxtQkFBZSwyQkFIakI7QUFJRSxZQUFRLENBQ047QUFDRSxpQkFBWSxDQURkO0FBRUUsb0JBQWUsV0FGakI7QUFHRSxnQkFBVyxDQUNUO0FBQ0UsY0FBUSxVQURWO0FBRUUsY0FBUSxLQUZWO0FBR0UsaUJBQVcsQ0FDVCxJQURTLEVBRVQsR0FGUyxFQUdULEtBSFM7QUFIYixNQURTLEVBVVQ7QUFDRSxjQUFRLFFBRFY7QUFFRSxjQUFRLFVBRlY7QUFHRSxpQkFBVyxDQUNULGtCQURTLEVBRVQsR0FGUyxFQUdULElBSFMsRUFJVCxLQUpTLEVBS1QsSUFMUyxFQU1ULElBTlMsRUFPVCxHQVBTO0FBSGIsTUFWUyxFQXVCVDtBQUNFLGNBQVEsT0FEVjtBQUVFLGNBQVEsTUFGVjtBQUdFLGlCQUFXLENBQ1QsS0FEUyxFQUVULEdBRlMsRUFHVCxJQUhTLEVBSVQsSUFKUyxFQUtULElBTFMsRUFNVCxHQU5TLEVBT1QsSUFQUyxFQVFULEtBUlMsRUFTVCxLQVRTO0FBSGIsTUF2QlMsRUFzQ1Q7QUFDRSxjQUFRLFVBRFY7QUFFRSxjQUFRLE1BRlY7QUFHRSxpQkFBVyxDQUNULEdBRFMsRUFFVCxHQUZTLEVBR1QsSUFIUyxFQUlULElBSlMsRUFLVCxJQUxTLEVBTVQsS0FOUyxFQU9ULEtBUFMsRUFRVCxFQVJTO0FBSGIsTUF0Q1M7QUFIYixLQURNLEVBMEROO0FBQ0UsaUJBQVksQ0FEZDtBQUVFLG9CQUFlO0FBRmpCLEtBMURNO0FBSlYsSUFETyxFQXFFUDtBQUNFLFlBQVEsQ0FEVjtBQUVFLFlBQVEsS0FGVjtBQUdFLG1CQUFlLGlCQUhqQjtBQUlFLFlBQVEsQ0FDTjtBQUNFLGlCQUFZLENBRGQ7QUFFRSxvQkFBZTtBQUZqQixLQURNO0FBSlYsSUFyRU87QUFoQ1EsR0FBaEI7QUFrSEEsU0FBTyxNQUFQLENBQWMsU0FBZCxHQUEwQixLQUExQjtBQUNBLEVBcEhEOztBQXNIQSxLQUFJLE9BQU8sU0FBUCxJQUFPLEdBQVU7O0FBRXBCOztBQUVBLFNBQU8sbUJBQVAsR0FBNkIsTUFBN0I7QUFDQSxTQUFPLFFBQVAsR0FBa0IsS0FBbEI7QUFDQSxFQU5EOztBQVFBO0FBQ0EsQ0FqU3NDLENBRnhDOzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxVQUFmLEVBQTJCLEVBQTNCLEVBRUUsVUFGRixDQUVhLGdCQUZiLEVBRStCLENBQUMsUUFBRCxFQUFXLFVBQVMsTUFBVCxFQUFnQjs7QUFFeEQsUUFBTyxPQUFQLEdBQWlCLHVCQUFqQjtBQUNELENBSDhCLENBRi9COzs7QUNBQSxRQUFRLE1BQVIsQ0FBZSxvQkFBZixFQUFxQyxFQUFyQyxFQUVFLFVBRkYsQ0FFYSwwQkFGYixFQUV5QyxDQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLFVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEwQjs7QUFFeEYsUUFBTyxRQUFQLEdBQWtCLEtBQWxCOztBQUVBLFFBQU8sTUFBUCxHQUFnQixZQUFVO0FBQ3pCLFNBQU8sWUFBUCxHQUFzQixPQUFPLFdBQTdCO0FBQ0EsU0FBTyxRQUFQLEdBQWtCLElBQWxCO0FBQ0EsTUFBRyxPQUFPLFdBQVYsRUFBc0I7QUFDckIsT0FBSSxLQUFLLE9BQU8sV0FBUCxDQUFtQixRQUFuQixFQUFUO0FBQ0EsWUFBUyxVQUFULENBQW9CLEVBQXBCLEVBRUUsT0FGRixDQUVXLGdCQUFPO0FBQ2hCLFdBQU8sTUFBUCxHQUFjLElBQWQ7QUFFQSxJQUxGO0FBTUE7QUFDRCxFQVpEOztBQWNBLFFBQU8sWUFBUCxHQUFzQixVQUFTLEdBQVQsRUFBYyxNQUFkLEVBQXFCO0FBQzFDLFNBQU8sSUFBUCxDQUFZLGtCQUFnQixHQUFoQixHQUFvQixVQUFwQixHQUErQixNQUEzQyxFQUFtRCxRQUFuRDtBQUNBLEVBRkQ7O0FBSUEsUUFBTyxjQUFQLEdBQXdCLFVBQVMsR0FBVCxFQUFjLEtBQWQsRUFBb0I7QUFDM0MsV0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQ0UsT0FERixDQUNXLGdCQUFROztBQUVqQixVQUFPLE1BQVAsQ0FBYyxNQUFkLENBQXFCLEtBQXJCLEVBQTRCLENBQTVCO0FBQ0EsR0FKRjtBQUtBLEVBTkQ7QUFPQSxDQTdCdUMsQ0FGekM7OztBQ0FBLFFBQVEsTUFBUixDQUFlLGNBQWYsRUFBK0IsRUFBL0IsRUFFRSxVQUZGLENBRWEsb0JBRmIsRUFFbUMsQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFzQixNQUF0QixFQUE2QixjQUE3QixFQUE2QyxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsSUFBM0IsRUFBaUMsWUFBakMsRUFBOEM7O0FBRTVILFFBQU8sZ0JBQVAsR0FBMEIsWUFBVTtBQUNuQyxNQUFHLE9BQU8sWUFBUCxDQUFvQixNQUFwQixJQUE4QixPQUFPLFlBQVAsQ0FBb0IsTUFBcEIsS0FBK0IsTUFBaEUsRUFBdUU7QUFDdEUsVUFBTyxZQUFQLENBQW9CLE1BQXBCLEdBQTZCLE1BQTdCO0FBQ0EsVUFBTyxZQUFQLENBQW9CLFdBQXBCLEdBQWtDLEtBQWxDO0FBQ0EsR0FIRCxNQUdLO0FBQ0osVUFBTyxZQUFQLENBQW9CLE1BQXBCLEdBQTZCLG9CQUE3QjtBQUNBLFVBQU8sWUFBUCxDQUFvQixXQUFwQixHQUFrQyxJQUFsQztBQUNBO0FBQ0QsRUFSRDs7QUFVQSxRQUFPLFVBQVAsR0FBb0IsWUFBVztBQUM5QixTQUFPLFlBQVAsR0FBc0IsRUFBdEI7QUFDQSxNQUFHLE9BQU8sTUFBVixFQUFpQjtBQUNoQixRQUFLLEdBQUwsQ0FBUyxPQUFPLE1BQWhCLEVBQ0UsT0FERixDQUNVLFVBQVMsSUFBVCxFQUFjO0FBQ3RCLFdBQU8sS0FBUCxHQUFlLElBQWY7O0FBRUEsV0FBTyxRQUFQLEdBQWtCLEtBQUssS0FBTCxDQUFXLE1BQTdCOztBQUVBLFdBQU8sWUFBUCxDQUFvQixNQUFwQixHQUE2QixLQUFLLEdBQWxDO0FBQ0EsV0FBTyxZQUFQLENBQW9CLE9BQXBCLEdBQThCLEtBQUssT0FBbkM7QUFDQSxXQUFPLFlBQVAsQ0FBb0IsTUFBcEIsR0FBNkIsS0FBSyxNQUFsQztBQUNBLFdBQU8sWUFBUCxDQUFvQixRQUFwQixHQUErQixLQUFLLFFBQXBDO0FBQ0EsV0FBTyxZQUFQLENBQW9CLE1BQXBCLEdBQTZCLE1BQTdCO0FBQ0EsSUFYRjtBQVlBO0FBQ0QsRUFoQkQ7O0FBa0JBLFFBQU8sUUFBUCxHQUFrQixZQUFVO0FBQzNCLE1BQUksU0FBUyxPQUFPLEtBQVAsQ0FBYSxLQUFiLENBQW1CLE9BQU8sV0FBUCxHQUFtQixDQUF0QyxDQUFiO0FBQ0EsTUFBRyxPQUFPLElBQVAsQ0FBWSxNQUFaLElBQXNCLE9BQU8sY0FBUCxHQUFzQixDQUEvQyxFQUFpRDtBQUNoRCxVQUFPLGNBQVAsSUFBeUIsQ0FBekI7QUFDQSxHQUZELE1BRUs7QUFDSixVQUFPLFdBQVAsSUFBc0IsQ0FBdEI7QUFDQSxVQUFPLGNBQVAsR0FBd0IsQ0FBeEI7QUFDQSxPQUFHLE9BQU8sV0FBUCxHQUFxQixPQUFPLFFBQS9CLEVBQXdDOzs7QUFHdkMsV0FBTyxnQkFBUDtBQUNBO0FBQ0Q7QUFDRCxFQWJEOztBQWVBLFFBQU8sVUFBUCxHQUFvQixVQUFTLElBQVQsRUFBYztBQUNqQyxTQUFPLGNBQVAsR0FBd0IsQ0FBeEI7QUFDQSxTQUFPLFdBQVAsR0FBcUIsSUFBckI7OztBQUdBLEVBTEQ7O0FBT0EsUUFBTyxhQUFQLEdBQXVCLFVBQVMsSUFBVCxFQUFjO0FBQ3BDLFNBQU8sY0FBUCxHQUF3QixJQUF4QjtBQUNBLEVBRkQ7O0FBSUEsUUFBTyxNQUFQLEdBQWdCLFlBQVU7QUFDekIsU0FBTyxXQUFQLEdBQXFCLENBQXJCO0FBQ0EsU0FBTyxjQUFQLEdBQXdCLENBQXhCOztBQUVBLFNBQU8sZ0JBQVA7QUFDQSxFQUxEOztBQU9BLFFBQU8sSUFBUCxHQUFjLFlBQVU7O0FBRXZCLE1BQUcsT0FBTyxZQUFQLENBQW9CLE9BQXZCLEVBQStCOztBQUU5QixZQUFTLElBQVQsQ0FBYyxPQUFPLFlBQXJCLEVBQ0UsT0FERixDQUNVLGdCQUFPOztBQUVmLElBSEY7QUFJQSxHQU5ELE1BTUs7QUFDSixXQUFPLE1BQVA7QUFDQTtBQUNELEVBWEQ7O0FBYUEsUUFBTyxNQUFQLEdBQWdCLFVBQVMsTUFBVCxFQUFnQjtBQUMvQixNQUFHLE9BQU8sWUFBUCxDQUFvQixRQUF2QixFQUFnQztBQUNoQyxPQUFHLFdBQVcsUUFBZCxFQUF1QjtBQUN0QixXQUFPLFlBQVAsQ0FBb0IsTUFBcEIsR0FBNkIsUUFBN0I7QUFDQSxJQUZELE1BRU0sSUFBRyxXQUFXLFVBQWQsRUFBeUI7QUFDOUIsV0FBTyxZQUFQLENBQW9CLE1BQXBCLEdBQTZCLFdBQTdCO0FBQ0E7QUFDRCxVQUFPLFlBQVAsQ0FBb0IsUUFBcEIsR0FBK0IsSUFBSSxJQUFKLEVBQS9CO0FBQ0EsVUFBTyxJQUFQO0FBQ0MsR0FSRCxNQVFLO0FBQ0osU0FBTSxxQkFBTjtBQUNBO0FBQ0QsRUFaRDs7QUFjQSxRQUFPLE1BQVAsR0FBZ0IsWUFBVTtBQUN6QixNQUFHLE9BQU8sUUFBUCxJQUFtQixPQUFPLFlBQVAsQ0FBb0IsRUFBMUMsRUFBNkM7O0FBRTVDLFVBQU8sWUFBUCxDQUFvQixPQUFwQixHQUE4QixJQUE5QjtBQUNBLFVBQU8sWUFBUCxDQUFvQixTQUFwQixHQUFnQyxPQUFPLFFBQXZDO0FBQ0EsVUFBTyxZQUFQLENBQW9CLFFBQXBCLEdBQStCLElBQUksSUFBSixFQUEvQjtBQUNBLFlBQVMsTUFBVCxDQUFnQixPQUFPLFlBQXZCOzs7QUFBQSxJQUdFLE9BSEYsQ0FHVyxnQkFBTztBQUNoQixZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsV0FBTyxZQUFQLEdBQXNCLElBQXRCO0FBQ0EsSUFORjtBQU9BLEdBWkQsTUFZSztBQUNKLFNBQU0sdUNBQU47QUFDQTtBQUNELEVBaEJEOztBQWtCQSxRQUFPLEdBQVAsR0FBYSxZQUFVO0FBQ3RCO0FBQ0EsRUFGRDs7QUFJQSxRQUFPLE1BQVAsR0FBZ0IsWUFBVTtBQUN6QixRQUFNLGNBQU47QUFDQSxNQUFHLE9BQU8sWUFBUCxDQUFvQixHQUF2QixFQUEyQjtBQUMxQixZQUFTLGNBQVQsQ0FBd0IsT0FBTyxZQUFQLENBQW9CLEdBQTVDLEVBQ0UsT0FERixDQUNVLGdCQUFRO0FBQ2hCO0FBQ0EsSUFIRjtBQUlBO0FBQ0QsRUFSRDs7QUFVQSxRQUFPLHFCQUFQLEdBQStCLFlBQVU7QUFDeEMsTUFBSSxXQUFXLE9BQU8sUUFBdEI7QUFDQSxNQUFHLGFBQWEsRUFBaEIsRUFBbUI7QUFDbEIsT0FBSSxjQUFjLE9BQU8sV0FBekI7QUFDQSxPQUFJLGlCQUFpQixPQUFPLGNBQTVCO0FBQ0EsVUFBTyxZQUFQLENBQW9CLElBQXBCLENBQXlCLFdBQXpCLEVBQXNDLGNBQXRDLEVBQXNELE1BQXRELEdBQStELFFBQS9EO0FBQ0EsVUFBTyxZQUFQLENBQW9CLElBQXBCLENBQXlCLFdBQXpCLEVBQXNDLGNBQXRDLEVBQXNELFFBQXRELEdBQWlFLElBQUksSUFBSixFQUFqRTtBQUNBLFVBQU8sSUFBUDtBQUNBO0FBQ0QsUUFBTSxpQkFBTjtBQUNBLFNBQU8sS0FBUDtBQUNBLEVBWEQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsS0FBSSxlQUFlLFNBQWYsWUFBZSxHQUFVO0FBQzVCLE9BQUssV0FBTCxHQUNFLE9BREYsQ0FDVSxVQUFTLElBQVQsRUFBYztBQUN0QixVQUFPLFFBQVAsR0FBa0IsSUFBbEI7QUFDRCxHQUhEO0FBSUEsRUFMRDs7QUFRQSxLQUFJLFFBQVEsU0FBUixLQUFRLEdBQVU7QUFDckIsU0FBTyxZQUFQLEdBQXNCLEVBQXRCO0FBQ0EsU0FBTyxXQUFQLEdBQXFCLENBQXJCO0FBQ0EsU0FBTyxjQUFQLEdBQXdCLENBQXhCO0FBQ0EsU0FBTyxZQUFQLENBQW9CLFdBQXBCLEdBQWtDLEtBQWxDO0FBQ0EsU0FBTyxNQUFQLEdBQWdCLEVBQWhCO0FBQ0EsU0FBTyxLQUFQLEdBQWUsSUFBZjtBQUNBLEVBUEQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsS0FBSSxPQUFPLFNBQVAsSUFBTyxHQUFVO0FBQ3BCO0FBQ0E7QUFDQSxTQUFPLFFBQVAsR0FBa0IsV0FBbEI7O0FBRUEsTUFBRyxhQUFhLE1BQWhCLEVBQXVCO0FBQ3RCLFVBQU8sTUFBUCxHQUFnQixhQUFhLE1BQTdCO0FBQ0EsVUFBTyxVQUFQO0FBQ0EsVUFBTyxLQUFQLEdBQWUsS0FBZjtBQUNBOztBQUdELE1BQUcsYUFBYSxHQUFoQixFQUFvQjtBQUNuQixVQUFPLEtBQVAsR0FBZSxLQUFmO0FBQ0EsWUFBUyxHQUFULENBQWEsYUFBYSxHQUExQixFQUNFLE9BREYsQ0FDVSxVQUFTLElBQVQsRUFBYzs7O0FBR3RCLFdBQU8sWUFBUCxHQUFzQixJQUF0QjtBQUNBLElBTEY7QUFNQTs7QUFFRCxFQXRCRDs7QUF3QkE7QUFDRCxDQTdNa0MsQ0FGbkM7OztBQ0FBLFFBQVEsTUFBUixDQUFlLGFBQWYsRUFBOEIsRUFBOUIsRUFFRSxPQUZGLENBRVUsTUFGVixFQUVrQixDQUFDLE9BQUQsRUFBVSxVQUFTLEtBQVQsRUFBZTs7QUFFekMsUUFBTzs7QUFFTixVQUFRLGdCQUFTLElBQVQsRUFBYztBQUNyQixVQUFPLE1BQU0sSUFBTixDQUFXLFlBQVgsRUFBeUIsSUFBekIsQ0FBUDtBQUNBLEdBSks7O0FBTU4sZUFBYSx1QkFBVTtBQUN0QixVQUFPLE1BQU0sR0FBTixDQUFVLGFBQVYsQ0FBUDtBQUNBLEdBUks7O0FBVU4sT0FBSyxhQUFTLE1BQVQsRUFBZ0I7QUFDcEIsVUFBTyxNQUFNLEdBQU4sQ0FBVSxnQkFBYyxNQUF4QixDQUFQO0FBQ0EsR0FaSztBQWFOLFFBQU0sY0FBUyxJQUFULEVBQWM7QUFDbkIsVUFBTyxNQUFNLEdBQU4sQ0FBVSxZQUFWLEVBQXdCLElBQXhCLENBQVA7QUFDQSxHQWZLO0FBZ0JOLFVBQVEsaUJBQVMsTUFBVCxFQUFnQjtBQUN2QixVQUFPLE1BQU0sTUFBTixDQUFhLGdCQUFjLE1BQTNCLENBQVA7QUFDQTtBQWxCSyxFQUFQO0FBb0JELENBdEJpQixDQUZsQjs7O0FDQUEsUUFBUSxNQUFSLENBQWUsaUJBQWYsRUFBa0MsRUFBbEMsRUFFSyxPQUZMLENBRWEsVUFGYixFQUV5QixDQUFDLE9BQUQsRUFBVSxVQUFTLEtBQVQsRUFBZTs7QUFFMUMsUUFBSSxhQUFhLEVBQWpCOztBQUVBLFdBQU87Ozs7QUFJSCxnQkFBUSxnQkFBUyxRQUFULEVBQWtCO0FBQ3pCLG1CQUFPLE1BQU0sSUFBTixDQUFXLGVBQVgsRUFBNEIsUUFBNUIsQ0FBUDtBQUNBLFNBTkU7O0FBUUgsdUJBQWUseUJBQVU7QUFDckIsbUJBQU8sVUFBUDtBQUNILFNBVkU7O0FBWUgsYUFBSyxhQUFTLEdBQVQsRUFBYTtBQUNkLG1CQUFPLE1BQU0sR0FBTixDQUFVLHVCQUFzQixHQUFoQyxDQUFQO0FBQ0gsU0FkRTs7QUFnQkgsY0FBTSxjQUFTLElBQVQsRUFBYztBQUNoQixtQkFBTyxNQUFNLEdBQU4sQ0FBVSxlQUFWLEVBQTJCLElBQTNCLENBQVA7QUFDSCxTQWxCRTs7QUFvQkgsdUJBQWUsdUJBQVMsSUFBVCxFQUFjO0FBQ3pCLHlCQUFhLElBQWI7QUFDSCxTQXRCRTs7QUF3Qkgsb0JBQVksb0JBQVMsRUFBVCxFQUFZO0FBQ3ZCLG1CQUFPLE1BQU0sR0FBTixDQUFVLDhCQUE2QixFQUF2QyxDQUFQO0FBQ0EsU0ExQkU7O0FBNEJILHdCQUFnQix3QkFBUyxHQUFULEVBQWMsS0FBZCxFQUFvQjtBQUNoQyxvQkFBUSxHQUFSLENBQVksR0FBWjtBQUNILG1CQUFPLE1BQU0sTUFBTixDQUFhLG1CQUFrQixHQUEvQixDQUFQO0FBQ0E7QUEvQkUsS0FBUDtBQWlDUCxDQXJDd0IsQ0FGekIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3NhbXBsZUFwcCcsIFxyXG5cdFtcclxuXHRcdCd1aS5yb3V0ZXInLCBcclxuXHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0J2FwcFJvdXRlcycsXHJcblx0XHQnZG5kTGlzdHMnLFxyXG5cclxuXHRcdCdBcHBDdHJsJyxcclxuXHRcdCdNYWluQ3RybCcsIFxyXG5cdFx0J1RyYXZlbGVyQ3RybCcsIFxyXG5cdFx0J1NlYXJjaFRyYXZlbGVyQ3RybCcsIFxyXG5cdFx0J0Zvcm1HZW5DdHJsLmpzJyxcclxuXHRcdFxyXG5cdFx0J1RyYXZlbGVyU2VydmljZScsIFxyXG5cdFx0J0Zvcm1TZXJ2aWNlJ1xyXG5cdF1cclxuKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwUm91dGVzJywgWyd1aS5yb3V0ZXInXSlcclxuXHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyAsXHJcblx0XHRmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XHJcblxyXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2hvbWUnKTtcclxuXHJcblx0XHQvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcblx0XHQkc3RhdGVQcm92aWRlclxyXG5cclxuXHRcdFx0Ly8gaG9tZSBwYWdlXHJcblx0XHRcdC5zdGF0ZSgnaG9tZScsIHtcclxuXHRcdFx0XHR1cmw6ICcvaG9tZScsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdNYWluQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdFxyXG5cdFx0XHQuc3RhdGUoJ3RyYXZlbGVyJywge1xyXG5cdFx0XHRcdHVybDogJy90cmF2ZWxlcj9faWQmZm9ybUlkJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2Zvcm1SZXZpZXdAdHJhdmVsZXInOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtUmV2aWV3Lmh0bWwnLFxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiBbJyRzY29wZScsICdUcmF2ZWxlcicsICdGb3JtJyxmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHQkc2NvcGUucmV2aWV3RGF0YSA9IFRyYXZlbGVyLmdldFJldmlld0RhdGEoKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRGb3JtLmdldCgkc2NvcGUucmV2aWV3RGF0YS5mb3JtSWQpXHJcblx0XHRcdFx0XHRcdC8vIFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0XHRcdFx0Ly8gfV1cclxuXHRcdFx0XHRcdFx0Ly8gY29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQuc3RhdGUoJ3NlYXJjaFRyYXZlbGVyJyx7XHJcblx0XHRcdFx0dXJsOiAnL3NlYXJjaFRyYXZlbGVyJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaFRyYXZlbGVyLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWFyY2hUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQuc3RhdGUoJ2Zvcm1HZW5lcmF0b3InLHtcclxuXHRcdFx0XHR1cmw6ICcvZm9ybUdlbmVyYXRvcicsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1HZW5lcmF0b3JOYXYuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVHZW5lcmF0b3JAZm9ybUdlbmVyYXRvcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RlbXBsYXRlR2VuZXJhdG9yLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3RlbXBsYXRlQ3JlYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVDcmVhdG9yLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnQXBwQ3RybCcsIFsnbmdBbmltYXRlJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtR2VuQ3RybC5qcycsIFsndWkuYm9vdHN0cmFwLnRhYnMnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ0Zvcm0nICwgZnVuY3Rpb24oJHNjb3BlLCBGb3JtKXtcclxuXHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKHBhc3N3b3JkKXtcclxuXHRcdFx0aWYoIXBhc3N3b3JkIHx8IHBhc3N3b3JkID09PSAnJyl7XHJcblx0XHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnMTIzJyl7XHJcblx0XHRcdEZvcm0uY3JlYXRlKCRzY29wZS50ZW1wbGF0ZSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHRhbGVydCgnYWRkJyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlID0gZGF0YTtcclxuXHRcdFx0XHRcdGRlbGV0ZSAkc2NvcGUudGVtcGxhdGU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lIHNvbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0nMTIzJyl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0Rm9ybS5zYXZlKCRzY29wZS5jcmVhdGUpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdzYXZlJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS50ZW1wbGF0ZSA9ICRzY29wZS5jcmVhdGU7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3VibWl0KHBhc3N3b3JkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKGNvbmZpcm0oJ2RlbGV0ZSB0ZW1wbGF0ZT8nKSl7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdEZvcm0uZGVsZXRlKCRzY29wZS5jcmVhdGUuX2lkKVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdFx0YWxlcnQoJ3JlbW92ZWQnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aW5pdENyZWF0ZSgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLnNldFNlbGVjdFRhYiA9IGZ1bmN0aW9uKG4pe1xyXG5cdFx0XHQkc2NvcGUuc2VsZWN0VGFiID0gbjtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZEl0ZW1SZWNvcmQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICYmICRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgaXRlbSA9IHtcclxuXHRcdFx0XHRcdFwiaWRcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6JHNjb3BlLmlucHV0SXRlbVJlY29yZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPT09ICdzZWxlY3QnKXtcclxuXHRcdFx0XHRcdHZhciBob2xkZXIgPSAkc2NvcGUuc2VsZWN0T3B0aW9ucztcclxuXHRcdFx0XHRcdGhvbGRlciA9IGhvbGRlci5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaTxob2xkZXIubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdGhvbGRlcltpXSA9IGhvbGRlcltpXS50cmltKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRob2xkZXIgPSBBcnJheS5mcm9tKG5ldyBTZXQoaG9sZGVyKSk7XHJcblx0XHRcdFx0XHRpdGVtWydzZWxlY3QnXSA9IHsnbmFtZSc6Jyd9O1xyXG5cdFx0XHRcdFx0aXRlbS5zZWxlY3RbJ29wdGlvbnMnXSA9IGhvbGRlcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZCA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gaWYoJHNjb3BlLmlucHV0U3RlcERlcyAmJiAkc2NvcGUuaW5wdXRTdGVwRGVzICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHMpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcyA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIHN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN0ZXBcIjogbGVuKzEsXHJcblx0XHRcdFx0XHRcInR5cGVcIjogJHNjb3BlLmlucHV0U3RlcFR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIkRlc2NyaXB0aW9uXCI6ICRzY29wZS5pbnB1dFN0ZXBEZXMgfHwgJydcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMucHVzaChzdGVwKTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmlucHV0U3RlcERlcyA9ICcnO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICYmICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGxldCBzdGVwSW5kZXggPSAkc2NvcGUudGVtcFN1Yi5zZWxlY3RTdGVwRm9yU3ViU3RlcDtcclxuXHRcdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3Qpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3Q9W107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBsZW4gPSAkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5sZW5ndGg7XHJcblx0XHRcdFx0bGV0IHN1YlN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN1Yl9zdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0LnB1c2goc3ViU3RlcCk7XHJcblx0XHRcdFx0JHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN1Yk9wdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGxldCBzdGVwID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMF07XHJcblx0XHRcdGxldCBzdWIgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zZWxlY3RTdWJGb3JPcHRpb24uc3BsaXQoJywnKVsxXTtcclxuXHRcdFx0bGV0IHNlbGVjdE9wdGlvbiA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMuc2VsZWN0U3ViT3B0aW9uO1xyXG5cdFx0XHRsZXQgb3B0aW9ucyA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0LnNwbGl0KCcsJyk7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPCBvcHRpb25zLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdG9wdGlvbnNbaV0gPSBvcHRpb25zW2ldLnRyaW0oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvcHRpb25zID0gQXJyYXkuZnJvbShuZXcgU2V0KG9wdGlvbnMpKTtcclxuXHRcdFx0bGV0IHN1YlN0ZXBPcHRpb24gPSB7XHJcblx0XHRcdFx0XHRcInR5cGVcIjogc2VsZWN0T3B0aW9uLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLm5hbWUsXHJcblx0XHRcdFx0XHRcIm9wdGlvbnNcIjogb3B0aW9uc1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZighJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucyl7XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucz1bXTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBdLmxpc3Rbc3ViXS5vcHRpb25zLnB1c2goc3ViU3RlcE9wdGlvbik7XHJcblx0XHRcdC8vJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl1bc2VsZWN0T3B0aW9uXSA9IHN1YlN0ZXBPcHRpb247XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLm5hbWUgPSAnJztcclxuXHRcdFx0JHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24uaW5wdXQgPSAnJztcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdCRzY29wZS5tb2RpZnlJRCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSl7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPG9iamVjdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRpZih0eXBlID09PSdpdGVtUmVjb3JkJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uaWQgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N0ZXBzJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3RlcCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0nc3ViX3N0ZXAnKXtcclxuXHRcdFx0XHRcdG9iamVjdFtpXS5zdWJfc3RlcCA9IGkrMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXRPcHRpb24gPSBmdW5jdGlvbihhZGRyZXNzLCBpbnB1dCl7XHJcblx0XHRcdGlmKGFkZHJlc3Mpe1xyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IFtdO1xyXG5cdFx0XHRcdGlucHV0ID0gaW5wdXQuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRmb3IobGV0IGk9MDtpPGlucHV0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0YWRkcmVzcy5vcHRpb25zW2ldID0gaW5wdXRbaV0udHJpbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRkcmVzcy5vcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciBpbml0Q3JlYXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZSA9IHtcclxuICBcImlzUHVibGlzaFwiOiBmYWxzZSxcclxuICBcImZvcm1Ob1wiOiBcIlJGLTc1MC0wMTAtMzI3XCIsXHJcbiAgXCJmb3JtUmV2XCI6IFwiMTBcIixcclxuICBcImN1c3RvbWVyXCI6IFwiQ0hFQ0sgUE9JTlRcIixcclxuICBcIml0ZW1SZWNvcmRcIjogW1xyXG4gICAge1xyXG4gICAgICBcImlkXCI6IDEsXHJcbiAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJTVyBWRVJcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJpZFwiOiAyLFxyXG4gICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiU08jXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwiaWRcIjogMyxcclxuICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIk1BQyNcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJpZFwiOiA0LFxyXG4gICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiUHJvZHVjdCBNb2RlbFwiLFxyXG4gICAgICBcInNlbGVjdFwiOiB7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcclxuICAgICAgICAgIFwiUE9XRVJcIixcclxuICAgICAgICAgIFwiVlNYXCIsXHJcbiAgICAgICAgICBcIkNPTk5FQ1RSQVwiLFxyXG4gICAgICAgICAgXCJETFBcIlxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJzdGVwc1wiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwic3RlcFwiOiAxLFxyXG4gICAgICBcInR5cGVcIjogXCJJUUNcIixcclxuICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkluaXRpYWwgVmlzdWFsIEluc3BlY3Rpb25cIixcclxuICAgICAgXCJsaXN0XCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcInN1Yl9zdGVwXCI6IDEsXHJcbiAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiT3V0ZXIgQm94XCIsXHJcbiAgICAgICAgICBcIm9wdGlvbnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCIxMjNcIixcclxuICAgICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCIxMlwiLFxyXG4gICAgICAgICAgICAgICAgXCIzXCIsXHJcbiAgICAgICAgICAgICAgICBcIjEyM1wiXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiMTIzMTIxMjNcIixcclxuICAgICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCIuMy4xMjMuMS4yMy4xMjMuXCIsXHJcbiAgICAgICAgICAgICAgICBcIjFcIixcclxuICAgICAgICAgICAgICAgIFwiMjNcIixcclxuICAgICAgICAgICAgICAgIFwiMTIzXCIsXHJcbiAgICAgICAgICAgICAgICBcIjEyXCIsXHJcbiAgICAgICAgICAgICAgICBcIjMxXCIsXHJcbiAgICAgICAgICAgICAgICBcIjJcIlxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInJhZGlvXCIsXHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiMjMxc1wiLFxyXG4gICAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXHJcbiAgICAgICAgICAgICAgICBcInNhZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJmXCIsXHJcbiAgICAgICAgICAgICAgICBcImFzXCIsXHJcbiAgICAgICAgICAgICAgICBcImZhXCIsXHJcbiAgICAgICAgICAgICAgICBcInNmXCIsXHJcbiAgICAgICAgICAgICAgICBcImVcIixcclxuICAgICAgICAgICAgICAgIFwiYWVcIixcclxuICAgICAgICAgICAgICAgIFwid2VmXCIsXHJcbiAgICAgICAgICAgICAgICBcImFlZlwiXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJnZXdnXCIsXHJcbiAgICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiZ1wiLFxyXG4gICAgICAgICAgICAgICAgXCJkXCIsXHJcbiAgICAgICAgICAgICAgICBcImdhXCIsXHJcbiAgICAgICAgICAgICAgICBcImRnXCIsXHJcbiAgICAgICAgICAgICAgICBcImFzXCIsXHJcbiAgICAgICAgICAgICAgICBcImFzZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzZGdcIixcclxuICAgICAgICAgICAgICAgIFwiXCJcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwic3ViX3N0ZXBcIjogMixcclxuICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJJbm5lciBDYXJ0b24gYW5kIEZvcm1cIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJzdGVwXCI6IDIsXHJcbiAgICAgIFwidHlwZVwiOiBcIklRQ1wiLFxyXG4gICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiUGFja2FnaW5nIENoZWNrXCIsXHJcbiAgICAgIFwibGlzdFwiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJzdWJfc3RlcFwiOiAxLFxyXG4gICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkFwcGxpYW5jZSBTbiBtYXRjaGVkIHdpdGggQm94IFNOXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICBdXHJcbn07XHJcblx0XHRcdCRzY29wZS5jcmVhdGUuaXNQdWJsaXNoID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aW5pdENyZWF0ZSgpO1xyXG5cdFx0XHJcblx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID0gJ3RleHQnO1xyXG5cdFx0XHQkc2NvcGUuanNvblZpZXcgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNYWluQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUudGFnbGluZSA9ICd0byB0aGUgbW9vbiBhbmQgYmFjayEnO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlYXJjaFRyYXZlbGVyQ3RybCcsIFtdKVxyXG5cclxuXHQuY29udHJvbGxlcignU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnVHJhdmVsZXInLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyKXtcclxuXHJcblx0XHQkc2NvcGUuaXNTZWFyY2ggPSBmYWxzZTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRJbnB1dCA9ICRzY29wZS5zZWFyY2hJbnB1dDtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gdHJ1ZTtcclxuXHRcdFx0aWYoJHNjb3BlLnNlYXJjaElucHV0KXtcclxuXHRcdFx0XHRsZXQgc24gPSAkc2NvcGUuc2VhcmNoSW5wdXQudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5zZWFyY2hMaWtlKHNuKVxyXG5cclxuXHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXRUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgZm9ybUlkKXtcclxuXHRcdFx0d2luZG93Lm9wZW4oJ3RyYXZlbGVyP19pZD0nK19pZCsnJmZvcm1JZD0nK2Zvcm1JZCwgJ19ibGFuaycpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucmVtb3ZlVHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGluZGV4KXtcclxuXHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoX2lkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+IHtcclxuXHRcdFx0XHRcdC8vICRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdCRzY29wZS5yZXN1bHQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCdUcmF2ZWxlcicsICdGb3JtJywnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSwgJHN0YXRlUGFyYW1zKXtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICYmICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICE9PSAnT1BFTicpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUEFORElORyBGT1IgUkVWSUVXJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRm9ybSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdGlmKCRzY29wZS5mb3JtSWQpe1xyXG5cdFx0XHRcdEZvcm0uZ2V0KCRzY29wZS5mb3JtSWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyBmaW5kIHRoZSBsYXN0IHN1YlN0ZXBcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkID0gZGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jdXN0b21lciA9IGRhdGEuY3VzdG9tZXI7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5leHRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG9iamVjdCA9ICRzY29wZS5mb3Jtcy5zdGVwc1skc2NvcGUuY3VycmVudFN0ZXAtMV07XHJcblx0XHRcdGlmKG9iamVjdC5saXN0Lmxlbmd0aCA+PSAkc2NvcGUuY3VycmVudFN1YlN0ZXArMSl7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwICs9IDE7XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwICs9IDE7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3VycmVudFN0ZXAgPiAkc2NvcGUubGFzdFN0ZXApe1xyXG5cdFx0XHRcdFx0Ly8gVHJhdmVsZXIuc2V0UmV2aWV3RGF0YSgkc2NvcGUudHJhdmVsZXJEYXRhKTtcclxuXHRcdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1x0XHRcclxuXHRcdFx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IHBhZ2U7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0Ly8gJHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1N1YlBhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gcGFnZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkKXtcclxuXHJcblx0XHRcdFx0VHJhdmVsZXIuc2F2ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN1Ym1pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZXZpZXcgPSBmdW5jdGlvbihvcHRpb24pe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0J5KXtcclxuXHRcdFx0aWYob3B0aW9uID09PSAncmVqZWN0Jyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUkVKRUNUJztcclxuXHRcdFx0fWVsc2UgaWYob3B0aW9uID09PSAnY29tcGxldGUnKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdDT01QTEVURUQnO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3QXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgcmV2aWV3ZXIgbmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudXNlcm5hbWUgJiYgJHNjb3BlLnRyYXZlbGVyRGF0YS5zbil7XHJcblx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jb21wbGV0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cclxuXHRcdFx0XHRcdC8vIGlmIHN1Y2Nlc3NmdWwgY3JlYXRlXHJcblx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUgb3Igc2VyaWFsIG51bWJlciBwbHogJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5ldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRhbGVydCgnZGVsZXRlIGNsaWNrJyk7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKXtcclxuXHRcdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFwcGVuZFN1YlN0ZXBFZGl0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB1c2VybmFtZSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0aWYodXNlcm5hbWUgIT09ICcnKXtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN0ZXAgPSAkc2NvcGUuY3VycmVudFN0ZXA7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdWJTdGVwID0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRCeSA9IHVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gdmFyIGFwcGVuZFN1YlN0ZXBFZGl0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdGFsZXJ0KDEyMzEyMyk7XHJcblx0XHQvLyBcdHZhciB1c2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZScpLnZhbHVlO1xyXG5cdFx0Ly8gXHRpZih1c2VybmFtZSAhPT0gJycpe1xyXG5cdFx0Ly8gXHRcdHZhciBjdXJyZW50U3RlcCA9ICRzY29wZS5jdXJyZW50U3RlcDtcclxuXHRcdC8vIFx0XHR2YXIgY3VycmVudFN1YlN0ZXAgPSAkc2NvcGUuY3VycmVudFN1YlN0ZXA7XHJcblx0XHQvLyBcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdEJ5ID0gdXNlcm5hbWU7XHJcblx0XHQvLyBcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0Ly8gXHRcdHJldHVybiB0cnVlO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUnKTtcclxuXHRcdC8vIFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0Ly8gfTtcclxuXHJcblx0XHR2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Rm9ybS5nZXRGb3JtTGlzdCgpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciByZXNldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZm9ybUlkID0gJyc7XHJcblx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIHZhciBzdGFydFdhdGNoID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vIFx0JHNjb3BlLiR3YXRjaChcclxuXHRcdC8vIFx0XHQndHJhdmVsZXJEYXRhLnN0ZXAnLFxyXG5cdFx0Ly8gXHRcdGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSl7XHJcblx0XHQvLyBcdFx0XHRpZighJHNjb3BlLmlzTmV3KXtcclxuXHRcdC8vIFx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gdHJ1ZTtcclxuXHRcdC8vIFx0XHRcdH1lbHNle1xyXG5cdFx0Ly8gXHRcdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuY3VycmVudFN0ZXAgKyAnOycrJHNjb3BlLmN1cnJlbnRTdWJTdGVwKydjaGFuZ2VkJyk7XHJcblx0XHQvLyBcdFx0XHRcdGFwcGVuZFN1YlN0ZXBFZGl0SW5mbygpO1xyXG5cdFx0Ly8gXHRcdFx0fVxyXG5cdFx0Ly8gXHRcdH0sIHRydWVcclxuXHRcdC8vIFx0KTtcclxuXHRcdC8vIH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRsb2FkRm9ybUxpc3QoKTtcclxuXHRcdFx0JHNjb3BlLnVzZXJuYW1lID0gJ0pvaG4gU25vdyc7XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gc3RhcnRXYXRjaCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybVNlcnZpY2UnLCBbXSlcclxuXHJcblx0LmZhY3RvcnkoJ0Zvcm0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZTogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbihfaWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlcj9faWQ9JysgX2lkKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS90cmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXZpZXdEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaExpa2U6IGZ1bmN0aW9uKHNuKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL3NlYXJjaExpa2UvJysgc24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIERFTEVURSBhIGZvcm1cclxuICAgICAgICAgICAgcmVtb3ZlVHJhdmVsZXI6IGZ1bmN0aW9uKF9pZCwgaW5wdXQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coX2lkKTtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3RyYXZlbGVyLycrIF9pZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
