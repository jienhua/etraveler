angular.module('sampleApp', 
	[
		'ui.router', 
		'ui.bootstrap',
		'appRoutes',

		'AppCtrl',
		'MainCtrl', 
		'TravelerCtrl', 
		'SearchTravelerCtrl', 
		'FormGenCtrl.js',
		
		'TravelerService', 
		'FormService'
	]
);