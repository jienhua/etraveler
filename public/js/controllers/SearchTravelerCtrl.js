angular.module('SearchTravelerCtrl', [])

	.controller('SearchTravelerController', ['$scope', 'Traveler', function($scope, Traveler){

		$scope.isSearch = false;

		$scope.search = function(){
			$scope.result = {};
			$scope.isSearch = true;
			if($scope.searchInput){
				let sn = $scope.searchInput.toString();
				Traveler.search(sn)

					.success( data =>{
						$scope.result=data;

					});
			}
		}
	}]);