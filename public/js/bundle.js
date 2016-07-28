'use strict';

angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'appRoutes', 'dndLists', 'AppCtrl', 'MainCtrl', 'TravelerCtrl', 'SearchTravelerCtrl', 'FormGenCtrl.js', 'TravelerService', 'FormService', 'DocNumService']);
'use strict';

angular.module('appRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise('/home');

	// $urlRouterProvider.otherwise('/');
	$stateProvider

	// home page
	.state('home', {
		url: '/home',
		templateUrl: 'views/home.html',
		controller: 'MainController'
	}).state('traveler', {
		url: '/traveler?_id&formId',
		views: {
			'': {
				templateUrl: 'views/traveler.html',
				controller: 'TravelerController'
			},
			'formReview@traveler': {
				templateUrl: 'views/formReview.html'
			}
		}
	}). // controller: ['$scope', 'Traveler', 'Form',function($scope, Traveler, Form){
	// 	$scope.reviewData = Traveler.getReviewData();
	// 	Form.get($scope.reviewData.formId)
	// 		.success(function(data){
	// 			$scope.forms = data;
	// 	});
	// }]
	// controller: 'TravelerController'
	state('searchTraveler', {
		url: '/searchTraveler',
		templateUrl: 'views/searchTraveler.html',
		controller: 'SearchTravelerController'
	}).state('formGenerator', {
		url: '/formGenerator',
		views: {
			'': {
				templateUrl: 'views/formGeneratorNav.html',
				controller: 'FormGeneratorController'
			},
			'templateGenerator@formGenerator': {
				templateUrl: 'views/templateGenerator.html',
				controller: 'FormGeneratorController'
			},
			'templateCreator@formGenerator': {
				templateUrl: 'views/templateCreator.html',
				controller: 'FormGeneratorController'
			}
		}
	});

	$locationProvider.html5Mode(true);
}]);
'use strict';

angular.module('AppCtrl', ['ngAnimate']).controller('AppController', ['$scope', function ($scope) {

	$scope.isCollapsed = true;
}]);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

angular.module('FormGenCtrl.js', ['ui.bootstrap.tabs']).controller('FormGeneratorController', ['$scope', 'Form', function ($scope, Form) {

	$scope.submit = function (password) {
		if (!password || password === '') {
			password = prompt('password');
		}
		if (password === '123') {
			Form.create($scope.template).success(function (data) {
				// do something
				alert('add');
				$scope.create = data;
				delete $scope.template;
			});
		} else {
			alert('go home son');
		}
	};

	$scope.save = function () {
		var password = prompt('password');
		if (password === '123') {
			if ($scope.create._id) {
				Form.save($scope.create).success(function (data) {
					alert('save');
				});
			} else {
				$scope.template = $scope.create;
				$scope.submit(password);
			}
		} else {
			alert('go home');
		}
	};

	$scope.delete = function () {
		if (confirm('delete template?')) {

			if ($scope.create._id) {
				Form.delete($scope.create._id).success(function (data) {
					alert('removed');
				});
			}
			initCreate();
		}
	};

	$scope.setSelectTab = function (n) {
		$scope.selectTab = n;
	};

	$scope.addItemRecord = function () {
		if ($scope.inputItemRecord && $scope.inputItemRecord !== '') {
			if (!$scope.create.itemRecord) {
				$scope.create.itemRecord = [];
			}
			var len = $scope.create.itemRecord.length;
			var item = {
				"id": len + 1,
				"Description": $scope.inputItemRecord
			};
			if ($scope.inputItemRecordType === 'select') {
				var holder = $scope.selectOptions;
				holder = holder.split(',');
				for (var i = 0; i < holder.length; i++) {
					holder[i] = holder[i].trim();
				}
				holder = Array.from(new Set(holder));
				item['select'] = { 'name': '' };
				item.select['options'] = holder;
			}
			$scope.create.itemRecord.push(item);
			$scope.inputItemRecord = '';
		}
	};

	$scope.addStep = function () {
		// if($scope.inputStepDes && $scope.inputStepDes !== ''){
		if (!$scope.create.steps) {
			$scope.create.steps = [];
		}
		var len = $scope.create.steps.length;
		var step = {
			"step": len + 1,
			"type": $scope.inputStepType || '',
			"Description": $scope.inputStepDes || ''
		};
		$scope.create.steps.push(step);

		$scope.inputStepDes = '';
		// }
	};

	$scope.addSubStep = function () {
		if ($scope.tempSub.inputSubStepDes && $scope.tempSub.inputSubStepDes !== '') {
			var stepIndex = $scope.tempSub.selectStepForSubStep;
			if (!$scope.create.steps[stepIndex].list) {
				$scope.create.steps[stepIndex].list = [];
			}
			var len = $scope.create.steps[stepIndex].list.length;
			var subStep = {
				"sub_step": len + 1,
				"Description": $scope.tempSub.inputSubStepDes
			};
			$scope.create.steps[stepIndex].list.push(subStep);
			$scope.tempSub.inputSubStepDes = '';
		}
	};

	$scope.addSubOption = function () {
		var step = $scope.tempSubOption.selectSubForOption.split(',')[0];
		var sub = $scope.tempSubOption.selectSubForOption.split(',')[1];
		var selectOption = $scope.tempSubOption.subOptions.selectSubOption;
		var options = $scope.tempSubOption.subOptions.option.input.split(',');
		for (var i = 0; i < options.length; i++) {
			options[i] = options[i].trim();
		}
		options = Array.from(new Set(options));
		var subStepOption = {
			"type": selectOption,
			"name": $scope.tempSubOption.subOptions.option.name,
			"options": options
		};
		if (!$scope.create.steps[step].list[sub].options) {
			$scope.create.steps[step].list[sub].options = [];
		}
		$scope.create.steps[step].list[sub].options.push(subStepOption);
		//$scope.create.steps[step].list[sub][selectOption] = subStepOption;
		$scope.tempSubOption.subOptions.option.name = '';
		$scope.tempSubOption.subOptions.option.input = '';
	};

	$scope.modifyID = function (object, type) {
		for (var i = 0; i < object.length; i++) {
			if (type === 'itemRecord') {
				object[i].id = i + 1;
			}
			if (type === 'steps') {
				object[i].step = i + 1;
			}
			if (type === 'sub_step') {
				object[i].sub_step = i + 1;
			}
		}
	};

	$scope.editOption = function (address, input) {
		console.log(typeof input === 'undefined' ? 'undefined' : _typeof(input));
		console.log(input);
		if (address) {
			address.options = [];
			if (typeof input === 'string') {
				input = input.split(',');
			}
			for (var i = 0; i < input.length; i++) {
				address.options[i] = input[i].trim();
			}
			address.options = Array.from(new Set(address.options));
		}
	};

	$scope.updateForm = function () {
		$scope.travelerData = {};
		if ($scope.formId) {
			Form.get($scope.formId).success(function (data) {
				// $scope.forms = data;       
				// // find the last subStep
				// $scope.lastStep = data.steps.length;
				// // init the travelerData from formData
				// $scope.travelerData.formId = data._id;
				// $scope.travelerData.formRev = data.formRev;
				// $scope.travelerData.formNo = data.formNo;
				// $scope.travelerData.customer = data.customer;
				// $scope.travelerData.status = 'OPEN';
				$scope.create = data;
			});
		}
	};

	var initCreate = function initCreate() {
		$scope.create = {};
		$scope.create.isPublish = false;
	};

	var loadFormList = function loadFormList() {
		Form.getFormList().success(function (data) {
			$scope.formList = data;
		});
	};

	var main = function main() {

		initCreate();
		loadFormList();

		$scope.inputItemRecordType = 'text';
		$scope.jsonView = false;
	};

	main();
}]);
'use strict';

