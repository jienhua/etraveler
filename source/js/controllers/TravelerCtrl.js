angular.module('TravelerCtrl', [])
	
	.controller('TravelerController', ['$scope','Traveler', 'Form','$stateParams', function($scope, Traveler, Form, $stateParams){

		$scope.checkReadyReview = function(){
			if($scope.travelerData.status && $scope.travelerData.status !== 'OPEN'){
				$scope.travelerData.status = 'OPEN';
				$scope.travelerData.readyReview = false;
			}else{
				$scope.travelerData.status = 'PANDING FOR REVIEW';
				$scope.travelerData.readyReview = true;
			}
		}

		$scope.updateForm = function() {
			$scope.travelerData = {};
			if($scope.formId){
				Form.get($scope.formId)
					.success(function(data){
						$scope.forms = data;				
						// find the last subStep
						$scope.lastStep = data.steps.length;
						// init the travelerData from formData
						$scope.travelerData.formId = data._id;
						$scope.travelerData.formRev = data.formRev;
						$scope.travelerData.formNo = data.formNo;
						$scope.travelerData.customer = data.customer;
						$scope.travelerData.status = 'OPEN';
					});
			}
		};

		$scope.nextStep = function(){
			var object = $scope.forms.steps[$scope.currentStep-1];
			if(object.list.length >= $scope.currentSubStep+1){
				$scope.currentSubStep += 1;	
			}else{
				$scope.currentStep += 1;
				$scope.currentSubStep = 1;
				if($scope.currentStep > $scope.lastStep){
					// Traveler.setReviewData($scope.travelerData);
					// $scope.travelerData.readyReview = true;		
					$scope.checkReadyReview();
				}
			}
		};

		$scope.statusPage = function(page){
			$scope.currentStep = page;
			$scope.currentSubStep = 1;
			// $scope.travelerData.readyReview = false;
			$scope.checkReadyReview();
		};

		$scope.statusSubPage = function(page){
			$scope.currentSubStep = page;
		};

		$scope.goBack = function(){
			$scope.currentStep = 1;
			$scope.currentSubStep = 1;
			// $scope.travelerData.readyReview = false;
			$scope.checkReadyReview();
		};

		$scope.save = function(){

			if($scope.travelerData.created){

				Traveler.save($scope.travelerData)
					.success(data =>{
						// do something
					});
			}else{
				$scope.submit();
			}
		};

		$scope.review = function(option){
			if($scope.travelerData.reviewBy){
			if(option === 'reject'){
				$scope.travelerData.status = 'REJECT';
			}else if(option === 'complete'){
				$scope.travelerData.status = 'COMPLETED';
			}
			$scope.travelerData.reviewAt = new Date();
			$scope.save();
			}else{
				alert('enter reviewer name');
			}
		}

		$scope.submit = function(){
			if($scope.username && $scope.travelerData.sn){
				// $scope.travelerData.completed = false;
				$scope.travelerData.created = true;
				$scope.travelerData.createdBy = $scope.username;
				$scope.travelerData.createAt = new Date();
				Traveler.create($scope.travelerData)

					// if successful create
					.success( data =>{
						console.log(data);
						$scope.travelerData = data;
					});
			}else{
				alert('enter your name or serial number plz ');
			}
		};

		$scope.new = function(){
			reset();
		};

		$scope.delete = function(){
			alert('delete click');
			if($scope.travelerData._id){
				Traveler.removeTraveler($scope.travelerData._id)
					.success(data => {
						reset();
					});
			}
		};

		$scope.appendSubStepEditInfo = function(){
			var username = $scope.username;
			if(username !== ''){
				var currentStep = $scope.currentStep;
				var currentSubStep = $scope.currentSubStep;
				$scope.travelerData.step[currentStep][currentSubStep].editBy = username;
				$scope.travelerData.step[currentStep][currentSubStep].editTime = new Date();
				return true;
			}
			alert('enter your name');
			return false;
		}

		// var appendSubStepEditInfo = function(){
		// 	alert(123123);
		// 	var username = document.getElementById('username').value;
		// 	if(username !== ''){
		// 		var currentStep = $scope.currentStep;
		// 		var currentSubStep = $scope.currentSubStep;
		// 		$scope.travelerData.step[currentStep][currentSubStep].editBy = username;
		// 		$scope.travelerData.step[currentStep][currentSubStep].editTime = new Date();
		// 		return true;
		// 	}
		// 	alert('enter your name');
		// 	return false;
		// };

		var loadFormList = function(){
			Form.getFormList()
				.success(function(data){
					$scope.formList = data;
			});
		};


		var reset = function(){
			$scope.travelerData = {};
			$scope.currentStep = 1;
			$scope.currentSubStep = 1;
			$scope.travelerData.readyReview = false;
			$scope.formId = '';
			$scope.isNew = true;
		};

		// var startWatch = function(){
		// 	$scope.$watch(
		// 		'travelerData.step',
		// 		function(newValue, oldValue){
		// 			if(!$scope.isNew){
		// 				$scope.isNew = true;
		// 			}else{
		// 				// console.log($scope.currentStep + ';'+$scope.currentSubStep+'changed');
		// 				appendSubStepEditInfo();
		// 			}
		// 		}, true
		// 	);
		// };

		var main = function(){
			reset();
			loadFormList();
			$scope.username = 'John Snow';

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
					});
			}
			// startWatch();
		};

		main();
}]);