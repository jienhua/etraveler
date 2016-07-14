angular.module('FormGenCtrl.js', ['ui.bootstrap.tabs'])
	
	.controller('FormGeneratorController', ['$scope','Form' , function($scope, Form){

		// $scope.initTemplate = function(){
		// }
		
		$scope.create = {};
		$scope.inputItemRecordType = 'text';

		$scope.submit = function(){
			var password = prompt('password');
			if(password === '123'){
			Form.create($scope.template)
				.success(data =>{
					// do something
					alert('add');
				});
			}else{
				alert('go home son');
			}
		};

		$scope.setSelectTab = function(n){
			$scope.selectTab = n;
		};

		$scope.addItemRecord = function(){
			if($scope.inputItemRecord && $scope.inputItemRecord !== ''){
				if(!$scope.create.itemRecord){
					$scope.create.itemRecord = [];
				}
				var len = $scope.create.itemRecord.length;
				var item = {
					"id": len+1,
					"Description":$scope.inputItemRecord
				};
				if($scope.inputItemRecordType === 'select'){
					var holder = $scope.selectOptions;
					holder = holder.split(',');
					for(let i = 0; i<holder.length;i++){
						holder[i] = holder[i].trim();
					}
					item['select'] = {'name':''};
					item.select['options'] = holder;
				}
				$scope.create.itemRecord.push(item);
				$scope.inputItemRecord = '';
			}
		};

		$scope.addStep = function(){
			// if($scope.inputStepDes && $scope.inputStepDes !== ''){
				if(!$scope.tempStep){
					$scope.tempStep = [];
					$scope.create.steps = [];
				}
				var len = $scope.tempStep.length;
				var step = {
					"step": len+1,
					"type": $scope.inputStepType || '',
					"Description": $scope.inputStepDes || ''
				};
				$scope.tempStep.push(step);

				$scope.inputStepDes = '';
				$scope.inputStepType = '';
			// }
		};

		$scope.addSubStep = function(){
			if($scope.tempSub.inputSubStepDes && $scope.tempSub.inputSubStepDes !== ''){
				let stepIndex = $scope.tempSub.selectStepForSubStep;
				if(!$scope.tempStep[stepIndex].list){
					$scope.tempStep[stepIndex].list=[];
				}
				let len = $scope.tempStep[stepIndex].list.length;
				let subStep = {
					"sub_step": len+1,
					"Description": $scope.tempSub.inputSubStepDes
				};
				$scope.tempStep[stepIndex].list.push(subStep);
				$scope.tempSub.inputSubStepDes = '';
			}
		}

		$scope.addSubOption = function(){
			let step = $scope.tempSubOption.selectSubForOption.split(',')[0];
			let sub = $scope.tempSubOption.selectSubForOption.split(',')[1];
			let selectOption = $scope.tempSubOption.subOptions.selectSubOption;
			let options = $scope.tempSubOption.subOptions.option.input.split(',');
			for(let i=0; i< options.length;i++){
				options[i] = options[i].trim();
			}
			let subStepOption = {
					"name": $scope.tempSubOption.subOptions.option.name,
					"options": options
			}
			$scope.tempStep[step].list[sub][selectOption] = subStepOption;
		}
		// $scope.subSelectOptionChange = function(value){
		// 	delete $scope.tempSub.subOptions.option;
		// }

		// $scope.addSubOption = function(){

		// }
	}]);