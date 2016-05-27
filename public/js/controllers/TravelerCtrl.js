angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler', 'Form',  function($scope, Traveler, Form){

		$scope.travelerData ={};

		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		$scope.readySubmit = false;

		Form.get()
			.success(function(data){
				$scope.forms = data.forms;
				
				// find the last subStep
				$scope.lastStep = data.forms.steps.length;
				$scope.travelerData.formId = data.forms.formId;
				// $scope.lastSubStep = data.forms.steps[data.forms.steps.length-1].list.length;
			});


		$scope.nextStep = function(){
			var object = $scope.forms.steps[$scope.currentStep-1];


			if(object.list.length >= $scope.currentSubStep+1){
				$scope.currentSubStep += 1;	
			}else{
				$scope.currentStep += 1;
				$scope.currentSubStep = 1;
				if($scope.currentStep > $scope.lastStep){
					$scope.readySubmit = true;
				}
			}
		};

		$scope.statusPage = function(page){
			$scope.currentStep = page;
			$scope.currentSubStep = 1;
			$scope.readySubmit = false;
		}

		$scope.statusSubPage = function(page){
			$scope.currentSubStep = page;
		}

		$scope.submit = function(){
			var condition = true;
			if(condition){
				$scope.travelerData.createAt = new Date();
				Traveler.create($scope.travelerData)

					// if successful create
					.success( data =>{
						console.log(data);
						// do something.
					});
			}
		}

}])