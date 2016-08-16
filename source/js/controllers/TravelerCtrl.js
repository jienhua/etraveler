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
	
	.controller('TravelerController', ['$scope','Traveler', 'Form', 'DocNum', 'Counter', '$stateParams', function($scope, Traveler, Form, DocNum, Counter, $stateParams){

		$scope.checkReadyReview = function(){
			if($scope.travelerData.status && $scope.travelerData.status !== 'OPEN'){
				$scope.travelerData.status = 'OPEN';
				$scope.travelerData.readyReview = false;
			}else{
				$scope.travelerData.status = 'PANDING FOR REVIEW';
				$scope.travelerData.readyReview = true;
			}
			$scope.save();
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
			$scope.selectSNList = [];
			$scope.isWorkFind = false;
			$scope.docNum.docNumData = $scope.docNum.docNumSelectList[$scope.docNum.docNumSelect];
			setNumDoctoTraveler();

			// call a function to use docnum to return the list of serial number associate with 
			// this docnum
			getSNList($scope.docNum.docNumData._id);
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

		$scope.save = function(callback){
			
			let idList = [];
			for(let i = 0;i < $scope.selectSNList.length;i++){
				idList.push($scope.selectSNList[i]._id);
			}

			let data = {
				idList : idList,
				travelerData: $scope.travelerData
			};
			if(idList.length > 1){
				delete data.travelerData.sn;
			}
			Traveler.updateMultiple(data)
				.success(data =>{
					if(callback)
						callback(data);
				});
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


		$scope.saveDocNum = function(){
			$scope.docNum.docNumData.formId = $scope.travelerData.formId;
			$scope.docNum.docNumData.formRev = $scope.travelerData.formRev;
			$scope.docNum.docNumData.formNo = $scope.travelerData.formNo;
			setDocNumLabel('create');
			delete $scope.docNum.docNumData._id;
			DocNum.create($scope.docNum.docNumData)
				.success(function(data){
					loadDocNumList($scope.travelerData.formId, (list)=>{
						for(let i=0; i<list.length;i++){
							if(list[i]._id === data._id){
								$scope.docNum.docNumData = data;
								$scope.docNum.docNumSelect = i.toString();
								$scope.travelerData.itemRecord = {"docNum":$scope.docNum.docNumData.docNum};
							}
						}
					});
					
				});
		};

		$scope.editDocNum = function(){
			// setDocNumLabel('edit');
			// console.log(JSON.stringify($scope.docNum.docNumData));
			DocNum.editDocNumData($scope.docNum.docNumData)
				.success(function(data){
					loadDocNumList($scope.travelerData.formId, ()=>{});
				});
		};

		$scope.checkForSN = function(data){

			if(data){
				$scope.isSNExistMoreThanOne = false;
				for(let i = 0; i < $scope.SNListForDocNum.length; i++){
					if($scope.SNListForDocNum[i].sn === data){
						$scope.isSNExistMoreThanOne = true;
						if(confirm('SN already exist. do you want to create a new traveler with same sn?')){
							$scope.isSNExistMoreThanOne = false;
						}
						break;
					}
				}

				if(!$scope.isSNExistMoreThanOne){
					$scope.isSNExistMoreThanOne = false;
					let item = {
						"sn": data,
						"status": "OPEN",
						"createAt": new Date
					}
					createNewTraveler(item);
					data = '';
					item = {};
				}
			}
		};

		$scope.moveToSelectSNList = function(){
			// console.log($scope.SNListForDocNum.length);
	
			let stack = [];
			for(let i=$scope.SNListForDocNum.length;i > 0;i--){
				let el = $scope.SNListForDocNum.pop();
				if(el.checkbox === true){
					el.checkbox = false;
					$scope.selectSNList.push(el);
				}else{
					stack.push(el);
				}
			}
			$scope.SNListForDocNum = stack;
			stack = null;
		};

		$scope.moveToSNListForDocNum = function(){
			let stack = [];
			for(let i =$scope.selectSNList.length; i>0;i--){
				let el = $scope.selectSNList.pop();
				if(el.checkbox ===  true){
					el.checkbox = false;
					$scope.SNListForDocNum.push(el);
				}else{
					stack.push(el);
				}
			}
			$scope.selectSNList = stack;
			stack = null;
		};

		$scope.selectAllList = function(list){
			let bool = list[0].checkbox;
			for(let i=0;i<list.length;i++){
				list[i].checkbox = !bool;
			}
		};

		$scope.loadTraveler = function(input){
			if(input){
				$scope.selectSN = input;
			}
			Traveler.normalSearch('_id', $scope.selectSN)
				.success(data =>{
					$scope.travelerData = data[0];
					
				});
		};

		$scope.searchSN = function(sn){

			if(sn){
				$scope.searchSNList= [];
				$scope.clearAfterChangeTab();
				$scope.selectSNList = [];
				Traveler.normalSearch('sn', sn, 'sn|createAt|status')
					.success(data =>{
						$scope.isSNExist = true;
						$scope.isSNMoreThanOne = false;
						if(data.length > 1){
							$scope.isSNMoreThanOne = true;
							$scope.searchSNList = data;
						}else if(data.length == 1){
							$scope.selectSNList.push({"_id":data[0]._id, "sn":data[0].sn});
							$scope.selectSN = data[0]._id;
							$scope.loadTraveler();
							loadItemRecord(data[0].formId);
							// $scope.isStartWork = true;
						}else{
							$scope.isSNExist = false;
						}
					});
			}
		};

		$scope.setTravelerData = function(data){
			$scope.selectSNList = [];
			$scope.selectSNList.push({"_id":$scope.searchSNList[data]._id, "sn": $scope.searchSNList[data].sn});
			$scope.selectSN = $scope.searchSNList[data]._id;
			$scope.loadTraveler();
			loadItemRecord();
			// $scope.isStartWork = true;
		};

		$scope.createWork = function(){

			if($scope.selectSNList.length > 0){
				Counter.nextSequenceValue({name:'workNum'})
					.success(data=>{
						alert('work number ' +data.sequence_value+ ' created');
						$scope.travelerData.workNum = data.sequence_value.toString();
						$scope.save();
					});
			}
		};

		$scope.searchWorkNum = function(input){
			$scope.isWorkFind =false;
			$scope.clearAfterChangeTab();
			Traveler.normalSearch('workNum', input, 'sn|createAt|status|workNum|formId|itemRecord.docNumId|itemRecord.docNum')
				.success(data=>{
					$scope.selectSNList = data;
					if(data.length>0){
						$scope.isWorkFind = true;
						$scope.travelerData['itemRecord'] = {
							docNumId:data[0].itemRecord.docNumId,
							docNum:data[0].itemRecord.docNum
						};
						loadItemRecord(data[0].formId);

						Traveler.normalSearch('itemRecord.docNumId', data[0].itemRecord.docNumId, 'sn|workNum|status|createAt')
							.success(data=>{
								if(data.length>0){
									for(let i =0; i < data.length;i++){
										if(data[i].workNum !== input){
											$scope.SNListForDocNum.push(data[i]);
										}
									}
								}
							})
					}
				});
		};

		$scope.clearAfterChangeTab = function(){
			// alert(123);
			$scope.selectSNList = [];
			$scope.SNListForDocNum=[];
			// let formId = $scope.formId;
			// reset();
			// $scope.formId = formId;
			// $scope.updateForm();
			$scope.isStartWork = false;
			$scope.isWorkFind = false;
			$scope.docNum.docNumSelect = 'new';
			$scope.docNum.docNumData = {};
			$scope.travelerData.created = false;
		};
		
		$scope.createTraveler = function(sn){

			if($scope.docNum.docNumSelect === 'new'){
				alert('Select a Docnument Number');
				$scope.isCollapsedItemRecord = false;
			}else{
				let isWantCreate = true;
				checkSNExistDB(sn,
					(result)=>{
						if(result){
							if(!confirm('Same Serial number already exist in the database. Create a new Traveler with same Serial Number?')){
								isWantCreate = false;
							}
						}
						if(isWantCreate){
							let item = {
								"sn": sn,
								"status": "OPEN",
								"createAt": new Date
							};
							createNewTraveler(item, (data)=>{
								$scope.selectSNList = [];
								$scope.selectSNList.push({
									"_id":data._id,
									"sn":data.sn
								});
								setNumDoctoTraveler();
								$scope.save();
								$scope.isSNExist = false;
								// $scope.isStartWork = true;
							});
							// console.log($scope.docNum.docNumData);
						}
					});
			}
			
		};

		$scope.startWork = function(){
			$scope.isStartWork = true;
			$scope.topCollapse = true;
		};

		var checkSNExistDB = function(sn, callback){
			$scope.isSNExist = false;
			Traveler.normalSearch('sn', sn, 'sn')
				.success(data => {
					if(data.length > 0){
						$scope.isSNExist = true;
					}
					callback($scope.isSNExist);
				});

		}

		var createNewTraveler = function(item, callback){
			// console.log(item.sn);
			if($scope.username){
				delete $scope.travelerData._id;
				delete $scope.travelerData.step;
				$scope.travelerData.sn = item.sn;
				$scope.travelerData.created = true;
				$scope.travelerData.createdBy = $scope.username;
				$scope.travelerData.createAt = item.createAt;
				Traveler.create($scope.travelerData)
					.success(data => {
						item._id = data._id;
						$scope.SNListForDocNum.push(item);
						if(callback){
							callback(data);
						}
					});
			}
		};

		var getSNList = function(input){
			Traveler.normalSearch('itemRecord.docNumId', input, 'sn|status|createAt|workNum')
				.success(data =>{
					$scope.SNListForDocNum = data;
				});
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
		var loadItemRecord = function(formId){
			if(!formId){
				formId = $scope.travelerData.formId;
			}
			DocNum.getDocNumList(formId)
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
			$scope.isSNExist = true;
			$scope.isSNExistMoreThanOne = false;
			$scope.isSNMoreThanOne = false;
			$scope.searchSNList = [];
			$scope.selectSN = '';
			$scope.SNListForDocNum = [];
			$scope.selectSNList = [];
			$scope.isUseWorkNum = false;
			$scope.isStartWork = false;
			$scope.selectSearchSN='0';
			$scope.isWorkFind = false;
			$scope.input={};
			$scope.isCollapsed = true;
			// $scope.isCollapsedSelectSNList = true;
			$scope.isCollapseHeaderSNList = true;
			$scope.isSearchClick = true;
			$scope.isCollapsedItemRecord = true;
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
						loadItemRecord(data.formId);
						shouldCollapse();
						$scope.selectSNList.push({"_id":data._id, "sn":data.sn});
						$scope.isStartWork = true;
					});
			}
			
		};

		main();
}]);