angular.module('MainCtrl', []).controller('MainController', ['$scope', function ($scope) {

	$scope.tagline = 'to the moon and back!';
}]);
'use strict';

angular.module('SearchTravelerCtrl', ['chart.js']).controller('SearchTravelerController', ['$scope', 'Traveler', function ($scope, Traveler) {

	$scope.search = function () {
		$scope.currentInput = $scope.searchInput;
		$scope.isSearch = true;
		if ($scope.searchInput) {
			if ($scope.searchOption === 'sn') {
				var sn = $scope.searchInput.toString();
				Traveler.searchLike(sn).success(function (data) {
					$scope.result = data;
					findStatistics();
				});
			} else {
				// search doc num
				Traveler.normalSearch($scope.searchOption, $scope.searchInput).success(function (data) {
					$scope.result = data;
					findStatistics();
				});
			}
		}
	};

	$scope.editTraveler = function (_id, formId) {
		window.open('traveler?_id=' + _id + '&formId=' + formId, '_blank');
	};

	$scope.removeTraveler = function (_id, index) {
		Traveler.removeTraveler(_id).success(function (data) {
			// $scope.result=data;
			$scope.result.splice(index, 1);
		});
	};

	// $scope.printTraveler = function(_id, formId){
	// 	window.open('traveler?_id='+_id+'&formId='+formId+'&action=print', '_blank');
	// }

	var findStatistics = function findStatistics() {
		$scope.stat = {};
		$scope.pieLabels1 = [];
		$scope.pieData1 = [];
		var data = $scope.result;
		for (var i = 0; i < data.length; i++) {
			if (data[i].status in $scope.stat) {
				$scope.stat[data[i].status] += 1;
			} else {
				$scope.pieLabels1.push(data[i].status);
				$scope.stat[data[i].status] = 1;
			}
		}
		$scope.stat.total = data.length;
		var reject = 0;

		// calulate percent of total complated out of total
		if ($scope.stat.REJECT) {
			reject = $scope.stat.REJECT;
		}
		$scope.stat.pecComplete = ($scope.stat.COMPLETED + reject) / data.length * 100;

		// calulate percent of reject out of total
		if ($scope.stat.REJECT / data.length * 100) {
			$scope.stat.pecReject = $scope.stat.REJECT / data.length * 100;
		} else {
			$scope.stat.pecReject = 0;
		}

		for (var _i = 0; _i < $scope.pieLabels1.length; _i++) {
			$scope.pieData1.push($scope.stat[$scope.pieLabels1[_i]]);
		}

		$scope.pieLabels2 = ['Finish', 'Hold'];
		$scope.pieData2 = [$scope.stat.COMPLETED + reject, $scope.stat.total - ($scope.stat.COMPLETED + reject)];
	};

	var init = function init() {
		$scope.isSearch = false;
		$scope.searchOption = 'docNum';
	};

	var main = function main() {
		init();
	};
	main();
}]);
'use strict';

angular.module('TravelerCtrl', []).filter('unique', function () {
	return function (collection, keyname) {
		var output = [],
		    keys = [];

		angular.forEach(collection, function (item) {
			var key = item[keyname];
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	};
}).controller('TravelerController', ['$scope', 'Traveler', 'Form', 'DocNum', '$stateParams', function ($scope, Traveler, Form, DocNum, $stateParams) {

	$scope.checkReadyReview = function () {
		if ($scope.travelerData.status && $scope.travelerData.status !== 'OPEN') {
			$scope.travelerData.status = 'OPEN';
			$scope.travelerData.readyReview = false;
		} else {
			$scope.travelerData.status = 'PANDING FOR REVIEW';
			$scope.travelerData.readyReview = true;
		}
	};

	$scope.updateForm = function () {
		$scope.travelerData = {};
		if ($scope.formId) {
			Form.get($scope.formId).success(function (data) {
				$scope.forms = data;
				// find the last subStep
				$scope.lastStep = data.steps.length;
				// init the travelerData from formData
				$scope.travelerData.formId = data._id;
				$scope.travelerData.formRev = data.formRev;
				$scope.travelerData.formNo = data.formNo;
				$scope.travelerData.customer = data.customer;
				$scope.travelerData.status = 'OPEN';
				loadDocNumList(data._id);
			});
		}
	};

	$scope.updateDocNum = function () {
		$scope.docNum.docNumData = $scope.docNum.docNumSelectList[$scope.docNum.docNumSelect];
	};

	$scope.nextStep = function () {
		var object = $scope.forms.steps[$scope.currentStep - 1];
		if (object.list.length >= $scope.currentSubStep + 1) {
			$scope.currentSubStep += 1;
		} else {
			$scope.currentStep += 1;
			$scope.currentSubStep = 1;
			if ($scope.currentStep > $scope.lastStep) {
				// Traveler.setReviewData($scope.travelerData);
				// $scope.travelerData.readyReview = true;		
				$scope.checkReadyReview();
			}
		}
	};

	$scope.statusPage = function (page) {
		$scope.currentSubStep = 1;
		$scope.currentStep = page;
		// $scope.travelerData.readyReview = false;
		// $scope.checkReadyReview();
	};

	$scope.statusSubPage = function (page) {
		$scope.currentSubStep = page;
	};

	$scope.goBack = function () {
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		// $scope.travelerData.readyReview = false;
		$scope.checkReadyReview();
	};

	$scope.save = function () {
		if ($scope.travelerData.created) {
			setNumDoctoTraveler();
			Traveler.save($scope.travelerData).success(function (data) {
				// do something
			});
		} else {
				$scope.submit();
			}
	};

	$scope.review = function (option) {
		if ($scope.travelerData.reviewBy) {
			if (option === 'reject') {
				$scope.travelerData.status = 'REJECT';
			} else if (option === 'complete') {
				$scope.travelerData.status = 'COMPLETED';
			}
			$scope.travelerData.reviewAt = new Date();
			$scope.save();
		} else {
			alert('enter reviewer name');
		}
	};

	$scope.submit = function () {
		if ($scope.username && $scope.travelerData.sn) {
			// $scope.travelerData.completed = false;
			setNumDoctoTraveler();
			$scope.travelerData.created = true;
			$scope.travelerData.createdBy = $scope.username;
			$scope.travelerData.createAt = new Date();
			Traveler.create($scope.travelerData)

			// if successful create
			.success(function (data) {
				// console.log(data);
				$scope.travelerData = data;
			});
		} else {
			alert('enter your name or serial number plz ');
		}
	};

	$scope.new = function () {
		reset();
	};

	$scope.delete = function () {
		alert('delete click');
		if ($scope.travelerData._id) {
			Traveler.removeTraveler($scope.travelerData._id).success(function (data) {
				reset();
			});
		}
	};

	$scope.appendSubStepEditInfo = function () {
		var username = $scope.username;
		if (username !== '') {
			var currentStep = $scope.currentStep;
			var currentSubStep = $scope.currentSubStep;
			$scope.travelerData.step[currentStep][currentSubStep].editBy = username;
			$scope.travelerData.step[currentStep][currentSubStep].editTime = new Date();
			return true;
		}
		alert('enter your name');
		return false;
	};

	$scope.saveDocNum = function () {
		$scope.docNum.docNumData.formId = $scope.travelerData.formId;
		$scope.docNum.docNumData.formRev = $scope.travelerData.formRev;
		$scope.docNum.docNumData.formNo = $scope.travelerData.formNo;
		// console.log($scope.docNum.docNumData);
		setDocNumLabel('create');
		delete $scope.docNum.docNumData._id;
		// console.log($scope.docNum.docNumData);
		DocNum.create($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId);
		});
	};

	$scope.editDocNum = function () {
		// console.log($scope.docNum.docNumData);
		setDocNumLabel('edit');
		DocNum.editDocNumData($scope.docNum.docNumData).success(function (data) {
			loadDocNumList($scope.travelerData.formId);
		});
	};

	var setNumDoctoTraveler = function setNumDoctoTraveler() {
		$scope.travelerData.itemRecord = {
			"docNumId": $scope.docNum.docNumData._id,
			"docNum": $scope.docNum.docNumData.docNum
		};
	};

	var setDocNumLabel = function setDocNumLabel(action) {

		var count = 1;
		if (action === 'create') {
			for (var i = 0; i < $scope.docNum.docNumSelectList.length; i++) {
				if ($scope.docNum.docNumSelectList[i].docNum === $scope.docNum.docNumData.docNum) {
					count += 1;
				}
			}
		}

		if (action === 'edit') {
			for (var _i = 0; _i < $scope.docNum.docNumSelectList.length; _i++) {
				if ($scope.docNum.docNumSelectList[_i].docNum === $scope.docNum.docNumData.docNum && $scope.docNum.docNumSelectList[_i]._id !== $scope.docNum.docNumData._id) {
					count += 1;
				}
			}
		}
		$scope.docNum.docNumData.label = count;
	};

	var loadFormList = function loadFormList() {
		Form.getFormList().success(function (data) {
			$scope.formList = data;
		});
	};

	var reset = function reset() {
		$scope.travelerData = {};
		$scope.currentStep = 1;
		$scope.currentSubStep = 1;
		$scope.travelerData.readyReview = false;
		$scope.formId = '';
		$scope.isNew = true;
	};

	var loadDocNumList = function loadDocNumList(id) {
		DocNum.getDocNumList(id).success(function (data) {
			$scope.docNum.docNumSelectList = data;
		});
	};

	// load information for ItemRecord with
	// docNum.
	var loadItemRecord = function loadItemRecord() {

		DocNum.getDocNumList($scope.travelerData.formId).success(function (data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i]._id === $scope.travelerData.itemRecord.docNumId) {
					$scope.docNum.docNumData = data[i];
					$scope.docNum.docNumSelect = i.toString();
					break;
				}
			}
		});
	};

	$scope.printTraveler = function () {
		var printContents = document.getElementById('div-id-selector').innerHTML;
		var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
		popupWin.window.focus();
		popupWin.document.open();
		popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>' + '<link rel="stylesheet" type="text/css" href="libs/bootstrap/dist/css/bootstrap.min.css">' + '</head><body onload="window.print(); window.close();"><div>' + printContents + '</div></html>');
		popupWin.document.close();
	};

	var main = function main() {

		$scope.topCollapse = false;
		reset();
		loadFormList();
		$scope.username = 'John Snow';
		$scope.docNum = {};

		if ($stateParams.formId) {
			$scope.formId = $stateParams.formId;
			$scope.updateForm();
			$scope.isNew = false;
		}

		// load the traveler from Search page
		// take the pramas from URL
		if ($stateParams._id) {
			$scope.isNew = false;
			Traveler.get($stateParams._id).success(function (data) {
				// data is a array. result could be more than one
				// need to deal wit this.
				$scope.travelerData = data;
				loadItemRecord();
			});
		}
	};

	main();
}]);
'use strict';

