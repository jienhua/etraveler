angular.module('CounterService', [])
	
	.factory('Counter', ['$http', function($http){
		return {
			nextSequenceValue:function(input){
				return $http.post('api/counter/nextSequenceValue/', input);
			}
		};
	}]);