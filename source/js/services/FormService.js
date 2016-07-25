angular.module('FormService', [])

	.factory('Form', ['$http', function($http){

		return {

			create: function(data){
				return $http.post('/api/forms', data);
			},

			getAll: function(){
				return $http.get('/api/forms/');
			},

			getFormList: function(){
				return $http.get('/api/forms/formList');
			},

			get: function(formId){
				return $http.get('/api/forms/search/'+formId);
			},
			save: function(data){
				return $http.put('/api/forms', data);
			},
			delete: function(formId){
				return $http.delete('/api/forms/'+formId);
			}
		};
}]);