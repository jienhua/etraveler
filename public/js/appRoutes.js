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
							// console.log($scope.reviewData);
							Form.get($scope.reviewData.formId)
								.success(function(data){
									$scope.forms = data.forms;
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
			});

		$locationProvider.html5Mode(true);
}]);