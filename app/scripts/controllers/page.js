'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $stateParams, $filter, $location, $templateCache, $modal, Page, Rubric, pages) {
		// We are promised 'pages'
		
		$scope.page = $filter('getById')(pages, $stateParams.page_id);
		//$scope.page = {};
		var pageIndex = pages.indexOf($scope.page);
		if (pageIndex > 5) {
			swapArrayElements(pages, 5, pageIndex);
		};
		
		
		$scope.rubricColDefs = [{ field: 'full_name', headerCellTemplate: '<a class="plus green" style="margin-left:-47px;position:relative;top:34px;" ng-click="newStudent();">Add a student</a>', width: 159},
														{ field: 'rubric', headerCellTemplate: '<a class="plus green" style="margin-left:34px;position:relative;top:34px;" ng-click="newRubric()">Add your first rubric</a>', width: 265 }];
		
		// This can be done better no?
		Page.get({id: $stateParams.page_id}, function (page, responseHeaders){
			angular.extend($scope.page, page);
			// Should this be done somehwere else?
			angular.forEach(page.rubrics, function (rubric) {
				$scope.rubricColDefs.splice($scope.rubricColDefs.length - 1, 0, 
					{ field: 'WHAT_GOES_HERE', headerCellTemplate: '<a class="col-header" ui-sref="rubric({id:'+rubric.id+'})">'+rubric.title+'</a>', width: 116 });
			});
			if (page.rubrics.length > 0) {
				var lastCol = $scope.rubricColDefs[$scope.rubricColDefs.length-1];
				lastCol.width = 116;
				lastCol.headerCellTemplate = '<a class="plus green" style="margin-left:41px;position:relative;top:34px;" ng-click="newRubric()"></a>';
			};
		}, function (httpResponse){
			// Error getting page
		});
		
		// Grid
		$scope.gridOptions = { 
			data: 'page.students',
			headerRowHeight: 90,
			enableSorting: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			columnDefs: 'rubricColDefs'
			//[{ field: 'full_name', headerCellTemplate: '<a class="plus green" style="margin-left:-47px;position:relative;top:25px;" ng-click="newStudent();">Add a student</a>', width: 148},
			//						 { field: 'rubric', headerCellTemplate: '<a class="plus green" style="margin-left:30px;position:relative;top:25px;" ng-click="newRubric()">Add your first rubric</a>' }]
		};
		
		
		// New Rubric
		$scope.newRubric = function () {
			Rubric.save({},{rubric: {page_id: $scope.page.id}}, function(rubric, postResponseHeader) {
				// Success
				Rubric.currentRubric = rubric;
				$location.path('/rubrics/' + rubric.id);
			}, function () {	alert('Error creating rubric'); });
		};
		
		// New Student
		$scope.newStudent = function () {
			var modalInstance = $modal.open({
	      templateUrl: 'views/studentForm.html',
				windowClass: 'new-student-modal',
				containerElement: '.container',
	      controller: ['$scope', '$modalInstance', 'Page','page', function ($scope, $modalInstance, Page, page) {

					$scope.student = {full_name: null};
					
				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					
					$scope.submitForm = function () {
						Page.update({id: page.id}, {page: {students_attributes: [{full_name: $scope.student.full_name}]}}, function (newPage, responseHeaders) {
							$scope.cancel();
							angular.extend(page, newPage);
						}, function () { alert('Error adding student'); });
					}
					
				}],
				resolve: {
					page: function () {
						return $scope.page;
					}
				}
	    });
		};
		
  });

function swapArrayElements(array_object, index_a, index_b) {
    var temp = array_object[index_a];
    array_object[index_a] = array_object[index_b];
    array_object[index_b] = temp;
}