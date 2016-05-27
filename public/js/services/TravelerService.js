angular.module('TravelerService', [])

	.factory('Traveler', ['$http', function($http){

                var reviewData = {};
                
		return {

                        getReviewData: function(){
                                return reviewData;
                        },

                        setReviewData: function(data){
                                reviewData = data;
        		},	
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