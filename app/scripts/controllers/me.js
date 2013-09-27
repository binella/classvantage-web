'use strict';

angular.module('classvantageApp')
  .controller('MeCtrl', function ($scope, TokenHandler, $http, $location) {
		
		$scope.logOut = function () {
			TokenHandler.set(null);
			delete $http.defaults.headers.common['Authorization'];
			$location.path('/');
		};
		
  });
