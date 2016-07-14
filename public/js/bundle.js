'use strict';

angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'appRoutes', 'AppCtrl', 'MainCtrl', 'TravelerCtrl', 'SearchTravelerCtrl', 'FormGenCtrl.js', 'TravelerService', 'FormService']);
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
				templateUrl: 'views/templateGenerator.html'
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

	// $scope.initTemplate = function(){
	// }

	$scope.create = {};
	$scope.inputItemRecordType = 'text';

	$scope.submit = function () {
		var password = prompt('password');
		if (password === '123') {
			Form.create($scope.template).success(function (data) {
				// do something
				alert('add');
			});
		} else {
			alert('go home son');
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
				item['select'] = { 'name': '' };
				item.select['options'] = holder;
			}
			$scope.create.itemRecord.push(item);
			$scope.inputItemRecord = '';
		}
	};

	$scope.addStep = function () {
		// if($scope.inputStepDes && $scope.inputStepDes !== ''){
		if (!$scope.tempStep) {
			$scope.tempStep = [];
			$scope.create.steps = [];
		}
		var len = $scope.tempStep.length;
		var step = {
			"step": len + 1,
			"type": $scope.inputStepType || '',
			"Description": $scope.inputStepDes || ''
		};
		$scope.tempStep.push(step);

		$scope.inputStepDes = '';
		$scope.inputStepType = '';
		// }
	};

	$scope.addSubStep = function () {
		if ($scope.tempSub.inputSubStepDes && $scope.tempSub.inputSubStepDes !== '') {
			var stepIndex = $scope.tempSub.selectStepForSubStep;
			if (!$scope.tempStep[stepIndex].list) {
				$scope.tempStep[stepIndex].list = [];
			}
			var len = $scope.tempStep[stepIndex].list.length;
			var subStep = {
				"sub_step": len + 1,
				"Description": $scope.tempSub.inputSubStepDes
			};
			$scope.tempStep[stepIndex].list.push(subStep);
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
		var subStepOption = {
			"name": $scope.tempSubOption.subOptions.option.name,
			"options": options
		};
		$scope.tempStep[step].list[sub][selectOption] = subStepOption;
	};
	// $scope.subSelectOptionChange = function(value){
	// 	delete $scope.tempSub.subOptions.option;
	// }

	// $scope.addSubOption = function(){

	// }
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
		$scope.currentStep = page;
		$scope.currentSubStep = 1;
		// $scope.travelerData.readyReview = false;
		$scope.checkReadyReview();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFLQyxTQUxELEVBTUMsVUFORCxFQU9DLGNBUEQsRUFRQyxvQkFSRCxFQVNDLGdCQVRELEVBV0MsaUJBWEQsRUFZQyxhQVpELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYTtBQURRO0FBTGpCO0FBRlksRUFWcEI7Ozs7Ozs7O0FBK0JFLE1BL0JGLENBK0JRLGdCQS9CUixFQStCeUI7QUFDdkIsT0FBSyxpQkFEa0I7QUFFdkIsZUFB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LENBaEJpQixDQUZsQjs7O0FDQUEsUUFBUSxNQUFSLENBQWUsaUJBQWYsRUFBa0MsRUFBbEMsRUFFSyxPQUZMLENBRWEsVUFGYixFQUV5QixDQUFDLE9BQUQsRUFBVSxVQUFTLEtBQVQsRUFBZTs7QUFFMUMsUUFBSSxhQUFhLEVBQWpCOztBQUVBLFdBQU87Ozs7QUFJSCxnQkFBUSxnQkFBUyxRQUFULEVBQWtCO0FBQ3pCLG1CQUFPLE1BQU0sSUFBTixDQUFXLGVBQVgsRUFBNEIsUUFBNUIsQ0FBUDtBQUNBLFNBTkU7O0FBUUgsdUJBQWUseUJBQVU7QUFDckIsbUJBQU8sVUFBUDtBQUNILFNBVkU7O0FBWUgsYUFBSyxhQUFTLEdBQVQsRUFBYTtBQUNkLG1CQUFPLE1BQU0sR0FBTixDQUFVLHVCQUFzQixHQUFoQyxDQUFQO0FBQ0gsU0FkRTs7QUFnQkgsY0FBTSxjQUFTLElBQVQsRUFBYztBQUNoQixtQkFBTyxNQUFNLEdBQU4sQ0FBVSxlQUFWLEVBQTJCLElBQTNCLENBQVA7QUFDSCxTQWxCRTs7QUFvQkgsdUJBQWUsdUJBQVMsSUFBVCxFQUFjO0FBQ3pCLHlCQUFhLElBQWI7QUFDSCxTQXRCRTs7QUF3Qkgsb0JBQVksb0JBQVMsRUFBVCxFQUFZO0FBQ3ZCLG1CQUFPLE1BQU0sR0FBTixDQUFVLDhCQUE2QixFQUF2QyxDQUFQO0FBQ0EsU0ExQkU7O0FBNEJILHdCQUFnQix3QkFBUyxHQUFULEVBQWMsS0FBZCxFQUFvQjtBQUNoQyxvQkFBUSxHQUFSLENBQVksR0FBWjtBQUNILG1CQUFPLE1BQU0sTUFBTixDQUFhLG1CQUFrQixHQUEvQixDQUFQO0FBQ0E7QUEvQkUsS0FBUDtBQWlDUCxDQXJDd0IsQ0FGekIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3NhbXBsZUFwcCcsIFxyXG5cdFtcclxuXHRcdCd1aS5yb3V0ZXInLCBcclxuXHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0J2FwcFJvdXRlcycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHQvLyBcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyB9XVxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR2aWV3czp7XHJcblx0XHRcdFx0XHQnJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybUdlbmVyYXRvck5hdi5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUdlbmVyYXRvckBmb3JtR2VuZXJhdG9yJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvdGVtcGxhdGVHZW5lcmF0b3IuaHRtbCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQndGVtcGxhdGVDcmVhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUNyZWF0b3IuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdBcHBDdHJsJywgWyduZ0FuaW1hdGUnXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1HZW5DdHJsLmpzJywgWyd1aS5ib290c3RyYXAudGFicyddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcicsIFsnJHNjb3BlJywnRm9ybScgLCBmdW5jdGlvbigkc2NvcGUsIEZvcm0pe1xyXG5cclxuXHRcdC8vICRzY29wZS5pbml0VGVtcGxhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8gfVxyXG5cdFx0XHJcblx0XHQkc2NvcGUuY3JlYXRlID0ge307XHJcblx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9ICd0ZXh0JztcclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJzEyMycpe1xyXG5cdFx0XHRGb3JtLmNyZWF0ZSgkc2NvcGUudGVtcGxhdGUpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0YWxlcnQoJ2FkZCcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZSBzb24nKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2V0U2VsZWN0VGFiID0gZnVuY3Rpb24obil7XHJcblx0XHRcdCRzY29wZS5zZWxlY3RUYWIgPSBuO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkSXRlbVJlY29yZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgJiYgJHNjb3BlLmlucHV0SXRlbVJlY29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5pdGVtUmVjb3JkID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBsZW4gPSAkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBpdGVtID0ge1xyXG5cdFx0XHRcdFx0XCJpZFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjokc2NvcGUuaW5wdXRJdGVtUmVjb3JkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigkc2NvcGUuaW5wdXRJdGVtUmVjb3JkVHlwZSA9PT0gJ3NlbGVjdCcpe1xyXG5cdFx0XHRcdFx0dmFyIGhvbGRlciA9ICRzY29wZS5zZWxlY3RPcHRpb25zO1xyXG5cdFx0XHRcdFx0aG9sZGVyID0gaG9sZGVyLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPGhvbGRlci5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aG9sZGVyW2ldID0gaG9sZGVyW2ldLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGl0ZW1bJ3NlbGVjdCddID0geyduYW1lJzonJ307XHJcblx0XHRcdFx0XHRpdGVtLnNlbGVjdFsnb3B0aW9ucyddID0gaG9sZGVyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQucHVzaChpdGVtKTtcclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRJdGVtUmVjb3JkID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFkZFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBpZigkc2NvcGUuaW5wdXRTdGVwRGVzICYmICRzY29wZS5pbnB1dFN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRpZighJHNjb3BlLnRlbXBTdGVwKXtcclxuXHRcdFx0XHRcdCRzY29wZS50ZW1wU3RlcCA9IFtdO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwcyA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbGVuID0gJHNjb3BlLnRlbXBTdGVwLmxlbmd0aDtcclxuXHRcdFx0XHR2YXIgc3RlcCA9IHtcclxuXHRcdFx0XHRcdFwic3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwidHlwZVwiOiAkc2NvcGUuaW5wdXRTdGVwVHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLmlucHV0U3RlcERlcyB8fCAnJ1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0JHNjb3BlLnRlbXBTdGVwLnB1c2goc3RlcCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5pbnB1dFN0ZXBEZXMgPSAnJztcclxuXHRcdFx0XHQkc2NvcGUuaW5wdXRTdGVwVHlwZSA9ICcnO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzICYmICRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGxldCBzdGVwSW5kZXggPSAkc2NvcGUudGVtcFN1Yi5zZWxlY3RTdGVwRm9yU3ViU3RlcDtcclxuXHRcdFx0XHRpZighJHNjb3BlLnRlbXBTdGVwW3N0ZXBJbmRleF0ubGlzdCl7XHJcblx0XHRcdFx0XHQkc2NvcGUudGVtcFN0ZXBbc3RlcEluZGV4XS5saXN0PVtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgbGVuID0gJHNjb3BlLnRlbXBTdGVwW3N0ZXBJbmRleF0ubGlzdC5sZW5ndGg7XHJcblx0XHRcdFx0bGV0IHN1YlN0ZXAgPSB7XHJcblx0XHRcdFx0XHRcInN1Yl9zdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS50ZW1wU3RlcFtzdGVwSW5kZXhdLmxpc3QucHVzaChzdWJTdGVwKTtcclxuXHRcdFx0XHQkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJPcHRpb24gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgc3RlcCA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzBdO1xyXG5cdFx0XHRsZXQgc3ViID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMV07XHJcblx0XHRcdGxldCBzZWxlY3RPcHRpb24gPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLnNlbGVjdFN1Yk9wdGlvbjtcclxuXHRcdFx0bGV0IG9wdGlvbnMgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dC5zcGxpdCgnLCcpO1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTwgb3B0aW9ucy5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRvcHRpb25zW2ldID0gb3B0aW9uc1tpXS50cmltKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHN1YlN0ZXBPcHRpb24gPSB7XHJcblx0XHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLnRlbXBTdWJPcHRpb24uc3ViT3B0aW9ucy5vcHRpb24ubmFtZSxcclxuXHRcdFx0XHRcdFwib3B0aW9uc1wiOiBvcHRpb25zXHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnRlbXBTdGVwW3N0ZXBdLmxpc3Rbc3ViXVtzZWxlY3RPcHRpb25dID0gc3ViU3RlcE9wdGlvbjtcclxuXHRcdH1cclxuXHRcdC8vICRzY29wZS5zdWJTZWxlY3RPcHRpb25DaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSl7XHJcblx0XHQvLyBcdGRlbGV0ZSAkc2NvcGUudGVtcFN1Yi5zdWJPcHRpb25zLm9wdGlvbjtcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyAkc2NvcGUuYWRkU3ViT3B0aW9uID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHQvLyB9XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNYWluQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUudGFnbGluZSA9ICd0byB0aGUgbW9vbiBhbmQgYmFjayEnO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlYXJjaFRyYXZlbGVyQ3RybCcsIFtdKVxyXG5cclxuXHQuY29udHJvbGxlcignU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnVHJhdmVsZXInLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyKXtcclxuXHJcblx0XHQkc2NvcGUuaXNTZWFyY2ggPSBmYWxzZTtcclxuXHJcblx0XHQkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRJbnB1dCA9ICRzY29wZS5zZWFyY2hJbnB1dDtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gdHJ1ZTtcclxuXHRcdFx0aWYoJHNjb3BlLnNlYXJjaElucHV0KXtcclxuXHRcdFx0XHRsZXQgc24gPSAkc2NvcGUuc2VhcmNoSW5wdXQudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5zZWFyY2hMaWtlKHNuKVxyXG5cclxuXHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUucmVzdWx0PWRhdGE7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmVkaXRUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgZm9ybUlkKXtcclxuXHRcdFx0d2luZG93Lm9wZW4oJ3RyYXZlbGVyP19pZD0nK19pZCsnJmZvcm1JZD0nK2Zvcm1JZCwgJ19ibGFuaycpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUucmVtb3ZlVHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGluZGV4KXtcclxuXHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoX2lkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+IHtcclxuXHRcdFx0XHRcdC8vICRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdCRzY29wZS5yZXN1bHQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCdUcmF2ZWxlcicsICdGb3JtJywnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSwgJHN0YXRlUGFyYW1zKXtcclxuXHJcblx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICYmICRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzICE9PSAnT1BFTicpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUEFORElORyBGT1IgUkVWSUVXJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0aWYoJHNjb3BlLmZvcm1JZCl7XHJcblx0XHRcdFx0Rm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1x0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG5cdFx0XHRcdFx0XHQkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0Ly8gaW5pdCB0aGUgdHJhdmVsZXJEYXRhIGZyb20gZm9ybURhdGFcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1ObyA9IGRhdGEuZm9ybU5vO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV4dFN0ZXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgb2JqZWN0ID0gJHNjb3BlLmZvcm1zLnN0ZXBzWyRzY29wZS5jdXJyZW50U3RlcC0xXTtcclxuXHRcdFx0aWYob2JqZWN0Lmxpc3QubGVuZ3RoID49ICRzY29wZS5jdXJyZW50U3ViU3RlcCsxKXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgKz0gMTtcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgKz0gMTtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50U3RlcCA+ICRzY29wZS5sYXN0U3RlcCl7XHJcblx0XHRcdFx0XHQvLyBUcmF2ZWxlci5zZXRSZXZpZXdEYXRhKCRzY29wZS50cmF2ZWxlckRhdGEpO1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHRcdFxyXG5cdFx0XHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gcGFnZTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc3RhdHVzU3ViUGFnZSA9IGZ1bmN0aW9uKHBhZ2Upe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSBwYWdlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuY2hlY2tSZWFkeVJldmlldygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQpe1xyXG5cclxuXHRcdFx0XHRUcmF2ZWxlci5zYXZlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuc3VibWl0KCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJldmlldyA9IGZ1bmN0aW9uKG9wdGlvbil7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3Qnkpe1xyXG5cdFx0XHRpZihvcHRpb24gPT09ICdyZWplY3QnKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdSRUpFQ1QnO1xyXG5cdFx0XHR9ZWxzZSBpZihvcHRpb24gPT09ICdjb21wbGV0ZScpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ0NPTVBMRVRFRCc7XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciByZXZpZXdlciBuYW1lJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLnVzZXJuYW1lICYmICRzY29wZS50cmF2ZWxlckRhdGEuc24pe1xyXG5cdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEuY29tcGxldGVkID0gZmFsc2U7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWRCeSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZUF0ID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5jcmVhdGUoJHNjb3BlLnRyYXZlbGVyRGF0YSlcclxuXHJcblx0XHRcdFx0XHQvLyBpZiBzdWNjZXNzZnVsIGNyZWF0ZVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lIG9yIHNlcmlhbCBudW1iZXIgcGx6ICcpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0YWxlcnQoJ2RlbGV0ZSBjbGljaycpO1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZCl7XHJcblx0XHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hcHBlbmRTdWJTdGVwRWRpdEluZm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgdXNlcm5hbWUgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdGlmKHVzZXJuYW1lICE9PSAnJyl7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdGVwID0gJHNjb3BlLmN1cnJlbnRTdGVwO1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3ViU3RlcCA9ICRzY29wZS5jdXJyZW50U3ViU3RlcDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0QnkgPSB1c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0VGltZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZScpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdmFyIGFwcGVuZFN1YlN0ZXBFZGl0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdGFsZXJ0KDEyMzEyMyk7XHJcblx0XHQvLyBcdHZhciB1c2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZScpLnZhbHVlO1xyXG5cdFx0Ly8gXHRpZih1c2VybmFtZSAhPT0gJycpe1xyXG5cdFx0Ly8gXHRcdHZhciBjdXJyZW50U3RlcCA9ICRzY29wZS5jdXJyZW50U3RlcDtcclxuXHRcdC8vIFx0XHR2YXIgY3VycmVudFN1YlN0ZXAgPSAkc2NvcGUuY3VycmVudFN1YlN0ZXA7XHJcblx0XHQvLyBcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdEJ5ID0gdXNlcm5hbWU7XHJcblx0XHQvLyBcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0Ly8gXHRcdHJldHVybiB0cnVlO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUnKTtcclxuXHRcdC8vIFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0Ly8gfTtcclxuXHJcblx0XHR2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Rm9ybS5nZXRGb3JtTGlzdCgpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciByZXNldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZm9ybUlkID0gJyc7XHJcblx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIHZhciBzdGFydFdhdGNoID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vIFx0JHNjb3BlLiR3YXRjaChcclxuXHRcdC8vIFx0XHQndHJhdmVsZXJEYXRhLnN0ZXAnLFxyXG5cdFx0Ly8gXHRcdGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSl7XHJcblx0XHQvLyBcdFx0XHRpZighJHNjb3BlLmlzTmV3KXtcclxuXHRcdC8vIFx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gdHJ1ZTtcclxuXHRcdC8vIFx0XHRcdH1lbHNle1xyXG5cdFx0Ly8gXHRcdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUuY3VycmVudFN0ZXAgKyAnOycrJHNjb3BlLmN1cnJlbnRTdWJTdGVwKydjaGFuZ2VkJyk7XHJcblx0XHQvLyBcdFx0XHRcdGFwcGVuZFN1YlN0ZXBFZGl0SW5mbygpO1xyXG5cdFx0Ly8gXHRcdFx0fVxyXG5cdFx0Ly8gXHRcdH0sIHRydWVcclxuXHRcdC8vIFx0KTtcclxuXHRcdC8vIH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRsb2FkRm9ybUxpc3QoKTtcclxuXHRcdFx0JHNjb3BlLnVzZXJuYW1lID0gJ0pvaG4gU25vdyc7XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gc3RhcnRXYXRjaCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybVNlcnZpY2UnLCBbXSlcclxuXHJcblx0LmZhY3RvcnkoJ0Zvcm0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1RyYXZlbGVyU2VydmljZScsIFtdKVxyXG4gICAgICAgXHJcbiAgICAuZmFjdG9yeSgnVHJhdmVsZXInLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICAgICAgICB2YXIgcmV2aWV3RGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG5cdFxyXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIHdvcmsgd2hlbiBtb3JlIEFQSSByb3V0ZXMgYXJlIGRlZmluZWQgb24gdGhlIE5vZGUgc2lkZSBvZiB0aGluZ3NcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBQT1NUIGFuZCBjcmVhdGUgYSBuZXcgZm9ybVxyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGZvcm1EYXRhKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90cmF2ZWxlcicsIGZvcm1EYXRhKTtcclxuICAgICAgICAgICAgfSwgXHJcblxyXG4gICAgICAgICAgICBnZXRSZXZpZXdEYXRhOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldmlld0RhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKF9pZCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyP19pZD0nKyBfaWQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRSZXZpZXdEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldmlld0RhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2VhcmNoTGlrZTogZnVuY3Rpb24oc24pe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvc2VhcmNoTGlrZS8nKyBzbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gREVMRVRFIGEgZm9ybVxyXG4gICAgICAgICAgICByZW1vdmVUcmF2ZWxlcjogZnVuY3Rpb24oX2lkLCBpbnB1dCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfaWQpO1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvdHJhdmVsZXIvJysgX2lkKTtcclxuICAgICAgICAgICAgfVxyXG5cdH07XHRcdFxyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
