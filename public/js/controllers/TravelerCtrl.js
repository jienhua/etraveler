angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler',  function($scope, Traveler){

		$scope.travelerData ={};

		$scope.currentStep = 1;
		$scope.currentSubStep = 1;

		Traveler.get()
			.success(function(data){
				$scope.forms = data.forms;
				// $scope.SN = data.forms.SN;
			});

		$scope.nextStep = function(){
			var object = $scope.forms.steps[$scope.currentStep-1];
			if(object.list.length >= $scope.currentSubStep+1){
				$scope.currentSubStep += 1;
			}else{
				$scope.currentStep += 1;
				$scope.currentSubStep = 1;
			}
		};

		$scope.statusPage = function(page){
			$scope.currentStep = page;
			$scope.currentSubStep = 1;
		}

		$scope.statusSubPage = function(page){
			$scope.currentSubStep = page;
		}

}])