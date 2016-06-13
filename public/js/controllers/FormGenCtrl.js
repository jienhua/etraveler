angular.module('FormGenCtrl.js', [])
	
	.controller('FormGeneratorController', ['$scope','Form' , function($scope, Form){

		$scope.submit = function(){
			// console.log($scope.template);
			var password = prompt('password');
			if(password === 'ji394su3'){
			Form.create($scope.template)
				.success(data =>{
					// do something
					alert('add');
				});
			}else{
				alert('go home son');
			}
		}
	}]);