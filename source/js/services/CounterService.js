angular.module('CounterService', [])
	
	.factory('Counter', ['$http', function($http){
		return {
			nextSequenceValue:function(input){
				return $http.post('api/counter/nextSequenceValue/', input);
			},
			create: function(data){
				return $http.post('api/counter/create', data);
			}
		};
	}]);