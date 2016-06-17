angular.module('TravelerService', [])
       
    .factory('Traveler', ['$http', function($http){

        var reviewData = {};
            
        return {
	
            // these will work when more API routes are defined on the Node side of things
            // call to POST and create a new form
            create: function(formData){
            	return $http.post('/api/traveler', formData);
            }, 

            getReviewData: function(){
                return reviewData;
            },

            get: function(_id){
                return $http.get('/api/traveler?_id='+ _id);
            },

            save: function(data){
                return $http.put('/api/traveler', data);
            },

            setReviewData: function(data){
                reviewData = data;
            },

            searchLike: function(sn){
            	return $http.get('/api/traveler/searchLike/'+ sn);
            },
            // call to DELETE a form
            removeTraveler: function(_id, input){
                console.log(_id);
            	return $http.delete('/api/traveler/'+ _id);
            }
	};		
}]);