'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $stateParams, Page) {
	
		$scope.page = Page.currentPage || {};
		Page.get({id: $stateParams.page_id}, function (page, responseHeaders){
			angular.extend($scope.page, page);
		}, function (httpResponse){
			// Error getting page
		});
		 
  });
