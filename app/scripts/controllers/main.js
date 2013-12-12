'use strict';

angular.module('classvantageApp')
  .controller('MainCtrl', function ($scope, $rootScope, TokenHandler, Me, $analytics, $location, $http, ENV) {
	
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
		
		$scope.me.password = '';
		$scope.me.password_confirmation = '';
		$scope.changePassword = function () {
			var payload = {
				password: $scope.me.password,
				password_confirmation: $scope.me.password_confirmation
			};
			
			if ($scope.me.password !== $scope.me.password_confirmation) {
				$scope.error = ["Passwords don't match"];
				return;
			};
			
			$http.put(ENV.baseURL + 'me', payload).success(function (data) {
				alert('Password successfully changed');
				$location.path('/gradebook');
			}).error(function (data) {
				$scope.error = data.error;
			})
			
		}
		
  });
