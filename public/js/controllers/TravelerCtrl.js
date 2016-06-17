angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler', 'Form','$stateParams', function($scope, Traveler, Form, $stateParams){

		$scope.updateForm = function() {
			$scope.travelerData = {};
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

		$scope.nextStep = function(){
			// appendSubStepEditInfo();
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
			// appendSubStepEditInfo();
			$scope.currentStep = page;
			$scope.currentSubStep = 1;
			$scope.readySubmit = false;
		}

		$scope.statusSubPage = function(page){
			// appendSubStepEditInfo();
			$scope.currentSubStep = page;
		}

		$scope.goBack = function(){
			$scope.currentStep = 1;
			$scope.currentSubStep = 1;
			$scope.readySubmit = false;
		}

		$scope.save = function(){

			if($scope.travelerData.created){
				if(appendSubStepEditInfo()){

					Traveler.save($scope.travelerData)
						.success(data =>{
							// do something
						});
				}
			}else{
				$scope.submit();
			}
		}

		$scope.submit = function(){
			if(document.getElementById('username').value){
				// $scope.travelerData.completed = false;
				$scope.travelerData.created = true;
				$scope.travelerData.createdBy = document.getElementById('username').value;
				$scope.travelerData.createAt = new Date();
				Traveler.create($scope.travelerData)

					// if successful create
					.success( data =>{
						console.log(data);
						$scope.travelerData = data;
					});
			}else{
				alert('enter you name plz');
			}
		}

		$scope.new = function(){
			reset();
		}

		$scope.delete = function(){
			alert('delete click');
			if($scope.travelerData._id){
				Traveler.removeTraveler($scope.travelerData._id)
					.success(data => {
						reset();
					});
			}
		}


		var appendSubStepEditInfo = function(){
			var username = document.getElementById('username').value;
			if(username !== ''){
				var currentStep = $scope.currentStep;
				var currentSubStep = $scope.currentSubStep;
				$scope.travelerData.step[currentStep][currentSubStep].editBy = username;
				$scope.travelerData.step[currentStep][currentSubStep].editTime = new Date();
				return true
			}
			alert('enter your name');
			return false
		}

		var loadFormList = function(){
			Form.getFormList()
				.success(function(data){
					$scope.formList = data;
			});
		}


		var reset = function(){
			$scope.travelerData = {};
			$scope.currentStep = 1;
			$scope.currentSubStep = 1;
			$scope.readySubmit = false;
			$scope.formId = '';
			$scope.isNew = true;
		}

		var startWatch = function(){
			$scope.$watch(
				'travelerData.step',
				function(newValue, oldValue){
					if(!$scope.isNew){
						$scope.isNew = true;
					}else{
						console.log($scope.currentStep + ';'+$scope.currentSubStep+'changed');
						appendSubStepEditInfo();
					}
				}, true
			);
		}

		var main = function(){
			reset();
			loadFormList();

			if($stateParams.formId){
				$scope.formId = $stateParams.formId;
				$scope.updateForm();
				$scope.isNew = false;
			}


			if($stateParams._id){
				$scope.isNew = false;
				Traveler.get($stateParams._id)
					.success(function(data){
						// data is a array. result could be more than one
						// need to deal wit this.
						$scope.travelerData = data;
						startWatch();
					});
			}
		}

		main();
}])