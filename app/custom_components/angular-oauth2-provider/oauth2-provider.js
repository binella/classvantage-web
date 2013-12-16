angular.module('oauthService', ['ngCookies', 'http-auth-interceptor'])	
	.factory('TokenHandler', function ($cookieStore) {
    // Service logic
    var tokenHandler = {};

	  tokenHandler.set = function( newToken ) {
	    $cookieStore.put('access_token', newToken);
	  };

	  tokenHandler.get = function() {
	    return $cookieStore.get('access_token');
	  };
	
		tokenHandler.setAccessLevel = function (level) {
			$cookieStore.put('access_level', level);
		};
		
		tokenHandler.getAccessLevel = function () {
			return $cookieStore.get('access_level');
		};
	
		return tokenHandler;
  })
	.provider('oauth', function () {
		var clientId = 'CLIENT_ID', clientSecret = 'CLIENT_SECRET', endPoint = 'OAUTH_ENDPOINT';
		
		return {
			$get: function () {
				return {
					clientId: clientId,
					clientSecret: clientSecret,
					endPoint: endPoint,
					authorize: function () {
						
					}
				}
			},
			setClientId: function (newClientId) {
				clientId = newClientId;
			},
			setClientSecret: function (newClientSecret) {
				clientSecret = newClientSecret;
			},
			setEndPoint: function (newEndPoint) {
				endPoint = newEndPoint;
			}
		};
	})
	.run(['$rootScope', '$http', 'TokenHandler', 'authService', 'oauth', '$location', '$state', function (scope, $http, tokenHandler, authService, oauth, $location, $state) {
		// Set access_token if there is any
		var isLoggedIn = false;
		var accessToken = tokenHandler.get();
		var accessLevel = tokenHandler.getAccessLevel();
		if (accessToken) { isLoggedIn = true; };
		$http.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
		

		scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (toState.access) {
				if (!isLoggedIn) {
					scope.$previousUrl = $state.href(toState.name, toParams).substr(1);
					event.preventDefault();
					$location.path('/signin');
					return;
				};
				if (toState.access > accessLevel) {
					event.preventDefault();
					$location.path('/gradebook');
				};
			} else {
				if (isLoggedIn) {
					event.preventDefault();
					var fromHref = $state.href(fromState.name, fromParams);
					if (fromHref)
						$location.path(fromHref.substr(1) || '/');
					else
						$location.path('/gradebook');
				};
			}
		});

		scope.$on('event:auth-signout', function (event) {
			scope.$emit('event:auth-loginRequired')
			tokenHandler.set(null);
			tokenHandler.setAccessLevel(null);
			delete $http.defaults.headers.common['Authorization'];
			$location.path('/signin');
		});
		
		scope.$on('event:auth-loginRequired', function (event) {
			scope.me = {};
			isLoggedIn = false;
			accessLevel = null;
		});

		scope.$on('event:auth-loginConfirmed', function (event) {
			isLoggedIn = true;
			accessToken = tokenHandler.get();
			accessLevel = 1;
			// Reload?
		});
		
		scope.$on('event:access-levelDetermined', function (event) {
			accessLevel = tokenHandler.getAccessLevel();
		});
		
	}]);