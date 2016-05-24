angular.module('FormService', [])

	.factory('Form', ['$http', function($http){

		return {

			get: function(){
				return $http.get('/api/forms');
			}
		};
}]);