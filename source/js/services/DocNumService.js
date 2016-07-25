angular.module('DocNumService', [])
	
	.factory('DocNum', ['$http', function($http){

		return {
			getDocNumList: function(formId){
				return $http.get('/api/DocNums/'+formId);
			}
		};
	}]);