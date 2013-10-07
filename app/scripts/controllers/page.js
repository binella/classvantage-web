'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $stateParams, $filter, Page, pages) {
		// We are promised 'pages'
	
		$scope.page = $filter('getById')(pages, $stateParams.page_id);
		//$scope.page = {};
		var pageIndex = pages.indexOf($scope.page);
		if (pageIndex > 5) {
			swapArrayElements(pages, 5, pageIndex);
		};
		
		//$scope.page.get();
		
		
		Page.get({id: $stateParams.page_id}, function (page, responseHeaders){
			angular.extend($scope.page, page);
		}, function (httpResponse){
			// Error getting page
		});
		
  });

function swapArrayElements(array_object, index_a, index_b) {
    var temp = array_object[index_a];
    array_object[index_a] = array_object[index_b];
    array_object[index_b] = temp;
}