angular.module('sampleApp', 
	[
		'ui.router', 
		'ui.bootstrap',
		'appRoutes',
		'dndLists',

		'AppCtrl',
		'MainCtrl', 
		'TravelerCtrl', 
		'SearchTravelerCtrl', 
		'FormGenCtrl.js',
		
		'TravelerService', 
		'FormService',
		'DocNumService',
		'CounterService'
	]
);