angular.module('TravelerCtrl', [])
	
	.filter('unique', function(){
		return function(collection, keyname){
			var output = [],
				keys   = [];

			angular.forEach(collection, function(item){
				var key = item[keyname];
				if(keys.indexOf(key) === -1){
					keys.push(key);
					output.push(item);
				}
			});
			return output;
		};
	})
	
	.controller('TravelerController', ['$scope','Traveler', 'Form', 'DocNum', '$stateParams', function($scope, Traveler, Form, DocNum, $stateParams){

		$scope.checkReadyReview = function(){
			if($scope.travelerData.status && $scope.travelerData.status !== 'OPEN'){
				$scope.travelerData.status = 'OPEN';
				$scope.travelerData.readyReview = false;
			}else{
				$scope.travelerData.status = 'PANDING FOR REVIEW';
				$scope.travelerData.readyReview = true;
			}
		};

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
						loadDocNumList(data._id, ()=>{});
					});
			}
		};

		$scope.updateDocNum = function(){
			$scope.docNum.docNumData = $scope.docNum.docNumSelectList[$scope.docNum.docNumSelect];
			setNumDoctoTraveler();
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
			$scope.currentSubStep = 1;
			$scope.currentStep = page;
			// $scope.travelerData.readyReview = false;
			// $scope.checkReadyReview();
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
				// setNumDoctoTraveler();
				Traveler.save($scope.travelerData)
					.success(data =>{
						// do something
						alert('saved');
						shouldCollapse();
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
		};

		$scope.submit = function(){
			if($scope.username && $scope.travelerData.sn){
				// $scope.travelerData.completed = false;
				// setNumDoctoTraveler();
				$scope.travelerData.created = true;
				$scope.travelerData.createdBy = $scope.username;
				$scope.travelerData.createAt = new Date();
				Traveler.create($scope.travelerData)

					// if successful create
					.success( data =>{
						// console.log(data);
						$scope.travelerData = data;
						alert('submit complete');
						shouldCollapse();
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
		};

		$scope.printTraveler = function(){
			// var printContents = document.getElementById('div-id-selector').innerHTML;
		 //    var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
		 //    popupWin.window.focus();
		 //    popupWin.document.open();
		 //    popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>' +
		 //        '<link rel="stylesheet" type="text/css" href="libs/boosaveDocNumtstrap/dist/css/bootstrap.min.css">' +
		 //        '</head><body onload="window.print(); window.close();"><div>' + printContents + '</div></html>');
		 //    popupWin.document.close();
			window.print();
		};

		/************************
		 *
		 *
		 ************************/
		$scope.saveDocNum = function(){
			$scope.docNum.docNumData.formId = $scope.travelerData.formId;
			$scope.docNum.docNumData.formRev = $scope.travelerData.formRev;
			$scope.docNum.docNumData.formNo = $scope.travelerData.formNo;
			// console.log($scope.docNum.docNumData);
			setDocNumLabel('create');
			delete $scope.docNum.docNumData._id;
			// console.log($scope.docNum.docNumData);
			DocNum.create($scope.docNum.docNumData)
				.success(function(data){
					loadDocNumList($scope.travelerData.formId, (list)=>{
						for(let i=0; i<list.length;i++){
							if(list[i]._id === data._id){
								$scope.docNum.docNumData = data;
								$scope.docNum.docNumSelect = i.toString();
							}
						}
					});
					
				});
		};

		$scope.editDocNum = function(){
			// setDocNumLabel('edit');
			DocNum.editDocNumData($scope.docNum.docNumData)
				.success(function(data){
					loadDocNumList($scope.travelerData.formId, ()=>{});
				});
		};

		$scope.checkForSN = function(){

			if(!$scope.travelerData._id){
				Traveler.normalSearch('sn', $scope.travelerData.sn)
						.success(function(data){
							if(data.length >0 ){
								$scope.isSNExist = true;
								$scope.searchSN = data;
							}else{
								$scope.isSNExist = false;
							}
						});
			}
		};

		$scope.setTravelerData = function(){
			$scope.travelerData = $scope.searchSN[$scope.selectSN];
			loadItemRecord();
		};

		var shouldCollapse = function(){
			if($scope.travelerData.sn  && $scope.travelerData.itemRecord.docNum){
				$scope.topCollapse = true;
			}
		};

		var setNumDoctoTraveler = function(){
			$scope.travelerData.itemRecord = {
					"docNumId": $scope.docNum.docNumData._id,
					"docNum"  : $scope.docNum.docNumData.docNum
				};
		};

		var setDocNumLabel = function(action){

			let count = 1;
			if(action === 'create'){
				for(let i=0; i<$scope.docNum.docNumSelectList.length;i++){
					if($scope.docNum.docNumSelectList[i].docNum === $scope.docNum.docNumData.docNum){
						count += 1;
					}
				}
			}

			// if(action === 'edit'){
			// 	for(let i=0; i<$scope.docNum.docNumSelectList.length;i++){
			// 		if($scope.docNum.docNumSelectList[i].docNum === $scope.docNum.docNumData.docNum &&
			// 			$scope.docNum.docNumSelectList[i]._id !== $scope.docNum.docNumData._id){
			// 			count += 1;
			// 		}
			// 	}
			// }
			$scope.docNum.docNumData.label = count;
		};

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

		var loadDocNumList = function(id, callback){
			DocNum.getDocNumList(id)
				.success(function(data){
					$scope.docNum.docNumSelectList = data;
					callback(data);
				});
		};

		// load information for ItemRecord with 
		// docNum. 
		var loadItemRecord = function(){
			
			DocNum.getDocNumList($scope.travelerData.formId)
				.success(function(data){
					for(let i=0; i<data.length;i++){
						if(data[i]._id === $scope.travelerData.itemRecord.docNumId){
							$scope.docNum.docNumData = data[i];
							$scope.docNum.docNumSelect = i.toString();
							break;
						}
					}
				});
		};

		var init = function(){
			$scope.topCollapse=false;
			$scope.username = 'John Snow';
			$scope.docNum = {};
			$scope.isSNExist = false;
			$scope.searchSN = {};
			$scope.selectSN = '0';
		};

		var main = function(){

			init();
			reset();
			loadFormList();

			if($stateParams.formId){
				$scope.formId = $stateParams.formId;
				$scope.updateForm();
				$scope.isNew = false;
			}

			// load the traveler from Search page
			// take the pramas from URL
			if($stateParams._id){
				$scope.isNew = false;
				Traveler.get('_id', $stateParams._id)
					.success(function(data){
						// data is a array. result could be more than one
						// need to deal wit this.
						$scope.travelerData = data;
						loadItemRecord();
						shouldCollapse();
					});
			}
			
		};

		main();
}]);