angular.module('DocNumService', []).factory('DocNum', ['$http', function ($http) {

	return {
		getDocNumList: function getDocNumList(formId) {
			return $http.get('/api/docNums/' + formId);
		},
		create: function create(data) {
			return $http.post('/api/docNums/', data);
		},
		editDocNumData: function editDocNumData(data) {
			return $http.put('/api/docNums/', data);
		},
		getDocNum: function getDocNum(type, data) {
			console.log('d service');
			return $http.get('/api/docNums/searchSingle?type=' + type + '&data=' + data);
		}
	};
}]);
'use strict';

angular.module('FormService', []).factory('Form', ['$http', function ($http) {

	return {

		create: function create(data) {
			return $http.post('/api/forms', data);
		},

		getAll: function getAll() {
			return $http.get('/api/forms/');
		},

		getFormList: function getFormList() {
			return $http.get('/api/forms/formList');
		},

		get: function get(formId) {
			return $http.get('/api/forms/search/' + formId);
		},
		save: function save(data) {
			return $http.put('/api/forms', data);
		},
		delete: function _delete(formId) {
			return $http.delete('/api/forms/' + formId);
		}
	};
}]);
'use strict';

angular.module('TravelerService', []).factory('Traveler', ['$http', function ($http) {

    var reviewData = {};

    return {

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new form
        create: function create(formData) {
            return $http.post('/api/traveler', formData);
        },

        getReviewData: function getReviewData() {
            return reviewData;
        },

        get: function get(_id) {
            return $http.get('/api/traveler?_id=' + _id);
        },

        save: function save(data) {
            return $http.put('/api/traveler', data);
        },

        setReviewData: function setReviewData(data) {
            reviewData = data;
        },

        searchLike: function searchLike(sn) {
            return $http.get('/api/traveler/searchLike/' + sn);
        },
        // call to DELETE a form
        removeTraveler: function removeTraveler(_id, input) {
            // console.log(_id);
            return $http.delete('/api/traveler/' + _id);
        },
        normalSearch: function normalSearch(type, data) {
            return $http.get('/api/traveler/normalSearch?type=' + type + '&data=' + data);
        }
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcFJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9Gb3JtR2VuQ3RybC5qcyIsImNvbnRyb2xsZXJzL01haW5DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VhcmNoVHJhdmVsZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvVHJhdmVsZXJDdHJsLmpzIiwic2VydmljZXMvRG9jTnVtU2VydmljZS5qcyIsInNlcnZpY2VzL0Zvcm1TZXJ2aWNlLmpzIiwic2VydmljZXMvVHJhdmVsZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsUUFBUSxNQUFSLENBQWUsV0FBZixFQUNDLENBQ0MsV0FERCxFQUVDLGNBRkQsRUFHQyxXQUhELEVBSUMsVUFKRCxFQU1DLFNBTkQsRUFPQyxVQVBELEVBUUMsY0FSRCxFQVNDLG9CQVRELEVBVUMsZ0JBVkQsRUFZQyxpQkFaRCxFQWFDLGFBYkQsRUFjQyxlQWRELENBREQ7OztBQ0FBLFFBQVEsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxXQUFELENBQTVCLEVBQ0UsTUFERixDQUNTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLG1CQUF6QyxFQUNQLFVBQVMsY0FBVCxFQUF5QixrQkFBekIsRUFBNkMsaUJBQTdDLEVBQStEOztBQUUvRCxvQkFBbUIsU0FBbkIsQ0FBNkIsT0FBN0I7OztBQUdBOzs7QUFBQSxFQUdFLEtBSEYsQ0FHUSxNQUhSLEVBR2dCO0FBQ2QsT0FBSyxPQURTO0FBRWQsZUFBYSxpQkFGQztBQUdkLGNBQVk7QUFIRSxFQUhoQixFQVVFLEtBVkYsQ0FVUSxVQVZSLEVBVW9CO0FBQ2xCLE9BQUssc0JBRGE7QUFFbEIsU0FBTTtBQUNMLE9BQUc7QUFDRixpQkFBYSxxQkFEWDtBQUVGLGdCQUFZO0FBRlYsSUFERTtBQUtMLDBCQUFzQjtBQUNyQixpQkFBYTtBQURRO0FBTGpCO0FBRlksRUFWcEI7Ozs7Ozs7O0FBK0JFLE1BL0JG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QUFhLElBQWI7QUFDSCxTQXRCRTs7QUF3Qkgsb0JBQVksb0JBQVMsRUFBVCxFQUFZO0FBQ3ZCLG1CQUFPLE1BQU0sR0FBTixDQUFVLDhCQUE2QixFQUF2QyxDQUFQO0FBQ0EsU0ExQkU7O0FBNEJILHdCQUFnQix3QkFBUyxHQUFULEVBQWMsS0FBZCxFQUFvQjs7QUFFbkMsbUJBQU8sTUFBTSxNQUFOLENBQWEsbUJBQWtCLEdBQS9CLENBQVA7QUFDQSxTQS9CRTtBQWdDSCxzQkFBYyxzQkFBUyxJQUFULEVBQWUsSUFBZixFQUFvQjtBQUM5QixtQkFBTyxNQUFNLEdBQU4sQ0FBVSxxQ0FBbUMsSUFBbkMsR0FBd0MsUUFBeEMsR0FBaUQsSUFBM0QsQ0FBUDtBQUNIO0FBbENFLEtBQVA7QUFvQ1AsQ0F4Q3dCLENBRnpCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdzYW1wbGVBcHAnLCBcclxuXHRbXHJcblx0XHQndWkucm91dGVyJywgXHJcblx0XHQndWkuYm9vdHN0cmFwJyxcclxuXHRcdCdhcHBSb3V0ZXMnLFxyXG5cdFx0J2RuZExpc3RzJyxcclxuXHJcblx0XHQnQXBwQ3RybCcsXHJcblx0XHQnTWFpbkN0cmwnLCBcclxuXHRcdCdUcmF2ZWxlckN0cmwnLCBcclxuXHRcdCdTZWFyY2hUcmF2ZWxlckN0cmwnLCBcclxuXHRcdCdGb3JtR2VuQ3RybC5qcycsXHJcblx0XHRcclxuXHRcdCdUcmF2ZWxlclNlcnZpY2UnLCBcclxuXHRcdCdGb3JtU2VydmljZScsXHJcblx0XHQnRG9jTnVtU2VydmljZSdcclxuXHRdXHJcbik7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcFJvdXRlcycsIFsndWkucm91dGVyJ10pXHJcblx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicgLFxyXG5cdFx0ZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpe1xyXG5cclxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9ob21lJyk7XHJcblxyXG5cdFx0Ly8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cdFx0JHN0YXRlUHJvdmlkZXJcclxuXHJcblx0XHRcdC8vIGhvbWUgcGFnZVxyXG5cdFx0XHQuc3RhdGUoJ2hvbWUnLCB7XHJcblx0XHRcdFx0dXJsOiAnL2hvbWUnLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvaG9tZS5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnTWFpbkNvbnRyb2xsZXInXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRcclxuXHRcdFx0LnN0YXRlKCd0cmF2ZWxlcicsIHtcclxuXHRcdFx0XHR1cmw6ICcvdHJhdmVsZXI/X2lkJmZvcm1JZCcsXHJcblx0XHRcdFx0dmlld3M6e1xyXG5cdFx0XHRcdFx0Jyc6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RyYXZlbGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdmb3JtUmV2aWV3QHRyYXZlbGVyJzp7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybVJldmlldy5odG1sJyxcclxuXHRcdFx0XHRcdFx0Ly8gY29udHJvbGxlcjogWyckc2NvcGUnLCAnVHJhdmVsZXInLCAnRm9ybScsZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlciwgRm9ybSl7XHJcblx0XHRcdFx0XHRcdC8vIFx0JHNjb3BlLnJldmlld0RhdGEgPSBUcmF2ZWxlci5nZXRSZXZpZXdEYXRhKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0Rm9ybS5nZXQoJHNjb3BlLnJldmlld0RhdGEuZm9ybUlkKVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdC8vIH1dXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRyb2xsZXI6ICdUcmF2ZWxlckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0LnN0YXRlKCdzZWFyY2hUcmF2ZWxlcicse1xyXG5cdFx0XHRcdHVybDogJy9zZWFyY2hUcmF2ZWxlcicsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9zZWFyY2hUcmF2ZWxlci5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnU2VhcmNoVHJhdmVsZXJDb250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0LnN0YXRlKCdmb3JtR2VuZXJhdG9yJyx7XHJcblx0XHRcdFx0dXJsOiAnL2Zvcm1HZW5lcmF0b3InLFxyXG5cdFx0XHRcdHZpZXdzOntcclxuXHRcdFx0XHRcdCcnOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtR2VuZXJhdG9yTmF2Lmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRm9ybUdlbmVyYXRvckNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3RlbXBsYXRlR2VuZXJhdG9yQGZvcm1HZW5lcmF0b3InOntcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy90ZW1wbGF0ZUdlbmVyYXRvci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCd0ZW1wbGF0ZUNyZWF0b3JAZm9ybUdlbmVyYXRvcic6e1xyXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RlbXBsYXRlQ3JlYXRvci5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0FwcEN0cmwnLCBbJ25nQW5pbWF0ZSddKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuXHRcdCRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRm9ybUdlbkN0cmwuanMnLCBbJ3VpLmJvb3RzdHJhcC50YWJzJ10pXHJcblx0XHJcblx0LmNvbnRyb2xsZXIoJ0Zvcm1HZW5lcmF0b3JDb250cm9sbGVyJywgWyckc2NvcGUnLCdGb3JtJyAsIGZ1bmN0aW9uKCRzY29wZSwgRm9ybSl7XHJcblxyXG5cclxuXHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihwYXNzd29yZCl7XHJcblx0XHRcdGlmKCFwYXNzd29yZCB8fCBwYXNzd29yZCA9PT0gJycpe1xyXG5cdFx0XHRcdHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHBhc3N3b3JkID09PSAnMTIzJyl7XHJcblx0XHRcdEZvcm0uY3JlYXRlKCRzY29wZS50ZW1wbGF0ZSlcclxuXHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXHJcblx0XHRcdFx0XHRhbGVydCgnYWRkJyk7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlID0gZGF0YTtcclxuXHRcdFx0XHRcdGRlbGV0ZSAkc2NvcGUudGVtcGxhdGU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lIHNvbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhc3N3b3JkID0gcHJvbXB0KCdwYXNzd29yZCcpO1xyXG5cdFx0XHRpZihwYXNzd29yZCA9PT0nMTIzJyl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLmNyZWF0ZS5faWQpe1xyXG5cdFx0XHRcdFx0Rm9ybS5zYXZlKCRzY29wZS5jcmVhdGUpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdzYXZlJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS50ZW1wbGF0ZSA9ICRzY29wZS5jcmVhdGU7XHJcblx0XHRcdFx0XHQkc2NvcGUuc3VibWl0KHBhc3N3b3JkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdnbyBob21lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKGNvbmZpcm0oJ2RlbGV0ZSB0ZW1wbGF0ZT8nKSl7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGlmKCRzY29wZS5jcmVhdGUuX2lkKXtcclxuXHRcdFx0XHRcdEZvcm0uZGVsZXRlKCRzY29wZS5jcmVhdGUuX2lkKVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhPT57XHJcblx0XHRcdFx0XHRcdFx0YWxlcnQoJ3JlbW92ZWQnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aW5pdENyZWF0ZSgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zZXRTZWxlY3RUYWIgPSBmdW5jdGlvbihuKXtcclxuXHRcdFx0JHNjb3BlLnNlbGVjdFRhYiA9IG47XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJHNjb3BlLmlucHV0SXRlbVJlY29yZCAmJiAkc2NvcGUuaW5wdXRJdGVtUmVjb3JkICE9PSAnJyl7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuaXRlbVJlY29yZCl7XHJcblx0XHRcdFx0XHQkc2NvcGUuY3JlYXRlLml0ZW1SZWNvcmQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSB7XHJcblx0XHRcdFx0XHRcImlkXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiRzY29wZS5pbnB1dEl0ZW1SZWNvcmRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKCRzY29wZS5pbnB1dEl0ZW1SZWNvcmRUeXBlID09PSAnc2VsZWN0Jyl7XHJcblx0XHRcdFx0XHR2YXIgaG9sZGVyID0gJHNjb3BlLnNlbGVjdE9wdGlvbnM7XHJcblx0XHRcdFx0XHRob2xkZXIgPSBob2xkZXIuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGk8aG9sZGVyLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHRob2xkZXJbaV0gPSBob2xkZXJbaV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aG9sZGVyID0gQXJyYXkuZnJvbShuZXcgU2V0KGhvbGRlcikpO1xyXG5cdFx0XHRcdFx0aXRlbVsnc2VsZWN0J10gPSB7J25hbWUnOicnfTtcclxuXHRcdFx0XHRcdGl0ZW0uc2VsZWN0WydvcHRpb25zJ10gPSBob2xkZXI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuaXRlbVJlY29yZC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdCRzY29wZS5pbnB1dEl0ZW1SZWNvcmQgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGlmKCRzY29wZS5pbnB1dFN0ZXBEZXMgJiYgJHNjb3BlLmlucHV0U3RlcERlcyAhPT0gJycpe1xyXG5cdFx0XHRcdGlmKCEkc2NvcGUuY3JlYXRlLnN0ZXBzKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGxlbiA9ICRzY29wZS5jcmVhdGUuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdHZhciBzdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdGVwXCI6IGxlbisxLFxyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6ICRzY29wZS5pbnB1dFN0ZXBUeXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCJEZXNjcmlwdGlvblwiOiAkc2NvcGUuaW5wdXRTdGVwRGVzIHx8ICcnXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzLnB1c2goc3RlcCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5pbnB1dFN0ZXBEZXMgPSAnJztcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuYWRkU3ViU3RlcCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyAmJiAkc2NvcGUudGVtcFN1Yi5pbnB1dFN1YlN0ZXBEZXMgIT09ICcnKXtcclxuXHRcdFx0XHRsZXQgc3RlcEluZGV4ID0gJHNjb3BlLnRlbXBTdWIuc2VsZWN0U3RlcEZvclN1YlN0ZXA7XHJcblx0XHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0KXtcclxuXHRcdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcEluZGV4XS5saXN0PVtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgbGVuID0gJHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwSW5kZXhdLmxpc3QubGVuZ3RoO1xyXG5cdFx0XHRcdGxldCBzdWJTdGVwID0ge1xyXG5cdFx0XHRcdFx0XCJzdWJfc3RlcFwiOiBsZW4rMSxcclxuXHRcdFx0XHRcdFwiRGVzY3JpcHRpb25cIjogJHNjb3BlLnRlbXBTdWIuaW5wdXRTdWJTdGVwRGVzXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlLnN0ZXBzW3N0ZXBJbmRleF0ubGlzdC5wdXNoKHN1YlN0ZXApO1xyXG5cdFx0XHRcdCRzY29wZS50ZW1wU3ViLmlucHV0U3ViU3RlcERlcyA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5hZGRTdWJPcHRpb24gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgc3RlcCA9ICRzY29wZS50ZW1wU3ViT3B0aW9uLnNlbGVjdFN1YkZvck9wdGlvbi5zcGxpdCgnLCcpWzBdO1xyXG5cdFx0XHRsZXQgc3ViID0gJHNjb3BlLnRlbXBTdWJPcHRpb24uc2VsZWN0U3ViRm9yT3B0aW9uLnNwbGl0KCcsJylbMV07XHJcblx0XHRcdGxldCBzZWxlY3RPcHRpb24gPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLnNlbGVjdFN1Yk9wdGlvbjtcclxuXHRcdFx0bGV0IG9wdGlvbnMgPSAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5pbnB1dC5zcGxpdCgnLCcpO1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTwgb3B0aW9ucy5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRvcHRpb25zW2ldID0gb3B0aW9uc1tpXS50cmltKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0aW9ucyA9IEFycmF5LmZyb20obmV3IFNldChvcHRpb25zKSk7XHJcblx0XHRcdGxldCBzdWJTdGVwT3B0aW9uID0ge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IHNlbGVjdE9wdGlvbixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lLFxyXG5cdFx0XHRcdFx0XCJvcHRpb25zXCI6IG9wdGlvbnNcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoISRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnMpe1xyXG5cdFx0XHRcdCRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdLm9wdGlvbnM9W107XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5zdGVwc1tzdGVwXS5saXN0W3N1Yl0ub3B0aW9ucy5wdXNoKHN1YlN0ZXBPcHRpb24pO1xyXG5cdFx0XHQvLyRzY29wZS5jcmVhdGUuc3RlcHNbc3RlcF0ubGlzdFtzdWJdW3NlbGVjdE9wdGlvbl0gPSBzdWJTdGVwT3B0aW9uO1xyXG5cdFx0XHQkc2NvcGUudGVtcFN1Yk9wdGlvbi5zdWJPcHRpb25zLm9wdGlvbi5uYW1lID0gJyc7XHJcblx0XHRcdCRzY29wZS50ZW1wU3ViT3B0aW9uLnN1Yk9wdGlvbnMub3B0aW9uLmlucHV0ID0gJyc7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUubW9kaWZ5SUQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUpe1xyXG5cdFx0XHRmb3IobGV0IGk9MDsgaTxvYmplY3QubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYodHlwZSA9PT0naXRlbVJlY29yZCcpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLmlkID0gaSsxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlID09PSdzdGVwcycpe1xyXG5cdFx0XHRcdFx0b2JqZWN0W2ldLnN0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09J3N1Yl9zdGVwJyl7XHJcblx0XHRcdFx0XHRvYmplY3RbaV0uc3ViX3N0ZXAgPSBpKzE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0T3B0aW9uID0gZnVuY3Rpb24oYWRkcmVzcywgaW5wdXQpe1xyXG4gICAgICBjb25zb2xlLmxvZyh0eXBlb2YgaW5wdXQpO1xyXG4gICAgICBjb25zb2xlLmxvZyhpbnB1dCk7XHJcblx0XHRcdGlmKGFkZHJlc3Mpe1xyXG5cdFx0XHRcdGFkZHJlc3Mub3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdCAgaW5wdXQgPSBpbnB1dC5zcGxpdCgnLCcpO1xyXG4gICAgICAgIH1cclxuXHRcdFx0XHRmb3IobGV0IGk9MDtpPGlucHV0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0YWRkcmVzcy5vcHRpb25zW2ldID0gaW5wdXRbaV0udHJpbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRyZXNzLm9wdGlvbnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRkcmVzcy5vcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuICAgICAgICAgIGlmKCRzY29wZS5mb3JtSWQpe1xyXG4gICAgICAgICAgICBGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmZvcm1zID0gZGF0YTsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gLy8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubGFzdFN0ZXAgPSBkYXRhLnN0ZXBzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIC8vIGluaXQgdGhlIHRyYXZlbGVyRGF0YSBmcm9tIGZvcm1EYXRhXHJcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2ID0gZGF0YS5mb3JtUmV2O1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm8gPSBkYXRhLmZvcm1ObztcclxuICAgICAgICAgICAgICAgIC8vICRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRyYXZlbGVyRGF0YS5zdGF0dXMgPSAnT1BFTic7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlPSBkYXRhO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcblx0XHR2YXIgaW5pdENyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jcmVhdGUgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmNyZWF0ZS5pc1B1Ymxpc2ggPSBmYWxzZTtcclxuXHRcdH07XHJcblxyXG4gICAgdmFyIGxvYWRGb3JtTGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIEZvcm0uZ2V0Rm9ybUxpc3QoKVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgJHNjb3BlLmZvcm1MaXN0ID0gZGF0YTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHRcdHZhciBtYWluID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdGluaXRDcmVhdGUoKTtcclxuICAgICAgbG9hZEZvcm1MaXN0KCk7XHJcblx0XHRcclxuXHRcdFx0JHNjb3BlLmlucHV0SXRlbVJlY29yZFR5cGUgPSAndGV4dCc7XHJcblx0XHRcdCRzY29wZS5qc29uVmlldyA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNYWluQ3RybCcsIFtdKVxyXG5cdFxyXG5cdC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcclxuXHJcblx0XHQkc2NvcGUudGFnbGluZSA9ICd0byB0aGUgbW9vbiBhbmQgYmFjayEnO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlYXJjaFRyYXZlbGVyQ3RybCcsIFsnY2hhcnQuanMnXSlcclxuXHJcblx0LmNvbnRyb2xsZXIoJ1NlYXJjaFRyYXZlbGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1RyYXZlbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUcmF2ZWxlcil7XHJcblxyXG5cdFx0JHNjb3BlLnNlYXJjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50SW5wdXQgPSAkc2NvcGUuc2VhcmNoSW5wdXQ7XHJcblx0XHRcdCRzY29wZS5pc1NlYXJjaCA9IHRydWU7XHJcblx0XHRcdGlmKCRzY29wZS5zZWFyY2hJbnB1dCl7XHJcblx0XHRcdFx0aWYoJHNjb3BlLnNlYXJjaE9wdGlvbiA9PT0nc24nKXtcclxuXHRcdFx0XHRcdGxldCBzbiA9ICRzY29wZS5zZWFyY2hJbnB1dC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0VHJhdmVsZXIuc2VhcmNoTGlrZShzbilcclxuXHJcblx0XHRcdFx0XHRcdC5zdWNjZXNzKCBkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIHNlYXJjaCBkb2MgbnVtXHJcblx0XHRcdFx0XHRUcmF2ZWxlci5ub3JtYWxTZWFyY2goJHNjb3BlLnNlYXJjaE9wdGlvbiwgJHNjb3BlLnNlYXJjaElucHV0KVxyXG5cdFx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXN1bHQ9ZGF0YTtcclxuXHRcdFx0XHRcdFx0XHRmaW5kU3RhdGlzdGljcygpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5lZGl0VHJhdmVsZXIgPSBmdW5jdGlvbihfaWQsIGZvcm1JZCl7XHJcblx0XHRcdHdpbmRvdy5vcGVuKCd0cmF2ZWxlcj9faWQ9JytfaWQrJyZmb3JtSWQ9Jytmb3JtSWQsICdfYmxhbmsnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZVRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBpbmRleCl7XHJcblx0XHRcdFRyYXZlbGVyLnJlbW92ZVRyYXZlbGVyKF9pZClcclxuXHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PiB7XHJcblx0XHRcdFx0XHQvLyAkc2NvcGUucmVzdWx0PWRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUucmVzdWx0LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vICRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oX2lkLCBmb3JtSWQpe1xyXG5cdFx0Ly8gXHR3aW5kb3cub3BlbigndHJhdmVsZXI/X2lkPScrX2lkKycmZm9ybUlkPScrZm9ybUlkKycmYWN0aW9uPXByaW50JywgJ19ibGFuaycpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHZhciBmaW5kU3RhdGlzdGljcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5zdGF0ID0ge31cclxuXHRcdFx0JHNjb3BlLnBpZUxhYmVsczE9W107XHJcblx0XHRcdCRzY29wZS5waWVEYXRhMSA9IFtdO1xyXG5cdFx0XHRsZXQgZGF0YSA9ICRzY29wZS5yZXN1bHQ7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPGRhdGEubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYoZGF0YVtpXS5zdGF0dXMgaW4gJHNjb3BlLnN0YXQpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRbZGF0YVtpXS5zdGF0dXNdICs9MTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRzY29wZS5waWVMYWJlbHMxLnB1c2goZGF0YVtpXS5zdGF0dXMpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRbZGF0YVtpXS5zdGF0dXNdID0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC50b3RhbCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRsZXQgcmVqZWN0ID0gMDtcclxuXHJcblx0XHRcdC8vIGNhbHVsYXRlIHBlcmNlbnQgb2YgdG90YWwgY29tcGxhdGVkIG91dCBvZiB0b3RhbFxyXG5cdFx0XHRpZigkc2NvcGUuc3RhdC5SRUpFQ1Qpe1xyXG5cdFx0XHRcdHJlamVjdCA9ICRzY29wZS5zdGF0LlJFSkVDVDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkc2NvcGUuc3RhdC5wZWNDb21wbGV0ZSA9ICgoJHNjb3BlLnN0YXQuQ09NUExFVEVEKSsocmVqZWN0KSkvKGRhdGEubGVuZ3RoKSoxMDA7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjYWx1bGF0ZSBwZXJjZW50IG9mIHJlamVjdCBvdXQgb2YgdG90YWxcclxuXHRcdFx0aWYoKCRzY29wZS5zdGF0LlJFSkVDVCkvKGRhdGEubGVuZ3RoKSoxMDApe1xyXG5cdFx0XHRcdCRzY29wZS5zdGF0LnBlY1JlamVjdCA9ICgkc2NvcGUuc3RhdC5SRUpFQ1QpLyhkYXRhLmxlbmd0aCkqMTAwO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuc3RhdC5wZWNSZWplY3QgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IobGV0IGk9MDtpPCRzY29wZS5waWVMYWJlbHMxLmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdCRzY29wZS5waWVEYXRhMS5wdXNoKCRzY29wZS5zdGF0WyRzY29wZS5waWVMYWJlbHMxW2ldXSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5waWVMYWJlbHMyID0gWydGaW5pc2gnLCAnSG9sZCddO1xyXG5cdFx0XHQkc2NvcGUucGllRGF0YTIgPSBbJHNjb3BlLnN0YXQuQ09NUExFVEVEK3JlamVjdCwgKCRzY29wZS5zdGF0LnRvdGFsLSgkc2NvcGUuc3RhdC5DT01QTEVURUQrcmVqZWN0KSldO1xyXG5cdFxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbml0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmlzU2VhcmNoID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS5zZWFyY2hPcHRpb24gPSAnZG9jTnVtJztcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIG1haW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpbml0KCk7XHJcblx0XHR9XHJcblx0XHRtYWluKCk7XHJcblx0fV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlckN0cmwnLCBbXSlcclxuXHRcclxuXHQuZmlsdGVyKCd1bmlxdWUnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGtleW5hbWUpe1xyXG5cdFx0XHR2YXIgb3V0cHV0ID0gW10sXHJcblx0XHRcdFx0a2V5cyAgID0gW107XHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0dmFyIGtleSA9IGl0ZW1ba2V5bmFtZV07XHJcblx0XHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKXtcclxuXHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH07XHJcblx0fSlcclxuXHRcclxuXHQuY29udHJvbGxlcignVHJhdmVsZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCdUcmF2ZWxlcicsICdGb3JtJywgJ0RvY051bScsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsIFRyYXZlbGVyLCBGb3JtLCBEb2NOdW0sICRzdGF0ZVBhcmFtcyl7XHJcblxyXG5cdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyAhPT0gJ09QRU4nKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnJlYWR5UmV2aWV3ID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ1BBTkRJTkcgRk9SIFJFVklFVyc7XHJcblx0XHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnVwZGF0ZUZvcm0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YSA9IHt9O1xyXG5cdFx0XHRpZigkc2NvcGUuZm9ybUlkKXtcclxuXHRcdFx0XHRGb3JtLmdldCgkc2NvcGUuZm9ybUlkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5mb3JtcyA9IGRhdGE7XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gZmluZCB0aGUgbGFzdCBzdWJTdGVwXHJcblx0XHRcdFx0XHRcdCRzY29wZS5sYXN0U3RlcCA9IGRhdGEuc3RlcHMubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHQvLyBpbml0IHRoZSB0cmF2ZWxlckRhdGEgZnJvbSBmb3JtRGF0YVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCA9IGRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1SZXYgPSBkYXRhLmZvcm1SZXY7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybU5vID0gZGF0YS5mb3JtTm87XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3VzdG9tZXIgPSBkYXRhLmN1c3RvbWVyO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdPUEVOJztcclxuXHRcdFx0XHRcdFx0bG9hZERvY051bUxpc3QoZGF0YS5faWQpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUudXBkYXRlRG9jTnVtID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gJHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0WyRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0XTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5leHRTdGVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG9iamVjdCA9ICRzY29wZS5mb3Jtcy5zdGVwc1skc2NvcGUuY3VycmVudFN0ZXAtMV07XHJcblx0XHRcdGlmKG9iamVjdC5saXN0Lmxlbmd0aCA+PSAkc2NvcGUuY3VycmVudFN1YlN0ZXArMSl7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwICs9IDE7XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwICs9IDE7XHJcblx0XHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0XHRpZigkc2NvcGUuY3VycmVudFN0ZXAgPiAkc2NvcGUubGFzdFN0ZXApe1xyXG5cdFx0XHRcdFx0Ly8gVHJhdmVsZXIuc2V0UmV2aWV3RGF0YSgkc2NvcGUudHJhdmVsZXJEYXRhKTtcclxuXHRcdFx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSB0cnVlO1x0XHRcclxuXHRcdFx0XHRcdCRzY29wZS5jaGVja1JlYWR5UmV2aWV3KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5zdGF0dXNQYWdlID0gZnVuY3Rpb24ocGFnZSl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IHBhZ2U7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0Ly8gJHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN0YXR1c1N1YlBhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gcGFnZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3RlcCA9IDE7XHJcblx0XHRcdCRzY29wZS5jdXJyZW50U3ViU3RlcCA9IDE7XHJcblx0XHRcdC8vICRzY29wZS50cmF2ZWxlckRhdGEucmVhZHlSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0JHNjb3BlLmNoZWNrUmVhZHlSZXZpZXcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZigkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQpe1xyXG5cdFx0XHRcdHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHRUcmF2ZWxlci5zYXZlKCRzY29wZS50cmF2ZWxlckRhdGEpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhkYXRhID0+e1xyXG5cdFx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkc2NvcGUuc3VibWl0KCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnJldmlldyA9IGZ1bmN0aW9uKG9wdGlvbil7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEucmV2aWV3Qnkpe1xyXG5cdFx0XHRpZihvcHRpb24gPT09ICdyZWplY3QnKXtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLnN0YXR1cyA9ICdSRUpFQ1QnO1xyXG5cdFx0XHR9ZWxzZSBpZihvcHRpb24gPT09ICdjb21wbGV0ZScpe1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RhdHVzID0gJ0NPTVBMRVRFRCc7XHJcblx0XHRcdH1cclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZXZpZXdBdCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdCRzY29wZS5zYXZlKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciByZXZpZXdlciBuYW1lJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCRzY29wZS51c2VybmFtZSAmJiAkc2NvcGUudHJhdmVsZXJEYXRhLnNuKXtcclxuXHRcdFx0XHQvLyAkc2NvcGUudHJhdmVsZXJEYXRhLmNvbXBsZXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHNldE51bURvY3RvVHJhdmVsZXIoKTtcclxuXHRcdFx0XHQkc2NvcGUudHJhdmVsZXJEYXRhLmNyZWF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlZEJ5ID0gJHNjb3BlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuY3JlYXRlQXQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdFRyYXZlbGVyLmNyZWF0ZSgkc2NvcGUudHJhdmVsZXJEYXRhKVxyXG5cclxuXHRcdFx0XHRcdC8vIGlmIHN1Y2Nlc3NmdWwgY3JlYXRlXHJcblx0XHRcdFx0XHQuc3VjY2VzcyggZGF0YSA9PntcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGFsZXJ0KCdlbnRlciB5b3VyIG5hbWUgb3Igc2VyaWFsIG51bWJlciBwbHogJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLm5ldyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRhbGVydCgnZGVsZXRlIGNsaWNrJyk7XHJcblx0XHRcdGlmKCRzY29wZS50cmF2ZWxlckRhdGEuX2lkKXtcclxuXHRcdFx0XHRUcmF2ZWxlci5yZW1vdmVUcmF2ZWxlcigkc2NvcGUudHJhdmVsZXJEYXRhLl9pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXNldCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmFwcGVuZFN1YlN0ZXBFZGl0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB1c2VybmFtZSA9ICRzY29wZS51c2VybmFtZTtcclxuXHRcdFx0aWYodXNlcm5hbWUgIT09ICcnKXtcclxuXHRcdFx0XHR2YXIgY3VycmVudFN0ZXAgPSAkc2NvcGUuY3VycmVudFN0ZXA7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRTdWJTdGVwID0gJHNjb3BlLmN1cnJlbnRTdWJTdGVwO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRCeSA9IHVzZXJuYW1lO1xyXG5cdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEuc3RlcFtjdXJyZW50U3RlcF1bY3VycmVudFN1YlN0ZXBdLmVkaXRUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhbGVydCgnZW50ZXIgeW91ciBuYW1lJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNhdmVEb2NOdW0gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybUlkID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQ7XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5mb3JtUmV2ID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtUmV2O1xyXG5cdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZm9ybU5vID0gJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtTm87XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSk7XHJcblx0XHRcdHNldERvY051bUxhYmVsKCdjcmVhdGUnKTtcclxuXHRcdFx0ZGVsZXRlICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5faWQ7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSk7XHJcblx0XHRcdERvY051bS5jcmVhdGUoJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0bG9hZERvY051bUxpc3QoJHNjb3BlLnRyYXZlbGVyRGF0YS5mb3JtSWQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuZWRpdERvY051bSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YSk7XHJcblx0XHRcdHNldERvY051bUxhYmVsKCdlZGl0Jyk7XHJcblx0XHRcdERvY051bS5lZGl0RG9jTnVtRGF0YSgkc2NvcGUuZG9jTnVtLmRvY051bURhdGEpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRsb2FkRG9jTnVtTGlzdCgkc2NvcGUudHJhdmVsZXJEYXRhLmZvcm1JZCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXROdW1Eb2N0b1RyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5pdGVtUmVjb3JkID0ge1xyXG5cdFx0XHRcdFx0XCJkb2NOdW1JZFwiOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuX2lkLFxyXG5cdFx0XHRcdFx0XCJkb2NOdW1cIiAgOiAkc2NvcGUuZG9jTnVtLmRvY051bURhdGEuZG9jTnVtXHJcblx0XHRcdFx0fTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHNldERvY051bUxhYmVsID0gZnVuY3Rpb24oYWN0aW9uKXtcclxuXHJcblx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdGlmKGFjdGlvbiA9PT0gJ2NyZWF0ZScpe1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0pe1xyXG5cdFx0XHRcdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoYWN0aW9uID09PSAnZWRpdCcpe1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdGlmKCRzY29wZS5kb2NOdW0uZG9jTnVtU2VsZWN0TGlzdFtpXS5kb2NOdW0gPT09ICRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5kb2NOdW0gJiZcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1TZWxlY3RMaXN0W2ldLl9pZCAhPT0gJHNjb3BlLmRvY051bS5kb2NOdW1EYXRhLl9pZCl7XHJcblx0XHRcdFx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5kb2NOdW0uZG9jTnVtRGF0YS5sYWJlbCA9IGNvdW50O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9hZEZvcm1MaXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Rm9ybS5nZXRGb3JtTGlzdCgpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZm9ybUxpc3QgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhciByZXNldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLmN1cnJlbnRTdWJTdGVwID0gMTtcclxuXHRcdFx0JHNjb3BlLnRyYXZlbGVyRGF0YS5yZWFkeVJldmlldyA9IGZhbHNlO1xyXG5cdFx0XHQkc2NvcGUuZm9ybUlkID0gJyc7XHJcblx0XHRcdCRzY29wZS5pc05ldyA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2FkRG9jTnVtTGlzdCA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0RG9jTnVtLmdldERvY051bUxpc3QoaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdExpc3QgPSBkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBsb2FkIGluZm9ybWF0aW9uIGZvciBJdGVtUmVjb3JkIHdpdGggXHJcblx0XHQvLyBkb2NOdW0uIFxyXG5cdFx0dmFyIGxvYWRJdGVtUmVjb3JkID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHJcblx0XHRcdERvY051bS5nZXREb2NOdW1MaXN0KCRzY29wZS50cmF2ZWxlckRhdGEuZm9ybUlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdFx0aWYoZGF0YVtpXS5faWQgPT09ICRzY29wZS50cmF2ZWxlckRhdGEuaXRlbVJlY29yZC5kb2NOdW1JZCl7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmRvY051bS5kb2NOdW1EYXRhID0gZGF0YVtpXTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZG9jTnVtLmRvY051bVNlbGVjdCA9IGkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5wcmludFRyYXZlbGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHByaW50Q29udGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWlkLXNlbGVjdG9yJykuaW5uZXJIVE1MO1xyXG5cdFx0ICAgIHZhciBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCxoZWlnaHQ9ODAwLHNjcm9sbGJhcnM9bm8sbWVudWJhcj1ubyx0b29sYmFyPW5vLGxvY2F0aW9uPW5vLHN0YXR1cz1ubyx0aXRsZWJhcj1ubyx0b3A9NTAnKTtcclxuXHRcdCAgICBwb3B1cFdpbi53aW5kb3cuZm9jdXMoKTtcclxuXHRcdCAgICBwb3B1cFdpbi5kb2N1bWVudC5vcGVuKCk7XHJcblx0XHQgICAgcG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzwhRE9DVFlQRSBodG1sPjxodG1sPjxoZWFkPjx0aXRsZT5USVRMRSBPRiBUSEUgUFJJTlQgT1VUPC90aXRsZT4nICtcclxuXHRcdCAgICAgICAgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwibGlicy9ib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIj4nICtcclxuXHRcdCAgICAgICAgJzwvaGVhZD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKTsgd2luZG93LmNsb3NlKCk7XCI+PGRpdj4nICsgcHJpbnRDb250ZW50cyArICc8L2Rpdj48L2h0bWw+Jyk7XHJcblx0XHQgICAgcG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWFpbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHQkc2NvcGUudG9wQ29sbGFwc2U9ZmFsc2U7XHJcblx0XHRcdHJlc2V0KCk7XHJcblx0XHRcdGxvYWRGb3JtTGlzdCgpO1xyXG5cdFx0XHQkc2NvcGUudXNlcm5hbWUgPSAnSm9obiBTbm93JztcclxuXHRcdFx0JHNjb3BlLmRvY051bSA9IHt9O1xyXG5cclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLmZvcm1JZCl7XHJcblx0XHRcdFx0JHNjb3BlLmZvcm1JZCA9ICRzdGF0ZVBhcmFtcy5mb3JtSWQ7XHJcblx0XHRcdFx0JHNjb3BlLnVwZGF0ZUZvcm0oKTtcclxuXHRcdFx0XHQkc2NvcGUuaXNOZXcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbG9hZCB0aGUgdHJhdmVsZXIgZnJvbSBTZWFyY2ggcGFnZVxyXG5cdFx0XHQvLyB0YWtlIHRoZSBwcmFtYXMgZnJvbSBVUkxcclxuXHRcdFx0aWYoJHN0YXRlUGFyYW1zLl9pZCl7XHJcblx0XHRcdFx0JHNjb3BlLmlzTmV3ID0gZmFsc2U7XHJcblx0XHRcdFx0VHJhdmVsZXIuZ2V0KCRzdGF0ZVBhcmFtcy5faWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGF0YSBpcyBhIGFycmF5LiByZXN1bHQgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxyXG5cdFx0XHRcdFx0XHQvLyBuZWVkIHRvIGRlYWwgd2l0IHRoaXMuXHJcblx0XHRcdFx0XHRcdCRzY29wZS50cmF2ZWxlckRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRsb2FkSXRlbVJlY29yZCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdG1haW4oKTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdEb2NOdW1TZXJ2aWNlJywgW10pXHJcblx0XHJcblx0LmZhY3RvcnkoJ0RvY051bScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RG9jTnVtTGlzdDogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2RvY051bXMvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2RvY051bXMvJyxkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZWRpdERvY051bURhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvZG9jTnVtcy8nLCBkYXRhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9jTnVtOiBmdW5jdGlvbih0eXBlLCBkYXRhKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZCBzZXJ2aWNlJyk7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9kb2NOdW1zL3NlYXJjaFNpbmdsZT90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0Zvcm1TZXJ2aWNlJywgW10pXHJcblxyXG5cdC5mYWN0b3J5KCdGb3JtJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9mb3JtcycsIGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZm9ybXMvJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXRGb3JtTGlzdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2Zvcm1zL2Zvcm1MaXN0Jyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKGZvcm1JZCl7XHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mb3Jtcy9zZWFyY2gvJytmb3JtSWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2Zvcm1zJywgZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZTogZnVuY3Rpb24oZm9ybUlkKXtcclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL2Zvcm1zLycrZm9ybUlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxlclNlcnZpY2UnLCBbXSlcclxuICAgICAgIFxyXG4gICAgLmZhY3RvcnkoJ1RyYXZlbGVyJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICAgICAgdmFyIHJldmlld0RhdGEgPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHRcclxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCB3b3JrIHdoZW4gbW9yZSBBUEkgcm91dGVzIGFyZSBkZWZpbmVkIG9uIHRoZSBOb2RlIHNpZGUgb2YgdGhpbmdzXHJcbiAgICAgICAgICAgIC8vIGNhbGwgdG8gUE9TVCBhbmQgY3JlYXRlIGEgbmV3IGZvcm1cclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihmb3JtRGF0YSl7XHJcbiAgICAgICAgICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdHJhdmVsZXInLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG5cclxuICAgICAgICAgICAgZ2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpZXdEYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbihfaWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmF2ZWxlcj9faWQ9JysgX2lkKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS90cmF2ZWxlcicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UmV2aWV3RGF0YTogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXZpZXdEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaExpa2U6IGZ1bmN0aW9uKHNuKXtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL3NlYXJjaExpa2UvJysgc24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjYWxsIHRvIERFTEVURSBhIGZvcm1cclxuICAgICAgICAgICAgcmVtb3ZlVHJhdmVsZXI6IGZ1bmN0aW9uKF9pZCwgaW5wdXQpe1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coX2lkKTtcclxuICAgICAgICAgICAgXHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3RyYXZlbGVyLycrIF9pZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5vcm1hbFNlYXJjaDogZnVuY3Rpb24odHlwZSwgZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3RyYXZlbGVyL25vcm1hbFNlYXJjaD90eXBlPScrdHlwZSsnJmRhdGE9JytkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cdH07XHRcdFxyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
