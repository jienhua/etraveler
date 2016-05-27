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

			// nerds page that will use the NerdController
			.state('traveler', {
				url: '/traveler',
				views:{
					'':{
						templateUrl: 'views/traveler.html',
						controller: 'TravelerController'
					},
					'formReview@traveler':{
						templateUrl: 'views/formReview.html',
						controller: function($scope, Traveler, Form){
							$scope.reviewData = Traveler.getReviewData();
							// console.log($scope.reviewData.step["1"]["1"]["checkbox"]["Option2"]);
							Form.get()
								.success(function(data){
									$scope.forms = data.forms;
							});
						}
					}
				}
			})

			// .state('home.formReview',{
			// 	url: '/formReview',
			// 	templateUrl: 'views/formReview.html',
			// 	controller: function($scope, TravelerService){

			// 	}
			// })

			.state('searchTraveler',{
				url: '/searchTraveler',
				templateUrl: 'views/searchTraveler.html',
				controller: 'SearchTravelerController'
			});

		$locationProvider.html5Mode(true);
}]);