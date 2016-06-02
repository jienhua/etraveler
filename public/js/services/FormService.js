angular.module('FormService', [])

	.factory('Form', ['$http', function($http){

		return {

			getFormList: function(){
				return $http.get('/api/forms/');
			},

			get: function(formId){
				return $http.get('/api/forms/'+formId);
			}
		};
}]);