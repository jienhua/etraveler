angular.module('FormGenCtrl.js', ['ui.bootstrap.tabs'])
	
	.controller('FormGeneratorController', ['$scope','Form' , function($scope, Form){


		$scope.submit = function(password){
			if(!password || password === ''){
				password = prompt('password');
			}
			if(password === 'QQmore'){
			Form.create($scope.template)
				.success(data =>{
					// do something
					alert('add');
					$scope.create = data;
					delete $scope.template;
				});
			}else{
				alert('go home son');
			}
		};

		$scope.save = function(){
			var password = prompt('password');
			if(password ==='QQmore'){
				if($scope.create._id){
					Form.save($scope.create)
					.success(data=>{
						alert('save');
					});
				}else{
					$scope.template = $scope.create;
					$scope.submit(password);
				}
			}else{
				alert('go home');
			}
		};

		$scope.delete = function(){
			var password = prompt('password');
			if(password === 'QQmore'){
				if(confirm('delete template?')){
				
					if($scope.create._id){
						Form.delete($scope.create._id)
							.success(data=>{
								alert('removed');
							});
					}
						initCreate();
				}	
			}else{
				alert('go home');
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
					holder = Array.from(new Set(holder));
					item['select'] = {'name':''};
					item.select['options'] = holder;
				}
				$scope.create.itemRecord.push(item);
				$scope.inputItemRecord = '';
			}
		};

		$scope.addStep = function(){
			// if($scope.inputStepDes && $scope.inputStepDes !== ''){
				if(!$scope.create.steps){
					$scope.create.steps = [];
				}
				var len = $scope.create.steps.length;
				var step = {
					"step": len+1,
					"type": $scope.inputStepType || '',
					"Description": $scope.inputStepDes || ''
				};
				$scope.create.steps.push(step);

				$scope.inputStepDes = '';
			// }
		};

		$scope.addSubStep = function(){
			if($scope.tempSub.inputSubStepDes && $scope.tempSub.inputSubStepDes !== ''){
				let stepIndex = $scope.tempSub.selectStepForSubStep;
				if(!$scope.create.steps[stepIndex].list){
					$scope.create.steps[stepIndex].list=[];
				}
				let len = $scope.create.steps[stepIndex].list.length;
				let subStep = {
					"sub_step": len+1,
					"Description": $scope.tempSub.inputSubStepDes
				};
				$scope.create.steps[stepIndex].list.push(subStep);
				$scope.tempSub.inputSubStepDes = '';
			}
		};

		$scope.addSubOption = function(){
			let step = $scope.tempSubOption.selectSubForOption.split(',')[0];
			let sub = $scope.tempSubOption.selectSubForOption.split(',')[1];
			let selectOption = $scope.tempSubOption.subOptions.selectSubOption;
			let options = $scope.tempSubOption.subOptions.option.input.split(',');
			for(let i=0; i< options.length;i++){
				options[i] = options[i].trim();
			}
			options = Array.from(new Set(options));
			let subStepOption = {
					"type": selectOption,
					"name": $scope.tempSubOption.subOptions.option.name,
					"options": options
			};
			if(!$scope.create.steps[step].list[sub].options){
				$scope.create.steps[step].list[sub].options=[];
			}
			$scope.create.steps[step].list[sub].options.push(subStepOption);
			//$scope.create.steps[step].list[sub][selectOption] = subStepOption;
			$scope.tempSubOption.subOptions.option.name = '';
			$scope.tempSubOption.subOptions.option.input = '';
		};
		
		$scope.modifyID = function(object, type){
			for(let i=0; i<object.length;i++){
				if(type ==='itemRecord'){
					object[i].id = i+1;
				}
				if(type ==='steps'){
					object[i].step = i+1;
				}
				if(type ==='sub_step'){
					object[i].sub_step = i+1;
				}
			}
		};

		$scope.editOption = function(address, input){
      // console.log(typeof input);
      // console.log(input);
			if(address){
				address.options = [];
        if(typeof input === 'string'){
				  input = input.split(',');
        }
				for(let i=0;i<input.length;i++){
					address.options[i] = input[i].trim();
				}
				address.options = Array.from(new Set(address.options));
			}
		};

    $scope.updateForm = function() {
          $scope.travelerData = {};
          if($scope.formId){
            Form.get($scope.formId)
              .success(function(data){
                // $scope.forms = data;        
                // // find the last subStep
                // $scope.lastStep = data.steps.length;
                // // init the travelerData from formData
                // $scope.travelerData.formId = data._id;
                // $scope.travelerData.formRev = data.formRev;
                // $scope.travelerData.formNo = data.formNo;
                // $scope.travelerData.customer = data.customer;
                // $scope.travelerData.status = 'OPEN';
                $scope.create= data;
              });
          }
    };

		var initCreate = function(){
			$scope.create = {};
			$scope.create.isPublish = false;
		};

    var loadFormList = function(){
      Form.getFormList()
        .success(function(data){
          $scope.formList = data;
      });
    };

		var main = function(){

			initCreate();
      		loadFormList();
		
			$scope.inputItemRecordType = 'text';
			$scope.jsonView = false;
		};

		main();
	}]);