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
				templateUrl: 'views/traveler.html',
				controller: 'TravelerController'
			})

			.state('searchTraveler',{
				url: '/searchTraveler',
				templateUrl: 'views/searchTraveler.html',
				controller: 'SearchTravelerController'
			});

		$locationProvider.html5Mode(true);
}]);