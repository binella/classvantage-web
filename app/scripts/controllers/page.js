'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $stateParams, $filter, $location, $templateCache, Page, Rubric, pages) {
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
			columnDefs: [{ field: 'full_name', headerCellTemplate: '<a class="plus green" style="margin-left:-47px;" href="">Add a student</a>'},
									 { field: 'rubric', headerCellTemplate: '<a class="plus green" style="margin-left:30px;" href="">Add your first rubric</a>' }]
		};
		
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
		
  });

function swapArrayElements(array_object, index_a, index_b) {
    var temp = array_object[index_a];
    array_object[index_a] = array_object[index_b];
    array_object[index_b] = temp;
}