'use strict';

var _oauthEndPoint = 'http://localhost\:3000/oauth/token'
var _baseURL = 'http://localhost\\:3000/v1/';

//var _oauthEndPoint = 'http://com-classvantage-test.herokuapp.com/oauth/token'
//var _baseURL = 'http://com-classvantage-test.herokuapp.com/v1/';

angular.module('classvantageApp', ['ngResource', 'oauthService', 'monospaced.elastic', 'ui.bootstrap.modal', 'ui.router', 'ui.bootstrap.dropdownToggle'])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, oauthProvider) {
		
		// Allow CORS
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		// OAuth config
		oauthProvider.setEndPoint(_oauthEndPoint);
		oauthProvider.setClientId('20100c70466699968233062227f148840238540ecf511a92e8d5d6748f0149de');
		oauthProvider.setClientSecret('9a13e2fd0a71494c87681b462213d416a3b8b503ca6ed13690bfe3de4ce0ee29');

		// Routes
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('home', {
				url: "/",
				templateUrl: "views/main.html"
			})
			.state('gradebook', {
				url: "/gradebook",
				templateUrl: "views/gradebook.html",
				controller: 'GradebookCtrl',
				resolve: {
					pages: ['Page', function (Page) {
						return Page.query().$promise;
					}]
				}
			})
			.state('gradebook.page', {
				url: "/:page_id",
				templateUrl: "views/page.html",
				controller: 'PageCtrl',
				// this might not even be needed
				resolve: {
					pages: ['$q', 'pages', function ($q, pages) {
						return pages;
						//var deferred = $q.defer();
						//deferred.resolve('hello');
						//return deferred.promise;
						//return Page.query().$promise;
					}]
				}
			})
			.state('rubric', {
				url: '/rubrics/:id',
				templateUrl: 'views/rubric.html',
				controller: 'RubricCtrl',
				resolve: {
					units: ['Unit', function (Unit) {
						return Unit.query().$promise;
					}]
				}
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
	/*
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
	*/
	.directive('cvStyledSelect', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				element.uniform({});
				scope.$watch(function() {return ngModel.$modelValue}, function() {
					$timeout(jQuery.uniform.update, 0);
				})
			}
		}
	}])
	
	.run(['$rootScope', 'Me', '$state', '$stateParams',
	  function( scope, Me, state, stateParams) {
			
			scope.$state = state;
			scope.$stateParams = stateParams;
			

			scope.me = Me.get();
			
	  }
	]);
