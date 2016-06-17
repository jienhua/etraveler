angular.module('SearchTravelerCtrl', [])

	.controller('SearchTravelerController', ['$scope', 'Traveler', function($scope, Traveler){

		$scope.isSearch = false;

		$scope.search = function(){
			$scope.currentInput = $scope.searchInput;
			$scope.isSearch = true;
			if($scope.searchInput){
				let sn = $scope.searchInput.toString();
				Traveler.searchLike(sn)

					.success( data =>{
						$scope.result=data;

					});
			}
		};

		$scope.editTraveler = function(_id, formId){
			window.open('traveler?_id='+_id+'&formId='+formId, '_blank');
		};

		$scope.removeTraveler = function(_id, index){
			Traveler.removeTraveler(_id)
				.success( data => {
					// $scope.result=data;
					$scope.result.splice(index, 1);
				});
		};
	}]);