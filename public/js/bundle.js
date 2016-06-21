'use strict';

angular.module('sampleApp', ['ui.router', 'appRoutes', 'MainCtrl', 'TravelerCtrl', 'SearchTravelerCtrl', 'FormGenCtrl.js', 'TravelerService', 'FormService']);
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
				templateUrl: 'views/formReview.html',
				controller: ['$scope', 'Traveler', 'Form', function ($scope, Traveler, Form) {
					$scope.reviewData = Traveler.getReviewData();
					Form.get($scope.reviewData.formId).success(function (data) {
						$scope.forms = data;
					});
				}]
			}
		}
	}).state('searchTraveler', {
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

	$scope.updateForm = function () {
		$scope.travelerData = {};
		if ($scope.formId) {
			Form.get($scope.formId).success(function (data) {
				$scope.forms = data;
				// find the last subStep
				$scope.lastStep = data.steps.length;
				$scope.travelerData.formId = data.formId;
				// $scope.lastSubStep = data.forms.steps[data.forms.steps.length-1].list.length;
			});
		}
	};

	$scope.nextStep = function () {
		// appendSubStepEditInfo();
		var object = $scope.forms.steps[$scope.currentStep - 1];
		if (object.list.length >= $scope.currentSubStep + 1) {
			$scope.currentSubStep += 1;
		} else {
			$scope.currentStep += 1;
			$scope.currentSubStep = 1;
			if ($scope.currentStep > $scope.lastStep) {
				Traveler.setReviewData($scope.travelerData);
				$scope.readySubmit = true;
			}
		}
	};

	$scope.statusPage = function (page) {
		// appendSubStepEditInfo();
		$scope.currentStep = page;
		$scope.currentSubStep = 1;
		$scope.readySubmit = false;
	};

	$scope.statusSubPage = function (page) {
		// appendSubStepEditInfo();
		$scope.currentSubStep = page;
	};

	$scope.goBack = function () {
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		$scope.readySubmit = false;
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

	$scope.submit = function () {
		if (document.getElementById('username').value) {
			// $scope.travelerData.completed = false;
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = document.getElementById('username').value;
			$scope.travelerData.createAt = new Date();
			Traveler.create($scope.travelerData)

			// if successful create
			.success(function (data) {
				console.log(data);
				$scope.travelerData = data;
			});
		} else {
			alert('enter you name plz');
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

	var appendSubStepEditInfo = function appendSubStepEditInfo() {
		var username = document.getElementById('username').value;
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

	var loadFormList = function loadFormList() {
		Form.getFormList().success(function (data) {
			$scope.formList = data;
		});
	};

	var reset = function reset() {
		$scope.travelerData = {};
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		$scope.readySubmit = false;
		$scope.formId = '';
		$scope.isNew = true;
	};

	var startWatch = function startWatch() {
		$scope.$watch('travelerData.step', function (newValue, oldValue) {
			if (!$scope.isNew) {
				$scope.isNew = true;
			} else {
				console.log($scope.currentStep + ';' + $scope.currentSubStep + 'changed');
				appendSubStepEditInfo();
			}
		}, true);
	};

	var main = function main() {
		reset();
		loadFormList();

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
		startWatch();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0Zvcm1HZW5DdHJsLmpzIiwiY29udHJvbGxlcnMvTWFpbkN0cmwuanMiLCJjb250cm9sbGVycy9TZWFyY2hUcmF2ZWxlckN0cmwuanMiLCJjb250cm9sbGVycy9UcmF2ZWxlckN0cmwuanMiLCJzZXJ2aWNlcy9Gb3JtU2VydmljZS5qcyIsInNlcnZpY2VzL1RyYXZlbGVyU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFDQyxDQUNDLFdBREQsRUFFQyxXQUZELEVBSUMsVUFKRCxFQUtDLGNBTEQsRUFNQyxvQkFORCxFQU9DLGdCQVBELEVBU0MsaUJBVEQsRUFVQyxhQVZELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYSx1QkFEUTtBQUVyQixnQkFBWSxDQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLE1BQXZCLEVBQThCLFVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQixJQUEzQixFQUFnQztBQUN6RSxZQUFPLFVBQVAsR0FBb0IsU0FBUyxhQUFULEVBQXBC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QixtQkFBTyxNQUFNLElBQU4sQ0FBVyxlQUFYLEVBQTRCLFFBQTVCLENBQVA7QUFDQSxTQU5FOztBQVFILHVCQUFlLHlCQUFVO0FBQ3JCLG1CQUFPLFVBQVA7QUFDSCxTQVZFOztBQVlILGFBQUssYUFBUyxHQUFULEVBQWE7QUFDZCxtQkFBTyxNQUFNLEdBQU4sQ0FBVSx1QkFBc0IsR0FBaEMsQ0FBUDtBQUNILFNBZEU7O0FBZ0JILGNBQU0sY0FBUyxJQUFULEVBQWM7QUFDaEIsbUJBQU8sTUFBTSxHQUFOLENBQVUsZUFBVixFQUEyQixJQUEzQixDQUFQO0FBQ0gsU0FsQkU7O0FBb0JILHVCQUFlLHVCQUFTLElBQVQsRUFBYztBQUN6Qix5QkFBYSxJQUFiO0FBQ0gsU0F0QkU7O0FBd0JILG9CQUFZLG9CQUFTLEVBQVQsRUFBWTtBQUN2QixtQkFBTyxNQUFNLEdBQU4sQ0FBVSw4QkFBNkIsRUFBdkMsQ0FBUDtBQUNBLFNBMUJFOztBQTRCSCx3QkFBZ0Isd0JBQVMsR0FBVCxFQUFjLEtBQWQsRUFBb0I7QUFDaEMsb0JBQVEsR0FBUixDQUFZLEdBQVo7QUFDSCxtQkFBTyxNQUFNLE1BQU4sQ0FBYSxtQkFBa0IsR0FBL0IsQ0FBUDtBQUNBO0FBL0JFLEtBQVA7QUFpQ1AsQ0FyQ3dCLENBRnpCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdzYW1wbGVBcHAnLCBcclxuXHRbXHJcblx0XHQndWkucm91dGVyJywgXHJcblx0XHQnYXBwUm91dGVzJywgXHJcblxyXG5cdFx0J01haW5DdHJsJywgXHJcblx0XHQnVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnU2VhcmNoVHJhdmVsZXJDdHJsJywgXHJcblx0XHQnRm9ybUdlbkN0cmwuanMnLFxyXG5cdFx0XHJcblx0XHQnVHJhdmVsZXJTZXJ2aWNlJywgXHJcblx0XHQnRm9ybVNlcnZpY2UnXHJcblx0XVxyXG4pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHBSb3V0ZXMnLCBbJ3VpLnJvdXRlciddKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInICxcclxuXHRcdGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuXHRcdC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblxyXG5cdFx0XHQvLyBob21lIHBhZ2VcclxuXHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdHVybDogJy9ob21lJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ01haW5Db250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdC5zdGF0ZSgndHJhdmVsZXInLCB7XHJcblx0XHRcdFx0dXJsOiAnL3RyYXZlbGVyP19pZCZmb3JtSWQnLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90cmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1RyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9ybVJldmlld0B0cmF2ZWxlcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1SZXZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgJ0Zvcm0nLGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIsIEZvcm0pe1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXZpZXdEYXRhID0gVHJhdmVsZXIuZ2V0UmV2aWV3RGF0YSgpO1xyXG5cdFx0XHRcdFx0XHRcdEZvcm0uZ2V0KCRzY29wZS5yZXZpZXdEYXRhLmZvcm1JZClcclxuXHRcdFx0XHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnc2VhcmNoVHJhdmVsZXInLHtcclxuXHRcdFx0XHR1cmw6ICcvc2VhcmNoVHJhdmVsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoVHJhdmVsZXIuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcidcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdC5zdGF0ZSgnZm9ybUdlbmVyYXRvcicse1xyXG5cdFx0XHRcdHVybDogJy9mb3JtR2VuZXJhdG9yJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm1HZW5lcmF0b3IuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybUdlbkN0cmwuanMnLCBbXSlcclxuXHRcclxuXHQuY29udHJvbGxlcignRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ0Zvcm0nICwgZnVuY3Rpb24oJHNjb3BlLCBGb3JtKXtcclxuXHJcblx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0gJzEyMycpe1xyXG5cdFx0XHRGb3JtLmNyZWF0ZSgkc2NvcGUudGVtcGxhdGUpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xyXG5cdFx0XHRcdFx0YWxlcnQoJ2FkZCcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgnZ28gaG9tZSBzb24nKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ01haW5DdHJsJywgW10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS50YWdsaW5lID0gJ3RvIHRoZSBtb29uIGFuZCBiYWNrISc7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnU2VhcmNoVHJhdmVsZXJDdHJsJywgW10pXHJcblxyXG5cdC5jb250cm9sbGVyKCdTZWFyY2hUcmF2ZWxlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdUcmF2ZWxlcicsIGZ1bmN0aW9uKCRzY29wZSwgVHJhdmVsZXIpe1xyXG5cclxuXHRcdCRzY29wZS5pc1NlYXJjaCA9IGZhbHNlO1xyXG5cclxuXHRcdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudElucHV0ID0gJHNjb3BlLnNlYXJjaElucHV0O1xyXG5cdFx0XHQkc2NvcGUuaXNTZWFyY2ggPSB0cnVlO1xyXG5cdFx0XHRpZigkc2NvcGUuc2VhcmNoSW5wdXQpe1xyXG5cdFx0XHRcdGxldCBzbiA9ICRzY29wZS5zZWFyY2hJbnB1dC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLnNlYXJjaExpa2Uoc24pXHJcblxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT57XHJcblx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdFRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBmb3JtSWQpe1xyXG5cdFx0XHR3aW5kb3cub3BlbigndHJhdmVsZXI/X2lkPScrX2lkKycmZm9ybUlkPScrZm9ybUlkLCAnX2JsYW5rJyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5yZW1vdmVUcmF2ZWxlciA9IGZ1bmN0aW9uKF9pZCwgaW5kZXgpe1xyXG5cdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcihfaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoIGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnJlc3VsdD1kYXRhO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnJlc3VsdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1RyYXZlbGVyQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdUcmF2ZWxlckNvbnRyb2xsZXInLCBbJyRzY29wZScsJ1RyYXZlbGVyJywgJ0Zvcm0nLCckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtLCAkc3RhdGVQYXJhbXMpe1xyXG5cclxuXHRcdCRzY29wZS51cGRhdGVGb3JtID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0aWYoJHNjb3BlLmZvcm1JZCl7XHJcblx0XHRcdFx0Rm9ybS5nZXQoJHNjb3BlLmZvcm1JZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZm9ybXMgPSBkYXRhO1x0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGZpbmQgdGhlIGxhc3Qgc3ViU3RlcFxyXG5cdFx0XHRcdFx0XHQkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQgPSBkYXRhLmZvcm1JZDtcclxuXHRcdFx0XHRcdFx0Ly8gJHNjb3BlLmxhc3RTdWJTdGVwID0gZGF0YS5mb3Jtcy5zdGVwc1tkYXRhLmZvcm1zLnN0ZXBzLmxlbmd0aC0xXS5saXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXh0U3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGFwcGVuZFN1YlN0ZXBFZGl0SW5mbygpO1xyXG5cdFx0XHR2YXIgb2JqZWN0ID0gJHNjb3BlLmZvcm1zLnN0ZXBzWyRzY29wZS5jdXJyZW50U3RlcC0xXTtcclxuXHRcdFx0aWYob2JqZWN0Lmxpc3QubGVuZ3RoID49ICRzY29wZS5jdXJyZW50U3ViU3RlcCsxKXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgKz0gMTtcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgKz0gMTtcclxuXHRcdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50U3RlcCA+ICRzY29wZS5sYXN0U3RlcCl7XHJcblx0XHRcdFx0XHRUcmF2ZWxlci5zZXRSZXZpZXdEYXRhKCRzY29wZS50cmF2ZWxlckRhdGEpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnJlYWR5U3VibWl0ID0gdHJ1ZTtcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdC8vIGFwcGVuZFN1YlN0ZXBFZGl0SW5mbygpO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSBwYWdlO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUucmVhZHlTdWJtaXQgPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1N1YlBhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0Ly8gYXBwZW5kU3ViU3RlcEVkaXRJbmZvKCk7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IHBhZ2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUucmVhZHlTdWJtaXQgPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0aWYoJHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVkKXtcclxuXHJcblx0XHRcdFx0VHJhdmVsZXIuc2F2ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLnN1Ym1pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWUnKS52YWx1ZSl7XHJcblx0XHRcdFx0Ly8gJHNjb3BlLnRyYXZlbGVyRGF0YS5jb21wbGV0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJuYW1lJykudmFsdWU7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5jcmVhdGVBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0VHJhdmVsZXIuY3JlYXRlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgc3VjY2Vzc2Z1bCBjcmVhdGVcclxuXHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ2VudGVyIHlvdSBuYW1lIHBseicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5uZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXNldCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0YWxlcnQoJ2RlbGV0ZSBjbGljaycpO1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZCl7XHJcblx0XHRcdFx0VHJhdmVsZXIucmVtb3ZlVHJhdmVsZXIoJHNjb3BlLnRyYXZlbGVyRGF0YS5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR2YXIgYXBwZW5kU3ViU3RlcEVkaXRJbmZvID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJuYW1lJykudmFsdWU7XHJcblx0XHRcdGlmKHVzZXJuYW1lICE9PSAnJyl7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdGVwID0gJHNjb3BlLmN1cnJlbnRTdGVwO1xyXG5cdFx0XHRcdHZhciBjdXJyZW50U3ViU3RlcCA9ICRzY29wZS5jdXJyZW50U3ViU3RlcDtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0QnkgPSB1c2VybmFtZTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0ZXBbY3VycmVudFN0ZXBdW2N1cnJlbnRTdWJTdGVwXS5lZGl0VGltZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0YWxlcnQoJ2VudGVyIHlvdXIgbmFtZScpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRm9ybUxpc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRGb3JtLmdldEZvcm1MaXN0KClcclxuXHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdCRzY29wZS5mb3JtTGlzdCA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dmFyIHJlc2V0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUuY3VycmVudFN1YlN0ZXAgPSAxO1xyXG5cdFx0XHQkc2NvcGUucmVhZHlTdWJtaXQgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmZvcm1JZCA9ICcnO1xyXG5cdFx0XHQkc2NvcGUuaXNOZXcgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgc3RhcnRXYXRjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS4kd2F0Y2goXHJcblx0XHRcdFx0J3RyYXZlbGVyRGF0YS5zdGVwJyxcclxuXHRcdFx0XHRmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpe1xyXG5cdFx0XHRcdFx0aWYoISRzY29wZS5pc05ldyl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLmN1cnJlbnRTdGVwICsgJzsnKyRzY29wZS5jdXJyZW50U3ViU3RlcCsnY2hhbmdlZCcpO1xyXG5cdFx0XHRcdFx0XHRhcHBlbmRTdWJTdGVwRWRpdEluZm8oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCB0cnVlXHJcblx0XHRcdCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmVzZXQoKTtcclxuXHRcdFx0bG9hZEZvcm1MaXN0KCk7XHJcblxyXG5cdFx0XHRpZigkc3RhdGVQYXJhbXMuZm9ybUlkKXtcclxuXHRcdFx0XHQkc2NvcGUuZm9ybUlkID0gJHN0YXRlUGFyYW1zLmZvcm1JZDtcclxuXHRcdFx0XHQkc2NvcGUudXBkYXRlRm9ybSgpO1xyXG5cdFx0XHRcdCRzY29wZS5pc05ldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3RhcnRXYXRjaCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybVNlcnZpY2UnLCBbXSlcclxuXHJcblx0LmZhY3RvcnkoJ0Zvcm0nLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zLycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0OiBmdW5jdGlvbihmb3JtSWQpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1RyYXZlbGVyU2VydmljZScsIFtdKVxyXG4gICAgICAgXHJcbiAgICAuZmFjdG9yeSgnVHJhdmVsZXInLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICAgICAgICB2YXIgcmV2aWV3RGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG5cdFxyXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIHdvcmsgd2hlbiBtb3JlIEFQSSByb3V0ZXMgYXJlIGRlZmluZWQgb24gdGhlIE5vZGUgc2lkZSBvZiB0aGluZ3NcclxuICAgICAgICAgICAgLy8gY2FsbCB0byBQT1NUIGFuZCBjcmVhdGUgYSBuZXcgZm9ybVxyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGZvcm1EYXRhKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90cmF2ZWxlcicsIGZvcm1EYXRhKTtcclxuICAgICAgICAgICAgfSwgXHJcblxyXG4gICAgICAgICAgICBnZXRSZXZpZXdEYXRhOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldmlld0RhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKF9pZCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyP19pZD0nKyBfaWQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3RyYXZlbGVyJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRSZXZpZXdEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHJldmlld0RhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2VhcmNoTGlrZTogZnVuY3Rpb24oc24pe1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhdmVsZXIvc2VhcmNoTGlrZS8nKyBzbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gREVMRVRFIGEgZm9ybVxyXG4gICAgICAgICAgICByZW1vdmVUcmF2ZWxlcjogZnVuY3Rpb24oX2lkLCBpbnB1dCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfaWQpO1xyXG4gICAgICAgICAgICBcdHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvdHJhdmVsZXIvJysgX2lkKTtcclxuICAgICAgICAgICAgfVxyXG5cdH07XHRcdFxyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
