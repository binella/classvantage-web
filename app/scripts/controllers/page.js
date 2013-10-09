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
		
		
		// This can be done better no?
		Page.get({id: $stateParams.page_id}, function (page, responseHeaders){
			angular.extend($scope.page, page);

		}, function (httpResponse){
			// Error getting page
		});
		
		// Grid
		$scope.gridOptions = { 
			data: 'page.students',
			headerRowHeight: 90,
			plugins: [new ngGridFlexibleHeightPlugin()],
			columnDefs: [{ field: 'full_name', headerCellTemplate: '<a class="plus green" style="margin-left:-47px;position:relative;top:25px;" ng-click="newStudent();">Add a student</a>', width: 148},
									 { field: 'rubric', headerCellTemplate: '<a class="plus green" style="margin-left:30px;position:relative;top:25px;" href="">Add your first rubric</a>' }]
		};
		
		
		// New Rubric
		$scope.newRubric = function () {
			Rubric.save({},{}, function(rubric, postResponseHeader) {
				// Success
				Rubric.currentRubric = rubric;
				$location.path('/rubrics/' + rubric.id);
			}, function () {
				// Error
				alert('Error');
			})
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