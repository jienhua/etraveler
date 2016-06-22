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
		templateUrl: 'views/formGenerator.html',
		controller: 'FormGeneratorController'
	});

	$locationProvider.html5Mode(true);
}]);
'use strict';

angular.module('AppCtrl', ['ui.bootstrap', 'ngAnimate']).controller('AppController', ['$scope', function ($scope) {

	$scope.isCollapsed = true;
}]);
'use strict';

angular.module('FormGenCtrl.js', []).controller('FormGeneratorController', ['$scope', 'Form', function ($scope, Form) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvRm9ybVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UcmF2ZWxlclNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQ0MsQ0FDQyxXQURELEVBRUMsY0FGRCxFQUdDLFdBSEQsRUFLQyxTQUxELEVBTUMsVUFORCxFQU9DLGNBUEQsRUFRQyxvQkFSRCxFQVNDLGdCQVRELEVBV0MsaUJBWEQsRUFZQyxhQVpELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYTtBQURRO0FBTGpCO0FBRlksRUFWcEI7Ozs7Ozs7O0FBK0JFLE1BL0JGLENBK0JRLGdCQS9CUixFQStCeUI7QUFDdkIsT0FBSyxpQkFEa0I7QUFFdkIsZUFB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QkFBUSxHQUFSLENBQVksR0FBWjtBQUNILG1CQUFPLE1BQU0sTUFBTixDQUFhLG1CQUFrQixHQUEvQixDQUFQO0FBQ0E7QUEvQkUsS0FBUDtBQWlDUCxDQXJDd0IsQ0FGekIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3NhbXBsZUFwcCcsIFxyXG5cdFtcclxuXHRcdCd1aS5yb3V0ZXInLCBcclxuXHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0J2FwcFJvdXRlcycsXHJcblxyXG5cdFx0J0FwcEN0cmwnLFxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHQvLyBcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyB9XVxyXG5cdFx0XHRcdFx0XHQvLyBjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1HZW5lcmF0b3IuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnQXBwQ3RybCcsIFsndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGb3JtR2VuQ3RybC5qcycsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdGb3JtR2VuZXJhdG9yQ29udHJvbGxlcicsIFsnJHNjb3BlJywnRm9ybScgLCBmdW5jdGlvbigkc2NvcGUsIEZvcm0pe1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGFzc3dvcmQgPSBwcm9tcHQoJ3Bhc3N3b3JkJyk7XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnMTIzJyl7XHJcblx0XHRcdEZvcm0uY3JlYXRlKCRzY29wZS50ZW1wbGF0ZSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHRhbGVydCgnYWRkJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lIHNvbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnTWFpbkN0cmwnLCBbXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XHJcblxyXG5cdFx0JHNjb3BlLnRhZ2xpbmUgPSAndG8gdGhlIG1vb24gYW5kIGJhY2shJztcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdTZWFyY2hUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHJcblx0LmNvbnRyb2xsZXIoJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlcil7XHJcblxyXG5cdFx0JHNjb3BlLmlzU2VhcmNoID0gZmFsc2U7XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50SW5wdXQgPSAkc2NvcGUuc2VhcmNoSW5wdXQ7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IHRydWU7XHJcblx0XHRcdGlmKCRzY29wZS5zZWFyY2hJbnB1dCl7XHJcblx0XHRcdFx0bGV0IHNuID0gJHNjb3BlLnNlYXJjaElucHV0LnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0VHJhdmVsZXIuc2VhcmNoTGlrZShzbilcclxuXHJcblx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0VHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGZvcm1JZCl7XHJcblx0XHRcdHdpbmRvdy5vcGVuKCd0cmF2ZWxlcj9faWQ9JytfaWQrJyZmb3JtSWQ9Jytmb3JtSWQsICdfYmxhbmsnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZVRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBpbmRleCl7XHJcblx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKF9pZClcclxuXHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PiB7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUucmVzdWx0LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnVHJhdmVsZXJDdHJsJywgW10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ1RyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnVHJhdmVsZXInLCAnRm9ybScsJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0sICRzdGF0ZVBhcmFtcyl7XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAhPT0gJ09QRU4nKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1BBTkRJTkcgRk9SIFJFVklFVyc7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRm9ybSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdGlmKCRzY29wZS5mb3JtSWQpe1xyXG5cdFx0XHRcdEZvcm0uZ2V0KCRzY29wZS5mb3JtSWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmZvcm1zID0gZGF0YTtcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyBmaW5kIHRoZSBsYXN0IHN1YlN0ZXBcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxhc3RTdGVwID0gZGF0YS5zdGVwcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkID0gZGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybVJldiA9IGRhdGEuZm9ybVJldjtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jdXN0b21lciA9IGRhdGEuY3VzdG9tZXI7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ09QRU4nO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5leHRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG9iamVjdCA9ICRzY29wZS5mb3Jtcy5zdGVwc1skc2NvcGUuY3VycmVudFN0ZXAtMV07XHJcblx0XHRcdGlmKG9iamVjdC5saXN0Lmxlbmd0aCA+PSAkc2NvcGUuY3VycmVudFN1YlN0ZXArMSl7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwICs9IDE7XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwICs9IDE7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3VycmVudFN0ZXAgPiAkc2NvcGUubGFzdFN0ZXApe1xyXG5cdFx0XHRcdFx0Ly8gVHJhdmVsZXIuc2V0UmV2aWV3RGF0YSgkc2NvcGUudHJhdmVsZXJEYXRhKTtcclxuXHRcdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1x0XHRcclxuXHRcdFx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IHBhZ2U7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1N1YlBhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gcGFnZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkKXtcclxuXHJcblx0XHRcdFx0VHJhdmVsZXIuc2F2ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN1Ym1pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZXZpZXcgPSBmdW5jdGlvbihvcHRpb24pe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnJldmlld0J5KXtcclxuXHRcdFx0aWYob3B0aW9uID09PSAncmVqZWN0Jyl7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnUkVKRUNUJztcclxuXHRcdFx0fWVsc2UgaWYob3B0aW9uID09PSAnY29tcGxldGUnKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdDT01QTEVURUQnO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3QXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHQkc2NvcGUuc2F2ZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZW50ZXIgcmV2aWV3ZXIgbmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS51c2VybmFtZSAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnNuKXtcclxuXHRcdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmNvbXBsZXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkQnkgPSAkc2NvcGUudXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0VHJhdmVsZXIuY3JlYXRlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgc3VjY2Vzc2Z1bCBjcmVhdGVcclxuXHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZSBvciBzZXJpYWwgbnVtYmVyIHBseiAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUubmV3ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGFsZXJ0KCdkZWxldGUgY2xpY2snKTtcclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpe1xyXG5cdFx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYXBwZW5kU3ViU3RlcEVkaXRJbmZvID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHVzZXJuYW1lID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRpZih1c2VybmFtZSAhPT0gJycpe1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3RlcCA9ICRzY29wZS5jdXJyZW50U3RlcDtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN1YlN0ZXAgPSAkc2NvcGUuY3VycmVudFN1YlN0ZXA7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdEJ5ID0gdXNlcm5hbWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5zdGVwW2N1cnJlbnRTdGVwXVtjdXJyZW50U3ViU3RlcF0uZWRpdFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHZhciBhcHBlbmRTdWJTdGVwRWRpdEluZm8gPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8gXHRhbGVydCgxMjMxMjMpO1xyXG5cdFx0Ly8gXHR2YXIgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWUnKS52YWx1ZTtcclxuXHRcdC8vIFx0aWYodXNlcm5hbWUgIT09ICcnKXtcclxuXHRcdC8vIFx0XHR2YXIgY3VycmVudFN0ZXAgPSAkc2NvcGUuY3VycmVudFN0ZXA7XHJcblx0XHQvLyBcdFx0dmFyIGN1cnJlbnRTdWJTdGVwID0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwO1xyXG5cdFx0Ly8gXHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRCeSA9IHVzZXJuYW1lO1xyXG5cdFx0Ly8gXHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdC8vIFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHRhbGVydCgnZW50ZXIgeW91ciBuYW1lJyk7XHJcblx0XHQvLyBcdHJldHVybiBmYWxzZTtcclxuXHRcdC8vIH07XHJcblxyXG5cdFx0dmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR2YXIgcmVzZXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0ge307XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmZvcm1JZCA9ICcnO1xyXG5cdFx0XHQkc2NvcGUuaXNOZXcgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyB2YXIgc3RhcnRXYXRjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdCRzY29wZS4kd2F0Y2goXHJcblx0XHQvLyBcdFx0J3RyYXZlbGVyRGF0YS5zdGVwJyxcclxuXHRcdC8vIFx0XHRmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpe1xyXG5cdFx0Ly8gXHRcdFx0aWYoISRzY29wZS5pc05ldyl7XHJcblx0XHQvLyBcdFx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHQvLyBcdFx0XHR9ZWxzZXtcclxuXHRcdC8vIFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJHNjb3BlLmN1cnJlbnRTdGVwICsgJzsnKyRzY29wZS5jdXJyZW50U3ViU3RlcCsnY2hhbmdlZCcpO1xyXG5cdFx0Ly8gXHRcdFx0XHRhcHBlbmRTdWJTdGVwRWRpdEluZm8oKTtcclxuXHRcdC8vIFx0XHRcdH1cclxuXHRcdC8vIFx0XHR9LCB0cnVlXHJcblx0XHQvLyBcdCk7XHJcblx0XHQvLyB9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0bG9hZEZvcm1MaXN0KCk7XHJcblx0XHRcdCRzY29wZS51c2VybmFtZSA9ICdKb2huIFNub3cnO1xyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLmZvcm1JZCl7XHJcblx0XHRcdFx0JHNjb3BlLmZvcm1JZCA9ICRzdGF0ZVBhcmFtcy5mb3JtSWQ7XHJcblx0XHRcdFx0JHNjb3BlLnVwZGF0ZUZvcm0oKTtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdGlmKCRzdGF0ZVBhcmFtcy5faWQpe1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHRcdFRyYXZlbGVyLmdldCgkc3RhdGVQYXJhbXMuX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdC8vIGRhdGEgaXMgYSBhcnJheS4gcmVzdWx0IGNvdWxkIGJlIG1vcmUgdGhhbiBvbmVcclxuXHRcdFx0XHRcdFx0Ly8gbmVlZCB0byBkZWFsIHdpdCB0aGlzLlxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhID0gZGF0YTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHN0YXJ0V2F0Y2goKTtcclxuXHRcdH07XHJcblxyXG5cdFx0bWFpbigpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1TZXJ2aWNlJywgW10pXHJcblxyXG5cdC5mYWN0b3J5KCdGb3JtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0Rm9ybUxpc3Q6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy8nKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbihfaWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlcj9faWQ9JysgX2lkKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS90cmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXZpZXdEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaExpa2U6IGZ1bmN0aW9uKHNuKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL3NlYXJjaExpa2UvJysgc24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIERFTEVURSBhIGZvcm1cclxuICAgICAgICAgICAgcmVtb3ZlVHJhdmVsZXI6IGZ1bmN0aW9uKF9pZCwgaW5wdXQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coX2lkKTtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3RyYXZlbGVyLycrIF9pZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHR9O1x0XHRcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
