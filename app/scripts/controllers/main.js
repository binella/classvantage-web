'use strict';

angular.module('classvantageApp')
  .controller('MainCtrl', function ($scope, $rootScope, TokenHandler, Me, $analytics) {
		
		$scope.reloadMe = function () {
			$scope.me = Me.fetchOne('');
			$scope.me.$promise.then(function (user) {
				TokenHandler.setAccessLevel(user.access_level);
				$rootScope.$broadcast('event:access-levelDetermined');
				/* User Analytics */
				mixpanel.identify($scope.me.email)
				$analytics.eventTrack('login');
				return user;
			});
		};
		
		$scope.$on('event:auth-loginConfirmed', function( event ) {
			$scope.reloadMe();
    });

		$scope.reloadMe();
		
  });
