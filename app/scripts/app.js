'use strict';

var _oauthEndPoint = 'http://localhost\:3000/oauth/token'
var _baseURL = 'http://localhost\\:3000/v1/';

angular.module('oauthService',['ngCookies'])	
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
  });


angular.module('classvantageApp', ['ngResource', 'http-auth-interceptor', 'oauthService', 'monospaced.elastic'])

  .config(function ($routeProvider, $httpProvider) {
		
		// Allow CORS
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
/*
      .when('/rubrics', {
        templateUrl: 'views/rubrics/index.html',
        controller: 'RubricCtrl'
      })
*/
			.when('/rubrics/:id', {
				templateUrl: 'views/rubrics/show.html',
				controller: 'RubricCtrl'
			})
      .when('/gradebook', {
        templateUrl: 'views/gradebook.html',
        controller: 'GradebookCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

	.directive('login', function() {
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs) {

	      scope.$on('event:auth-loginRequired', function( event ) {
	        scope.show = true;
	      });

	      scope.$on('event:auth-loginConfirmed', function( event ) {
	        scope.show = false;
	      });

	      var button = angular.element(element.find('button'));
	      button.bind('click', function(){
	        scope.$emit('event:authenticate', scope.username, scope.password)
	      });
	    }
	  }
	})

	.directive('cvInput', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('blur', function(e) {
					if (scope.updateModel) {
						scope.updateModel();
					};
				});
			}
		}
	})
	
	.directive('blursOnEnter', function (){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind("keypress", function (event) {
					if (event.which == 13) {
						element.blur();
						event.preventDefault();
					};
				})
			}
		}
	})

	.directive('focusWhen', function (){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focusWhen, function(value) {
					if (value) { element.focus(); };
				});
			}
		}
	})
	
	/* This isnt needed in new version of angular */
	
	.directive('ngBlur', ['$parse', function($parse) {
	  return function(scope, element, attr) {
	    var fn = $parse(attr['ngBlur']);
	    element.bind('blur', function(event) {
	      scope.$apply(function() {
	        fn(scope, {$event:event});
	      });
	    });
	  }
	}])
	
	.directive('cvSelect', function() {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
				$(element).uniform({
					
				});
			}
		}
	})
	
	.run(['$rootScope', '$http', 'TokenHandler', 'Me', 'httpBuffer',
	  function( scope, $http, tokenHandler, Me, httpBuffer) {
			
			// Set access_token if there is any
			$http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenHandler.get();
		
	    scope.$on( 'event:authenticate',
	      function( event, username, password ) {
	        var payload = {
	          username: username,
	          password: password,
	          grant_type: 'password',
	          client_id: 'e5fe8cebca719598957f20c7d717c1193d35f9cacf4aa3263483ec5bfaa930a7',
	          client_secret: '84cea0b0201b9af18942f6a3b80de0c915d75f3cd3f86e5369d573d0f528f7fe' 
	        };

	        $http.post(_oauthEndPoint, payload).success(
	            function( data ) {
	              tokenHandler.set( data.access_token );
								$http.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
	              var updater = function(config) {return config;};
				        scope.$broadcast('event:auth-loginConfirmed', data);
				        httpBuffer.retryAll(updater);
	            }
	        );
	      }
	    );
	
			scope.me = Me.get();
			
	  }
	]);
/*
	.run(function ($rootScope, Me){
		$rootScope.userLogged
		$rootScope.me = Me.get();
	});
*/