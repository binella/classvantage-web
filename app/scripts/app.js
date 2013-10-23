'use strict';

var _oauthEndPoint = 'http://localhost\:3000/oauth/token'
var _baseURL = 'http://localhost\:3000/v1/';

//var _oauthEndPoint = 'http://com-classvantage-test.herokuapp.com/oauth/token'
//var _baseURL = 'http://com-classvantage-test.herokuapp.com/v1/';

function swapArrayElements(array_object, index_a, index_b) {
    var temp = array_object[index_a];
    array_object[index_a] = array_object[index_b];
    array_object[index_b] = temp;
}

angular.module('classvantageApp', ['ngResource', 'oauthService', 'monospaced.elastic', 'ui.bootstrap.modal', 'ui.router', 'ui.bootstrap.dropdownToggle', 'ngAnimate', 'data.store'])

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
						return Page.fetchAll();
					}]
				}
			})
			.state('gradebook.page', {
				url: "/:page_id",
				templateUrl: "views/page.html",
				controller: 'PageCtrl',
				resolve: {
					currentPage: ['$stateParams', '$filter', 'Page', 'pages', function ($stateParams, $filter, Page, pages) {
						var currentPage = $filter('getById')(pages, $stateParams.page_id);
						var pageIndex = pages.indexOf(currentPage);
						if (pageIndex > 5) {
							swapArrayElements(pages, 5, pageIndex);
						};
						
						return Page.fetchOne($stateParams.page_id);
					}]
					/*
					currentPage: ['$q', '$stateParams', '$filter', 'Page', 'pages', function ($q, $stateParams, $filter, Page, pages) {
						
						
						// This can be done better no?
						Page.get({id: $stateParams.page_id}, function (page, responseHeaders){
							angular.extend(currentPage, page);
						}, function (httpResponse){
							// Error getting page
						});
						
						return currentPage;
						
					}]
					*/
				}
			})
			.state('rubric', {
				url: '/rubrics/:id',
				templateUrl: 'views/rubric.html',
				controller: 'RubricCtrl',
				resolve: {
					rubric: ['$stateParams', 'Rubric', function ($stateParams, Rubric) {
						return Rubric.fetchOne($stateParams.id);
					}],
					/*
					currentRubric: ['$stateParams', 'Rubric', function ($stateParams, Rubric) {
						// TODO: Should use model side fetch here!
						var currentRubric = {};
						
						Rubric.get({id: $stateParams.id}, function (rubric, responseHeaders){
							angular.extend(currentRubric, rubric);
							currentRubric.unit = currentRubric.unit || {grade: currentRubric.page.grade, strand: {subject: {id: currentRubric.page.subject_id}}};
						}, function (httpResponse){
							// Error getting rubric
						});
						
						return currentRubric;
					}],
					*/
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
					scope.username = '';
					scope.password = '';
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
	
	.directive('scrollWith', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var elm = $(element), target = $(attrs.scrollWith);
				target.scroll(function(){
		        elm
		            .scrollLeft(target.scrollLeft());
		    });
		    elm.scroll(function(){
		        target
		            .scrollLeft(elm.scrollLeft());
		    });
			}
		}
	})
	
	.run(['$rootScope', 'Me', '$state', '$stateParams', '$location',
	  function( scope, Me, state, stateParams, $location) {
	
			scope.$on('event:auth-forbidden', function( event ) {
        history.back();
				alert('Access Denied');
      })
			
			scope.logOut = function () {
				scope.me = {};
				scope.$emit('event:auth-signout');
				$location.path('/');
			};
			
			scope.$on('event:auth-loginConfirmed', function( event ) {
        scope.me = Me.get();
      });
			
			scope.$state = state;
			scope.$stateParams = stateParams;
			

			scope.me = Me.get();
			
	  }
	]);
