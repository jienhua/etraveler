angular.module('appRoutes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider' ,
		function($stateProvider, $urlRouterProvider, $locationProvider){

		$urlRouterProvider.otherwise('/home');

		// $urlRouterProvider.otherwise('/');
		$stateProvider

			// home page
			.state('home', {
				url: '/home',
				templateUrl: 'views/home.html',
				controller: 'MainController'
			})

			
			.state('traveler', {
				url: '/traveler?_id&formId',
				views:{
					'':{
						templateUrl: 'views/traveler.html',
						controller: 'TravelerController'
					},
					'formReview@traveler':{
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
			})

			.state('searchTraveler',{
				url: '/searchTraveler',
				views:{
					'':{
						templateUrl: 'views/searchTraveler.html',
						controller: 'SearchTravelerController'
					},
					'formReview@searchTraveler':{
						templateUrl: 'views/formReview.html'
					}
				}
			})

			.state('formGenerator',{
				url: '/formGenerator',
				views:{
					'':{
						templateUrl: 'views/formGeneratorNav.html',
						controller: 'FormGeneratorController'
					},
					'templateGenerator@formGenerator':{
						templateUrl: 'views/templateGenerator.html',
						controller: 'FormGeneratorController'
					},
					'templateCreator@formGenerator':{
						templateUrl: 'views/templateCreator.html',
						controller: 'FormGeneratorController'
					}
				}
			});

		$locationProvider.html5Mode(true);
}]);