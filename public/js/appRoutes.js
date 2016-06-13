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
						templateUrl: 'views/formReview.html',
						controller: function($scope, Traveler, Form){
							$scope.reviewData = Traveler.getReviewData();
							// alert(123);
							// console.log($scope.reviewData);
							// alert($scope.reviewData);
							// console.log(123);
							Form.get($scope.reviewData.formId)
								.success(function(data){
									// console.log('review here?');
									console.log($scope.reviewData.formId);
									console.log(data);
									$scope.forms = data;
							});
						}
					}
				}
			})

			// .state('newTraveler',{
			// 	url: '/newTraveler',
			// 	templateUrl: 'views/newTraveler.html'
			// })

			.state('searchTraveler',{
				url: '/searchTraveler',
				templateUrl: 'views/searchTraveler.html',
				controller: 'SearchTravelerController'
			})

			.state('formGenerator',{
				url: '/formGenerator',
				templateUrl: 'views/formGenerator.html',
				controller: 'FormGeneratorController'
			});

		$locationProvider.html5Mode(true);
}]);