'use strict';

angular.module('classvantageApp')
  .controller('MeCtrl', function ($scope, TokenHandler, $http, $location) {
		
		$scope.logOut = function () {
			$scope.$emit('event:auth-loginRequired')
			TokenHandler.set(null);
			delete $http.defaults.headers.common['Authorization'];
			$location.path('/');

		};
		
  });
