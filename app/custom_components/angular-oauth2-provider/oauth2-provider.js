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
	
		return tokenHandler;
  })
	.provider('oauth', function () {
		var clientId = 'CLIENT_ID', clientSecret = 'CLIENT_SECRET', endPoint = 'OAUTH_ENDPOINT';
		
		return {
			$get: function () {
				return {
					clientId: clientId,
					clientSecret: clientSecret,
					endPoint: endPoint
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
	.run(['$rootScope', '$http', 'TokenHandler', 'authService', 'oauth', function (scope, $http, tokenHandler, authService, oauth) {
		// Set access_token if there is any
		$http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenHandler.get();

		scope.$on( 'event:authenticate',
		  function( event, username, password ) {
		    var payload = {
		      username: username,
		      password: password,
		      grant_type: 'password',
		      client_id: oauth.clientId,
		      client_secret: oauth.clientSecret
		    };

		    $http.post(oauth.endPoint, payload).success(
		        function( data ) {
		          tokenHandler.set( data.access_token );
							$http.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
							authService.loginConfirmed(data, function (config) {
								config.headers['Authorization'] = 'Bearer ' + data.access_token;
								return config;
							});

		        }
		    );
		  }
		);;
	}]);