angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler', 'Form','$stateParams', function($scope, Traveler, Form, $stateParams){
		
		
		$scope.travelerData = {};
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		$scope.readySubmit = false;

		Form.getFormList()
			.success(function(data){
				$scope.formList = data;
		});

		$scope.updateForm = function() {
			
			if($scope.formId){
				Form.get($scope.formId)
					.success(function(data){

						$scope.forms = data;
						
						// find the last subStep
						$scope.lastStep = data.steps.length;
						$scope.travelerData.formId = data.formId;

						// $scope.lastSubStep = data.forms.steps[data.forms.steps.length-1].list.length;
					});
			}
		}

		if($stateParams.formId){
			$scope.formId = $stateParams.formId;
			$scope.updateForm();
		}


		if($stateParams._id){
			Traveler.get($stateParams._id)
				.success(function(data){
					// data is a array. result could be more than one
					// need to deal wit this.
					$scope.travelerData = data;
				});
		}

		$scope.nextStep = function(){
			var object = $scope.forms.steps[$scope.currentStep-1];


			if(object.list.length >= $scope.currentSubStep+1){
				$scope.currentSubStep += 1;	
			}else{
				$scope.currentStep += 1;
				$scope.currentSubStep = 1;
				if($scope.currentStep > $scope.lastStep){
					Traveler.setReviewData($scope.travelerData);
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

		$scope.edit = function(){
			$scope.currentStep = 1;
			$scope.currentSubStep = 1;
			$scope.readySubmit = false;
		}

		$scope.submit = function(){
			var condition = true;
			if(condition){
				$scope.travelerData.completed = false;
				$scope.travelerData.submited = true;
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