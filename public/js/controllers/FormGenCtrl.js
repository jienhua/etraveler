angular.module('FormGenCtrl.js', [])
	
	.controller('FormGeneratorController', ['$scope','Form' , function($scope, Form){

		$scope.submit = function(){
			// console.log($scope.template);
			Form.create($scope.template)
				.success(data =>{
					// do something
				});
		}
	}]);