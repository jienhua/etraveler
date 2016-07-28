angular.module('DocNumService', [])
	
	.factory('DocNum', ['$http', function($http){

		return {
			getDocNumList: function(formId){
				return $http.get('/api/docNums/'+formId);
			},
			create: function(data){
				return $http.post('/api/docNums/',data);
			},
			editDocNumData: function(data){
				return $http.put('/api/docNums/', data);
			},
			getDocNum: function(type, data){
				console.log('d service');
				return $http.get('/api/docNums/searchSingle?type='+type+'&data='+data);
			}
		};
	}]);