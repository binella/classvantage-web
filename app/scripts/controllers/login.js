'use strict';

angular.module('classvantageApp')
  .controller('LoginCtrl', function ($scope, TokenHandler, $http, authService, oauth, $location, ENV) {
		
		/*
		$scope.logOut = function () {
			$scope.$emit('event:auth-loginRequired')
			TokenHandler.set(null);
			delete $http.defaults.headers.common['Authorization'];
			$location.path('/signin');

		};
		*/
		
		// Default
		$scope.province = "Ontario";
		
		$scope.provinces = [
			"Ontario",
			"Quebec",
			"British Columbia",
			"Alberta",
			"Manitoba",
			"Saskatchewan",
			"Nova Scotia",
			"New Brunswick",
			"Newfoundland and Labrador",
			"Prince Edward Island",
			"Northwest Territories",
			"Yukon",
			"Nunavut"
		];
		
		if ($scope.me && $scope.me.name) {
			$location.path('/');
		};
		
		$scope.resetColor = function () {
			if ($scope.error) $scope.error = 'normal';
		}
		
		$scope.logIn = function (username, password) {
			
			$scope.$on('event:auth-loginRequired', function (event) {
				$scope.error = 'red';
			});
			
			var payload = {
	      username: username || $scope.username,
	      password: password || $scope.password,
	      grant_type: 'password',
	      client_id: oauth.clientId,
	      client_secret: oauth.clientSecret
	    };

	    $http.post(oauth.endPoint, payload).success(
	        function( data ) {
	          TokenHandler.set( data.access_token );
						
						if (data.admin) {
							TokenHandler.setAccessLevel(2);
						} else {
							TokenHandler.setAccessLevel(1);
						}
						
						$http.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
						authService.loginConfirmed(data, function (config) {
							config.headers['Authorization'] = 'Bearer ' + data.access_token;
							return config;
						});
						
						$location.path($scope.$previousUrl || '/');
	        }
	    ).error(
					function( data, status, headers, config ) {
						// This is an error other than incorrect username or password, but includes no username or password (i.e. missing params)
						// for now, its handled the same
						$scope.error = 'red';
					}
			);
		};
		
		
		$scope.signUp = function () {
			var payload = {
	      email: $scope.username,
	      password: $scope.password,
	      province: $scope.province,
				school: $scope.school,
				name: $scope.name
	    };
	
			$http.post(ENV.baseURL.substr(0,ENV.baseURL.length-3) + 'register', payload).success(function (data) {
				$scope.logIn(payload.email, payload.password);
			}).error(function (data) {
				console.log(data);
				$scope.error = data.error;
			});
		};
  });
