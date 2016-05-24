angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler',  function($scope, Traveler){

		$scope.tagline = 'Nothing beats a pocket protector!';
		Traveler.get()
			.success(function(data){
				$scope.forms = data;
			});
}])