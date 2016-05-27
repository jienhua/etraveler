angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler', 'Form',  function($scope, Traveler, Form){

		$scope.travelerData = {"formId":1,"sn":"123123","itemRecord":{"1":"12312","2":"31231"},"step":{"1":{"1":{"qty":23123,"checkbox":{"Option2":true,"Option3":true},"radio":"Green","select":"3","comment":"123123"},"2":{"qty":1231,"comment":"23123"}},"2":{"1":{"qty":12312,"comment":"3123"},"2":{"qty":12312,"comment":"3123"}}},"createAt":"2016-05-27T00:59:00.903Z"};

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