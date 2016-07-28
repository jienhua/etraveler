angular.module('SearchTravelerCtrl', ['chart.js'])

	.controller('SearchTravelerController', ['$scope', 'Traveler', function($scope, Traveler){

		$scope.search = function(){
			$scope.currentInput = $scope.searchInput;
			$scope.isSearch = true;
			if($scope.searchInput){
				if($scope.searchOption ==='sn'){
					let sn = $scope.searchInput.toString();
					Traveler.searchLike(sn)

						.success( data =>{
							$scope.result=data;
							findStatistics();
						});
				}else{
					// search doc num
					Traveler.normalSearch($scope.searchOption, $scope.searchInput)
						.success(data =>{
							$scope.result=data;
							findStatistics();
						});
				}
			}
			
		};

		$scope.editTraveler = function(_id, formId){
			window.open('traveler?_id='+_id+'&formId='+formId, '_blank');
		};

		$scope.removeTraveler = function(_id, index){
			Traveler.removeTraveler(_id)
				.success( data => {
					// $scope.result=data;
					$scope.result.splice(index, 1);
				});
		};

		// $scope.printTraveler = function(_id, formId){
		// 	window.open('traveler?_id='+_id+'&formId='+formId+'&action=print', '_blank');
		// }

		var findStatistics = function(){
			$scope.stat = {}
			$scope.pieLabels1=[];
			$scope.pieData1 = [];
			let data = $scope.result;
			for(let i=0; i<data.length;i++){
				if(data[i].status in $scope.stat){
					$scope.stat[data[i].status] +=1;
				}else{
					$scope.pieLabels1.push(data[i].status);
					$scope.stat[data[i].status] =1;
				}
			}
			$scope.stat.total = data.length;
			let reject = 0;

			// calulate percent of total complated out of total
			if($scope.stat.REJECT){
				reject = $scope.stat.REJECT;
			}
			$scope.stat.pecComplete = (($scope.stat.COMPLETED)+(reject))/(data.length)*100;
			
			// calulate percent of reject out of total
			if(($scope.stat.REJECT)/(data.length)*100){
				$scope.stat.pecReject = ($scope.stat.REJECT)/(data.length)*100;
			}else{
				$scope.stat.pecReject = 0;
			}
			
			for(let i=0;i<$scope.pieLabels1.length;i++){
				$scope.pieData1.push($scope.stat[$scope.pieLabels1[i]]);
			}

			$scope.pieLabels2 = ['Finish', 'Hold'];
			$scope.pieData2 = [$scope.stat.COMPLETED+reject, ($scope.stat.total-($scope.stat.COMPLETED+reject))];
	
		}

		var init = function(){
			$scope.isSearch = false;
			$scope.searchOption = 'docNum';
		};

		var main = function(){
			init();
		}
		main();
	}]);