angular.module('FormGenCtrl.js', [])
	
	.controller('FormGeneratorController', ['$scope','Form' , function($scope, Form){

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
	}]);