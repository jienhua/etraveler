angular.module('SearchTravelerCtrl', ['chart.js'])

	.controller('SearchTravelerController', ['$scope', 'Traveler', function($scope, Traveler){

		$scope.search = function(){
			$scope.currentInput = $scope.searchInput;
			$scope.isSearch = true;
			if($scope.searchInput){
				if($scope.searchOption ==='sn'){
					let sn = $scope.searchInput.toString();
					Traveler.searchLike($scope.searchInput)

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
			let data ={
				idList:[
					_id
				]
			};
			Traveler.removeTraveler(data)
				.success( data => {
					// $scope.result=data;
					$scope.result.splice(index, 1);
				});
		};

		$scope.timeSpend = function(data){
			if(data.reviewAt){
				let diff = Math.round((new Date(data.reviewAt) - new Date(data.createAt))/1000);
				$scope.totalTimeSpand += diff;
				return calulateTime(diff);
			}else{
				let diff = Math.round((new Date() - new Date(data.createAt))/1000);
				$scope.totalTimeSpand += diff;
				return calulateTime(diff);
			}
		};

		$scope.totalTimeSpend = function(){

			return 5;
		};

		var calulateTime = function(seconds){
			return Math.floor(seconds/60/60) + ' Hours and ' + Math.floor(seconds/60)%60 + 
					' min and ' + seconds % 60 + ' sec';
		};

		// $scope.printTraveler = function(index){
		// 	$scope.travelerData = $scope.result[index];
			// var printContents = document.getElementById('div-id-selector').innerHTML;
		 //    var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
		 //    popupWin.window.focus();
		 //    popupWin.document.open();
		 //    popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>' +
		 //        '<link rel="stylesheet" type="text/css" href="libs/boosaveDocNumtstrap/dist/css/bootstrap.min.css">' +
		 //        '</head><body onload="window.print(); window.close();"><div>' + printContents + '</div></html>');
		 //    popupWin.document.close();
		// }

		var findStatistics = function(){
			$scope.stat = {};
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
			let completed = 0;
			// calulate percent of total complated out of total
			if($scope.stat.REJECT){
				reject = $scope.stat.REJECT;
			}

			if($scope.stat.COMPLETED){
				completed = $scope.stat.COMPLETED;
			}
			$scope.stat.pecComplete = (((completed)+(reject))/(data.length)*100).toFixed(2);
			
			// calulate percent of reject out of total
			if(($scope.stat.REJECT)/(data.length)*100){
				$scope.stat.pecReject = ((reject)/(data.length)*100).toFixed(2);
			}else{
				$scope.stat.pecReject = 0;
			}
			
			for(let i=0;i<$scope.pieLabels1.length;i++){
				$scope.pieData1.push($scope.stat[$scope.pieLabels1[i]]);
			}

			$scope.pieLabels2 = ['Finish', 'Hold'];
			$scope.pieData2 = [completed+reject, ($scope.stat.total-(completed+reject))];
	
		};

		var init = function(){
			$scope.isSearch = false;
			$scope.searchOption = 'docNum';
			$scope.sortType = 'createAt';
			$scope.sortReverse = false;
			$scope.travelerData = {};
			$scope.totalTimeSpand = 0;
		};

		var main = function(){
			init();
		};
		main();
	}]);