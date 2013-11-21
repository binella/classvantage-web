'use strict';

angular.module('classvantageApp')
  .controller('MainCtrl', function ($scope, Me) {
		
		$scope.reloadMe = function () {
			$scope.me = Me.fetchOne('');
		};
		
		$scope.$on('event:auth-loginConfirmed', function( event ) {
			$scope.reloadMe();
    });

		$scope.reloadMe();
		
  });
