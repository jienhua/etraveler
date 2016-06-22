angular.module('FormService', [])

	.factory('Form', ['$http', function($http){

		return {

			create: function(data){
				return $http.post('/api/forms', data);
			},

			getFormList: function(){
				return $http.get('/api/forms/');
			},

			get: function(formId){
				return $http.get('/api/forms/'+formId);
			}
		};
}]);