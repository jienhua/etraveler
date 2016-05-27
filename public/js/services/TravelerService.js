angular.module('TravelerService', [])

	.factory('Traveler', ['$http', function($http){

		return {

			// call to get all nerds
			// get: function(){
			// 	return $http.get('/api/forms');
			// },

			// these will work when more API routes are defined on the Node side of things
        	// call to POST and create a new form
        	create: function(formData){
        		return $http.post('/api/travelers', formData);
        	}, 

        	search: function(sn){
        		return $http.get('/api/travelers/search/'+ sn);
        	}
        	// call to DELETE a form
        	// delete: function(id){
        	// 	return $http.delete('api/nerds/' + id);
        	// }
		}			
}]);